# BlindMatch

- **Track(s):** Advanced Cryptography and Applied Encryption
- **Team/Contributors:** [Raphaël Deknop, Fabian Ferno]
- **Repository:** [https://github.com/fabianferno/blindmatch/]
- **Demo:** [https://youtu.be/idIGuzFKmAw]

## Description (TL;DR)
BlindMatch is a privacy-preserving dating platform that uses Fully Homomorphic Encryption (FHE) to match users based on shared interests without revealing personal preferences. Users discover compatibility while maintaining privacy FHE computations done in smart contracts using Fhenix.

## Problem
Current dating applications collect and sometimes expose sensitive personal data including interests, preferences, location, and matching behavior.

## Solution
By using an FHE-based solution, the amount of data or metadata exposed is minimal. 

### Interest matching
- Users select interests encrypted client-side using cofhejs
- Smart contract performs similarity calculations on encrypted data using Fhenix
- Match results only revealed through FHE decryption to involved parties
- Nobody sees the actual interests
- 8-bit interest bitmaps for gas-efficient encrypted operations
- 3/8 common interests threshold (37.5% compatibility) triggers matches
- Bitwise AND operations on encrypted data reveal only match/no-match results

### Attempt at geographical proximity check
- Prove you're in an area without revealing where exactly
- Show potential matches by fully homomorphically checking proximity

## Technology Stack
- **Blockchain:** Ethereum
- **Smart Contracts:** Solidity with Fhenix Cofhe contracts
- **Encryption:** Cofhejs for client-side FHE encryption
- **Frontend:** React/TypeScript with ethers.js integration
- **Location Privacy:** Circom/FHE -> cfr presentation for encountered issues
- **Testing:** Hardhat with FHE test suite

## Privacy Impact
This approach prevents data collection and sharing as well as potential leaks, and also protect users in case of triangulation attempts. It also empowers users to be more sovereign, and actively choose what they want to share with others.

## Real-World Use Cases

While we focused on a dating application, the core components can be used and adapted for many applications.

The matchmaking part can be used more broadly, such as when seeking jobs, business partners, new acquintances, possible roommates, etc. 

The location part of it can be used for delivery, meetups, events, and proof of attendance. In general, any application which requires 


## Business Logic

While this was not the focus of our work, here are possible revenue streams :
- **Premium matching**: Advanced compatibility algorithms and filters
- **API licensing**: Privacy-preserving matching for other platforms
- **Enterprise**: Private recruitment/networking for companies

## What's Next

### Immediate (Hackathon+)
- Deploy to testnet with full FHE functionality
- Complete frontend integration with cofhejs encryption
- Implement a better location verification system
- Beta testing with privacy-focused user cohorts

### Short-term (3-6 months)
- Mainnet deployment with gas optimization
- Advanced matching algorithms (personality, values, goals)
- Multi-platform mobile applications
- Enhanced location privacy features (country/city-level verification)

### Long-term (6-12 months)
- Cross-chain privacy infrastructure for other social apps
- AI-powered compatibility without compromising privacy
- Decentralized governance for matching algorithm improvements
- Privacy consulting services for social platforms
