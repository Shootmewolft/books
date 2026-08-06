/**
 * Legacy tree -> canonical taxonomy mapping.
 *
 * Strategy: broad directory rules cover the common case, explicit overrides
 * handle every book that was filed in the wrong place or whose filename parsed
 * badly. Overrides always win.
 *
 * This file is the curated judgement layer. Nothing here is inferred at runtime,
 * which means the migration is fully reviewable before a single file moves.
 */

/**
 * Byte-identical copies to delete. The retained path is listed as `keep`, chosen
 * by whichever location matches the new taxonomy most closely.
 *
 * Verified by md5 in inventory.json — these are exact duplicates, not editions.
 */
export const DUPLICATES = [
  {
    keep: 'Databases/design/Designing Data Intensive Applications - Martin Kleppmann.pdf',
    drop: [
      'Distributed Systems/_Designing Data Intensive Applications.pdf',
      'Software Architecture/_Designing Data Intensive Applications.pdf',
    ],
  },
  {
    keep: 'Problem Solving/_Grokking the Advanced System Design Interview (2021).pdf',
    drop: [
      'Problem Solving/System Design Interview/_Grokking the Advanced System Design Interview (2021).pdf',
      'Software Architecture/_Grokking the Advanced System Design Interview (2021).pdf',
    ],
  },
  {
    keep: 'programming/design-pattern/Erich Gamma, Richard Helm, Ralph Johnson, John M. Vlissides - Design Patterns_ Elements of Reusable Object-Oriented Software-addison-wesley (1994).pdf',
    drop: ['Software Engineering/Design Patterns Elements of Reusable Object-Oriented Software.pdf'],
  },
  {
    keep: 'programming/design-patterns/Head First Design Patterns 2nd Edition by Eric Freeman, Elisabeth Robson.pdf',
    drop: [
      "Software Architecture/Eric Freeman, Elisabeth Robson - Head First Design Patterns_ Building Extensible and Maintainable Object-Oriented Software (2020, O'Reilly Media).pdf",
    ],
  },
  {
    keep: 'Software Engineering/_Software Engineering at Google_ Lessons Learned from Programming Over Time (2020, O\'Reilly Media) - Titus Winters, Tom Manshreck, Hyrum Wright.pdf',
    drop: [
      "Development Practices/_Software Engineering at Google_ Lessons Learned from Programming Over Time (2020, O'Reilly Media) - Titus Winters, Tom Manshreck, Hyrum Wright.pdf",
    ],
  },
  {
    keep: 'Software Engineering/Modern Software Engineering_ Doing What Works to Build Better Software Faster (2021, Addison-Wesley Professional) - David Farley.pdf',
    drop: [
      'Development Practices/Modern Software Engineering_ Doing What Works to Build Better Software Faster (2021, Addison-Wesley Professional) - David Farley.pdf',
    ],
  },
  {
    keep: 'Software Testing/unit-test/The Art of Unit Testing, with examples in C_ (2014, Manning) - Roy Osherove.pdf',
    drop: ['programming/The Art of Unit Testing, with examples in C_ (2014, Manning) - Roy Osherove.pdf'],
  },
  {
    keep: 'Software Testing/unit-test/Mockito for Spring_ learn all you need to know about the Spring Framework and how to unit test your projects with Mockito (2015, Packt Publishing) - Sujoy Acharya.pdf',
    drop: [
      'Software Testing/Mockito for Spring_ learn all you need to know about the Spring Framework and how to unit test your projects with Mockito (2015, Packt Publishing) - Sujoy Acharya.pdf',
    ],
  },
  {
    keep: 'Databases/design/Beginning database design solutions (2009, Wiley Pub) - Rod Stephens.pdf',
    drop: ['Databases/design/(Wrox beginning guides) Rod Stephens - Beginning database design solutions-Wiley Pub (2009).pdf'],
  },
  {
    keep: 'Software Architecture/developing-open-cloud-native-microservice.pdf',
    drop: ['Distributed Systems/Microservices/developing-open-cloud-native-microservice.pdf'],
  },
]

/**
 * Not byte-identical, but the same work in a strictly worse copy — truncated
 * extracts, low-quality scans, or early-release samples padded out to look like
 * the full book. Each decision is justified by page count, which is the only
 * reliable signal here: file size is actively misleading (the 18.3 MB scan of
 * Design Patterns has FEWER pages than the 4.1 MB one).
 */
