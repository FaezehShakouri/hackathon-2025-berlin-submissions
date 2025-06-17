# ShadowPay

- **Track:** Applied Encryption, Public Goods
- **Team/Contributors:** Levan Ilashvili, Guy at the Coffee Stand
- **Repository:** https://github.com/LevanIlashvili/hackathon-2025-berlin-submissions
- **Demo:** https://pitch.com/v/shadowpay-38envn 

## Description (TL;DR)
ShadowPay enables confidential payroll on public blockchains. Employers pay in USDC on an Ethereum network, and our platform uses Aztec to privately distribute shielded tokens to employees. Employees can then withdraw their funds to a public address without creating an on-chain link to their employer, ensuring their salary details remain private.

## Problem
Traditional on-chain payroll systems expose sensitive financial data. Every salary payment is a public record, revealing employee earnings, company payroll expenses, and cash flow. This lack of privacy is a significant barrier to the adoption of blockchain for business operations, as it exposes companies to competitive analysis and employees to financial scrutiny.

## Solution
ShadowPay severs the on-chain link between employer payrolls and employee withdrawals through a three-step process:

1.  **Fund & Deposit:** An employer connects their wallet and funds the entire payroll batch with a single USDC deposit to our smart contract on the Sepolia testnet.

2.  **Shield & Distribute:** Based on a private CSV upload of employee Aztec addresses, our backend service interacts with Aztec to mint and distribute shielded USDC (sUSDC) tokens to each employee. The individual amounts and destinations are never exposed on the L1.

3.  **Unshield & Withdraw:** Employees see their private sUSDC balance in their dashboard. They can burn these tokens to initiate a withdrawal, which transfers public USDC to their desired address from a platform-owned account. This process breaks the public traceability back to the original employer deposit, ensuring employee financial privacy.

## Technology Stack
- **Frontend:** Next.js, React, TypeScript
- **Styling:** Tailwind CSS, shadcn/ui
- **Blockchain Interaction:** wagmi, viem, RainbowKit
- **Privacy Layer:** Aztec SDK
- **Smart Contracts:** Solidity, Hardhat
- **Backend:** Node.js, NestJS API

## Privacy Impact
ShadowPay's core contribution is bringing financial privacy to payroll. By using Aztec, we ensure that:
- Employee salaries are not public knowledge.
- The company's total payroll and payment schedule are not exposed on-chain.
- The flow of funds between the company and its employees is shielded, preventing external analysis of the company's financial health or employee compensation.

## Real-World Use Cases
- **DAOs & Web3 Companies:** Pay contributors and employees without doxxing their earnings.
- **Global Freelance Payments:** Enable companies to pay international freelancers in a stable, universal currency without broadcasting payment details.
- **Privacy-Conscious Enterprises:** Any business that wants to leverage the efficiency of blockchain for payroll without compromising on financial confidentiality.

## Business Logic
The platform is designed to be self-sustaining. A small, fixed percentage fee (e.g., 0.3%) is calculated on top of the total payroll amount. This fee is collected by the smart contract during the deposit and would be used to fund the operational costs of the platform, including backend services and gas fees for withdrawals.

## What's Next
- **Full Aztec Integration:** Complete the integration with the Aztec Sandbox to enable fully private, end-to-end transactions, from deposit to shielded balance management.
- **Zero-Knowledge Proofs for Finance:** Leverage the shielded balances to enable powerful new use cases like `zkProof of Salary` (for mortgage applications or loans without revealing exact income) and `zkProof of Funds`, enhancing financial privacy beyond just payroll.
- **Multi-token Support:** Expand beyond USDC to support other stablecoins and tokens.
- **On-chain Payroll History:** Implement a private, auditable record of past payments for both employers and employees, accessible only by them.
- **Gas Abstraction:** Sponsor withdrawal transactions so employees do not need to hold ETH to receive their funds.
- **Mainnet Deployment:** After thorough testing and auditing, deploy the platform to a public mainnet.
