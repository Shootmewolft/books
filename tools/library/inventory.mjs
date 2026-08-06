#!/usr/bin/env node

/**
 * Library inventory scanner.
 *
 * Walks the legacy book tree, extracts whatever metadata is recoverable from
 * (a) the PDF's embedded info dictionary and (b) the current filename, then
 * emits a single inventory.json used as the input for taxonomy curation and
 * migration.
 *
 * This script is read-only. It never touches the source files.
 *
 *   node tools/library/inventory.mjs [--root <dir>] [--out <file>]
 */

import { execFile } from 'node:child_process'
import { createHash } from 'node:crypto'
import { createReadStream } from 'node:fs'
import { mkdir, readdir, stat, writeFile } from 'node:fs/promises'
import { basename, extname, join, relative, sep } from 'node:path'
import { promisify } from 'node:util'

const run = promisify(execFile)

const BOOK_EXTENSIONS = new Set(['.pdf', '.epub'])
const IGNORED_DIRECTORIES = new Set(['.git', 'node_modules', '.next', 'apps', 'tools', '.atl'])

/**
 * Filename noise accumulated from the various sources these files came from.
 * Order matters: broader patterns run after the specific ones.
 */
const NOISE_PATTERNS = [
  /\s*-\s*libgen\.(li|lc|is|rs)\b/gi,
  /\s*\(\s*PDFDrive(\.com)?\s*\)/gi,
  /\s*\(true pdf\)/gi,
  /\s*\(z-lib\.org\)/gi,
  /\s*\(\d+\)\s*$/,
  /^\s*_+/,
  /\s+/g,
]

/** Series/collection prefixes that are not part of the title. */
const BRACKET_PREFIX = /^\s*[[(]([^\])]+)[\])]\s*/

/**
 * Publishers seen in this collection. Used to disambiguate the
 * "Title-Publisher (Year)" pattern from a genuinely hyphenated title.
 */
const KNOWN_PUBLISHERS = [
  "O'Reilly Media",
  "O'Reilly",
  'Manning Publications',
  'Manning',
  'Packt Publishing',
  'Packt',
  'Addison-Wesley Professional',
  'Addison-Wesley',
  'addison-wesley',
  'Pearson',
  'Wiley Pub',
  'Wiley',
  'Prentice Hall PTR',
  'Prentice Hall',
  'The MIT Press',
  'MIT Press',
  'No Starch Press',
  'no starch press',
  'Apress',
  'Morgan Kaufmann',
  'HarperBusiness',
  'It Revolution Press',
  'Independently published',
  'leanpub.com',
  'Wrox',
]

function stripNoise(value) {
  let out = value
  for (const pattern of NOISE_PATTERNS) out = out.replace(pattern, ' ')
  return out
    .trim()
    .replace(/\s*[-–—]\s*$/, '')
    .trim()
}

/**
 * Pulls a 4-digit publication year out of a string, preferring one that sits
 * inside parentheses since that is where these filenames put it.
 */
function extractYear(value) {
  const parenthesised = value.match(/\((?:[^)]*?\b)?((?:19|20)\d{2})\b[^)]*\)/)
  if (parenthesised) return Number(parenthesised[1])
  const bare = value.match(/\b((?:19|20)\d{2})\b/)
  return bare ? Number(bare[1]) : null
}

function extractPublisher(value) {
  for (const publisher of KNOWN_PUBLISHERS) {
    if (value.toLowerCase().includes(publisher.toLowerCase())) return publisher
  }
  return null
}

/**
 * Splits an author blob like "Erich Gamma, Richard Helm and John Vlissides"
 * into individual names. Handles the "Last, First" form these files sometimes
 * use by leaving it intact — curation resolves those.
 */
function splitAuthors(value) {
  if (!value) return []
  return value
    .split(/\s*(?:,|&|\band\b|\/)\s*/i)
    .map((name) => name.trim())
    .filter((name) => name.length > 1 && /[a-zA-Z]/.test(name))
}

