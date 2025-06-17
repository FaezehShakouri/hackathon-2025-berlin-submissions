# **DeeperTruth**

* **Track(s):**

  * Applied Encryption
  * Design (UI/UX)

* **Team/Contributors:**

  * Romario Kavin – Full-Stack + Crypto Blochain Engineer

* **Repository:**
  [[Repo](https://github.com/RomarioKavin1/deepTruth-W3PN)]

* **Demo:**
  [[Website](https://deep-truth-w3-pn.vercel.app)]

  [[Deck & Video Demo](https://www.canva.com/design/DAGqaNquHa0/rcnmvGQxN_UTG4ji34u7uQ/view?utm_content=DAGqaNquHa0&utm_campaign=designshare&utm_medium=link2&utm_source=uniquelinks&utlId=habf4140f72)]
  

---

##  Description

**DeeperTruth** is a privacy-first proof-of-video authenticity platform that embeds **cryptographic proof directly inside video files using steganography**. It combats deepfakes by offering three escalating tiers of identity verification:

* **Anonymity** (World ID),
* **Pseudo-Anonymity** (Wallet Signature),
* **Full Identity** (Decentralized ID via Self Protocol).

It’s especially useful for whistleblowers, citizen journalists, and **government officials** — anyone needing to prove **"I am a real human" or "I truly said this"** without relying on centralized platforms or trust.

---

## Problem

Deepfakes are undermining trust in audio-visual content. In an era of AI-generated misinformation, there’s no easy way to verify that a video came from a **real person** — let alone prove it came from a **specific, trusted source** like a government official or agency — **without relying on centralized authority or watermarking**.

---

## Solution

DeeperTruth offers a **zero-trust**, decentralized way to **cryptographically bind the video to the identity of its creator**, based on their privacy preference:

1. **Anonymity** – Just proves the speaker is human (via World ID nullifier).
2. **Pseudo-Anonymity** – Links the proof to a wallet address.
3. **Full Identity** – Connects the video to a **Self Protocol DID**, verifying that a real, verifiable identity made the statement.

This is especially powerful in:

* **Government contexts**, where officials can publish provably signed video announcements (e.g., public safety, legislation, emergency alerts), cryptographically proving their origin.
* **Decentralized journalism**, where sources may wish to remain anonymous or pseudonymous but still provide irrefutable proof of authenticity.

The proof is **embedded into the video** itself using **steganography**, making the video a **portable, self-verifiable artifact**.

---

##  Technology Stack

* **Frontend**: Next.js, TailwindCSS, TypeScript
* **Crypto & Identity**:

  * World ID (Proof of Humanity)
  * Self Protocol (Passport-based Decentralized ID)
  * EIP-712 Signatures
* **Steganography**: Stego module (DCT or LSB embedding)
* **Storage**: IPFS (via Pinata)
* **Verification Layer**: CID + signature + stego decoder pipeline

---

## How its made

![alt text](https://github.com/RomarioKavin1/deepTruth-W3PN/blob/main/slides/6.png "How Its Made")
![alt text](https://github.com/RomarioKavin1/deepTruth-W3PN/blob/main/slides/5.png "How Its Made")
![alt text](https://github.com/RomarioKavin1/deepTruth-W3PN/blob/main/slides/7.png "How Its Made")


## Privacy Impact

* Enables proof-of-humanity or proof-of-identity **without revealing unnecessary personal info**.
* Zero central authority required to “approve” or “verify” videos.
* Proof embedded inside the video — not as external metadata.
* Empowers both **anonymous truth-tellers** and **verifiable public officials**.

---

## Real-World Use Cases

* **Government/Public Officials**:

  * Public figures can use Self Protocol to link official DIDs to videos.
  * Example: A minister posts a climate policy video announcement; with DeeperTruth, it’s provable that it came from their verified digital passport, not an AI-generated deepfake.

* **Whistleblowers & Activists**:

  * Record video evidence anonymously, but prove it's real & human-made via World ID.
  * Example: A protestor in a conflict zone records war crimes but wants to stay safe.

* **Citizen Journalists**:

  * Authenticate field footage with pseudonymous or verified credentials.

* **Social Media Platforms**:

  * DeeperTruth videos shared across platforms carry embedded, verifiable trust — regardless of platform censorship or central validation.

---

## Business Logic

* **Free Tier**: Anonymous (World ID-based) video proofs.
* **Premium Tier**: Wallet + DID integrations for power users, journalists, and government use.
* **B2B**:

  * Offer DID-backed verification tools to media outlets, government platforms, or DAOs.
  * Developer API for platforms to integrate their own steganographic proof layer.

---

## What's Next

* Direct Integration of our TEE with socialmedias to provide proof verification directly on their platform
* Mobile browser & cross-platform support (iOS/Android)
* DID expansion to other protocols (Polygon ID, Disco, Veramo)
* API/SDK for media platforms to auto-verify video content
* Integration with Arweave/Filecoin for immutable archival
* Watermark-free tamper detection based on embedded hashes
* Real-time recording + proof streaming support

---
## Tracks

* Applied Encryption
     DeeperTruth is a strong contender for the Applied Encryption track because the core functionality of the platform relies on practical, real-world cryptographic techniques to ensure authenticity, privacy, and verifiability of video content:
     
     Steganographic Encryption: The platform uses steganography to embed cryptographic data (nullifiers, wallet signatures, DIDs) directly inside video frames, making the proof self-contained and tamper-evident.
     
     Zero-Knowledge Proof Integration: World ID provides ZK-based proof of humanity, which is hashed and stored on IPFS — an applied real-world use of ZK systems without leaking user identity.
     
     EIP-712 Signatures: Wallet-based signatures allow pseudonymous linking of proof to Web3 identities — practical applied cryptography used widely across Ethereum-based apps.
     
     DID Integration (Self Protocol): The use of DIDs (Decentralized Identifiers) applies cryptographic public/private key systems to verifiable identity in video media.
     
     IPFS Storage: The use of content-addressable hashes (CID) ensures cryptographic integrity and decentralization of proof data.

Together, this stack demonstrates how cryptographic primitives can be applied holistically to secure, verify, and preserve sensitive media content in a decentralized way — an ideal showcase for applied encryption.

 * Design (UI/UX)
      DeeperTruth also qualifies strongly for the Design (UI/UX) track through a thoughtful balance of minimal interaction and maximum privacy protection:
      
      Simple, Streamlined Process: Users can record a video, select their desired privacy level (Anonymity, Pseudo-Anonymity, or Identity), and generate a verifiable proof in just a few clicks.
      
      No Wallet Required (Anonymity Tier): The platform lowers friction by requiring only a World ID scan for full anonymous proof — removing the usual Web3 onboarding pain points.
      
      Visual Privacy Model (Venn UI): The use of an interactive Venn diagram to explain and let users select their privacy level offers a unique, intuitive, and educational interface for understanding digital identity.
      
      Neo-Brutalist / Hacker Theme: The hacker-coding inspired brutalist design adds visual identity and aesthetic coherence to the idea of a trustless, anti-deepfake video tool — aligning form and function.
      
      Camera-First UX: No upload or drag-and-drop confusion — just open the platform, choose a mode, and start recording proof with zero setup friction.
      
      This level of polish and clarity ensures even non-technical users can confidently generate cryptographic video proofs without being overwhelmed — which is rare in Web3 tooling.
