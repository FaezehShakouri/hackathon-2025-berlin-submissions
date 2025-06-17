# Portal

- Track(s): Public Goods, Censorship Resistance
- Team/Contributors: sunsakis, belakm, yellowBirdy, weboko
- Repository: https://github.com/sunsakis/portal
- Demo: https://github.com/sunsakis/portal - https://portal.live coming soon, video link for now: [https://drive.google.com/file/d/19GVzQL4cwm5fAWaNVpbrvVpjrDeeJNAM/view?usp=sharing](https://drive.google.com/file/d/19GVzQL4cwm5fAWaNVpbrvVpjrDeeJNAM/view?usp=sharing)

## Description (TL;DR)
A decentralized location-based chat app where users can chat with people nearby via P2P messaging without storing personal data or tracking movement.

## Problem
Location-based apps typically track users continuously and harvest personal data
Social discovery requires sacrificing privacy to centralized platforms
No way to connect with people in your immediate vicinity without exposing identity

## Solution
A user shares their GPS coordinates once to open a chat portal that allows people to participate in a P2P group chat.

## Technology Stack

#Frontend:

React 18 + Vite
Leaflet + MapTiler (OpenStreetMap tiles)

#P2P Infra:

Waku (P2P messaging)
Ethereum cryptography (eth-crypto, viem)
Protobuf (message serialization)

#Backend:
Supabase (anonymous portal location storage)

#Privacy Tech:

Client-side identity generation
End-to-end encryption for friend requests
No user tracking or analytics
Local-first data storage

## Privacy Impact
[How does this improve privacy?]

## Real-World Use Cases
#Social Discovery:

Conference networking without sharing personal contacts
Meeting people at concerts, festivals, or events
Campus connections for students
Neighborhood community building

#Privacy-Conscious Communication:

Activists coordinating in sensitive locations
Travelers connecting without exposing identity
Local community organizing
Emergency coordination in disaster areas

#Professional Networking:

Co-working space connections
Industry meetup coordination
Conference attendee discovery
Local professional communities

## Business Logic

Allow users to purchase a portal without GPS
Selling ticket NFTs for events
Solutions for communal gatherings

## What's Next
Decentralized message storage
Integration with events
Community-driven map add-ons
