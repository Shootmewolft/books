/**
 * Canonical library taxonomy.
 *
 * Two rules govern this file:
 *
 *  1. A book has exactly ONE home (category + subcategory). The old tree let a
 *     book live in three places at once, which is why Designing Data-Intensive
 *     Applications existed as three identical copies.
 *  2. Everything else is a TAG. Tags are many-to-many and are what the web app
 *     actually filters on, so cross-cutting books stay discoverable without
 *     being duplicated on disk.
 *
 * Adding a category is a deliberate act: it requires a real book to justify it.
 * Empty categories are not created "for later" — the previous tree had three of
 * them (Blockchain & Web3, Cloud Computing, Web & Mobile Development), each with
 * a README promising books that did not exist.
 */

/** Content shape. Keeps 1-page posters out of the same grid as 1300-page books. */
export const KINDS = /** @type {const} */ ({
  book: 'A full-length published book.',
  guide: 'A short-form guide, booklet, or vendor whitepaper.',
  reference: 'A cheatsheet, poster, or single-diagram reference.',
})

/** Languages a file can be published in. Extend as translations are added. */
export const LANGUAGES = /** @type {const} */ ({
  en: 'English',
  es: 'Español',
})

export const FORMATS = /** @type {const} */ (['pdf', 'epub'])

/**
 * Category tree. `order` drives navigation sequence — it runs from the
 * theoretical foundations up to the human side of the craft, which is roughly
 * how someone actually grows into the field.
 */
export const TAXONOMY = [
  {
    slug: 'foundations',
    label: { en: 'Foundations', es: 'Fundamentos' },
    summary: {
      en: 'The machine underneath: algorithms, operating systems, networks, and concurrency.',
      es: 'La máquina por debajo: algoritmos, sistemas operativos, redes y concurrencia.',
    },
    order: 1,
    subcategories: [
      {
        slug: 'algorithms',
        label: { en: 'Algorithms & Data Structures', es: 'Algoritmos y Estructuras de Datos' },
      },
      { slug: 'operating-systems', label: { en: 'Operating Systems', es: 'Sistemas Operativos' } },
      { slug: 'networking', label: { en: 'Networking', es: 'Redes' } },
      { slug: 'concurrency', label: { en: 'Concurrency', es: 'Concurrencia' } },
    ],
  },
  {
    slug: 'programming',
    label: { en: 'Programming', es: 'Programación' },
    summary: {
      en: 'Writing code: languages, frameworks, patterns, and the discipline of keeping it clean.',
      es: 'Escribir código: lenguajes, frameworks, patrones y la disciplina de mantenerlo limpio.',
    },
    order: 2,
    subcategories: [
      {
        slug: 'code-quality',
        label: { en: 'Code Quality & Refactoring', es: 'Calidad y Refactorización' },
      },
      { slug: 'design-patterns', label: { en: 'Design Patterns', es: 'Patrones de Diseño' } },
      { slug: 'java', label: { en: 'Java', es: 'Java' } },
      { slug: 'python', label: { en: 'Python', es: 'Python' } },
      { slug: 'spring', label: { en: 'Spring', es: 'Spring' } },
      { slug: 'apis', label: { en: 'API Design', es: 'Diseño de APIs' } },
      { slug: 'tooling', label: { en: 'Tooling', es: 'Herramientas' } },
    ],
  },
  {
    slug: 'architecture',
    label: { en: 'Architecture', es: 'Arquitectura' },
    summary: {
      en: 'Shaping systems at scale — the decisions that are expensive to reverse.',
      es: 'Dar forma a sistemas a escala: las decisiones caras de revertir.',
    },
    order: 3,
    subcategories: [
      { slug: 'fundamentals', label: { en: 'Fundamentals', es: 'Fundamentos' } },
      { slug: 'patterns', label: { en: 'Architectural Patterns', es: 'Patrones Arquitectónicos' } },
      {
        slug: 'domain-driven-design',
        label: { en: 'Domain-Driven Design', es: 'Domain-Driven Design' },
      },
      { slug: 'microservices', label: { en: 'Microservices', es: 'Microservicios' } },
      {
        slug: 'distributed-systems',
        label: { en: 'Distributed Systems', es: 'Sistemas Distribuidos' },
      },
      {
        slug: 'event-driven',
        label: { en: 'Event-Driven Architecture', es: 'Arquitectura Orientada a Eventos' },
      },
    ],
  },
  {
    slug: 'data',
    label: { en: 'Data', es: 'Datos' },
    summary: {
      en: 'Storing, modelling, querying, and streaming data — from engine internals to schema design.',
      es: 'Almacenar, modelar, consultar y transmitir datos: desde los internos del motor al diseño de esquemas.',
    },
    order: 4,
    subcategories: [
      {
        slug: 'fundamentals',
        label: { en: 'Fundamentals & Internals', es: 'Fundamentos e Internos' },
      },
      { slug: 'modeling', label: { en: 'Data Modeling', es: 'Modelado de Datos' } },
      { slug: 'postgresql', label: { en: 'PostgreSQL', es: 'PostgreSQL' } },
      { slug: 'mysql', label: { en: 'MySQL', es: 'MySQL' } },
      { slug: 'mongodb', label: { en: 'MongoDB', es: 'MongoDB' } },
      { slug: 'cassandra', label: { en: 'Cassandra', es: 'Cassandra' } },
      { slug: 'redis', label: { en: 'Redis', es: 'Redis' } },
      { slug: 'elasticsearch', label: { en: 'Elasticsearch', es: 'Elasticsearch' } },
      { slug: 'kafka', label: { en: 'Kafka & Streaming', es: 'Kafka y Streaming' } },
    ],
  },
  {
    slug: 'platform',
    label: { en: 'Platform', es: 'Plataforma' },
    summary: {
      en: 'Shipping and running software: containers, orchestration, pipelines, and operations.',
      es: 'Desplegar y operar software: contenedores, orquestación, pipelines y operación.',
    },
    order: 5,
    subcategories: [
      { slug: 'devops', label: { en: 'DevOps Culture', es: 'Cultura DevOps' } },
      { slug: 'containers', label: { en: 'Containers', es: 'Contenedores' } },
      { slug: 'kubernetes', label: { en: 'Kubernetes', es: 'Kubernetes' } },
      { slug: 'cicd', label: { en: 'CI/CD', es: 'CI/CD' } },
    ],
  },
  {
    slug: 'quality',
    label: { en: 'Quality', es: 'Calidad' },
    summary: {
      en: 'Proving software works: testing strategy, TDD, and performance under load.',
      es: 'Demostrar que el software funciona: estrategia de testing, TDD y rendimiento bajo carga.',
    },
    order: 6,
    subcategories: [
      { slug: 'testing', label: { en: 'Testing Strategy', es: 'Estrategia de Testing' } },
      { slug: 'unit-testing', label: { en: 'Unit Testing', es: 'Testing Unitario' } },
      { slug: 'load-testing', label: { en: 'Load Testing', es: 'Testing de Carga' } },
      { slug: 'debugging', label: { en: 'Debugging', es: 'Depuración' } },
    ],
  },
  {
    slug: 'security',
    label: { en: 'Security', es: 'Seguridad' },
    summary: {
      en: 'Attack surfaces and countermeasures for applications and APIs.',
      es: 'Superficies de ataque y contramedidas para aplicaciones y APIs.',
    },
    order: 7,
    subcategories: [
      {
        slug: 'application-security',
        label: { en: 'Application Security', es: 'Seguridad de Aplicaciones' },
      },
      { slug: 'api-security', label: { en: 'API Security', es: 'Seguridad de APIs' } },
    ],
  },
  {
    slug: 'craft',
    label: { en: 'Craft', es: 'Oficio' },
    summary: {
      en: 'How effective engineers and teams actually work — process, culture, and judgement.',
      es: 'Cómo trabajan de verdad los ingenieros y equipos efectivos: proceso, cultura y criterio.',
    },
    order: 8,
    subcategories: [
      {
        slug: 'engineering-practice',
        label: { en: 'Engineering Practice', es: 'Práctica de Ingeniería' },
      },
      { slug: 'team-culture', label: { en: 'Team & Culture', es: 'Equipo y Cultura' } },
      {
        slug: 'interviews',
        label: { en: 'Interview Preparation', es: 'Preparación de Entrevistas' },
      },
    ],
  },
  {
    slug: 'career',
    label: { en: 'Career', es: 'Carrera' },
    summary: {
      en: 'Everything that is not code: negotiation, strengths, leadership, and business.',
      es: 'Todo lo que no es código: negociación, fortalezas, liderazgo y negocio.',
    },
    order: 9,
    subcategories: [
      { slug: 'negotiation', label: { en: 'Negotiation', es: 'Negociación' } },
      { slug: 'self-development', label: { en: 'Self Development', es: 'Desarrollo Personal' } },
      { slug: 'business', label: { en: 'Business', es: 'Negocio' } },
    ],
  },
]

