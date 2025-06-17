Identity-Locked Social Recovery accessible to everyone!

•	Track(s):   6 - Design (UI/UX), 7- User on boarding

•	Team/Contributors: (privacy matters) signal handle: S001.28

•	Repository: Private — insufficient time to clean and anonymize the code before submission.

•	Demo: [ https://streamable.com/a0b10a ] (will expire at 17.06.25)

________________________________________

📝 Description (TL;DR)

Social recovery is finally accessible to everyone!

Identity locked social recovery that is accessible for non-technical users with non-technical friends/family— no passwords, no on-chain footprint, 
no crypto-native guardians needed.
 Instead, your face + friends/family enable private, off-chain seedphrase recovery.
________________________________________

🚨 Problem

NO technical friends / family members which can act as Guradians ->>>  NO Social recovery!


Or a bit more in detail:

Digital Seed phrase based social recovery which is also identity locked(only the original owner can recover) is  NOT  accessible to people with non technical friends/family members.


Even more detail:

•	Most available applications for social recovery assume that technically proficient guardians are available to everyone.(which NEED to co-sign, download and set up an application, etc…)

•	 For most social recovery setups Guardians could plot against you if they want to. Or if they are hacked your assets are gone.

•	For most identity locked solutions the owner does need to store a password, a file or something.

•	On-chain recovery options can compromise privacy, be less censorship resistance and leave traces.

•	Hello L**ger  -No the solution is not to export the private keys to some companies… 

•	Most of the the current available solutions are mostly EVM based, and not Seedphrase based! Therefor in case you hold mix of coins, they are not all part of the social recovery.

•	Most of the solution out there, the Guardians need to know they are guardians and also for what they are the guardians. 

________________________________________

✅ Solution

zero-knowledge proof of Biometrics + Shamir Secret Sharing with additional Passphrase:

Use a zero-knowledge (ZK) proof of your face to derive a passphrase, which is then used with Shamir Secret Sharing to create encrypted shares which than can be shared with chosen guardians.
Sharing can be done via “unsecure channels “ like whatsapp, all will be in form of a link which adds a “concert ticket” like looking thing to the guardians Google or IOS Wallet.
This enables social recovery for non-technical users with non-technical friends/family members  - all while the Owner is the only one who can recover it 
and does not have to store anything only have to remember which are his guardians.

In case of loss, a user can regenerate the passphrase using his face and ask his guardians to send the “Concert ticket” out of their IOs/Android wallet back over whatsapp. 
As soon as he has the threshold he can fully recover his seedphrase.

Zero technical knowledge needed from guardians!  (how to use a smartphone) 

(Incase of avoiding google wallet and IOs wallet, the shares could be also encrypted in a picture which the guardians are ask to store on their device)

________________________________________

⚙️ Technology Stack

•	Zero-Knowledge Proofs of facial Biometrics – via RariMe or SELF on Celo for identity lock.

•	SLIP-39 – Library form trezor for secret sharing with passphrase.(awesome lib)

•	Google Wallet API / IOS wallet API – for distributing encrypted shares, which look like “Concert Tickets”.

 (I get it, I also don’t like google or apple, but most people uses android or apple phones)
 
(alternative: encrypt the shares into a picture, and tell guardians to take care of this.)

•	SHA-256 – to deterministically derive passphrase from ZK proof.

•	Python – core implementation.

•	Streamlit – frontend visualisation
________________________________________

🔒 Privacy Impact

•	No on-chain commitments, or registry needed, or email etc needed. All runs locally.

•	Users are less afraid to use self custody as everyone now has access to identity bound social recovery! No more how the FU** do I store my seedphrase ??
!! LETS MAKE SELFCUSTODY  and privacy NORMAL!!!

•	Guardians do not need to know they are guardians or for what exactly. 
________________________________________

🧑‍💻 Real-World Use Cases

Any user of a seed phrase–based self-custodial blockchain wallet who doesn’t want to rely solely on a piece of paper hidden somewhere—but instead wants additional social recovery,

where only they can initiate the recovery—faces a challenge if they have no technically skilled friends or family members to serve as guardians. 
Without these kind of trusted contacts,this form of social recovery remains inaccessible to them.
________________________________________

💰 Business Logic

•	Monthly subscription to us the easy to use app, but if you want to build it yourself with the open available tools we used here are our docs!

•	Wallet providers want this feature in their wallet and pay for it.

•	Offer premium feature like also to add additional institutional guardians. 
________________________________________
🚀 What's Next
-	Hopefully win this hackathon what equals an Idea Validation, or a least get valuable feedback to improve it.

-	Even more I hope  to get selected to the Cypherpunk Launchpad Program and build this fulltime from 01.07!
  
•	Talk with more potential users!
As there is clearly a problem which is not solved, and this could be one solution, get more people to do the survey and find out if they would pay for this application, so I can showcase this to potential investors and raise a bit of money, so I can continue to build it and also can find others and pay them to help me build it. (UX designer, Security Expert, and for an audit.)

