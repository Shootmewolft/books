<div align="center">

# 📚 La Biblioteca del Software

**A curated collection of software engineering books, with a reader built in.**

`151 books` · `158 files` · `1.48 GB` · `9 categories`

[![Stars](https://img.shields.io/github/stars/shootmewolft/books?style=flat-square&label=stars&color=8b5cf6)](https://github.com/shootmewolft/books/stargazers)
[![Last commit](https://img.shields.io/github/last-commit/shootmewolft/books?style=flat-square&color=6366f1)](https://github.com/shootmewolft/books/commits)
[![License](https://img.shields.io/badge/code-MIT-blue?style=flat-square)](./LICENSE)

Built by [**Shoot**](https://github.com/shootmewolft)

</div>

---

## ⚖️ The books are not mine

Every file under `library/` belongs to its authors and publishers. The MIT license
covers the software in this repository — the reader, the tooling, the schemas — and
nothing else. See [COPYRIGHT.md](./COPYRIGHT.md).

**If a book here is useful to you, buy it.** Removal requests from rights holders are
honoured immediately and without argument.

---

## How it is organised

Every book is a directory holding its files and its metadata:

```
library/{category}/{subcategory}/{slug}/
    book.json      metadata: title, authors, tags, files
    cover.webp     extracted from page 1
    en.pdf         one file per language and format
    es.pdf         the same book in Spanish, when available
```

A book lives in exactly one place. Everything cross-cutting is a **tag**, which is what
the reader filters on — so a book that spans three topics stays findable without being
copied three times.

Content shapes: `book` (131) · `guide` (19) · `reference` (1).

---

## Catalogue

### Foundations <sup>25</sup>

*The machine underneath: algorithms, operating systems, networks, and concurrency.*

<details>
<summary><b>Algorithms & Data Structures</b> — 3 titles</summary>

| Title | Author | Year | Formats | Languages |
|---|---|:---:|:---:|:---:|
| [Algorithms Unlocked](library/foundations/algorithms/algorithms-unlocked) | Thomas H. Cormen | 2013 | pdf | en |
| [Data structures and algorithms made easy in Java](library/foundations/algorithms/data-structures-and-algorithms-made-easy-in-java) | Narasimha Karumanchi | 2018 | pdf | en |
| [Introduction to algorithms](library/foundations/algorithms/introduction-to-algorithms-3e) *(3e)* | Thomas H. Cormen et al. | 2009 | pdf | en |

</details>

<details>
<summary><b>Operating Systems</b> — 8 titles</summary>

| Title | Author | Year | Formats | Languages |
|---|---|:---:|:---:|:---:|
| [A Commentary on the Sixth Edition UNIX Operating System](library/foundations/operating-systems/a-commentary-on-the-sixth-edition-unix-operating-system) | John Lions | 1977 | pdf | en |
| [How Linux Works](library/foundations/operating-systems/how-linux-works-3e) *(3e)* | Brian Ward | 2021 | pdf | en |
| [Modern Operating Systems](library/foundations/operating-systems/modern-operating-systems) | Andrew S. Tanenbaum & Herbert Bos | 2023 | pdf | en |
| [Operating System Concepts Essentials](library/foundations/operating-systems/operating-system-concepts-essentials) | Abraham Silberschatz et al. | 2013 | pdf | en |
| [Operating Systems In Depth](library/foundations/operating-systems/operating-systems-in-depth) | Doeppner & Thomas W | — | pdf | en |
| [Operating Systems: Principles and Practice](library/foundations/operating-systems/operating-systems-principles-and-practice-2e) *(2e)* | Thomas Anderson & Michael Dahlin | 2015 | pdf | en |
| [The Design of the UNIX Operating System](library/foundations/operating-systems/the-design-of-the-unix-operating-system) | Maurice J. Bach | 1986 | pdf | en |
| [xv6: A Simple, Unix-like Teaching Operating System](library/foundations/operating-systems/xv6-a-simple-unix-like-teaching-operating-system) `guide` | Russ Cox et al. | — | pdf | en |

</details>

<details>
<summary><b>Networking</b> — 9 titles</summary>

| Title | Author | Year | Formats | Languages |
|---|---|:---:|:---:|:---:|
| [Computer Networking](library/foundations/networking/computer-networking) | Kurose et al. | 2021 | pdf | en |
| [Computer Networking](library/foundations/networking/computer-networking-7e) *(7e)* | James F. Kurose | 2020 | pdf | en |
| [Mastering MQTT](library/foundations/networking/mastering-mqtt) `guide` | yangxiaojuan | — | pdf | en |
| [MQTT Essentials - A Lightweight IoT Protocol](library/foundations/networking/mqtt-essentials-a-lightweight-iot-protocol) | Gaston C. Hillar | 2017 | pdf | en |
| [Network Programmability and Automation](library/foundations/networking/network-programmability-and-automation) | Jason Edelman et al. | 2018 | pdf | en |
| [Network Warrior](library/foundations/networking/network-warrior) | Gary A. Donahue | 2011 | pdf | en |
| [Networking All-in-One For Dummies](library/foundations/networking/networking-all-in-one-for-dummies) | Doug Lowe | 2021 | pdf | en |
| [Networking and Kubernetes](library/foundations/networking/networking-and-kubernetes) | James Strong & Vallery Lancey | 2021 | pdf | en |
| [Networking Fundamentals](library/foundations/networking/networking-fundamentals) | Gordon Davies | 2019 | pdf | en |

</details>

<details>
<summary><b>Concurrency</b> — 5 titles</summary>

| Title | Author | Year | Formats | Languages |
|---|---|:---:|:---:|:---:|
| [Concurrent Programming in Java](library/foundations/concurrency/concurrent-programming-in-java) | Doug Lea | — | pdf | en |
| [Java Threads](library/foundations/concurrency/java-threads-3e) *(3e)* | Scott Oaks & Henry Wong | 2004 | pdf | en |
| [Mastering Concurrency Programming with Java 9](library/foundations/concurrency/mastering-concurrency-programming-with-java-9) | Javier Fernandez Gonzalez | 2020 | pdf | en |
| [The Art of Multiprocessor Programming](library/foundations/concurrency/the-art-of-multiprocessor-programming) | Maurice Herlihy & Nir Shavit | 2012 | pdf | en |
| [The Art of Multiprocessor Programming](library/foundations/concurrency/the-art-of-multiprocessor-programming-2e) *(2e)* | Maurice Herlihy & Nir Shavit | 2021 | pdf | en |

</details>

### Programming <sup>32</sup>

*Writing code: languages, frameworks, patterns, and the discipline of keeping it clean.*

<details>
<summary><b>Code Quality & Refactoring</b> — 6 titles</summary>

| Title | Author | Year | Formats | Languages |
|---|---|:---:|:---:|:---:|
| [Clean Code](library/programming/code-quality/clean-code) | Robert C. Martin | — | pdf | en |
| [Clean Code Tips and Tricks](library/programming/code-quality/clean-code-tips-and-tricks) `guide` | Lewis & Elijah | — | pdf | en |
| [Code Simplicity](library/programming/code-quality/code-simplicity) | Max Kanat-Alexander | 2012 | pdf | en |
| [Refactoring](library/programming/code-quality/refactoring) | Martin Fowler | — | pdf | en |
| [Working effectively with legacy code](library/programming/code-quality/working-effectively-with-legacy-code) | Feathers & Michael C | 2013 | pdf | en |
| [Your Code as a Crime Scene](library/programming/code-quality/your-code-as-a-crime-scene) | Adam Tornhill | 2015 | pdf | en |

</details>

<details>
<summary><b>Design Patterns</b> — 5 titles</summary>

| Title | Author | Year | Formats | Languages |
|---|---|:---:|:---:|:---:|
| [Agile Principles, Patterns, and Practices in C#](library/programming/design-patterns/agile-principles-patterns-and-practices-in-c) | Robert C. Martin & Micah Martin | — | pdf | en |
| [Design Patterns](library/programming/design-patterns/design-patterns) | Erich Gamma et al. | — | pdf | en |
| [Dive Into Design Patterns](library/programming/design-patterns/dive-into-design-patterns) | Alexander Shvets | — | pdf | en |
| [Head First Design Patterns](library/programming/design-patterns/head-first-design-patterns) | Eric Freeman & Elisabeth Robson | 2004 | pdf | en |
| [Head First Design Patterns](library/programming/design-patterns/head-first-design-patterns-2e) *(2e)* | Eric Freeman & Elisabeth Robson | 2020 | pdf | en |

</details>

<details>
<summary><b>Java</b> — 3 titles</summary>

| Title | Author | Year | Formats | Languages |
|---|---|:---:|:---:|:---:|
| [[Java Performance](library/programming/java/java-performance) | The Definitive Guide] | — | pdf | en |
| [Introduction to Java Programming and Data Structures](library/programming/java/introduction-to-java-programming-and-data-structures-11e) *(11e)* | Y. Daniel Liang | 2017 | pdf | en |
| [Introduction to Java Programming and Data Structures](library/programming/java/introduction-to-java-programming-and-data-structures-12e) *(12e)* | Y. Daniel Liang | 2019 | pdf | en |

</details>

<details>
<summary><b>Python</b> — 5 titles</summary>

| Title | Author | Year | Formats | Languages |
|---|---|:---:|:---:|:---:|
| [Fluent Python](library/programming/python/fluent-python) | Luciano Ramalho | — | pdf | en |
| [Impractical Python Projects](library/programming/python/impractical-python-projects) | Lee Vaughan | 2019 | pdf | en |
| [Learn Python the Hard Way](library/programming/python/learn-python-the-hard-way-3e) *(3e)* | Zed A. Shaw | 2013 | pdf | en |
| [Learn Python the Hard Way](library/programming/python/learn-python-the-hard-way-5e) *(5e)* | Zed A. Shaw | 2024 | pdf | en |
| [Python Distilled](library/programming/python/python-distilled) | David Beazley | 2021 | pdf | en |

</details>

<details>
<summary><b>Spring</b> — 7 titles</summary>

| Title | Author | Year | Formats | Languages |
|---|---|:---:|:---:|:---:|
| [Cloud Native Java](library/programming/spring/cloud-native-java) | Josh Long & Kenny Bastani | — | epub, pdf | en |
| [Cloud Native Spring in Action with Spring Boot And Kubernetes](library/programming/spring/cloud-native-spring-in-action-with-spring-boot-and-kubernetes) | Thomas Vitale | 2022 | pdf | en |
| [Learning Spring Boot 3.0](library/programming/spring/learning-spring-boot-3-0-3e) *(3e)* | Greg L. Turnquist | 2022 | pdf | en |
| [Mastering Spring Boot 2.0](library/programming/spring/mastering-spring-boot-2-0) | Dinesh Rajput | 2018 | pdf | en |
| [Spring Boot in Action](library/programming/spring/spring-boot-in-action) | Craig Walls | 2016 | pdf | en |
| [Spring Boot in Practice](library/programming/spring/spring-boot-in-practice) | Somnath Musib | 2022 | pdf | en |
| [Stratospheric From Zero to Production with Spring Boot and AWS](library/programming/spring/stratospheric-from-zero-to-production-with-spring-boot-and-aws) | Tom Hombergs et al. | 2021 | pdf | en |

</details>

<details>
<summary><b>API Design</b> — 4 titles</summary>

| Title | Author | Year | Formats | Languages |
|---|---|:---:|:---:|:---:|
| [Designing Web APIs](library/programming/apis/designing-web-apis) | Brenda Jin et al. | — | pdf | en |
| [hands-on-restful-api-design-patterns-and-best-practices](library/programming/apis/hands-on-restful-api-design-patterns-and-best-practices) | Harihara Subramanian & Pethuru Raj | 2019 | pdf | en |
| [REST API Design Rulebook](library/programming/apis/rest-api-design-rulebook) `guide` | Mark Masse | — | pdf | en |
| [Undisturbed REST](library/programming/apis/undisturbed-rest) `guide` | Michael Stowe | — | pdf | en |

</details>

<details>
<summary><b>Tooling</b> — 2 titles</summary>

| Title | Author | Year | Formats | Languages |
|---|---|:---:|:---:|:---:|
| [Pro Git](library/programming/tooling/pro-git-2e) *(2e)* | Scott Chacon & Ben Straub | 2023 | pdf | en |
| [Regular Expressions Cookbook](library/programming/tooling/regular-expressions-cookbook-2e) *(2e)* | Jan Goyvaerts & Steven Levithan | 2012 | pdf | en |

</details>

### Architecture <sup>22</sup>

*Shaping systems at scale — the decisions that are expensive to reverse.*

<details>
<summary><b>Fundamentals</b> — 5 titles</summary>

| Title | Author | Year | Formats | Languages |
|---|---|:---:|:---:|:---:|
| [A Philosophy of Software Design](library/architecture/fundamentals/a-philosophy-of-software-design) | John Ousterhout | 2018 | pdf | en |
| [Clean Architecture](library/architecture/fundamentals/clean-architecture) | Robert C. Martin | 2017 | epub, pdf | en |
| [Fundamentals of Software Architecture](library/architecture/fundamentals/fundamentals-of-software-architecture) | Mark Richards & Neal Ford | 2020 | pdf | en |
| [Software Architecture: The Hard Parts](library/architecture/fundamentals/software-architecture-the-hard-parts) | Neal Ford et al. | 2021 | pdf | en |
| [Web scalability for startup engineers](library/architecture/fundamentals/web-scalability-for-startup-engineers) | Ejsmont & Artur | — | pdf | en |

</details>

<details>
<summary><b>Architectural Patterns</b> — 3 titles</summary>

| Title | Author | Year | Formats | Languages |
|---|---|:---:|:---:|:---:|
| [Architectural Patterns](library/architecture/patterns/architectural-patterns) | Pethuru Raj et al. | 2017 | pdf | en |
| [Patterns of Enterprise Application Architecture](library/architecture/patterns/patterns-of-enterprise-application-architecture) | Martin Fowler | 2002 | pdf | en |
| [Software Architecture Patterns](library/architecture/patterns/software-architecture-patterns) `guide` | Mark Richards | 2015 | pdf | en |

</details>

<details>
<summary><b>Domain-Driven Design</b> — 3 titles</summary>

| Title | Author | Year | Formats | Languages |
|---|---|:---:|:---:|:---:|
| [Domain-driven design](library/architecture/domain-driven-design/domain-driven-design) | Evans & Eric | 2014 | pdf | en |
| [Domain-Driven Design Distilled](library/architecture/domain-driven-design/domain-driven-design-distilled) | Vaughn Vernon | 2016 | pdf | en |
| [Domain-Driven Design Quickly](library/architecture/domain-driven-design/domain-driven-design-quickly) `guide` | Abel Avram & Floyd Marinescu | 2006 | pdf | en |

</details>

<details>
<summary><b>Microservices</b> — 6 titles</summary>

| Title | Author | Year | Formats | Languages |
|---|---|:---:|:---:|:---:|
| [An a to Z Guidebook on Microservices](library/architecture/microservices/an-a-to-z-guidebook-on-microservices) | Nawda & Jarred | 2021 | epub | en |
| [Building Microservices](library/architecture/microservices/building-microservices-2e) *(2e)* | Sam Newman | 2021 | pdf | en |
| [developing-open-cloud-native-microservice](library/architecture/microservices/developing-open-cloud-native-microservice) `guide` | Graham Charters et al. | — | pdf | en |
| [Microservice Pattern Language](library/architecture/microservices/microservice-pattern-language) `reference` | Chris Richardson | — | pdf | en |
| [Microservices AntiPatterns and Pitfalls](library/architecture/microservices/microservices-antipatterns-and-pitfalls) | Mark Richards | 2016 | pdf | en |
| [Microservices Patterns](library/architecture/microservices/microservices-patterns) | Chris Richardson | 2018 | pdf | en |

</details>

<details>
<summary><b>Distributed Systems</b> — 3 titles</summary>

| Title | Author | Year | Formats | Languages |
|---|---|:---:|:---:|:---:|
| [Architecting Distributed Transactional Applications](library/architecture/distributed-systems/architecting-distributed-transactional-applications) | Guy Harrison et al. | — | pdf | en |
| [Designing Distributed Systems](library/architecture/distributed-systems/designing-distributed-systems) | Brendan Burns | 2018 | pdf | en |
| [Understanding Distributed Systems](library/architecture/distributed-systems/understanding-distributed-systems) | Roberto Vitillo | 2021 | pdf | en |

</details>

<details>
<summary><b>Event-Driven Architecture</b> — 2 titles</summary>

| Title | Author | Year | Formats | Languages |
|---|---|:---:|:---:|:---:|
| [Designing Event-Driven Systems](library/architecture/event-driven/designing-event-driven-systems) `guide` | Ben Stopford | 2018 | pdf | en |
| [Enterprise Integration Patterns](library/architecture/event-driven/enterprise-integration-patterns) | Gregor Hohpe & Bobby Woolf | — | pdf | en |

</details>

### Data <sup>31</sup>

*Storing, modelling, querying, and streaming data — from engine internals to schema design.*

<details>
<summary><b>Fundamentals & Internals</b> — 3 titles</summary>

| Title | Author | Year | Formats | Languages |
|---|---|:---:|:---:|:---:|
| [Database Internals](library/data/fundamentals/database-internals) | Alex Petrov | — | pdf | en |
| [Designing Data-Intensive Applications](library/data/fundamentals/designing-data-intensive-applications) | Martin Kleppmann | 2017 | pdf | en |
| [SQL Cookbook](library/data/fundamentals/sql-cookbook) | Anthony Molinaro & Robert de Graaf | 2021 | pdf | en |

</details>

<details>
<summary><b>Data Modeling</b> — 5 titles</summary>

| Title | Author | Year | Formats | Languages |
|---|---|:---:|:---:|:---:|
| [Beginning Database Design Solutions](library/data/modeling/beginning-database-design-solutions) | Rod Stephens | 2009 | pdf | en |
| [Beginning Database Design Solutions](library/data/modeling/beginning-database-design-solutions-2e) *(2e)* | Rod Stephens | 2023 | pdf | en |
| [Data Modeling with Snowflake](library/data/modeling/data-modeling-with-snowflake) | Serge Gershkovich | — | pdf | en |
| [Database design for mere mortals](library/data/modeling/database-design-for-mere-mortals-2e) *(2e)* | Michael James Hernandez | — | pdf | en |
| [Database Design for Mere Mortals](library/data/modeling/database-design-for-mere-mortals-3e) *(3e)* | Michael J. Hernandez | 2013 | pdf | en |

</details>

<details>
<summary><b>PostgreSQL</b> — 3 titles</summary>

| Title | Author | Year | Formats | Languages |
|---|---|:---:|:---:|:---:|
| [Best Practices for Optimizing Postgres Query Performance](library/data/postgresql/best-practices-for-optimizing-postgres-query-performance) `guide` | — | — | pdf | en |
| [Effective Indexing in Postgres](library/data/postgresql/effective-indexing-in-postgres) `guide` | — | — | pdf | en |
| [PostgreSQL 13 Cookbook](library/data/postgresql/postgresql-13-cookbook) | Vallarapu Naga Avinash Kumar | 2021 | pdf | en |

</details>

<details>
<summary><b>MySQL</b> — 5 titles</summary>

| Title | Author | Year | Formats | Languages |
|---|---|:---:|:---:|:---:|
| [Effective MySQL Optimizing SQL Statements](library/data/mysql/effective-mysql-optimizing-sql-statements) | Ronald Bradford | — | pdf | en |
| [High Availability MySQL Cookbook](library/data/mysql/high-availability-mysql-cookbook) | Alex Davies | 2010 | pdf | en |
| [High Performance MySQL](library/data/mysql/high-performance-mysql) | Silvia Botros & Jeremy Tinley | 2021 | pdf | en |
| [MySQL Cookbook](library/data/mysql/mysql-cookbook-3e) *(3e)* | Paul DuBois | — | pdf | en |
| [Understanding MySQL Internals](library/data/mysql/understanding-mysql-internals) | Sasha Pachev | 2009 | pdf | en |

</details>

<details>
<summary><b>MongoDB</b> — 1 title</summary>

| Title | Author | Year | Formats | Languages |
|---|---|:---:|:---:|:---:|
| [MongoDB Applied Design Patterns](library/data/mongodb/mongodb-applied-design-patterns) | Rick Copeland | 2013 | pdf | en |

</details>

<details>
<summary><b>Cassandra</b> — 1 title</summary>

| Title | Author | Year | Formats | Languages |
|---|---|:---:|:---:|:---:|
| [Cassandra: The Definitive Guide](library/data/cassandra/cassandra-the-definitive-guide-3e) *(3e)* | Jeff Carpenter & Eben Hewitt | 2020 | pdf | en |

</details>

<details>
<summary><b>Redis</b> — 3 titles</summary>

| Title | Author | Year | Formats | Languages |
|---|---|:---:|:---:|:---:|
| [Caching at Scale with Redis](library/data/redis/caching-at-scale-with-redis) `guide` | — | 2021 | pdf | en |
| [Mastering Redis](library/data/redis/mastering-redis) | Jeremy Nelson | 2016 | epub | en |
| [Redis Essentials](library/data/redis/redis-essentials) | Maxwell Dayvson Da Silva & Hugo Lopes Tavares | 2015 | pdf | en |

</details>

<details>
<summary><b>Elasticsearch</b> — 4 titles</summary>

| Title | Author | Year | Formats | Languages |
|---|---|:---:|:---:|:---:|
| [Advanced Elasticsearch 7.0](library/data/elasticsearch/advanced-elasticsearch-7-0) | Wai Tak Wong | 2019 | pdf | en |
| [Elasticsearch](library/data/elasticsearch/elasticsearch) | Clinton Gormley & Zachary Tong | 2015 | pdf | en |
| [Elasticsearch Blueprints](library/data/elasticsearch/elasticsearch-blueprints) | Vineeth Mohan | 2015 | pdf | en |
| [Elasticsearch Indexing](library/data/elasticsearch/elasticsearch-indexing) | Huseyin Akdogan | — | pdf | en |

</details>

<details>
<summary><b>Kafka & Streaming</b> — 6 titles</summary>

| Title | Author | Year | Formats | Languages |
|---|---|:---:|:---:|:---:|
| [Kafka Best Practices](library/data/kafka/kafka-best-practices) `guide` | Yeva Byzek | — | pdf | en |
| [Kafka in Action](library/data/kafka/kafka-in-action) | Dylan Scott et al. | 2022 | pdf | en |
| [Kafka Optimization and Benchmarking Guide](library/data/kafka/kafka-optimization-and-benchmarking-guide) `guide` | — | — | pdf | en |
| [Learning Apache Kafka](library/data/kafka/learning-apache-kafka-2e) *(2e)* | Nishant Garg | 2015 | pdf | en |
| [Mastering Kafka Streams and ksqlDB](library/data/kafka/mastering-kafka-streams-and-ksqldb) | Mitch Seymour | 2021 | pdf | en |
| [Optimizing Your Apache Kafka Deployment](library/data/kafka/optimizing-your-apache-kafka-deployment) `guide` | Yeva Byzek et al. | — | pdf | en |

</details>

### Platform <sup>13</sup>

*Shipping and running software: containers, orchestration, pipelines, and operations.*

<details>
<summary><b>DevOps Culture</b> — 1 title</summary>

| Title | Author | Year | Formats | Languages |
|---|---|:---:|:---:|:---:|
| [The DevOps Handbook](library/platform/devops/the-devops-handbook) | Gene Kim et al. | — | pdf | en |

</details>

<details>
<summary><b>Containers</b> — 3 titles</summary>

| Title | Author | Year | Formats | Languages |
|---|---|:---:|:---:|:---:|
| [A Developer's Essential Guide to Docker Compose](library/platform/containers/a-developers-essential-guide-to-docker-compose) | — | 2022 | pdf | en |
| [Docker in Action](library/platform/containers/docker-in-action-2e) *(2e)* | Jeff Nickoloff & Stephen Kuenzli | 2019 | pdf | en |
| [Docker in Practice](library/platform/containers/docker-in-practice-2e) *(2e)* | Ian Miell & Aidan Hobson Sayers | 2019 | pdf | en |

</details>

<details>
<summary><b>Kubernetes</b> — 5 titles</summary>

| Title | Author | Year | Formats | Languages |
|---|---|:---:|:---:|:---:|
| [Cloud Native DevOps with Kubernetes](library/platform/kubernetes/cloud-native-devops-with-kubernetes-2e) *(2e)* | John Arundel & Justin Domingus | 2022 | pdf | en |
| [Kubernetes Best Practices](library/platform/kubernetes/kubernetes-best-practices-2e) *(2e)* | Brendan Burns et al. | 2023 | epub | en |
| [Kubernetes in Action](library/platform/kubernetes/kubernetes-in-action) | Marko Lukša | 2018 | epub | en |
| [Kubernetes in Action](library/platform/kubernetes/kubernetes-in-action-2e) *(2e)* | Marko Lukša | 2023 | epub | en |
| [Kubernetes Patterns](library/platform/kubernetes/kubernetes-patterns) | Bilgin Ibryam & Roland Huss | — | pdf | en |

</details>

<details>
<summary><b>CI/CD</b> — 4 titles</summary>

| Title | Author | Year | Formats | Languages |
|---|---|:---:|:---:|:---:|
| [Automating DevOps with GitLab CI_CD Pipelines](library/platform/cicd/automating-devops-with-gitlab-ci-cd-pipelines) | Christopher Cowell et al. | — | pdf | en |
| [Continuous Delivery with Docker and Jenkins](library/platform/cicd/continuous-delivery-with-docker-and-jenkins) | Rafal Leszko | 2017 | pdf | en |
| [Learning GitHub Actions](library/platform/cicd/learning-github-actions) | Brent Laster | 2023 | pdf | en |
| [Pipeline as Code](library/platform/cicd/pipeline-as-code) | Mohamed Labouardy | 2021 | pdf | en |

</details>

### Quality <sup>8</sup>

*Proving software works: testing strategy, TDD, and performance under load.*

<details>
<summary><b>Testing Strategy</b> — 1 title</summary>

| Title | Author | Year | Formats | Languages |
|---|---|:---:|:---:|:---:|
| [Test-Driven Development by Example](library/quality/testing/test-driven-development-by-example) | Kent Beck | 2002 | pdf | en |

</details>

<details>
<summary><b>Unit Testing</b> — 5 titles</summary>

| Title | Author | Year | Formats | Languages |
|---|---|:---:|:---:|:---:|
| [Java Unit Testing with JUnit 5](library/quality/unit-testing/java-unit-testing-with-junit-5) | Shekhar Gulati & Rahul Sharma | 2017 | pdf | en |
| [Mockito for Spring](library/quality/unit-testing/mockito-for-spring) | Sujoy Acharya | 2015 | pdf | en |
| [Practical Unit Testing with JUnit and Mockito](library/quality/unit-testing/practical-unit-testing-with-junit-and-mockito) | Tomek Kaczanowsk | 2013 | pdf | en |
| [The Art of Unit Testing, with examples in C](library/quality/unit-testing/the-art-of-unit-testing-with-examples-in-c) | Roy Osherove | 2014 | pdf | en |
| [Unit Testing Principles, Practices, and Patterns](library/quality/unit-testing/unit-testing-principles-practices-and-patterns) | Vladimir Khorikov | 2019 | pdf | en |

</details>

<details>
<summary><b>Load Testing</b> — 1 title</summary>

| Title | Author | Year | Formats | Languages |
|---|---|:---:|:---:|:---:|
| [k6 Load Testing Guide](library/quality/load-testing/k6-load-testing-guide) `guide` | — | — | pdf | en |

</details>

<details>
<summary><b>Debugging</b> — 1 title</summary>

| Title | Author | Year | Formats | Languages |
|---|---|:---:|:---:|:---:|
| [Why Programs Fail](library/quality/debugging/why-programs-fail-2e) *(2e)* | Andreas Zeller | 2009 | pdf | en |

</details>

### Security <sup>2</sup>

*Attack surfaces and countermeasures for applications and APIs.*

<details>
<summary><b>Application Security</b> — 1 title</summary>

| Title | Author | Year | Formats | Languages |
|---|---|:---:|:---:|:---:|
| [Web Application Security](library/security/application-security/web-application-security) | Andrew Hoffman | 2020 | epub, pdf | en |

</details>

<details>
<summary><b>API Security</b> — 1 title</summary>

| Title | Author | Year | Formats | Languages |
|---|---|:---:|:---:|:---:|
| [securing-the-api-stronghold](library/security/api-security/securing-the-api-stronghold) `guide` | Nordic APIs | — | pdf | en |

</details>

### Craft <sup>11</sup>

*How effective engineers and teams actually work — process, culture, and judgement.*

<details>
<summary><b>Engineering Practice</b> — 6 titles</summary>

| Title | Author | Year | Formats | Languages |
|---|---|:---:|:---:|:---:|
| [97 Things Every Programmer Should Know](library/craft/engineering-practice/97-things-every-programmer-should-know) | Kevlin Henney | 2010 | pdf | en |
| [Modern Software Engineering](library/craft/engineering-practice/modern-software-engineering) | David Farley | 2021 | pdf | en |
| [Software Engineering at Google](library/craft/engineering-practice/software-engineering-at-google) | Titus Winters et al. | 2020 | pdf | en |
| [The Effective Engineer](library/craft/engineering-practice/the-effective-engineer) | Edmond Lau | 2015 | epub, pdf | en |
| [The Pragmatic Programmer](library/craft/engineering-practice/the-pragmatic-programmer) | Andrew Hunt & David Thomas | 1999 | pdf | en |
| [The Pragmatic Programmer](library/craft/engineering-practice/the-pragmatic-programmer-2e) *(2e)* | David Thomas & Andrew Hunt | 2019 | pdf | en |

</details>

<details>
<summary><b>Team & Culture</b> — 3 titles</summary>

| Title | Author | Year | Formats | Languages |
|---|---|:---:|:---:|:---:|
| [Accelerate](library/craft/team-culture/accelerate) | Nicole Forsgren et al. | 2018 | epub, pdf | en |
| [The Mythical Man-Month](library/craft/team-culture/the-mythical-man-month) | Frederick P. Brooks Jr. | 1975 | pdf | en |
| [The Software Architect Elevator](library/craft/team-culture/the-software-architect-elevator) | Gregor Hohpe | 2020 | pdf | en |

</details>

<details>
<summary><b>Interview Preparation</b> — 2 titles</summary>

| Title | Author | Year | Formats | Languages |
|---|---|:---:|:---:|:---:|
| [Grokking the Advanced System Design Interview](library/craft/interviews/grokking-the-advanced-system-design-interview) `guide` | — | 2021 | pdf | en |
| [Machine Learning Design Interview](library/craft/interviews/machine-learning-design-interview) | Khang Pham | — | pdf | en |

</details>

### Career <sup>7</sup>

*Everything that is not code: negotiation, strengths, leadership, and business.*

<details>
<summary><b>Negotiation</b> — 2 titles</summary>

| Title | Author | Year | Formats | Languages |
|---|---|:---:|:---:|:---:|
| [Never Split the Difference](library/career/negotiation/never-split-the-difference) | Chris Voss & Tahl Raz | 2016 | epub, pdf | en |
| [Summary: Never Split the Difference](library/career/negotiation/summary-never-split-the-difference) `guide` | EssentialInsight Summaries | 2021 | epub, pdf | en |

</details>

<details>
<summary><b>Self Development</b> — 2 titles</summary>

| Title | Author | Year | Formats | Languages |
|---|---|:---:|:---:|:---:|
| [StrengthsFinder 2.0](library/career/self-development/strengthsfinder-2-0) | Tom Rath | 2007 | pdf | en |
| [TRIZ For Dummies](library/career/self-development/triz-for-dummies) | Lilly Haines-Gadd | — | pdf | en |

</details>

<details>
<summary><b>Business</b> — 3 titles</summary>

| Title | Author | Year | Formats | Languages |
|---|---|:---:|:---:|:---:|
| [Payment Systems and Performance Improvement](library/career/business/payment-systems-and-performance-improvement) | Angela Bowey & Richard Thorpe | 1989 | pdf | en |
| [The End of Advertising as We Know It](library/career/business/the-end-of-advertising-as-we-know-it) | Sergio Zyman & Armin Brott | 2002 | pdf | en |
| [The Hard Thing About Hard Things](library/career/business/the-hard-thing-about-hard-things) | Ben Horowitz | 2014 | pdf | en |

</details>

---

## Running the reader

```bash
pnpm install
pnpm dev
```

| Command | What it does |
|---|---|
| `pnpm dev` | Start the reader in development |
| `pnpm build` | Production build |
| `pnpm lint` | Biome lint + format check |
| `pnpm library:validate` | Validate every book against the schema |
| `pnpm library:covers` | Extract missing covers from page 1 |
| `pnpm library:readme` | Regenerate this file |

---

## Contributing

Adding a book is welcome — read [CONTRIBUTING.md](./CONTRIBUTING.md) first. CI validates
structure, rejects duplicates by hash, and enforces the naming rules, so a malformed
submission fails before review rather than after.

---

<div align="center">

<sub>This file is generated by `pnpm library:readme`. Do not edit it by hand.</sub>

</div>