/** Words that appear in titles but effectively never inside a person's name. */
const TITLE_STOPWORDS = new Set([
  'the',
  'a',
  'an',
  'of',
  'for',
  'with',
  'to',
  'in',
  'on',
  'and',
  'your',
  'you',
  'guide',
  'introduction',
  'handbook',
  'cookbook',
  'patterns',
  'design',
  'programming',
  'edition',
  'practical',
  'modern',
  'learning',
  'mastering',
  'building',
  'how',
  'what',
  'systems',
  'software',
  'data',
  'web',
  'science',
  'art',
  'essentials',
  'fundamentals',
])

/** Normalises a name for comparison: lowercase, no punctuation, sorted-insensitive. */
function normaliseName(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z\s]/g, ' ')
    .split(/\s+/)
    .filter((word) => word.length > 2)
}

/**
 * True when a filename segment reads like a person or list of people rather
 * than a book title. Used only as a fallback when embedded metadata is absent.
 */
function looksLikePersonName(segment) {
  const words = segment.split(/\s+/).filter(Boolean)
  if (words.length === 0 || words.length > 9) return false
  const lowered = words.map((word) => word.toLowerCase().replace(/[^a-z]/g, ''))
  if (lowered.some((word) => TITLE_STOPWORDS.has(word))) return false
  const capitalised = words.filter((word) => /^[A-Z]/.test(word) || /^[A-Z]\.$/.test(word))
  return capitalised.length / words.length >= 0.7
}

/**
 * Scores how strongly a filename segment matches the PDF's embedded Author
 * field, by counting shared surname-ish tokens. Zero means no relation.
 */
function authorMatchScore(segment, embeddedAuthor) {
  if (!embeddedAuthor) return 0
  const segmentTokens = new Set(normaliseName(segment))
  const embeddedTokens = normaliseName(embeddedAuthor)
  if (segmentTokens.size === 0 || embeddedTokens.length === 0) return 0
  const shared = embeddedTokens.filter((token) => segmentTokens.has(token))
  return shared.length / embeddedTokens.length
}

/**
 * Best-effort structural parse of a legacy filename, cross-checked against the
 * PDF's embedded info dictionary when available.
 *
 * Recognised shapes:
 *   "Authors - Title (Year, Publisher)"  |  "Title (Year, Publisher) - Authors"
 *   "Title-Publisher (Year) - Authors"   |  "Title - Authors"  |  bare slug
 *
 * The embedded Author field decides which segment is which whenever it exists;
 * the positional heuristic is only a fallback. Returns a confidence marker so
 * curation can prioritise the ambiguous ones.
 */