export const INFERIOR_COPIES = [
  {
    keep: "Databases/mysql/Silvia Botros, Jeremy Tinley - High Performance MySQL_ Proven Strategies for Operating at Scale (2021, O'Reilly Media).pdf",
    drop: "Databases/mysql/Silvia Botros, Jeremy Tinley - High Performance MySQL_ Proven Strategies for Running MySQL at Scale (2022, O'Reilly Media).pdf",
    reason: '83 pages vs 389 — early-release sample, not the full book',
  },
  {
    keep: 'Databases/mysql/Understanding MySQL Internals (2009) - Sasha Pachev.pdf',
    drop: 'Databases/mysql/Understanding MySQL Internals.pdf',
    reason: 'both 256 pages; kept copy carries embedded metadata, the other has none',
  },
  {
    keep: 'programming/clean-code/Clean Code_ A Handbook of Agile Software Craftsmanship - Robert C. Martin.pdf',
    drop: 'programming/clean-code/clean-code.pdf',
    reason: 'both 462 pages, identical content, differing scans',
  },
  {
    keep: 'programming/design-pattern/Erich Gamma, Richard Helm, Ralph Johnson, John M. Vlissides - Design Patterns_ Elements of Reusable Object-Oriented Software-addison-wesley (1994).pdf',
    drop: 'programming/design-pattern/Erich Gamma, Richard Helm, Ralph Johnson, John M. Vlissides - Design Patterns_ Elements of Reusable Object-Oriented Software (1994, Addison-Wesley Professional) - libgen.li.pdf',
    reason: '417 pages vs 431 — the heavier file is the more incomplete scan',
  },
  {
    keep: 'Soft Skills/StrengthsFinder.pdf',
    drop: 'Soft Skills/Strengths Finder 2.0 - Rath Tom. .pdf',
    reason: '64 pages vs 170 — truncated',
  },
  {
    keep: 'Software Architecture/Accelerate - Building and Scaling High Performing Technology Organisations - Nicole Fergrson.pdf',
    drop: 'Software Architecture/Accelerate_ The Science of DevOps ( PDFDrive ).pdf',
    reason: '263 pages vs 315 — abridged',
  },
  {
    keep: 'Software Architecture/Software Architecture - The Hardparts.pdf',
    drop: 'Software Architecture/Software Architecture The Hard Parts - Neal Ford, Mark Richards, Pramod Sadalage, Zhamak Dehghani.pdf',
    reason: '47 pages vs 462 — sample chapter',
  },
]

/** Flattened set of paths that must not be migrated. */
export const DROPPED_PATHS = new Set([
  ...DUPLICATES.flatMap((group) => group.drop),
  ...INFERIOR_COPIES.map((entry) => entry.drop),
])

/**
 * Directory prefix -> destination. Longest matching prefix wins, so a specific
 * subdirectory rule beats its parent.
 */
export const DIRECTORY_RULES = [
  ['Algorithms/', { category: 'foundations', subcategory: 'algorithms', tags: ['algorithms'] }],
  ['Operating Systems/', { category: 'foundations', subcategory: 'operating-systems', tags: ['unix'] }],
  ['networking/mqtt/', { category: 'foundations', subcategory: 'networking', tags: ['mqtt', 'messaging'] }],
  ['networking/', { category: 'foundations', subcategory: 'networking', tags: [] }],
  ['programming/concurrency/', { category: 'foundations', subcategory: 'concurrency', tags: ['concurrency'] }],

  ['programming/clean-code/', { category: 'programming', subcategory: 'code-quality', tags: ['refactoring'] }],
  ['programming/refactoring/', { category: 'programming', subcategory: 'code-quality', tags: ['refactoring', 'legacy-code'] }],
  ['programming/design-pattern/', { category: 'programming', subcategory: 'design-patterns', tags: ['design-patterns', 'oop'] }],
  ['programming/design-patterns/', { category: 'programming', subcategory: 'design-patterns', tags: ['design-patterns', 'oop'] }],
  ['programming/java/', { category: 'programming', subcategory: 'java', tags: ['java', 'jvm'] }],
  ['programming/python/', { category: 'programming', subcategory: 'python', tags: ['python'] }],
  ['programming/spring/', { category: 'programming', subcategory: 'spring', tags: ['spring', 'java'] }],
  ['programming/tools/', { category: 'programming', subcategory: 'tooling', tags: ['git'] }],

  ['Software Architecture/DDD/', { category: 'architecture', subcategory: 'domain-driven-design', tags: ['ddd'] }],
  ['Software Architecture/microservices/', { category: 'architecture', subcategory: 'microservices', tags: ['microservices'] }],
  ['Software Architecture/', { category: 'architecture', subcategory: 'fundamentals', tags: [] }],
  ['Distributed Systems/Microservices/', { category: 'architecture', subcategory: 'microservices', tags: ['microservices'] }],
  ['Distributed Systems/', { category: 'architecture', subcategory: 'distributed-systems', tags: ['distributed-systems'] }],

  ['Apache Kafka/', { category: 'data', subcategory: 'kafka', tags: ['kafka', 'streaming'] }],
  ['Databases/cassandra/', { category: 'data', subcategory: 'cassandra', tags: ['nosql'] }],
  ['Databases/elasticsearch/', { category: 'data', subcategory: 'elasticsearch', tags: ['nosql', 'indexing'] }],
  ['Databases/mongo/', { category: 'data', subcategory: 'mongodb', tags: ['nosql'] }],
  ['Databases/mysql/', { category: 'data', subcategory: 'mysql', tags: ['sql'] }],
  ['Databases/postgresql/', { category: 'data', subcategory: 'postgresql', tags: ['sql'] }],
  ['Databases/redis/', { category: 'data', subcategory: 'redis', tags: ['nosql', 'caching'] }],
  ['Databases/design/', { category: 'data', subcategory: 'modeling', tags: ['sql'] }],
  ['Databases/', { category: 'data', subcategory: 'fundamentals', tags: [] }],

  ['devops/cicd/', { category: 'platform', subcategory: 'cicd', tags: ['devops'] }],
  ['devops/container/', { category: 'platform', subcategory: 'containers', tags: ['docker', 'containers'] }],
  ['devops/k8s/', { category: 'platform', subcategory: 'kubernetes', tags: ['kubernetes', 'cloud-native'] }],
  ['devops/', { category: 'platform', subcategory: 'devops', tags: ['devops'] }],

  ['Software Testing/load-testing/', { category: 'quality', subcategory: 'load-testing', tags: ['testing', 'performance'] }],
  ['Software Testing/unit-test/', { category: 'quality', subcategory: 'unit-testing', tags: ['testing', 'tdd'] }],
  ['Software Testing/', { category: 'quality', subcategory: 'testing', tags: ['testing'] }],

  ['security/', { category: 'security', subcategory: 'application-security', tags: ['security', 'web-security'] }],

  ['Development Practices/', { category: 'craft', subcategory: 'engineering-practice', tags: [] }],
  ['Software Engineering/', { category: 'craft', subcategory: 'engineering-practice', tags: [] }],
  ['Problem Solving/System Design Interview/', { category: 'craft', subcategory: 'interviews', tags: ['interviews', 'system-design'] }],
  ['Problem Solving/', { category: 'craft', subcategory: 'engineering-practice', tags: [] }],
  ['Machine Learning/', { category: 'craft', subcategory: 'interviews', tags: ['interviews', 'machine-learning'] }],

  ['Soft Skills/negotiating/', { category: 'career', subcategory: 'negotiation', tags: ['negotiation'] }],
  ['Soft Skills/', { category: 'career', subcategory: 'self-development', tags: [] }],
  ['Non-Technical/', { category: 'career', subcategory: 'business', tags: [] }],

  ['System Design/', { category: 'architecture', subcategory: 'fundamentals', tags: ['system-design'] }],
]

