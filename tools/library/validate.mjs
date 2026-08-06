#!/usr/bin/env node
/**
 * Validates the whole library against the taxonomy and the book schema.
 *
 * This is the gate that makes open contribution safe: a pull request adding a
 * book cannot land unless its metadata is internally consistent, its files
 * actually exist, and it does not duplicate something already in the library.
 *
 *   node tools/library/validate.mjs
 *
 * Exits non-zero on any error. Warnings never fail the build.
 */

import { createHash } from 'node:crypto'
import { createReadStream } from 'node:fs'
import { readdir, readFile, stat } from 'node:fs/promises'
import { join, relative } from 'node:path'

import { FORMATS, findCategory, LANGUAGES, TAG_SET, VALID_PATHS } from './taxonomy.mjs'

const ROOT = process.cwd()
const LIBRARY = join(ROOT, 'library')

/** GitHub rejects any single file above this. Hard failure, not a warning. */
const MAX_FILE_BYTES = 100 * 1024 * 1024
/** GitHub warns above this. Worth surfacing before the push, not after. */
const WARN_FILE_BYTES = 50 * 1024 * 1024

const errors = []
const warnings = []

const error = (where, message) => errors.push({ where, message })
const warn = (where, message) => warnings.push({ where, message })

function hashFile(filePath) {
  return new Promise((resolve, reject) => {
    const hash = createHash('md5')
    createReadStream(filePath)
      .on('error', reject)
      .on('data', (chunk) => hash.update(chunk))
      .on('end', () => resolve(hash.digest('hex')))
  })
}

/** Every directory containing a book.json, at any depth under library/. */
async function findBookDirectories(directory) {
  const found = []
  const entries = await readdir(directory, { withFileTypes: true })

  if (entries.some((entry) => entry.isFile() && entry.name === 'book.json')) {
    return [directory]
  }

  for (const entry of entries) {
    if (entry.isDirectory()) {
      found.push(...(await findBookDirectories(join(directory, entry.name))))
    }
  }
  return found
}

