# Hopline

- **Tracks:**
  -   Design (UI/UX) - Better privacy app experiences
  -   User Onboarding - Improving privacy tech adoption
- **Team/Contributors:**
  - [tolbrino - Core dev](https://github.com/tolbrino)
  - [mjadach - Fullstack dev](https://github.com/mjadach-iv)
  - [ilge ustun - Dapp dev](https://github.com/ilge-ustun)
  - [1uiz - UI/UX design](https://github.com/1uizeth)
- **Repos:** 
  - [UI](https://github.com/hoprnet/gnosis-vpn-ui-electron)
  - [VPN Binaries](https://github.com/gnosis/gnosis_vpn-client)
  - [Mixnet](https://github.com/hoprnet/hoprnet)
  - [Figma file](https://www.figma.com/design/k7EuEj4gBcojWkuez55FI3/Hopline?node-id=9-41&t=53m0hgs6fhaxaxKf-1)
- **Demo:**
  - [Video](https://drive.google.com/file/d/1-kIzaZIKjC5XRUXZL66TPbU7m-IPGygD/view?usp=sharing)
  - [Presentation](https://www.figma.com/slides/rfNRzGdbk2ScoSATIMuQ5J/Hopline?node-id=1-114&t=tHDDcplIcPmsXy3N-1)
  - [Figma prototype](https://www.figma.com/proto/k7EuEj4gBcojWkuez55FI3/Hopline?page-id=9%3A41&node-id=73-690&p=f&viewport=-387%2C279%2C0.39&t=6QfTzSARG7o0GAS5-1&scaling=scale-down&content-scaling=fixed&starting-point-node-id=69%3A413)


![Image](https://github.com/1uizeth/Hopline/blob/d3d2421addf98891650f9453d5424ac11772c11c/hopline.png)

## TL;DR
Hopline is a user-friendly interface for GnosisVPN, built on HOPR’s decentralized mixnet. While the core VPN binaries already existed, they were previously accessible only via CLI. With Hopline, we’re making enterprise-grade privacy accessible to everyday users by introducing a clean UI, intelligent onboarding, and progressive disclosure—transforming the experience from technical to intuitive.

## Problem
Web3 privacy tools often force a trade-off between usability and technical sophistication. GnosisVPN, powered by HOPR’s robust decentralized mixnet, previously existed only as command-line binaries—limiting access to technically proficient users. There was a clear need for an intuitive interface that brings powerful, decentralized privacy to a wider audience without compromising the advanced routing and anonymity features HOPR provides.

## Solution
A progressive disclosure UX that gradually introduces HOPR's complexity as users become more comfortable. Start with simple "connect and go" experience, then reveal mixnet routing, hub selection, and advanced privacy controls as users explore. Smart defaults handle optimization automatically while preserving access to full manual control.

![Image](https://github.com/1uizeth/Hopline/blob/4685023500bcdc8b8fdae895dbbcd6ba93da0ad1/UI_hopline.png)

## Technology Stack
- HOPR Protocol: Decentralized mixnet infrastructure providing metadata privacy
- GnosisVPN: VPN layer built on HOPR's network
- Progressive Onboarding: Layered interface revealing complexity gradually
- Local Intelligence: On-device traffic analysis for routing optimization
- Adaptive UX: Interface complexity scales with user engagement and expertise
- Desktop UI: Electron and React

## Privacy Impact
Combines HOPR's metadata privacy with traditional VPN traffic encryption. Multi-hop routing through HOPR's decentralized node network eliminates single points of failure. Local-only intelligence ensures no behavioral data leaves user's device while optimizing HOPR route selection.

## Real-World Use Cases
- Web3 Users: Secure DeFi transactions leveraging HOPR's mixnet privacy
- Mainstream Adoption: Making HOPR's enterprise privacy accessible to non-technical users
- Content Access: Geographic routing through HOPR's global node network
- Enterprise Privacy: HOPR-grade metadata protection with familiar VPN interfaces
- Privacy Advocates: Maximum protection through HOPR's proven infrastructure

## Business Logic
Built on HOPR's existing token economics and node operator incentives. Interface design accelerates mainstream adoption of HOPR infrastructure. Sustainable through HOPR's proven network economics while expanding user base beyond technical communities.

## What's Next
- Integrate design with GnosisVPN's HOPR-based backend
- Develop HOPR node selection algorithms for optimal routing
- Create onboarding flows that educate users about HOPR's privacy benefits
- Implement HOPR network health indicators in the interface
- Launch with existing HOPR community for validation and feedback
