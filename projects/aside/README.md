## Aside

When you want to discuss something sensitive, you'll be able to safely step aside.

- Tracks:  Censorship Resistance - Tor, mixnets, Nostr, mesh networks  User Onboarding - Improving privacy tech adoption
- Team/Contributors:  Alisher, Sasha
- Repository:  [https://github.com/weboko/aside](https://github.com/weboko/aside)
- Web demo (proof of concept):  [http://weboko.github.io/aside](http://weboko.github.io/aside)
- Slides: [link](https://www.figma.com/proto/RabMCrsG4P9lzJ4lnp1mM6/Aside?page-id=202%3A13193&node-id=202-13249&viewport=149%2C202%2C0.19&t=sfau0xoJzMI6ec6f-1&scaling=contain&content-scaling=fixed)
- Video demo: [link](https://github.com/weboko/aside/blob/51c9ed656d78db6296dedf6b363e85151f582caa/demo.MOV)

## Description

Aside is a radically minimal, ephemeral, peer-to-peer chat tool. No accounts. No sync. No trace. It lets people connect - then vanish. Nothing saved. Nothing leaked.

Most messengers, even "private" ones, store too much: contacts, metadata, message history. These traces create risks in high-pressure or high-surveillance environments. Think Tails OS or incognito mode - but for short, trusted conversations.

---

## Solution

Aside removes everything that creates traceability. Built on Waku, it only works when both users are online. There’s no history, no retries, and no identity. It is presence without persistence.

---

## Technology Stack

- Waku (peer-to-peer messaging layer)
- Android and web (Tauri frontend using TypeScript + Rust core)
- No backend, no database
- GitHub
- ECIES

---

## Privacy Impact

Success is two humans connecting without a trace. That’s it.

- Zero metadata logging
- No accounts, contacts, or logs
- Messages disappear when session ends
- No trace even on device - "exit" wipes memory instantly
- Works outside of app stores (sideload APK) - allows verifiability

---

## Real-World Use Cases

- Activist coordination in hostile environments
- Anonymous whistleblower conversations
- One-time trusted communication without identity
- Field journalists verifying sensitive info

---

## Business Logic

Aside is public: open-source, forkable, modifiable. Sustainability comes through:

- Meant to be free
- Grants (public goods), no VC, no tokens
- Community forks
- Use by privacy toolkits (bundled into broader offerings)

No ads, no data sales, no accounts.

---

## What's Next

- Distribute APK via GitHub
- Strengthen cryptography and transport-layer protection
- Trusted and secure execution environments
- Add Waku mixnet or other mixnet built-in
- Ship hardened release
- Launch a grassroots privacy campaign
- Integrate feedback from use in real-world ops

---
