# LiveBlur

- **Track(s):** Public Goods and Design UI/UX
- **Team/Contributors:** Me :) Agustin Schiariti
- **Repository:** [LiveBlur Repo](https://github.com/Podima2/W3PN)
- **Demo:** [Presentation, Video Demo and other Media](https://www.canva.com/design/DAGqbcGuQzk/gxJAfrR82XEV0_em5NOoaA/edit?utm_content=DAGqbcGuQzk&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton)

## Description (TL;DR)
Intercepting the Meta Rayban Wayfarer LiveStream (BEFORE going live on IG), redirected to LiveBlur and then all faces are blurred! Subjects in the stream can dictate their privacy preferences and even demand payment for unblurring.
Think 'no photogaphy' stickers but real time enforcement and monetisation feature.

## Problem
Privacy preferences are notoriously difficult to enforce at irl events - ask the videographer here! 

Post processing for pixelation has to be done manually, face mask tracking is extremely time-consuming.  

We are currently suceptible to being filmed covertly by the Meta raybans and sales are growing x2.5 (2m pairs, 2024 to 5m pairs, 2025 projected) since last year and only increasing! (10m pairs in production in 2026)

## Solution
Creating a platform whereby the privacy preferences of event participants can be safe-guarded in real time on added streams can replace media post-processing and ensure each individuals digital image is handled with care. 

EU law dictates we have no reasonable expectation of privacy in public spaces. That's ridiculous - what about if you need to sign-in to literally anything, are we seriously accepting the recording of these sensitive activities in public spaces? Treating the surveillance as fair-game?

## Technology Stack
- **Frontend:** React, face-api.js, snarkjs (for ZK proof generation)
- **Backend:** Node.js/Express, snarkjs (for ZK proof verification)
- **ZK Circuits:** Circom, Groth16

## Privacy Impact
This business means everyone at the event can have the camera lens pointed at their face without it inducing doxxing axiety because you know it is being processed in realtime and implementing the privacy preference you yourself dictate.  

## Real-World Use Cases
The privacy preference settings of events can be managed through LiveBlur instead of relying on stickers and trusting the videographers' thoroughness in complying with privacy prefereces of each and every individual.

## Business Logic
Commission on every 'pay-to-unblur' transaction. Aside from this, meta rayban wayfarer users will be able to utilise this service to create privacy conscious vlogs on a subscription basis and as the proliferation of camera glasses continues this will become a more timely issue for everyone, not just anons. 

## What's Next
SUPER exciting conversation last night with Carlotta at the daydream party. They are part of livepeer and facilitate livestream image-to-image transformation. So next steps would be to include a prompt option in the privacy preferences for event participants. Meaning that instead of a boring blur effect they could choose to present themselves however they wish on other peoples streams and have that superimposed in real time! 