/** Flat lookup: "category/subcategory" -> true. Used to validate book.json. */
export const VALID_PATHS = new Set(
  TAXONOMY.flatMap((category) =>
    category.subcategories.map((sub) => `${category.slug}/${sub.slug}`),
  ),
)

export const CATEGORY_SLUGS = TAXONOMY.map((category) => category.slug)

/**
 * Curated tag vocabulary. Free-form tags fragment fast ("k8s" vs "kubernetes"),
 * so CI validates against this list. Adding a tag is a one-line PR.
 */
export const TAGS = [
  'algorithms',
  'api',
  'aws',
  'caching',
  'cloud-native',
  'concurrency',
  'containers',
  'ddd',
  'debugging',
  'design-patterns',
  'devops',
  'distributed-systems',
  'docker',
  'event-driven',
  'functional-programming',
  'git',
  'gof',
  'indexing',
  'interviews',
  'java',
  'jvm',
  'kafka',
  'kubernetes',
  'leadership',
  'legacy-code',
  'linux',
  'machine-learning',
  'management',
  'messaging',
  'microservices',
  'mqtt',
  'negotiation',
  'nosql',
  'observability',
  'oop',
  'performance',
  'python',
  'refactoring',
  'reliability',
  'rest',
  'scalability',
  'security',
  'spring',
  'sql',
  'streaming',
  'system-design',
  'tdd',
  'testing',
  'unix',
  'web-security',
]

export const TAG_SET = new Set(TAGS)

/** Resolves a category slug to its definition, or undefined. */
export function findCategory(slug) {
  return TAXONOMY.find((category) => category.slug === slug)
}

/** Resolves a "category/subcategory" pair, or undefined if either is unknown. */
export function findSubcategory(categorySlug, subcategorySlug) {
  return findCategory(categorySlug)?.subcategories.find((sub) => sub.slug === subcategorySlug)
}