function parseFilename(rawName, pdfInfo = {}) {
  const withoutExtension = rawName.slice(0, rawName.length - extname(rawName).length)

  let working = withoutExtension
  let series = null
  const bracket = working.match(BRACKET_PREFIX)
  if (bracket) {
    series = bracket[1].trim()
    working = working.replace(BRACKET_PREFIX, '')
  }

  working = stripNoise(working)

  const year = extractYear(working)
  const publisher = extractPublisher(working)

  // Remove the "(Year, Publisher)" block once harvested so it stops
  // interfering with the title/author split.
  const withoutParens = working
    .replace(/\s*\([^)]*\)\s*/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

  const segments = withoutParens
    .split(/\s+-\s+/)
    .map((part) => part.trim())
    .filter(Boolean)

  let title = withoutParens
  let authors = []
  let confidence = 'low'

  if (segments.length >= 2) {
    const first = segments[0]
    const last = segments[segments.length - 1]

    const firstScore = authorMatchScore(first, pdfInfo.embeddedAuthor)
    const lastScore = authorMatchScore(last, pdfInfo.embeddedAuthor)

    let firstIsAuthors
    if (firstScore > 0.4 || lastScore > 0.4) {
      // Embedded metadata is authoritative: whichever end matches it is the
      // author segment. This fixes "Alex Petrov - Database Internals".
      firstIsAuthors = firstScore >= lastScore
      confidence = 'high'
    } else {
      // No usable embedded author; fall back to shape analysis.
      firstIsAuthors = looksLikePersonName(first) && !looksLikePersonName(last)
      confidence = 'medium'
    }

    if (firstIsAuthors) {
      authors = splitAuthors(first)
      title = segments.slice(1).join(' - ')
    } else {
      title = segments.slice(0, -1).join(' - ')
      authors = splitAuthors(last)
    }
  }

  // Edition markers leak into whichever segment they trail; harvest and strip.
  const editionMatch = `${title} ${authors.join(' ')}`.match(
    /\b(\d+)(?:st|nd|rd|th)\s+edition\b|\b(second|third|fourth|fifth)\s+edition\b/i,
  )
  const ORDINALS = { second: 2, third: 3, fourth: 4, fifth: 5 }
  const edition = editionMatch
    ? Number(editionMatch[1]) || ORDINALS[editionMatch[2]?.toLowerCase()] || null
    : null

  const stripEdition = (value) =>
    value
      .replace(/,?\s*\b\d+(?:st|nd|rd|th)\s+edition\b/gi, '')
      .replace(/,?\s*\b(?:second|third|fourth|fifth)\s+edition\b/gi, '')
      .replace(/^\s*[-–—,]\s*/, '')
      .trim()

  title = stripEdition(title)
  authors = authors.map(stripEdition).filter(Boolean)

  // "Title-Publisher" runs the imprint straight onto the title with no spaces
  // around the hyphen; strip it once we know which publisher it is.
  if (publisher) {
    title = title
      .replace(
        new RegExp(`\\s*[-–—]?\\s*${publisher.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*$`, 'i'),
        '',
      )
      .trim()
  }

  // Publishers routinely leak into the author slot; drop them.
  authors = authors.filter(
    (name) => !KNOWN_PUBLISHERS.some((p) => name.toLowerCase().includes(p.toLowerCase())),
  )

  // Underscores in these filenames stand in for a colon before the subtitle.
  let subtitle = null
  const subtitleSplit = title.split(/_\s+|\s+:\s+/)
  if (subtitleSplit.length > 1) {
    title = subtitleSplit[0].trim()
    subtitle = subtitleSplit.slice(1).join(': ').trim()
    confidence = confidence === 'medium' ? 'high' : confidence
  }

  title = title.replace(/[_:]\s*$/, '').trim()

  // Last resort: a filename that carried no usable title falls back to the
  // embedded one (e.g. "Art of.pdf" -> "The Art of Multiprocessor Programming").
  if (title.length < 3 && pdfInfo.embeddedTitle && pdfInfo.embeddedTitle.length > 3) {
    title = pdfInfo.embeddedTitle.trim()
    confidence = 'low'
  }

  if (authors.length === 0 && pdfInfo.embeddedAuthor) {
    authors = splitAuthors(pdfInfo.embeddedAuthor)
  }

  return { title, subtitle, authors, year, publisher, series, edition, confidence }
}

/** Reads the PDF info dictionary. Returns an empty object for non-PDFs. */
async function readPdfInfo(filePath) {
  if (extname(filePath).toLowerCase() !== '.pdf') return {}
  try {
    const { stdout } = await run('pdfinfo', [filePath], { maxBuffer: 1024 * 1024 })
    const fields = {}
    for (const line of stdout.split('\n')) {
      const separator = line.indexOf(':')
      if (separator === -1) continue
      fields[line.slice(0, separator).trim()] = line.slice(separator + 1).trim()
    }
    return {
      embeddedTitle: fields.Title || null,
      embeddedAuthor: fields.Author || null,
      embeddedSubject: fields.Subject || null,
      embeddedKeywords: fields.Keywords || null,
      producer: fields.Producer || null,
      pages: fields.Pages ? Number(fields.Pages) : null,
      encrypted: fields.Encrypted ? !fields.Encrypted.startsWith('no') : false,
    }
  } catch {
    // Corrupt or password-protected files must not abort the whole scan.
    return { pdfInfoFailed: true }
  }
}

