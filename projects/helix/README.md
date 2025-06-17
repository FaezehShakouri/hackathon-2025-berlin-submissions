# HELIX

- **Track(s):** Public Goods
- **Team/Contributors:** Julian Nalenz, Yvanik
- **Repository:** https://github.com/Kayvin59/helix
- **Demo:** https://helix-mocha.vercel.app/
- **Slides:** https://docs.google.com/presentation/d/1c7kwl1ogZnUXx_K6cf5VGyEBGh13ocBPlX5sPeejoaw/edit

## Description (TL;DR)

**HELIX** is the concept of a privacy-first, zk-native infrastructure for cross-border dividend payments and beyond. Starting with the EU’s FASTER directive, HELIX enables fast and secure withholding tax relief by combining zero-knowledge proofs with modern Web3 infrastructure, aiming to build public digital institutions for the next generation of sovereign data management.

## Problem

Investors receiving dividends across EU borders are often taxed twice: once via withholding tax in the country of the dividend issuer and again via income tax in their home country. Though reclaiming overpaid tax is theoretically possible, in practice:

- Reclaim procedures are complex, manual, and paper-based
- Many investors lack the knowledge or resources to pursue refunds
- Tax refunds can take up to 18 months or longer
- Billions remain unreclaimed each year due to these inefficiencies

This complexity undermines investor trust, burdens financial intermediaries, and keeps European capital markets fragmented.

## Solution

HELIX implements core components required by the FASTER directive using zero-knowledge (zk) proofs and zk-rollups:

- **Proof of Tax Residency (zk-eTRC)**: Tax authorities issue zk-verifiable certificates digitally
- **Proof of Beneficial Ownership**: Financial intermediaries provide proofs without disclosing sensitive identity or asset data
- **zk-Native Infrastructure Layer**: All proofs are verifiable on-chain, ensuring privacy and auditability
- **Wallet-like Interface for Citizens**: Enables full control and transparency over personal data usage

The goal is not just to simplify withholding tax relief, but to establish a privacy-preserving foundation for future public services.

## Technology Stack

- **zk Layer**: Under consideration (e.g. Aztec, Scroll, zkSync, Polygon CDK)
- **Zero-Knowledge Proofs**: For tax residency and beneficial ownership
- **Smart Contracts**: To enforce compliance and verification rules
- **Decentralized Wallet Infrastructure**: For user control and consent tracking
- **Open Source Commons Infrastructure**: For interoperability across financial and public institutions

## Privacy Impact

HELIX gives individuals sovereign control over sensitive financial and identity data. By using zero-knowledge proofs:

- Financial intermediaries and governments can verify tax residency and beneficial ownership without accessing private data
- Citizens can transparently audit who accessed or modified their information
- Sensitive data remains encrypted and under user control—reducing surveillance risks and regulatory overhead

HELIX reimagines public infrastructure with privacy-by-design principles.

## Real-World Use Cases

- **Investors**: Automatically benefit from reduced withholding tax rates without paperwork
- **Banks & Brokers**: Use HELIX APIs to comply with FASTER while minimizing cost and effort
- **Tax Authorities**: Digitally issue tax residency certificates with zk-verifiable integrity
- **RegTech & FinTech Providers**: Build services on top of HELIX's open-source infrastructure

## Business Logic

While HELIX is still in an early-stage prototype phase, we see strong potential for real-world impact and long-term sustainability. Our initial focus is on:

- **Validating feasibility**: Demonstrating that zk-proofs can realistically satisfy FASTER compliance without compromising user privacy.
- **Open collaboration**: HELIX is envisioned as public commons infrastructure. Monetization is not the first priority—robust functionality and trust are.
- **Modular integrations**: Financial institutions could adopt specific HELIX components (like zk-eTRCs) as plug-and-play tools to ease compliance.
- **Future potential**: As adoption grows, service layers (e.g. dashboards, integrations, and managed APIs) could support public-private partnerships or cost-recovery through cooperative models.

Initial monetization will focus on relieving FASTER compliance burdens, while future opportunities include expanding to other public administrative functions.

Both of us are completely new to Web3, so we settled with simply building the first concept of the frontend for now, as well as working on distilling and communicating the overall idea.

## What's Next

- **MVP Buildout**: Implement zk-proof flows for tax residency and beneficial ownership
- **Pilot with FinTech/Banks**: Test in collaboration with industry partners and regulators
- **zk Layer Selection**: Finalize optimal zero-knowledge layer for HELIX deployment
- **Community Launch**: Open-source the protocol, governance model, and citizen dashboard
- **Scale Beyond Finance**: Extend HELIX principles to additional public sector domains like property records, ID verification, and healthcare

HELIX is just the beginning of a privacy-first digital civilization.