/**
 * Per-file corrections. Keyed by legacy path.
 *
 * Two kinds of entry live here:
 *   - Books filed in a directory that lied about their subject.
 *   - Books whose filename parsed badly and need explicit bibliographic data.
 */
export const OVERRIDES = {
  // --- Misfiled: not MySQL-specific, it is general relational modelling ---
  'Databases/mysql/Michael J. Hernandez - Database Design for Mere Mortals_ A Hands-On Guide to Relational Database Design (2013, Addison-Wesley Professional).pdf': {
    category: 'data', subcategory: 'modeling', edition: 3, tags: ['sql'],
  },
  'Databases/mysql/Anthony Molinaro, Robert de Graaf - SQL Cookbook_ Query Solutions and Techniques for All SQL Users (2021, O\'Reilly Media) - libgen.li.pdf': {
    category: 'data', subcategory: 'fundamentals', tags: ['sql'],
  },
  'Databases/design/Designing Data Intensive Applications - Martin Kleppmann.pdf': {
    category: 'data', subcategory: 'fundamentals',
    title: 'Designing Data-Intensive Applications',
    subtitle: 'The Big Ideas Behind Reliable, Scalable, and Maintainable Systems',
    authors: ['Martin Kleppmann'], year: 2017, publisher: "O'Reilly Media",
    tags: ['distributed-systems', 'scalability', 'streaming', 'sql', 'nosql'],
  },
  'Databases/design/Serge Gershkovich - Data Modeling with Snowflake_ A practical guide to accelerating Snowflake development using universal data modeling techniques-Packt Publishing.pdf': {
    category: 'data', subcategory: 'modeling', tags: ['sql', 'cloud-native'],
  },

  // --- Misfiled: language/runtime concurrency belongs with foundations ---
  'programming/Concurrent Programming in Java Design Principles.pdf': {
    category: 'foundations', subcategory: 'concurrency',
    title: 'Concurrent Programming in Java', subtitle: 'Design Principles and Patterns',
    authors: ['Doug Lea'], tags: ['concurrency', 'java', 'jvm'],
  },
  'programming/concurrency/Art of.pdf': {
    category: 'foundations', subcategory: 'concurrency',
    title: 'The Art of Multiprocessor Programming',
    authors: ['Maurice Herlihy', 'Nir Shavit'], year: 2021, edition: 2,
    publisher: 'Morgan Kaufmann', tags: ['concurrency', 'algorithms'],
  },
  'programming/concurrency/The Art of Multiprocessor Programming, Revised Reprint- Maurice Herlihy, Nir Shavit -Morgan Kaufmann (2012).pdf': {
    category: 'foundations', subcategory: 'concurrency',
    title: 'The Art of Multiprocessor Programming',
    authors: ['Maurice Herlihy', 'Nir Shavit'], year: 2012, edition: 1,
    publisher: 'Morgan Kaufmann', tags: ['concurrency', 'algorithms'],
  },

  // --- Misfiled: API design is a programming concern, not architecture ---
  'programming/Designing Web APIs by Brenda Jin, Saurabh Sahni, Amir Shevat-OReilly.pdf': {
    category: 'programming', subcategory: 'apis',
    title: 'Designing Web APIs', authors: ['Brenda Jin', 'Saurabh Sahni', 'Amir Shevat'],
    publisher: "O'Reilly Media", tags: ['api', 'rest'],
  },
  'System Design/hands-on-restful-api-design-patterns-and-best-practices.pdf': {
    category: 'programming', subcategory: 'apis', tags: ['api', 'rest'],
  },
  'System Design/rest-api-design-rulebook.pdf': {
    category: 'programming', subcategory: 'apis', kind: 'guide',
    title: 'REST API Design Rulebook', authors: ['Mark Masse'], publisher: "O'Reilly Media",
    tags: ['api', 'rest'],
  },
  'System Design/Stowe M. - Undisturbed Rest - libgen.li.pdf': {
    category: 'programming', subcategory: 'apis', kind: 'guide',
    title: 'Undisturbed REST', subtitle: 'A Guide to Designing the Perfect API',
    authors: ['Michael Stowe'], tags: ['api', 'rest'],
  },
  'security/securing-the-api-stronghold.pdf': {
    category: 'security', subcategory: 'api-security', kind: 'guide', tags: ['api', 'security'],
  },

  // --- Misfiled: these are architecture, not generic "system design" ---
  'System Design/Chris Richardson - Microservices Patterns_ With examples in Java (2018, Manning Publications).pdf': {
    category: 'architecture', subcategory: 'microservices', tags: ['microservices', 'java', 'design-patterns'],
  },
  'System Design/Designing Distributed Systems_ Patterns and Paradigms for Scalable, Reliable Services (2018, O’Reilly Media) - Brendan Burns.pdf': {
    category: 'architecture', subcategory: 'distributed-systems', tags: ['distributed-systems', 'kubernetes'],
  },
  'System Design/Payment Systems and Performance Improvement_ Participation in Payment System Design (1989) - Bowey, Angela_ Thorpe, Richard.pdf': {
    category: 'career', subcategory: 'business', tags: [],
  },
  'Software Architecture/Designing_Event_Driven_Systems.pdf': {
    category: 'architecture', subcategory: 'event-driven', kind: 'guide',
    title: 'Designing Event-Driven Systems', authors: ['Ben Stopford'],
    publisher: "O'Reilly Media", year: 2018, tags: ['event-driven', 'kafka', 'streaming'],
  },
  'Software Architecture/Enterprise Integration Patterns_ Designing, Building, and Deploying Messaging Solutions  -Addison-Wesley Professional (2003).pdf': {
    category: 'architecture', subcategory: 'event-driven',
    title: 'Enterprise Integration Patterns', authors: ['Gregor Hohpe', 'Bobby Woolf'],
    tags: ['messaging', 'design-patterns', 'event-driven'],
  },
  'Software Architecture/Patterns of Enterprise Application Architecture.pdf': {
    category: 'architecture', subcategory: 'patterns',
    title: 'Patterns of Enterprise Application Architecture', authors: ['Martin Fowler'],
    year: 2002, publisher: 'Addison-Wesley', tags: ['design-patterns', 'oop'],
  },
  'Software Architecture/Mark Richards - Software Architecture Patterns (2015, O\'Reilly).pdf': {
    category: 'architecture', subcategory: 'patterns', kind: 'guide', tags: ['design-patterns'],
  },
  'Software Architecture/Pethuru Raj, Anupama Raman, Harihara Subramanian - Architectural Patterns_ Uncover essential patterns in the most indispensable realm of enterprise architecture (2017, Packt Publishing - ebooks Account).pdf': {
    category: 'architecture', subcategory: 'patterns', tags: ['design-patterns'],
  },
  'Software Architecture/microservices/MicroservicePatternLanguage.pdf': {
    category: 'architecture', subcategory: 'microservices', kind: 'reference',
    title: 'Microservice Pattern Language', authors: ['Chris Richardson'],
    tags: ['microservices', 'design-patterns'],
  },
  'Software Architecture/developing-open-cloud-native-microservice.pdf': {
    category: 'architecture', subcategory: 'microservices', kind: 'guide',
    tags: ['microservices', 'cloud-native'],
  },
  'Software Architecture/Ejsmont, Artur - Web scalability for startup engineers (2015).pdf': {
    category: 'architecture', subcategory: 'fundamentals', tags: ['scalability'],
  },

  // --- Misfiled: culture and team books are craft, not architecture ---
  'Software Architecture/Accelerate - Building and Scaling High Performing Technology Organisations - Nicole Fergrson.pdf': {
    category: 'craft', subcategory: 'team-culture',
    title: 'Accelerate', subtitle: 'The Science of Lean Software and DevOps',
    authors: ['Nicole Forsgren', 'Jez Humble', 'Gene Kim'], year: 2018,
    tags: ['devops', 'management', 'leadership'],
  },
  'Software Architecture/Accelerate_ The Science of DevOps ( PDFDrive ).pdf': {
    category: 'craft', subcategory: 'team-culture',
    title: 'Accelerate', subtitle: 'The Science of Lean Software and DevOps',
    authors: ['Nicole Forsgren', 'Jez Humble', 'Gene Kim'], year: 2018,
    tags: ['devops', 'management', 'leadership'],
  },
  'Software Architecture/Nicole Forsgren_ Jez Humble_ Gene Kim - Accelerate_ The Science of Lean Software and DevOps_ Building and Scaling High Performing Technology Organizations (2018, It Revolution Press).epub': {
    category: 'craft', subcategory: 'team-culture',
    title: 'Accelerate', subtitle: 'The Science of Lean Software and DevOps',
    authors: ['Nicole Forsgren', 'Jez Humble', 'Gene Kim'], year: 2018,
    tags: ['devops', 'management', 'leadership'],
  },
  'Software Architecture/Hohpe G. The Software Architect Elevator...2020.pdf': {
    category: 'craft', subcategory: 'team-culture',
    title: 'The Software Architect Elevator', authors: ['Gregor Hohpe'],
    year: 2020, publisher: "O'Reilly Media", tags: ['leadership', 'management'],
  },
  'Software Engineering/mythical-man-month.pdf': {
    category: 'craft', subcategory: 'team-culture',
    title: 'The Mythical Man-Month', subtitle: 'Essays on Software Engineering',
    authors: ['Frederick P. Brooks Jr.'], year: 1975, tags: ['management', 'leadership'],
  },
  'devops/The DevOps Handbook_ How to Create World-Class Agility, Reliability, & Security in Technology Organizations-Gene Kim, Jez Humble, Patrick Debois, John Willis, Nicole Forsgren.pdf': {
    category: 'platform', subcategory: 'devops',
    title: 'The DevOps Handbook',
    authors: ['Gene Kim', 'Jez Humble', 'Patrick Debois', 'John Willis'],
    tags: ['devops', 'management', 'reliability'],
  },

  // --- Misfiled: quality concerns ---
  'Software Engineering/kent-beck-test-driven-development-by-example.pdf': {
    category: 'quality', subcategory: 'testing',
    title: 'Test-Driven Development by Example', authors: ['Kent Beck'],
    year: 2002, publisher: 'Addison-Wesley', tags: ['tdd', 'testing'],
  },
  'Software Engineering/Why_Programs_Fail_Second_Edition_A_Guide_to_Systematic_Debugging__2009by-Andreas_Zeller.pdf': {
    category: 'quality', subcategory: 'debugging',
    title: 'Why Programs Fail', subtitle: 'A Guide to Systematic Debugging',
    authors: ['Andreas Zeller'], year: 2009, edition: 2, tags: ['debugging', 'testing'],
  },
  'Software Testing/load-testing/k6-guideline.pdf': {
    category: 'quality', subcategory: 'load-testing', kind: 'guide',
    title: 'k6 Load Testing Guide', tags: ['testing', 'performance'],
  },

  // --- Misfiled: code quality ---
  'Software Engineering/Martin Fowler - Refactoring - Improving the Design of Existing Code.pdf': {
    category: 'programming', subcategory: 'code-quality',
    title: 'Refactoring', subtitle: 'Improving the Design of Existing Code',
    authors: ['Martin Fowler'], tags: ['refactoring', 'design-patterns'],
  },
  'Software Engineering/Head First Design Patterns.pdf': {
    category: 'programming', subcategory: 'design-patterns',
    title: 'Head First Design Patterns', authors: ['Eric Freeman', 'Elisabeth Robson'],
    edition: 1, year: 2004, publisher: "O'Reilly Media", tags: ['design-patterns', 'oop', 'java'],
  },
  'programming/Your Code as a Crime Scene_ Use Forensic Techniques to Arrest Defects, Bottlenecks, and Bad Design in Your Programs (2015) - Adam Tornhill.pdf': {
    category: 'programming', subcategory: 'code-quality', tags: ['refactoring', 'legacy-code'],
  },
  'programming/clean-code/Code Simplicity -The Fundamentals of Software.pdf': {
    category: 'programming', subcategory: 'code-quality',
    title: 'Code Simplicity', subtitle: 'The Fundamentals of Software',
    authors: ['Max Kanat-Alexander'], year: 2012, publisher: "O'Reilly Media", tags: ['refactoring'],
  },
  'programming/clean-code/clean-code.pdf': {
    category: 'programming', subcategory: 'code-quality',
    title: 'Clean Code', subtitle: 'A Handbook of Agile Software Craftsmanship',
    authors: ['Robert C. Martin'], year: 2008, tags: ['refactoring', 'oop'],
  },
  'programming/clean-code/clean-code-tips-tricks-world-coding.pdf': {
    category: 'programming', subcategory: 'code-quality', kind: 'guide',
    title: 'Clean Code Tips and Tricks', tags: ['refactoring'],
  },
  'programming/design-patterns/Agile-Principles-Patterns-and-Practices-in-C.pdf': {
    category: 'programming', subcategory: 'design-patterns',
    title: 'Agile Principles, Patterns, and Practices in C#',
    authors: ['Robert C. Martin', 'Micah Martin'], tags: ['design-patterns', 'oop'],
  },
  'programming/97_Things_Every_Programmer_Should_Know.pdf': {
    category: 'craft', subcategory: 'engineering-practice',
    title: '97 Things Every Programmer Should Know', authors: ['Kevlin Henney'],
    year: 2010, publisher: "O'Reilly Media", tags: [],
  },
  'Development Practices/Jan Goyvaerts, Steven Levithan - Regular Expressions Cookbook (2012, O\'Reilly Media).pdf': {
    category: 'programming', subcategory: 'tooling', edition: 2, tags: [],
  },

  // --- Craft: practice and interviews ---
  'Problem Solving/_Grokking the Advanced System Design Interview (2021).pdf': {
    category: 'craft', subcategory: 'interviews', kind: 'guide',
    title: 'Grokking the Advanced System Design Interview', year: 2021,
    tags: ['interviews', 'system-design', 'distributed-systems'],
  },
  'Problem Solving/triz-for-dummies.pdf': {
    category: 'career', subcategory: 'self-development',
    title: 'TRIZ For Dummies', authors: ['Lilly Haines-Gadd'], tags: [],
  },
  'Problem Solving/the-effective-engineer.pdf': {
    category: 'craft', subcategory: 'engineering-practice',
    title: 'The Effective Engineer', authors: ['Edmond Lau'], year: 2015, tags: [],
  },
  'Problem Solving/The Effective Engineer - Edmond Lau.epub': {
    category: 'craft', subcategory: 'engineering-practice',
    title: 'The Effective Engineer', authors: ['Edmond Lau'], year: 2015, tags: [],
  },
  'Machine Learning/Khang Pham - Machine Learning Design Interview_ Machine Learning System Design Interview-Independently published (2022).pdf': {
    category: 'craft', subcategory: 'interviews', tags: ['interviews', 'machine-learning', 'system-design'],
  },

  // --- Career ---
  'Soft Skills/Strengths Finder 2.0 - Rath Tom. .pdf': {
    category: 'career', subcategory: 'self-development',
    title: 'StrengthsFinder 2.0', authors: ['Tom Rath'], year: 2007, tags: [],
  },
  'Soft Skills/StrengthsFinder.pdf': {
    category: 'career', subcategory: 'self-development',
    title: 'StrengthsFinder 2.0', authors: ['Tom Rath'], year: 2007, tags: [],
  },
  'Non-Technical/The Hard Thing About Hard Things.pdf': {
    category: 'career', subcategory: 'business',
    title: 'The Hard Thing About Hard Things',
    subtitle: 'Building a Business When There Are No Easy Answers',
    authors: ['Ben Horowitz'], year: 2014, tags: ['leadership', 'management'],
  },
  'Non-Technical/The End of Advertising as We Know It (2002) - Sergio Zyman, Armin Brott .pdf': {
    category: 'career', subcategory: 'business', tags: [],
  },

  // --- Foundations: OS files with unparseable names ---
  'Operating Systems/a simple, Unix-like teaching operating system.pdf': {
    category: 'foundations', subcategory: 'operating-systems', kind: 'guide',
    title: 'xv6: A Simple, Unix-like Teaching Operating System',
    authors: ['Russ Cox', 'Frans Kaashoek', 'Robert Morris'], tags: ['unix', 'linux'],
  },
  'Operating Systems/A COMMENTARY ON THE SIXTH EDITION UNIX OPERATING SYSTEM.pdf': {
    category: 'foundations', subcategory: 'operating-systems',
    title: 'A Commentary on the Sixth Edition UNIX Operating System',
    authors: ['John Lions'], year: 1977, tags: ['unix'],
  },
  'Operating Systems/Operating Systems Principles & Practice (2015).pdf': {
    category: 'foundations', subcategory: 'operating-systems',
    title: 'Operating Systems: Principles and Practice',
    authors: ['Thomas Anderson', 'Michael Dahlin'], year: 2015, edition: 2, tags: [],
  },
  'Operating Systems/Brian Ward - How Linux Works. What Every Superuser Should Know (2021, no starch press).pdf': {
    category: 'foundations', subcategory: 'operating-systems',
    title: 'How Linux Works', subtitle: 'What Every Superuser Should Know',
    authors: ['Brian Ward'], year: 2021, edition: 3, tags: ['linux', 'unix'],
  },

  // --- Data: vendor guides that are not books ---
  'Apache Kafka/kafka-best-practices.pdf': {
    category: 'data', subcategory: 'kafka', kind: 'guide',
    title: 'Kafka Best Practices', tags: ['kafka', 'streaming', 'performance'],
  },
  'Apache Kafka/Kafka-Optimization-Benchmarking-Guide.pdf': {
    category: 'data', subcategory: 'kafka', kind: 'guide',
    title: 'Kafka Optimization and Benchmarking Guide', tags: ['kafka', 'performance'],
  },
  'Apache Kafka/Optimizing_Your_Apache_Kafka_Deployment.pdf': {
    category: 'data', subcategory: 'kafka', kind: 'guide',
    title: 'Optimizing Your Apache Kafka Deployment', tags: ['kafka', 'performance'],
  },
  'Apache Kafka/Mastering_Kafka_Streams_and_ksqlDB.pdf': {
    category: 'data', subcategory: 'kafka',
    title: 'Mastering Kafka Streams and ksqlDB', authors: ['Mitch Seymour'],
    year: 2021, publisher: "O'Reilly Media", tags: ['kafka', 'streaming'],
  },
  'Databases/postgresql/Effective_Indexing_in_Postgres.pdf': {
    category: 'data', subcategory: 'postgresql', kind: 'guide',
    title: 'Effective Indexing in Postgres', tags: ['sql', 'indexing', 'performance'],
  },
  'Databases/postgresql/pganalyze_Best-Practices-for-Optimizing-Postgres-Query-Performance.pdf': {
    category: 'data', subcategory: 'postgresql', kind: 'guide',
    title: 'Best Practices for Optimizing Postgres Query Performance',
    tags: ['sql', 'performance'],
  },
  'Databases/redis/caching-at-scale-with-redis-updated-2021-12-04.pdf': {
    category: 'data', subcategory: 'redis', kind: 'guide',
    title: 'Caching at Scale with Redis', year: 2021, tags: ['caching', 'nosql', 'scalability'],
  },
  'Databases/mysql/High Availability MySQL Cookbook.pdf': {
    category: 'data', subcategory: 'mysql',
    title: 'High Availability MySQL Cookbook', authors: ['Alex Davies'],
    year: 2010, publisher: 'Packt Publishing', tags: ['sql', 'reliability'],
  },
  'Databases/mysql/MySQL Cookbook, 3rd Edition.pdf': {
    category: 'data', subcategory: 'mysql',
    title: 'MySQL Cookbook', authors: ['Paul DuBois'], edition: 3,
    publisher: "O'Reilly Media", tags: ['sql'],
  },
  'Databases/mysql/Understanding MySQL Internals.pdf': {
    category: 'data', subcategory: 'mysql',
    title: 'Understanding MySQL Internals', authors: ['Sasha Pachev'],
    year: 2007, publisher: "O'Reilly Media", tags: ['sql', 'performance'],
  },
  'Databases/mysql/Understanding MySQL Internals (2009) - Sasha Pachev.pdf': {
    category: 'data', subcategory: 'mysql',
    title: 'Understanding MySQL Internals', authors: ['Sasha Pachev'],
    year: 2009, publisher: "O'Reilly Media", tags: ['sql', 'performance'],
  },
  'Databases/Alex Petrov - Database Internals_ A Deep Dive into How Distributed Data Systems Work-O\'Reilly Media (2019).pdf': {
    category: 'data', subcategory: 'fundamentals',
    tags: ['distributed-systems', 'performance', 'indexing'],
  },

  // --- Platform ---
  'devops/k8s/Marko Luksa - Kubernetes in Action (2018, Manning Publications).epub': {
    category: 'platform', subcategory: 'kubernetes', edition: 1,
    title: 'Kubernetes in Action', authors: ['Marko Lukša'], year: 2018,
    tags: ['kubernetes', 'containers'],
  },
  'devops/k8s/Marko Lukša - Kubernetes in Action, Second Edition MEAP V15.-Manning Publications Co. (2023).epub': {
    category: 'platform', subcategory: 'kubernetes', edition: 2,
    title: 'Kubernetes in Action', authors: ['Marko Lukša'], year: 2023,
    tags: ['kubernetes', 'containers'],
  },
  'networking/mqtt/Mastering MQTT-Your Ultimate Tutorial for MQTT.pdf': {
    category: 'foundations', subcategory: 'networking', kind: 'guide',
    title: 'Mastering MQTT', tags: ['mqtt', 'messaging'],
  },

  // --- Architecture fundamentals with broken names ---
  'Software Architecture/Fundamentals of Software Architecture.pdf': {
    category: 'architecture', subcategory: 'fundamentals',
    title: 'Fundamentals of Software Architecture', subtitle: 'An Engineering Approach',
    authors: ['Mark Richards', 'Neal Ford'], year: 2020, publisher: "O'Reilly Media",
    tags: ['design-patterns'],
  },
  'Software Architecture/Software Architecture - The Hardparts.pdf': {
    category: 'architecture', subcategory: 'fundamentals',
    title: 'Software Architecture: The Hard Parts',
    authors: ['Neal Ford', 'Mark Richards', 'Pramod Sadalage', 'Zhamak Dehghani'],
    year: 2021, publisher: "O'Reilly Media", tags: ['microservices', 'distributed-systems'],
  },
  'Software Architecture/Book - Clean Architecture - Robert Cecil Martin.pdf': {
    category: 'architecture', subcategory: 'fundamentals',
    title: 'Clean Architecture', subtitle: "A Craftsman's Guide to Software Structure and Design",
    authors: ['Robert C. Martin'], year: 2017, tags: ['oop', 'design-patterns'],
  },
  'Software Architecture/Clean.Architecture.2017.9.epub': {
    category: 'architecture', subcategory: 'fundamentals',
    title: 'Clean Architecture', subtitle: "A Craftsman's Guide to Software Structure and Design",
    authors: ['Robert C. Martin'], year: 2017, tags: ['oop', 'design-patterns'],
  },
  'Software Architecture/A Philosophy of Software Design - John Ousterhout.pdf': {
    category: 'architecture', subcategory: 'fundamentals',
    title: 'A Philosophy of Software Design', authors: ['John Ousterhout'],
    year: 2018, tags: [],
  },
  'Software Architecture/DDD/DomainDrivenDesignQuicklyOnline.pdf': {
    category: 'architecture', subcategory: 'domain-driven-design', kind: 'guide',
    title: 'Domain-Driven Design Quickly', authors: ['Abel Avram', 'Floyd Marinescu'],
    year: 2006, tags: ['ddd'],
  },
  'Software Architecture/Nawda, Jarred - An a to Z Guidebook on Microservices_ An Introduction Explaining Microservices and Their Patterns_ Microservices Patterns Book (2021, Independently published).epub': {
    category: 'architecture', subcategory: 'microservices', tags: ['microservices', 'design-patterns'],
  },
  // --- Distinct editions of one work: each gets its own directory ---
  'Databases/design/Beginning database design solutions (2009, Wiley Pub) - Rod Stephens.pdf': {
    category: 'data', subcategory: 'modeling', edition: 1,
    title: 'Beginning Database Design Solutions', authors: ['Rod Stephens'],
    year: 2009, publisher: 'Wiley', tags: ['sql'],
  },
  'Databases/design/Rod Stephens - Beginning Database Design Solutions_ Understanding and Implementing Database Design Concepts for the Cloud and Beyond (2023, Wiley) - libgen.li.pdf': {
    category: 'data', subcategory: 'modeling', edition: 2,
    title: 'Beginning Database Design Solutions',
    subtitle: 'Understanding and Implementing Database Design Concepts for the Cloud and Beyond',
    authors: ['Rod Stephens'], year: 2023, publisher: 'Wiley', tags: ['sql', 'cloud-native'],
  },
  'Problem Solving/Andrew Hunt, David Thomas - The Pragmatic Programmer_ From Journeyman to Master (1999, Addison-Wesley Professional) - libgen.lc (1).pdf': {
    category: 'craft', subcategory: 'engineering-practice', edition: 1,
    title: 'The Pragmatic Programmer', subtitle: 'From Journeyman to Master',
    authors: ['Andrew Hunt', 'David Thomas'], year: 1999, publisher: 'Addison-Wesley', tags: [],
  },
  'Problem Solving/David Thomas, Andrew Hunt - The Pragmatic Programmer_ Your Journey To Mastery, 20th Anniversary Edition (2019, Addison-Wesley Professional) - libgen.li.pdf': {
    category: 'craft', subcategory: 'engineering-practice', edition: 2,
    title: 'The Pragmatic Programmer', subtitle: 'Your Journey to Mastery, 20th Anniversary Edition',
    authors: ['David Thomas', 'Andrew Hunt'], year: 2019, publisher: 'Addison-Wesley', tags: [],
  },
  'programming/java/Y Daniel Liang - Introduction to Java Programming and Data Structures, Comprehensive Version (2017, Pearson).pdf': {
    category: 'programming', subcategory: 'java', edition: 11,
    title: 'Introduction to Java Programming and Data Structures',
    subtitle: 'Comprehensive Version', authors: ['Y. Daniel Liang'],
    year: 2017, publisher: 'Pearson', tags: ['java', 'jvm', 'algorithms'],
  },
  'programming/java/Y. Daniel Liang - Introduction to Java Programming and Data Structures, Comprehensive Version (2019, Pearson).pdf': {
    category: 'programming', subcategory: 'java', edition: 12,
    title: 'Introduction to Java Programming and Data Structures',
    subtitle: 'Comprehensive Version', authors: ['Y. Daniel Liang'],
    year: 2019, publisher: 'Pearson', tags: ['java', 'jvm', 'algorithms'],
  },
  'programming/python/Learn Python The Hard Way-Addison-Wesley (2013) - Zed Shaw .pdf': {
    category: 'programming', subcategory: 'python', edition: 3,
    title: 'Learn Python the Hard Way', subtitle: 'A Very Simple Introduction to the Terrifyingly Beautiful World of Computers and Code',
    authors: ['Zed A. Shaw'], year: 2013, publisher: 'Addison-Wesley', tags: ['python'],
  },
  "programming/python/(Zed Shaw's Hard Way Series) Zed Shaw - Learn Python the Hard Way-Addison-Wesley Professional (2024).pdf": {
    category: 'programming', subcategory: 'python', edition: 5,
    title: 'Learn Python the Hard Way', authors: ['Zed A. Shaw'],
    year: 2024, publisher: 'Addison-Wesley', tags: ['python'],
  },

  // --- Filename lies: this is Docker in PRACTICE, a different book entirely ---
  'devops/container/Miell, Ian_Sayers, Aiden Hobson - Docker in Action (2019, Manning Publications) - libgen.li.pdf': {
    category: 'platform', subcategory: 'containers', edition: 2,
    title: 'Docker in Practice', authors: ['Ian Miell', 'Aidan Hobson Sayers'],
    year: 2019, publisher: 'Manning Publications', tags: ['docker', 'containers'],
  },
  'devops/container/Jeff Nickoloff, Stephen Kuenzli - Docker in Action (2019, Manning Publications) - libgen.li.pdf': {
    category: 'platform', subcategory: 'containers', edition: 2,
    title: 'Docker in Action', authors: ['Jeff Nickoloff', 'Stephen Kuenzli'],
    year: 2019, publisher: 'Manning Publications', tags: ['docker', 'containers'],
  },

  // --- Summaries are separate works from the book they summarise ---
  'Soft Skills/negotiating/EssentialInsight Summaries - Summary_ Never Split the Difference_ Negotiating As If Your Life Depended On It - by Chris Voss (2021, EssentialInsight Summaries) - libgen.li.pdf': {
    category: 'career', subcategory: 'negotiation', kind: 'guide',
    title: 'Summary: Never Split the Difference', authors: ['EssentialInsight Summaries'],
    year: 2021, tags: ['negotiation'],
  },
  'Soft Skills/negotiating/EssentialInsight Summaries - Summary_ Never Split the Difference_ Negotiating As If Your Life Depended On It - by Chris Voss (2021, EssentialInsight Summaries) - libgen.li.epub': {
    category: 'career', subcategory: 'negotiation', kind: 'guide',
    title: 'Summary: Never Split the Difference', authors: ['EssentialInsight Summaries'],
    year: 2021, tags: ['negotiation'],
  },
  'Soft Skills/negotiating/Voss, Chris - Never Split the Difference_ Negotiating as if Your Life Depended on It 1 1 (2016) - libgen.li.pdf': {
    category: 'career', subcategory: 'negotiation',
    title: 'Never Split the Difference', subtitle: 'Negotiating As If Your Life Depended On It',
    authors: ['Chris Voss', 'Tahl Raz'], year: 2016, publisher: 'HarperBusiness', tags: ['negotiation'],
  },
  'Soft Skills/negotiating/Raz, Tahl_Voss, Chris - Never Split the Difference_ Negotiating As If Your Life Depended On It (2016, HarperBusiness) - libgen.li.epub': {
    category: 'career', subcategory: 'negotiation',
    title: 'Never Split the Difference', subtitle: 'Negotiating As If Your Life Depended On It',
    authors: ['Chris Voss', 'Tahl Raz'], year: 2016, publisher: 'HarperBusiness', tags: ['negotiation'],
  },

  'Distributed Systems/_Designing Data Intensive Applications.pdf': { drop: true },
  'Software Architecture/_Designing Data Intensive Applications.pdf': { drop: true },
}

/**
 * Resolves the destination for a legacy path by applying the longest matching
 * directory rule, then layering the override on top.
 */
export function resolveMapping(sourcePath) {
  if (DROPPED_PATHS.has(sourcePath)) return null

  let rule = null
  let matchedLength = -1
  for (const [prefix, destination] of DIRECTORY_RULES) {
    if (sourcePath.startsWith(prefix) && prefix.length > matchedLength) {
      rule = destination
      matchedLength = prefix.length
    }
  }

  const override = OVERRIDES[sourcePath] ?? {}
  if (override.drop) return null

  const tags = [...new Set([...(rule?.tags ?? []), ...(override.tags ?? [])])]
  return { ...rule, ...override, tags }
}