async function validateBook(directory, seenSlugs, seenHashes) {
  const relativeDirectory = relative(ROOT, directory)
  const manifestPath = join(directory, 'book.json')

  let book
  try {
    book = JSON.parse(await readFile(manifestPath, 'utf8'))
  } catch (cause) {
    error(relativeDirectory, `book.json is not valid JSON: ${cause.message}`)
    return
  }

  // --- Identity -----------------------------------------------------------
  const directoryName = relativeDirectory.split('/').pop()
  if (book.slug !== directoryName) {
    error(relativeDirectory, `slug "${book.slug}" does not match directory "${directoryName}"`)
  }
  if (seenSlugs.has(book.slug)) {
    error(
      relativeDirectory,
      `duplicate slug "${book.slug}", already used by ${seenSlugs.get(book.slug)}`,
    )
  } else {
    seenSlugs.set(book.slug, relativeDirectory)
  }

  // --- Required fields ----------------------------------------------------
  for (const field of ['title', 'kind', 'category', 'subcategory']) {
    if (!book[field]) error(relativeDirectory, `missing required field "${field}"`)
  }
  if (!Array.isArray(book.files) || book.files.length === 0) {
    error(relativeDirectory, 'must declare at least one file')
    return
  }

  // --- Taxonomy -----------------------------------------------------------
  const taxonomyPath = `${book.category}/${book.subcategory}`
  if (!VALID_PATHS.has(taxonomyPath)) {
    error(
      relativeDirectory,
      `unknown category path "${taxonomyPath}" — add it to taxonomy.mjs first`,
    )
  }

  // The directory must physically sit where its metadata claims it does,
  // otherwise the site and the filesystem disagree about where a book lives.
  const expectedPrefix = join('library', book.category, book.subcategory)
  if (!relativeDirectory.startsWith(expectedPrefix)) {
    error(
      relativeDirectory,
      `filed under "${relativeDirectory}" but metadata says "${expectedPrefix}"`,
    )
  }

  if (!['book', 'guide', 'reference'].includes(book.kind)) {
    error(relativeDirectory, `invalid kind "${book.kind}"`)
  }

  // Editions past the first carry an explicit suffix so two editions of one
  // work can never collide on a slug, and so the URL says which one it is.
  if (book.edition && book.edition > 1) {
    const suffix = `-${book.edition}e`
    if (!book.slug.endsWith(suffix)) {
      error(relativeDirectory, `edition ${book.edition} requires slug ending in "${suffix}"`)
    }
  } else if (/-\d+e$/.test(book.slug)) {
    error(
      relativeDirectory,
      `slug has an edition suffix but "edition" is ${book.edition ?? 'null'}`,
    )
  }

  for (const tag of book.tags ?? []) {
    if (!TAG_SET.has(tag)) {
      error(relativeDirectory, `unknown tag "${tag}" — add it to TAGS in taxonomy.mjs first`)
    }
  }

  // --- Files --------------------------------------------------------------
  const seenVariants = new Set()
  for (const file of book.files) {
    const where = `${relativeDirectory}/${file.path}`

    if (!LANGUAGES[file.lang]) error(where, `unsupported language "${file.lang}"`)
    if (!FORMATS.includes(file.format)) error(where, `unsupported format "${file.format}"`)
    if (file.path !== `${file.lang}.${file.format}`) {
      error(where, `filename must be "${file.lang}.${file.format}"`)
    }

    const variant = `${file.lang}.${file.format}`
    if (seenVariants.has(variant)) error(where, `duplicate ${variant} variant`)
    seenVariants.add(variant)

    const absolute = join(directory, file.path)
    let stats
    try {
      stats = await stat(absolute)
    } catch {
      error(where, 'declared in book.json but missing on disk')
      continue
    }

    if (stats.size !== file.bytes) {
      error(where, `size mismatch: book.json says ${file.bytes}, file is ${stats.size}`)
    }
    if (stats.size > MAX_FILE_BYTES) {
      error(where, `${(stats.size / 1048576).toFixed(1)} MB exceeds GitHub's 100 MB hard limit`)
    } else if (stats.size > WARN_FILE_BYTES) {
      warn(
        where,
        `${(stats.size / 1048576).toFixed(1)} MB — above GitHub's 50 MB warning threshold`,
      )
    }

    if (file.md5) {
      const actual = await hashFile(absolute)
      if (actual !== file.md5) {
        error(where, `md5 mismatch: book.json says ${file.md5}, file hashes to ${actual}`)
      }
      const previous = seenHashes.get(actual)
      if (previous && previous !== where) {
        error(where, `identical content already exists at ${previous}`)
      } else {
        seenHashes.set(actual, where)
      }
    }
  }

  // --- Orphaned files -----------------------------------------------------
  const declared = new Set(['book.json', 'cover.webp', ...book.files.map((file) => file.path)])
  for (const entry of await readdir(directory)) {
    if (!declared.has(entry)) {
      warn(`${relativeDirectory}/${entry}`, 'present on disk but not declared in book.json')
    }
  }

  // --- Quality nudges -----------------------------------------------------
  if (!book.authors || book.authors.length === 0) {
    warn(relativeDirectory, 'no authors recorded')
  }
  if (!book.year) warn(relativeDirectory, 'no publication year recorded')
}

async function main() {
  const directories = await findBookDirectories(LIBRARY)
  const seenSlugs = new Map()
  const seenHashes = new Map()

  for (const directory of directories) {
    await validateBook(directory, seenSlugs, seenHashes)
  }

  // Category folders that exist on disk but hold nothing are the exact failure
  // mode the old tree had: three categories promising books that never existed.
  for (const entry of await readdir(LIBRARY, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue
    if (!findCategory(entry.name)) {
      error(`library/${entry.name}`, 'directory is not a category declared in taxonomy.mjs')
    }
  }

  console.info(`Validated ${directories.length} books.`)

  if (warnings.length > 0) {
    console.info(`\n${warnings.length} warning(s):`)
    for (const { where, message } of warnings) console.info(`  ${where}\n    ${message}`)
  }

  if (errors.length > 0) {
    console.error(`\n${errors.length} error(s):`)
    for (const { where, message } of errors) console.error(`  ${where}\n    ${message}`)
    process.exit(1)
  }

  console.info('\nAll checks passed.')
}

main().catch((cause) => {
  console.error(cause)
  process.exit(1)
})
