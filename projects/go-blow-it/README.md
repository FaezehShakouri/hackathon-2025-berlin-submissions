# [goblow.it](https://goblow.it)

- **Track(s):** Public Goods + User Onboarding
- **Team/Contributors:** Coco the dog (life coach), [Manu](https://github.com/frosimanuel) (developer), [Peter](https://github.com/petermlyon) (developer), and [Paulo](https://github.com/paulofonseca1987) (designer).
![hacking goblow.it](https://github.com/paulofonseca1987/goblow.it/blob/main/projects/go-blow-it/teamphoto.jpg?raw=true)
- **Repository:** [Github submission repo](https://github.com/paulofonseca1987/goblow.it/tree/main/projects/go-blow-it) + [Github App repo](https://github.com/frosimanuel/blowit) + [Railgun server repo](https://github.com/frosimanuel/railgun_server) + [TLS Notary repo](https://github.com/petermlyon/tlsn)
- **User Flows:** [FigJam](https://www.figma.com/board/96V8WgvzTCaZWilTGMU1JR/blow-it?node-id=0-1&t=aiJEr5h2Ui0i59rD-1)
- **Design:** [Figma](https://www.figma.com/design/e3VXYvyal2h3qjdLCWQyk3/blow-it?node-id=0-1&t=VpCj1SNxeQZLXEhC-1)
- **Demo Video:** [Google Drive](https://drive.google.com/file/d/1wVESSAhnmYXbyzxEfB_etM-8s12ZULwN/view?usp=sharing)
- **Live App:** [goblow.it](https://goblow.it)

## Description (TL;DR)
[goblow.it](https://goblow.it) empowers whistleblowers to anonymously and securely report verifiably true Telegram messages—such as evidence of misconduct, corruption, or unethical behavior—directly to the public, all while keeping the whistleblowers identity private and fully anonymous. Users can submit a contextual report along with a zkTLS proof of the veracity of the Telegram message and receive public or private donations from anyone that cares to support their whistleblowing efforts.

## Problem
What should you do if you receive a message on Telegram (either in a DM on in a private group chat), that is abusive, incriminating, or indicative of criminal intent?

Show it to someone else?
Report it to the authorities?
Or just simply take a screenshot of it?

We can probably all agree that it is a very natural human behavior to take a screenshot of a weird/suspicious/incriminating conversation or message, just to have it as insurance, for your future self. The issue is that a screenshot is not a good and verifiable piece evidence in this day and age, given that anyone can easily fabricate a screenshot with any content whatsoever.

Also, if you report it to the authorities, you risk them confiscating your phone and access all of your other messages in there.

If you show it to someone else, you risk making them unwilling witnesses to a potential crime.

None of these options are good.

## Solution
With goblow.it you can forward any Telegram message to the Blow It! telegram bot and get a zkTLS proof that guarantees that the author, content, and timestamp of that message (at the time it was forwarded), is in fact verifiably true since that information was indeed transmitted by Telegram's servers. Then, you can publish that message publicly and anonymously, with a private and shielded wallet that can receive public or private donations from people that would like to compensate the whistleblower that leaked that verifiably true Telegram message.

## Technology Stack
We are using [TLS Notary](https://tlsnotary.org) for the zkTLS proofs, [Railgun](https://railgun.org) for the shielded and private wallets, Next.js on Vercel for the web app with a Supabase database, and a small private server for hosting the railgun wallet generation and the telegram bot.

## Privacy Impact
goblow.it actively reduces the privacy of people whose messages get zk proved and publicly leaked. But on the other hand it also makes sure to preserve the privacy and anonymity of the whistleblowers that leak the messages by offering them, by default, a Railgun shielded and private wallet. We follow the Julian Assange maxim of "Transparency for the powerful, privacy for the powerless" and we take it to the extreme by allowing the powerless to whistleblow on the powerful. As it should be. Also, the whole codebase can be self-hosted and someone that is really worried about their privacy can run their own notary service and railgun generation back-end by themselves. And even deploy a forked version of [goblow.it](https://goblow.it)

## Real-World Use Cases
Anybody that has ever received a suspicious Telegram message could use [goblow.it](https://goblow.it) and prove a message and get rewarded for it. This toold provides a safe whistleblowing tech stack for leaking Telegram messages anonymously.

## Business Logic
In the future, we could charge for the publishing of evidences in the future, which would also help to prevent spam. We could have specific pools of funds, for specific communities that want to incentivize and reward whistleblowing, and charge a fee for each case. We could also build a prediction market for which leaks are going to happen in the future, and charge a fee on each bet, that would fund the whistleblower and we could keep a fee.

## What's Next
The immediate next steps is to allow whistleblowers to publish evidence privately to a committee, with a time expiration countdown where the evidence becomes public after the time expires. Also, all cases handled by the committee are made transparent after a decision is made. Committees decide how much they pay to each whistleblower from their own pool of funds. We could also expand this project to support other messaging apps like Whatsapp, Signal and the likes. Nobody is safe from being exposed on [goblow.it](https://goblow.it) =)