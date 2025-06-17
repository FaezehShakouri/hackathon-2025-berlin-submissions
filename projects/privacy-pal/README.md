# PrivacyPal

- **Track(s):** Privacy Enhancement, Data Sovereignty
- **Team/Contributors:** Daniel Silberschmidt, ChatGPT (technical co-pilot)
- **Repository:** [https://github.com/dsilberschmidt/privacy-pal-dev]
- **Demo:** PrivacyPal_Slides.pdf

## Description (TL;DR)
PrivacyPal is a local-first browser extension that watches the privacy policies you visit — and remembers them for you. It detects changes over time, notifies you when something shifts, and even suggests responses or alternatives using local AI models.

## Problem
Most users agree to privacy policies without reading them. Even those who do rarely notice when companies change them silently. These shifts may affect your consent, expose your data, or remove prior protections — and you’d never know.

## Solution
PrivacyPal automatically stores privacy policies locally the first time you visit them, and in the future when you accept them. It tracks version history, highlights changes, and can use lightweight local AI to:
- Summarize key clauses (e.g., what’s changed?)
- Suggest actions (e.g., unsubscribe, write to DPO, switch services)
- Recommend privacy-friendly alternatives

All of this runs **entirely in your browser**, preserving your autonomy and avoiding cloud-based surveillance. You can opt for an ai suggestions from aiml

## Technology Stack
- JavaScript (Vanilla, no frameworks)
- Chrome/Brave Extension APIs
- IndexedDB for local version tracking
- Hashing with SHA-256 (WebCrypto)
- GPT-4o (via local prompt or API, optional and pluggable)
- GitHub for collaboration

## Privacy Impact
PrivacyPal strengthens your position as a data subject. By giving visibility into evolving policies and suggesting actions, it counters dark patterns and silent overreach. All AI features are **opt-in** and in future would  be local-only. 

## Real-World Use Cases
- Journalists tracking silent changes in Big Tech policies
- Activists monitoring government digital platforms
- Families supervising websites used by children
- Individuals auto-generating opt-out emails or complaints
- Anyone seeking privacy without deep legal knowledge

## Business Logic
PrivacyPal is free and open-source. Future versions may offer premium features for legal teams, such as:
- Bulk monitoring across domains
- Legal diff summaries
- Exportable reports for GDPR/CCPA audits
Sustainability may rely on community funding, not ads.

## What's Next
- Full diff viewer between versions
- Timeline visualizer
- Integration with TOSDR/EFF datasets
- Local LLM summarizer (WASM + WebGPU or browser-based model)
- AI-powered response generator (e.g., DPO contact draft)
