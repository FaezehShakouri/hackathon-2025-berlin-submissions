# StealthGrant

- **Track(s):** PublicGoods, Censorship Resistance
- **Team/Contributors:** Leo Franklin 
- **Repository:** [https://github.com/LeoFranklin015/StealthGrants](https://github.com/LeoFranklin015/StealthGrants)  
- **Demo:** [Youtube](https://youtu.be/GYrSA0M-naE)

---

## Description (TL;DR)

**StealthGrant** is the first fully-private quadratic funding platform that protects donor privacy, resists Sybil attacks, and corrects for popularity bias. Powered by **FHE** (via Fhenix) and **zkKYC** (via Self Protocol), StealthGrant brings fairer, privacy-respecting capital allocation to public goods.

---

## Problem

Despite the promise of quadratic funding, current platforms suffer from critical flaws:

- **Popularity Bias:** Early visibility or influencer support can cause a runaway effect—popular projects receive more funding not because they’re better, but because they’re louder. This undermines the goal of funding true public goods.
- **Sybil Attacks:** Platforms without strong identity guarantees are prone to fake accounts, skewing the “number of contributors” metric to drain matching pools.
- **Zero Privacy:** Contributions are publicly visible, discouraging donations from individuals who value anonymity or fear backlash.

- **CensorShip Resistance :** : If you belong to country , we can prevent them from participating , using Self ZK-Passport

These limitations make quadratic funding less effective and inclusive, especially in sensitive ecosystems.

---

## Solution

**StealthGrant** introduces a privacy-preserving, bias-resistant quadratic funding mechanism:

- **Encrypted Contributions:** Donation amounts are encrypted using FHE. This hides real-time fund flows, removing visibility-based bandwagoning.
- **Encrypted Matching Calculations:** Matching logic is performed on encrypted data, ensuring projects are ranked fairly—without leaking intermediate scores or popularity.
- **zkKYC with Self Protocol:** Ensures each donor is uniquely verified without revealing personal details. This prevents Sybil attacks while respecting privacy.
- **Deferred Decryption:** Only final, necessary outputs are decrypted post-round. Everything else remains private.

The result is a **truly fair** and **democratic** funding round that cannot be gamed by visibility, bots, or central entities.

---

## Technology Stack

- **Frontend:** Next.js, TailwindCSS, Framer Motion  
- **Contracts:** Solidity (Fhenix-compatible, FHE ops integrated)  
- **Encryption Layer:** FHE via Fhenix + CofheJS  
- **Identity Layer:** Self Protocol (zk-passport + unique proof system)  
- **Tooling:** Foundry, Hardhat, Viem, IPFS (for optional encrypted metadata)  

---

## Privacy Impact

- **Donor and Project Anonymity:** Contributions and matching totals are never exposed publicly.  
- **zk-Based Uniqueness Proofs:** Self Protocol ensures each participant is real and unique—without any wallet whitelisting or doxxing.  
- **Onchain Privacy Enforcement:** Everything from donations to matching is encrypted and calculated on-chain.  

This approach creates a **zero-trust** privacy-preserving environment for funding coordination.

---

## Real-World Use Cases

- **Anonymous Grant Rounds:** For activist, whistleblower, or journalistic public goods.  
- **DAO Internal Funding:** Members vote privately on team-level initiatives without bias.  
- **Global Public Goods:** Regions where privacy is essential due to legal or political threats.  
- **Fair Hackathons:** Hide public “hype” and ensure projects win based on true community support.  

---

## Business Logic

- **Protocol Fees:** Small fee charged on matching pool disbursements to sustain infrastructure.  
- **Self Protocol Integrations:** Bridges privacy-preserving KYC to other Web3 compliance needs (airdrops, onboarding, etc).  
- **SDK Licenses:** Other builders can use our SDK to launch privacy-native grant rounds.  

---

## What's Next

- 🧪 **Launch testnet round** with Self Protocol + Fhenix integrations fully active.  
- 🧠 **Add encrypted quadratic voting** for proposal-based funding rounds.  
- 🛠️ **Release SDK** for projects/DAOs to integrate their own matching logic privately.  
- 🌐 **Integrate onchain governance tools** (e.g., Snapshot, Tally) with privacy layers.  
- 🎭 **Explore identity reputation scoring** from Self without revealing identities.  
