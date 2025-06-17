# PrivateRPC

- **Track(s):**  
  - Censorship Resistance – Tor, mixnets, Nostr, mesh networks  
  - Applied Encryption – Strengthen existing tools  
- **Team/Contributors:** Erik Valle (erikvalle.85 - t.me/erikvalle), Artur Vargas (t.me/lil_code)

- **Repository:** [https://github.com/moclas17/private-NYMRPC](https://github.com/moclas17/private-NYMRPC)  
- **Demo:** [Video demo coming soon]

---

## 🧠 Description (TL;DR)

**PrivateRPC** is a lightweight local middleware that routes MetaMask and JSON-RPC traffic through the **Nym mixnet**, protecting user IP addresses and enhancing Web3 privacy at the RPC layer. It is developer-friendly and easy to integrate.

As state surveillance increases, especially in regions like **Latin America**, the need for metadata privacy grows. For example, **Ecuador recently passed a law** requiring internet providers and digital platforms to **share user activity and connection data with the government** upon request. Even if a user self-custodies their crypto, their network metadata can still betray them.

PrivateRPC breaks this link by anonymizing RPC traffic, making blockchain usage truly private.

---

## ❗️ Problem

Every time a wallet like MetaMask sends a transaction or queries blockchain data, the request exposes the user’s IP address to the RPC provider. This breaks user anonymity and allows RPC nodes (often centralized companies) to log, correlate, and analyze network behavior.

RPC providers can associate wallets with metadata such as:
- IP address  
- Device fingerprint  
- Session history  
- Timestamps and query patterns

In some jurisdictions, this metadata becomes an attack vector. For example, **a law recently passed in Ecuador** (Ley de Gestión de la Identidad y Datos Civiles, 2024) empowers authorities to **demand full user-level logs from internet and digital service providers**.

This type of policy is not unique to Ecuador — it mirrors global trends where Web2-style surveillance is being applied to Web3 interactions.

Even if you never use a custodial wallet, your network metadata can be **legally compelled, retroactively audited**, and correlated with your onchain identity.

PrivateRPC eliminates these risks by routing all RPC traffic through the **Nym mixnet**, ensuring that even if someone intercepts your request, **they only see encrypted packets and random timing patterns — not your IP address or location.**

---

## ✅ Solution

PrivateRPC acts as a local RPC proxy that routes all Ethereum JSON-RPC calls (like `eth_sendRawTransaction` and `eth_call`) through the **Nym mixnet**. This decouples user identity from wallet activity at the network layer and provides default metadata privacy for any dApp or wallet.

---

## 🛠 Technology Stack

- MetaMask (custom RPC support)  
- Node.js + Express  
- `socks-proxy-agent`  
- Nym SDK and `nym-client`  
- Nym Network Requester (for exit traffic)

---

## 🔐 Privacy Impact

- Hides user IPs from RPC providers  
- Anonymizes all outgoing Ethereum RPC calls  
- Helps prevent wallet fingerprinting and surveillance  
- Compatible with any Web3 wallet or app using HTTP JSON-RPC

---

## 🌍 Real-World Use Cases

- MetaMask users in restrictive jurisdictions (e.g. Ecuador, Turkey, Iran)  
- Developers needing private RPC infrastructure  
- DeFi platforms and privacy-first wallets  
- Onchain activists or whistleblowers needing full metadata unlinkability

---

## 💼 Business Logic

- Can be extended into a freemium "Privacy RPC as a Service"  
- Potential integration with wallet SDKs and privacy-focused dApps  
- Opportunity to offer this as an enterprise solution for regulated or censored regions

---

## 🚧 What's Next

- MetaMask Snaps integration for native privacy routing  
- Auto-discovery of active mixnet gateways  
- Prebuilt binaries for Windows/macOS/Linux  
- Decentralized relay network for scalable privacy infrastructure  
- Optional relay logging with privacy guarantees