title: About John
category: bio
date: 2020-12-22
modified: 2026-06-23
summary: John A. Cairns is a software engineer with three decades in distributed systems, building smart contracts and multi-chain trading infrastructure in Rust and Solidity — and an enthusiastic illustrator, photographer and computer cartographer.

![John Cairns]({static}/images/2022/sep2222_sm.jpg){: width=28% style="float:right; padding:16px"}

I'm **John A. Cairns** — a software engineer based in Chicago with three decades of experience building **distributed software systems**. I build in **Rust** and develop **smart contracts for Ethereum**; a background in **physics** and systems programming grounds my work in blockchain, financial engineering, and open source. I appreciate the inherent balance of art and science, and a considered approach in all things.

### What I work on

My day-to-day is **smart contracts and on-chain trading infrastructure** — the systems behind **[Fabric](https://benchmark.withfabric.xyz)**, a high-performance DEX aggregator. These are production services written in **Rust and Solidity** that run across multiple chains (Base, Arbitrum, Solana), spanning the full stack of a modern trading platform:

* **Multi-chain pool indexing and quoting** — services that snapshot and query liquidity across Uniswap V2/V3/V4-style pools in real time.
* **On-chain swap execution** — Solidity execution engines that run off-chain-planned routes (sequences, splits, multi-pool paths) safely on-chain.
* **Token discovery and risk** — fast, typeahead-grade token indexing with metadata and risk scoring.
* **Data pipelines** — Ethereum log ETL into Arrow/Parquet for archival and real-time indexing, with resilient RPC handling.

I care about correctness, performance, and tools that compose. A few things I've shipped that show how I think:

* **[parsm](https://github.com/jac18281828/parsm)** — a structured-data processor for the command line (JSON, CSV, YAML, TOML, logfmt, plain text). A friendlier superset of `sed`/`awk`/`grep`. [Published on crates.io](https://crates.io/crates/parsm).
* **[EMOM Timer](https://emomtimer.2ad.com)** — a precision, drift-correcting workout timer built in Rust + WebAssembly (Yew). [Source](https://github.com/jac18281828/emomtimer).
* **[checksmix](https://github.com/jac18281828/checksmix)** — a fast emulator and assembler for Knuth's MMIX. A homage to *The Art of Computer Programming* and the fundamentals it teaches.
* **[snipren](https://github.com/jac18281828/snipren)** and **[trimtrain](https://github.com/jac18281828/trimtrain)** — small, intent-aware Unix utilities that do one thing well.
* **[Conversant Disruptor](https://github.com/conversant/disruptor)** — a high-performance Java ring-buffer `BlockingQueue` with ~320 stars, published on Maven Central, packaged for Debian and Ubuntu, and used by Apache Log4j 2 as an async-logging queue.
* **On-chain protocols** — author of **[Collective Governance](https://github.com/collectivexyz/collective-governance-v1)**, an Ethereum voting/consensus protocol, and a contributor to **[Stader's ETHx](https://github.com/stader-labs/ethx)** liquid-staking protocol.

I work comfortably across **Rust, Solidity, Go, C++, Python, and TypeScript**, and I keep a set of standardized dev containers so the toolchain is never the bottleneck. I also have a standing interest in **zero-knowledge proofs and applied cryptography** — Merkle proofs, Fiat–Shamir, ZoKrates and gnark — that I explore in the open as I go.

### Illustration & cartography

Away from code, I'm an enthusiastic amateur **illustrator, photographer, and computer cartographer**. I created the **regional maps** for six military-history books written by Brian Todd Carey — from *Warfare in the Ancient World* through the *Warfare in the Age of Crusades* series — maps that place campaigns, shifting frontiers, and battle sites within their geographic context, presenting complex history through clear, thoughtful cartography.

* **[Cartography & Books]({filename}penandsword.md)** — the full set of six titles, with covers and summaries.
* **[Amazon author page](https://amazon.com/author/johncairns)** · **[Pen & Sword Military](https://www.penandswordbooks.com/author/john-cairns/)**

### Beyond the terminal

A proud husband and father of three, I enjoy family time, travel, and the rich tapestry of life in Chicago. On the weekends you might find me on a long run in a forest preserve or at a kid's soccer match. I also bake, play music, and narrate public-domain works for **[LibriVox](https://librivox.org/reader/12659)**.

### Find me

* **[GitHub — jac18281828](https://github.com/jac18281828)** · **[LinkedIn](https://www.linkedin.com/in/johnacairns)** · **[YouTube](https://www.youtube.com/@johnacairns)** · **[Instagram](https://www.instagram.com/jac18281828)** · **[TikTok](https://www.tiktok.com/@jac1828)** · **[Amazon author page](https://amazon.com/author/johncairns)**
* **[jac1828.eth](https://app.ens.domains/jac1828.eth)** · PGP `FD311EE84C8321C3E93C1E639028C4309ACCEB9B`

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": "https://2ad.com/#person",
      "name": "John A. Cairns",
      "url": "https://2ad.com",
      "mainEntityOfPage": "https://2ad.com/pages/about-john.html",
      "image": "https://2ad.com/images/2022/sep2222_sm.jpg",
      "jobTitle": "Software Engineer",
      "description": "Software engineer with three decades in distributed systems and a background in physics, building smart contracts and multi-chain trading infrastructure in Rust and Solidity. Illustrator, photographer and computer cartographer.",
      "worksFor": { "@id": "https://benchmark.withfabric.xyz/#org" },
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Chicago",
        "addressRegion": "IL",
        "addressCountry": "US"
      },
      "knowsAbout": [
        "Distributed systems",
        "Smart contracts",
        "Solidity",
        "Rust",
        "On-chain trading infrastructure",
        "DEX aggregation",
        "Decentralized finance",
        "Financial engineering",
        "Liquid staking",
        "On-chain governance",
        "Ethereum",
        "Solana",
        "Layer 2 (Base, Arbitrum)",
        "Systems programming",
        "Concurrency",
        "WebAssembly",
        "Arbitrary-precision arithmetic",
        "Zero-knowledge proofs",
        "Applied cryptography",
        "Physics",
        "Unix tools",
        "Cartography",
        "Illustration"
      ],
      "sameAs": [
        "https://github.com/jac18281828",
        "https://www.linkedin.com/in/johnacairns",
        "https://www.youtube.com/@johnacairns",
        "https://www.instagram.com/jac18281828",
        "https://www.tiktok.com/@jac1828",
        "https://www.amazon.com/author/johncairns",
        "https://app.ens.domains/jac1828.eth",
        "https://librivox.org/reader/12659",
        "https://www.penandswordbooks.com/author/john-cairns/"
      ]
    },
    {
      "@type": "Organization",
      "@id": "https://benchmark.withfabric.xyz/#org",
      "name": "Fabric",
      "description": "High-performance multi-chain DEX aggregator.",
      "url": "https://benchmark.withfabric.xyz"
    },
    {
      "@type": "SoftwareSourceCode",
      "@id": "https://github.com/conversant/disruptor",
      "name": "Conversant Disruptor",
      "description": "High-performance Java ring-buffer BlockingQueue; published on Maven Central, packaged for Debian and Ubuntu, and supported by Apache Log4j 2 as an async-logging queue.",
      "programmingLanguage": "Java",
      "codeRepository": "https://github.com/conversant/disruptor",
      "author": { "@id": "https://2ad.com/#person" },
      "sameAs": "https://mvnrepository.com/artifact/com.conversantmedia/disruptor"
    },
    {
      "@type": "SoftwareSourceCode",
      "@id": "https://github.com/jac18281828/parsm",
      "name": "parsm",
      "description": "Structured-data processor for the command line (JSON, CSV, YAML, TOML, logfmt, plain text) with a PEG-grammar DSL.",
      "programmingLanguage": "Rust",
      "codeRepository": "https://github.com/jac18281828/parsm",
      "author": { "@id": "https://2ad.com/#person" },
      "sameAs": "https://crates.io/crates/parsm"
    },
    {
      "@type": "SoftwareSourceCode",
      "@id": "https://github.com/collectivexyz/collective-governance-v1",
      "name": "Collective Governance",
      "description": "Open-source on-chain Ethereum voting/consensus protocol.",
      "programmingLanguage": "Solidity",
      "codeRepository": "https://github.com/collectivexyz/collective-governance-v1",
      "author": { "@id": "https://2ad.com/#person" }
    },
    {
      "@type": "SoftwareSourceCode",
      "@id": "https://github.com/jac18281828/checksmix",
      "name": "checksmix",
      "description": "Assembler and emulator for Donald Knuth's MMIX 64-bit RISC architecture.",
      "programmingLanguage": "Rust",
      "codeRepository": "https://github.com/jac18281828/checksmix",
      "author": { "@id": "https://2ad.com/#person" }
    },
    {
      "@type": "WebApplication",
      "@id": "https://emomtimer.2ad.com",
      "name": "EMOM Timer",
      "description": "Precision, drift-correcting workout timer built in Rust and WebAssembly (Yew).",
      "applicationCategory": "HealthApplication",
      "operatingSystem": "Web",
      "url": "https://emomtimer.2ad.com",
      "author": { "@id": "https://2ad.com/#person" }
    },
    {
      "@type": "SoftwareSourceCode",
      "@id": "https://github.com/stader-labs/ethx",
      "name": "Stader ETHx",
      "description": "Multi-pool Ethereum liquid-staking protocol.",
      "programmingLanguage": "Solidity",
      "codeRepository": "https://github.com/stader-labs/ethx",
      "contributor": { "@id": "https://2ad.com/#person" }
    },
    {
      "@type": "Person",
      "@id": "https://2ad.com/#brian-todd-carey",
      "name": "Brian Todd Carey",
      "jobTitle": "Military historian"
    },
    {
      "@type": "Book",
      "@id": "https://www.penandswordbooks.com/9781781592632/warfare-in-the-age-of-crusades/",
      "name": "Warfare in the Ancient World",
      "genre": "Military history",
      "isbn": "9781781592632",
      "author": { "@id": "https://2ad.com/#brian-todd-carey" },
      "contributor": [
        { "@id": "https://2ad.com/#person" },
        { "@type": "Person", "name": "Joshua B. Allfree" }
      ],
      "publisher": { "@type": "Organization", "name": "Pen & Sword Books" }
    },
    {
      "@type": "Book",
      "@id": "https://www.penandswordbooks.com/9781848847415/warfare-in-the-medieval-world/",
      "name": "Warfare in the Medieval World",
      "genre": "Military history",
      "isbn": "9781848847415",
      "author": { "@id": "https://2ad.com/#brian-todd-carey" },
      "contributor": [
        { "@id": "https://2ad.com/#person" },
        { "@type": "Person", "name": "Joshua B. Allfree" }
      ],
      "publisher": { "@type": "Organization", "name": "Pen & Sword Books" }
    },
    {
      "@type": "Book",
      "@id": "https://www.amazon.com/Hannibals-Last-Battle-Zama-Carthage/dp/1594160759",
      "name": "Hannibal's Last Battle: Zama and the Fall of Carthage",
      "genre": "Military history",
      "isbn": "1594160759",
      "author": { "@id": "https://2ad.com/#brian-todd-carey" },
      "contributor": [
        { "@id": "https://2ad.com/#person" },
        { "@type": "Person", "name": "Joshua B. Allfree" }
      ],
      "publisher": { "@type": "Organization", "name": "Westholme Publishing" }
    },
    {
      "@type": "Book",
      "@id": "https://www.penandswordbooks.com/9781526796646/road-to-manzikert/",
      "name": "Road to Manzikert: Byzantine and Islamic Warfare, 527-1071",
      "genre": "Military history",
      "isbn": "9781526796646",
      "author": { "@id": "https://2ad.com/#brian-todd-carey" },
      "contributor": [
        { "@id": "https://2ad.com/#person" },
        { "@type": "Person", "name": "Joshua B. Allfree" }
      ],
      "publisher": { "@type": "Organization", "name": "Pen & Sword Books" }
    },
    {
      "@type": "Book",
      "@id": "https://www.penandswordbooks.com/9781526730176/warfare-in-the-age-of-crusades/",
      "name": "Warfare in the Age of Crusades: Europe",
      "genre": "Military history",
      "isbn": "9781526730176",
      "author": { "@id": "https://2ad.com/#brian-todd-carey" },
      "contributor": [
        { "@id": "https://2ad.com/#person" },
        { "@type": "Person", "name": "Joshua B. Allfree" }
      ],
      "publisher": { "@type": "Organization", "name": "Pen & Sword Books" }
    },
    {
      "@type": "Book",
      "@id": "https://www.penandswordbooks.com/9781526730213/warfare-in-the-age-of-crusades/",
      "name": "Warfare in the Age of Crusades: The Latin East",
      "genre": "Military history",
      "isbn": "9781526730213",
      "author": { "@id": "https://2ad.com/#brian-todd-carey" },
      "contributor": [
        { "@id": "https://2ad.com/#person" },
        { "@type": "Person", "name": "Joshua B. Allfree" }
      ],
      "publisher": { "@type": "Organization", "name": "Pen & Sword Books" }
    }
  ]
}
</script>
