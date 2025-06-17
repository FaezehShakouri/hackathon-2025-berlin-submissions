# OpenLavatory

- **Track(s):** UI/UX, Onboarding
- **Team/Contributors:** luc.eth, v1rtl.eth, Daniel
- **Repository:** https://github.com/v3xlabs/open-lavatory
- **Demo:**
  https://raw.githubusercontent.com/v3xlabs/open-lavatory/refs/heads/master/packages/dapp/public/ss_02.png

## Description (TL;DR)

Mobile to desktop wallet connection protocol based on open infrastructure. Uses
WebRTC and MQTT.

## Problem

WalletConnect relies on a central relay, it is hardcoded in the client.

## Solution

Infrastructure-agnostic signalling over WebRTC and handshaking over MQTT.

## Technology Stack

Viem, wagmi, TypeScript, Ethereum, JSONRPC, React, TailwindCSS, Radix.

## Privacy Impact

Does not leak your IP address to a central relay server. Can connect to self
hosted ones.

## Real-World Use Cases

Direct replacement of WalletConnect.

## Business Logic

Mobile user onboarding to dApps without opting in to centralization.

## What's Next

Polishing the library, handling edge-cases, support other transports and
handshake exchanges, writing an EIP.