function hashFile(filePath) {
  return new Promise((resolve, reject) => {
    const hash = createHash('md5')
    createReadStream(filePath)
      .on('error', reject)
      .on('data', (chunk) => hash.update(chunk))
      .on('end', () => resolve(hash.digest('hex')))
  })
}

/**
 * Ignores only apply at the repository root. Nesting matters: `programming/tools`
 * is a book subcategory, while the top-level `tools` holds these scripts.
 */
async function* walk(directory, isRoot = true) {
  const entries = await readdir(directory, { withFileTypes: true })
  for (const entry of entries) {
    const full = join(directory, entry.name)
    if (entry.isDirectory()) {
      if (isRoot && IGNORED_DIRECTORIES.has(entry.name)) continue
      if (entry.name === 'node_modules' || entry.name === '.git') continue
      yield* walk(full, false)
    } else if (BOOK_EXTENSIONS.has(extname(entry.name).toLowerCase())) {
      yield full
    }
  }
}

function parseArgs(argv) {
  const options = { root: process.cwd(), out: 'tools/library/inventory.json' }
  for (let index = 0; index < argv.length; index += 1) {
    if (argv[index] === '--root') options.root = argv[++index]
    if (argv[index] === '--out') options.out = argv[++index]
  }
  return options
}

async function main() {
  const { root, out } = parseArgs(process.argv.slice(2))

  const records = []
  for await (const filePath of walk(root)) {
    const relativePath = relative(root, filePath)
    const [legacyCategory, ...restSegments] = relativePath.split(sep)
    const stats = await stat(filePath)
    const [md5, pdfInfo] = await Promise.all([hashFile(filePath), readPdfInfo(filePath)])

    records.push({
      sourcePath: relativePath,
      legacyCategory,
      legacySubcategory: restSegments.length > 1 ? restSegments[0] : null,
      format: extname(filePath).toLowerCase().slice(1),
      bytes: stats.size,
      md5,
      parsed: parseFilename(basename(filePath), pdfInfo),
      ...pdfInfo,
    })
  }

  records.sort((a, b) => a.sourcePath.localeCompare(b.sourcePath))

  // Group byte-identical files so migration can collapse them into one book.
  const byHash = new Map()
  for (const record of records) {
    if (!byHash.has(record.md5)) byHash.set(record.md5, [])
    byHash.get(record.md5).push(record.sourcePath)
  }
  const duplicates = [...byHash.entries()]
    .filter(([, paths]) => paths.length > 1)
    .map(([md5, paths]) => ({ md5, paths }))

  const inventory = {
    generatedFrom: root,
    totals: {
      files: records.length,
      bytes: records.reduce((sum, record) => sum + record.bytes, 0),
      duplicateGroups: duplicates.length,
      redundantFiles: duplicates.reduce((sum, group) => sum + group.paths.length - 1, 0),
      needsReview: records.filter((record) => record.parsed.confidence === 'low').length,
    },
    duplicates,
    books: records,
  }

  await mkdir(join(root, 'tools/library'), { recursive: true })
  await writeFile(join(root, out), `${JSON.stringify(inventory, null, 2)}\n`, 'utf8')

  const { totals } = inventory
  console.log(`Scanned ${totals.files} files (${(totals.bytes / 1024 ** 3).toFixed(2)} GB)`)
  console.log(
    `Duplicate groups: ${totals.duplicateGroups} (${totals.redundantFiles} redundant files)`,
  )
  console.log(`Low-confidence filename parses: ${totals.needsReview}`)
  console.log(`Wrote ${out}`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
