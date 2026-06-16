# MAGPIE Server for Shelder Evolution {#top}

- [MAGPIE Server for Shelder Evolution {#top}](#magpie-server-for-shelder-evolution-top)
  - [Meta](#meta)
    - [What is MAGPIE Server?](#what-is-magpie-server)
      - [Q1 — What is the core gameplay loop?](#q1--what-is-the-core-gameplay-loop)
      - [Q2 — What happens between card matches?](#q2--what-happens-between-card-matches)
      - [Q3 — What is the role of the client?](#q3--what-is-the-role-of-the-client)
      - [Q4 — What is the 'tick' frequency?](#q4--what-is-the-tick-frequency)
        - [L0 — the 'Base' layer](#l0--the-base-layer)
        - [L1 — the 'Game' layer](#l1--the-game-layer)
        - [L2 — the 'Standard' or 'TICK' layer](#l2--the-standard-or-tick-layer)
        - [L3 — the 'superTICK' layer](#l3--the-supertick-layer)
        - [L4 — the 'megaTICK' layer](#l4--the-megatick-layer)
        - [L5 — the 'ultraTICK' layer](#l5--the-ultratick-layer)
      - [Q5 — What happens when an entity gets 'kicked'?](#q5--what-happens-when-an-entity-gets-kicked)
      - [Q6 — How often is data saved to the database?](#q6--how-often-is-data-saved-to-the-database)
      - [Q7 — What security measures are used to protect client connections?](#q7--what-security-measures-are-used-to-protect-client-connections)
  - [Game Architecture](#game-architecture)
    - [What is Shelder Evolution?](#what-is-shelder-evolution)
    - [Why a MMORPG?](#why-a-mmorpg)
    - [How does 'roguelike deckbuilding' fit in?](#how-does-roguelike-deckbuilding-fit-in)
    - [What genre and why is it hard sci/fi?](#what-genre-and-why-is-it-hard-scifi)
    - [Why 'Grey Tone' is just a baseline](#why-grey-tone-is-just-a-baseline)
    - ['Bleak Agency' doesn't mean you are insignificant](#bleak-agency-doesnt-mean-you-are-insignificant)
    - [Lore themes and the meta-narrative](#lore-themes-and-the-meta-narrative)
    - [The case for a business model](#the-case-for-a-business-model)
    - [Roadmap](#roadmap)
  - [Index](#index)
  - [NodeJS server + NWjs client](#nodejs-server--nwjs-client)
    - [Security](#security)
    - [Hosting and Domain](#hosting-and-domain)
    - [RMMZ-based client](#rmmz-based-client)
  - [ECS/OOP hybrid architecture](#ecsoop-hybrid-architecture)
  - [Express server](#express-server)
  - [Socket.io](#socketio)
  - [JWT security](#jwt-security)
  - [Better-sqlite3 database](#better-sqlite3-database)
  - [REPL](#repl)
    - [CLI-progress](#cli-progress)
    - [CLI-spinner](#cli-spinner)
  - [Lore](#lore)
  - [Prototype 0.40.0](#prototype-0400)
    - [Plan](#plan)

[Back to Top ⤴️](#top)

---

## Meta

[Back to Top ⤴️](#top)

---

### What is MAGPIE Server?

'MAGPIE_Server' is the 'server-side logic'/'backend' for *M.A.G.P.I.E.[^MAGPIE] [Shelder Evolution](https://shelderevolution.org) MMOTCG[^MMOTCG]*.

---

#### Q1 — What is the core gameplay loop?

The core gameplay loop is: *[tactical card-play from a hand](https://en.wikipedia.org/wiki/Collectible_card_game)*.

---

#### Q2 — What happens between card matches?

The 'meta' gameplay loop is *pet lifecycle[^lifecycle] via [roguelike-deckbuilding](https://en.wikipedia.org/wiki/Roguelike_deck-building_game) strategy*.

The PLAYER[^player] adopts and guides a CREATURE[^creature]

---

#### Q3 — What is the role of the client?

The 'client' app strictly acts as a *dumb terminal*: the server streams concise, pure-data instruction packets called TICKET[^ticket], and the client simply projects the data points carried by it and loads it with user inputs to send back to the server for processing.

---

#### Q4 — What is the 'tick' frequency?

There are multiple layers of tick frequency, each designed for a specific purpose, each looped through asynchronously with a *"if you fail your .refresh() you get kicked"* policy:

##### L0 — the 'Base' layer

At maximum tick rate (avg. `1ms`), reserved for server processing and admin-approved edge cases like time-accelerating an entity.

##### L1 — the 'Game' layer

At `60Hz`, with limited slots, so, reserved to the entities that have refresh priority.

##### L2 — the 'Standard' or 'TICK' layer

At `1Hz`, with a much more generous slot limit, but reserved for entities that have a 'active' status, meaning, their 'exp queue'[^exp] is not 0 and there is at least one exp triggering activity.

##### L3 — the 'superTICK' layer

At `0.033Hz` (or 1/minute), where we start not caring about slot limit anymore. Most inactive or slowly-updating entities reside here. The standard layer for celestial-body entities and active structure/immobile entities.

##### L4 — the 'megaTICK' layer

At 1/hour.

##### L5 — the 'ultraTICK' layer

At 1/day. Every entity in the database is updated at least once a day, but the purpose of having this layer is that the entities registered here have priority of update over the other entities in the database.

---

#### Q5 — What happens when an entity gets 'kicked'?

WHen an entity gets kicked from a refresh layer, they won't get refreshed anymore until the next '1/day' global refresh, and, in the case of an 'adoptee', the owner PLAYER will only receive the 1/day update from their creature. This is a programming fallback to avoid entity errors cascading into server errors, and is handled automatically by the HIVE[^hive], which will 'awake' an inactive entity not currently hosted, and host it to the appropriate refresh layer upon receiving and accepting a valid TICKET[^ticket]. 99% of the times, a PLAYER won't have to worry about this.

---

#### Q6 — How often is data saved to the database?

**L0** to **L2** are *buffer* layers (`array` of `MAGPIE_ENTITY`) which means the **HIVE**[^hive] becomes the source of truth for these entities while they're hosted.
**L3** to **L5** are *remote* layers (`Float64Array` of `entityID`) which means the database remains the source of truth and the HIVE dynamically accesses the entity by `sql query`. **L3**+ usually update on *1/min+* frequency, so, `1/min` is the maximum frequency to be expected for their database write, which is also the frequency for a *metasave*[^metastate] (metastate save + save buffer entity).

So, *TLDR*: every minute, unless manual override.

---

#### Q7 — What security measures are used to protect client connections?

- our server runs on a HTTPS Cloudflare domain, which takes care of protecting you from external tampering.
- we use JWT tokens to validate socket identity with 1-hour expiry
- client and server refresh the socket token every minute
- *security-by-design* policy:
  - HIVE[^hive] only accepts valid payload
  - for payload to be valid, it must have a legitimate action
  - legitimate actions are the cards in the creature's hand — the options available to the creature and that the creature is already likely to choose from
  - 'no code injection' — payload is dumb data and enforced at the type level (e.g. Number(data), String(data), not 'eval(code)'), so, anything improperly formatted automatically becomes an 'undefined' value, which the HIVE immediately refuses and triggers a `kick(entity)` response
  - native rate-limiting and activity throttling — the creature can only do so much as its simulated physiology can allow
  - native anti-cheat — the payload can only ever queue suggestions to the creature to choose a specific option in the pool of already legitimate option (e.g. client sends `play(hand_index)`)
  - native anti-spam — payloads get filtered by the creature's own agency and willingness to trust[^affinity] a player's input
- additional technical security measures:
  - rate-limiting (to mitigate spamming and Ddos attacks)

[Back to top ⤴️](#top)

---

## Game Architecture

The game's architecture is based on the following components:

- **Central Server**
  - Unique and hierarchical coordination starting from 'REYA' — the admin, and descending through levels:
    - **REYA**
      - **ROLE_MODEL / MOD** (moderator)
      - **EXPERT / DEV** (gamedevs or lore writers)
      - **GUIDE** (the game masters)
    - Playerbase with an additional hierarchy of roles:
      - **PLAYER** (base level that everyone has as a member of the community, because we are all, at our core, PLAYERs)
      - **Leader** (members leading factions/groups)
      - **Legend** (popular members known for deeds and contributions)
      - **Elder** (honorary members for longevity)
    - NPCs integrated directly into the lore and meta-structure:
      - All creatures, whether controlled by a human or by the game's AI, are technically NPCs. The PLAYER is a guide, and the adopted creature is not an avatar but a disciple. Ergo, the concept of a standard NPC doesn't exist because they are *all* NPCs. The only difference is the mentor guiding them.

[Back to Top ⤴️](#top)

---

### What is Shelder Evolution?

[Shelder Evolution](https://www.notion.so/Shelder-Evolution-4ab289bcbf5144e3ad24aaf9d4fc20ad?pvs=21) is a multi-platform project that encompasses the saga (lore), the content (art/music/vlogs/merchandise), the meta (the game world / server) with its interoperable access points (client), and the backend (admin/gamedev).

The content outlet ranges from digital art using tools like Krita, GIMP, and Aseprite, to merchandise. Specifically:

- Webcomic (w.i.p. 'Wild World' on [Webtoons](https://www.webtoons.com/en/canvas/wild-world/list?title_no=392510))
- [Game Assets](https://matheraptor.itch.io/)
- Art for merchandise, sold via Spreadshirt or Amazon
- Music through the virtual band '[Trickster Switch](https://soundcloud.com/tricksterswitch/sets)'
- Vlogs such as the [MatheraptorShow](https://www.youtube.com/@MaTheRaptor)

[Back to Top ⤴️](#top)

---

### Why a MMORPG?

Let's state right away that the final idea is to create an MMORPG on the scale of Eve Online, featuring its own internal economy and a single persistent server that unifies the lore in one place while encouraging individual granularity to create personal sub-lore.

Naturally, this is the endgame, not the current state of affairs. We are starting instead with a single-player app that already takes a multiplayer approach, emulating aspects typically found in an MMORPG—such as logging into a server to join a persistent community, the presence of other entities pursuing their own paths, and an internal economy.

[Back to Top ⤴️](#top)

---

### How does 'roguelike deckbuilding' fit in?

As explained above, the architecture is based on a collectible card game (CCG). If you are already a fan of Pokémon, Magic, Yu-Gi-Oh, etc., you should have an idea of what it entails. Although the specific idea for this game differs from any other card game currently on the market—which is exactly why there was a need to create an original one, allowing the freedom to do it my way.

The base unit of action in the game is the **CREATURE**:

- Each creature has its own life with gradual growth, starting from conception as a fetus, up to definitive death.
- Each creature is therefore a unique persistent entity, whose death is permanent.
- Adoption is the primary mechanic through which a PLAYER can acquire the guidance of a creature and maintain it until its death.
- Every creature provides the adopting PLAYER with a CREATURE DECK that represents the card abstraction of that entity in the game.

The base interaction in the game is the **ACTION**, with its alternative of inaction — **REST**:

- Every action involves choosing and using a card from one's hand. The cost of an action is inherent to the hand itself, which represents **STAMINA**.
- You can only draw cards during rest, which acts as a stamina recharge, thereby necessarily forfeiting the action for that turn. The cost of resting is inherent in the consumption of cards from the deck, which represents the **RESERVE**.
- When the reserve runs out, one of the cards in the discard pile is exiled as an INJURY, taking the form of FATIGUE. Each fatigue reduces stamina by 1, thus limiting the maximum number of cards you can hold in your hand.
- When fatigue prevents holding any cards, the creature is EXHAUSTED and is lost to EXHAUSTION. This does not equal death, unless the opponent decides to prey upon your defenseless creature.
- If the entire reserve becomes an injury, or a vital trait is injured, the creature dies from its wounds.
- A dead creature becomes food for other creatures — the foundation of predation, and the focal point of the internal economy.

[Back to Top ⤴️](#top)

---

### What genre and why is it hard sci/fi?

[Back to Top ⤴️](#top)

---

### Why 'Grey Tone' is just a baseline

[Back to Top ⤴️](#top)

---

### 'Bleak Agency' doesn't mean you are insignificant

[Back to Top ⤴️](#top)

---

### Lore themes and the meta-narrative

The base goal of the game is the acquisition of **EVOLUTION POINTS (EVP)**, which are necessary for meta-interactions, chief among them being adoption:

- Adopting creatures costs EVP. Unless the cost is 0 (like for 'starter species'), you pay in evolution points, effectively treating them as meta-currency.
- EVP can also be invested to develop exotic traits and hack evolution.
- EVP are generated primarily when giving birth to a fetus. Additional EVP are awarded during the offspring's growth as bonuses for this main 'QUEST'.

The base goal of the metagame/community is the acquisition of **CLOUT POINTS**, necessary to level up in roles:

- The simple act of playing, the trade of evolution points, and the creation of evolution points itself provide clout bonuses.
- Contributions to the community, such as monetary donations or volunteering for management tasks, provide additional clout bonuses.

[Back to Top ⤴️](#top)

---

### The case for a business model

[Back to Top ⤴️](#top)

---

### Roadmap

- **Development on NW.js via HTML/CSS/Javascript**
  - PC downloadable app with negligible requirements (if the PC runs Chrome, it runs the app).
  - 0 dependencies - plug-and-play game - download it, and play.
  - Javascript/JSON architecture based on ES6/JSDocs making modding easy, and allowing the implementation of external links without visible performance costs.
    - Synchronization module via Discord through API.
    - RP details generation module via local LLM.
    - Integration module with strategic dashboard.
- **Development on Node.js with advanced ESM, API, MCP functions**
  - ESM allows advanced package (plugins) integration.
  - APIs allow fast and automated data exchange.
  - MCP facilitates the integration of generative AI models (LLM) to assist with RP details, or other types of automation.
- **Simple Server**
  - Renting a virtual machine on Google Cloud.
  - Node.js integration on the virtual machine.
  - Pay-as-you-go system through donations to the server.
- **Complex Server**
  - Renting a specialized virtual server.
  - Expanding Node.js with modules to manage server security and RMMZ multiplayer.
  - Subscription system, with a 0-cost trial subscription for 'starter-species', and an EVP/CLOUT conversion program into free subscription months.
- **Mobile**
  - Integration on Android mobile.
- **Full MMORPG**
  - Proprietary server.
  - Specialized Node.js app, no longer enslaved to the RPG Maker MZ engine.
  - In-app integrated web services.

[Back to Top ⤴️](#top)

---

## Index

[Back to Top ⤴️](#top)

---

## NodeJS server + NWjs client

The architecture relies on Node.js inherently present in modern browsers, making it easily implementable without complicated or heavy system requirements. Android app integration is on the roadmap (though not guaranteed), making it a portable game that can be played asynchronously, keeping it 'always on' in the background to maximize its strategic card game architecture.

---

### Security

[Email security architecture](./private/docs/../../.private/docs/spec/email_security.md)

---

### Hosting and Domain

**Shelder Evolution** <https://www.shelderevolution.org> via [Cloudflare](https://www.cloudflare.com/)

[Back to Top ⤴️](#top)

---

### RMMZ-based client

For those unfamiliar, [RMMZ (RPG Maker MZ)](https://www.rpgmakerweb.com/products/rpg-maker-mz) is a game engine focused on JRPGs, based on the NW.js architecture. It is therefore a Javascript web app that also allows the integration of internal plugins or direct Javascript code. It is not strictly limited to the JRPG architecture, which is why, in our case, we are implementing a CCG (collectible card game) genre.

[Back to Top ⤴️](#top)

---

## ECS/OOP hybrid architecture

[Back to Top ⤴️](#top)

---

## Express server

[Back to Top ⤴️](#top)

---

## Socket.io

[Back to Top ⤴️](#top)

---

## JWT security

[Back to Top ⤴️](#top)

---

## Better-sqlite3 database

[Back to Top ⤴️](#top)

---

## REPL

[Back to Top ⤴️](#top)

---

### CLI-progress

[Back to Top ⤴️](#top)

---

### CLI-spinner

[Back to Top ⤴️](#top)

---

## Lore

Starting from the 50s, a group of nerds formed a secret society that later grew and split into two. These continued to grow independently up to the present day, when, parallel to the development of AI, the focus increasingly shifted towards space colonization. It is exactly with this perspective that, in a future heavily styled after 'The Expanse', the 'M.A.G.P.I.E.' project finally sees the light—a seed ship designed for intergalactic travel to colonize a planet as similar to Earth as possible.

The creators of this project are convinced of the existence of the aforementioned planet—'Shelder'—in an almost prophetic vision of the distant future. Whether it's a prophecy coming true, or the Drake Equation disproving the Fermi paradox, the fact is that the 'HSS Venture' actually finds 'Shelder' in the Orion galactic arm, thus reaching the end of its 40k+ years of (subjective) travel. Meanwhile, entire human empires have been born, grown, and fallen, and most Earthlings have forgotten that this adventure was ever even conceived. From the relativistic point of view of the travelers aboard the Venture, digitized directly into the ship's AI mainframe, a fraction of time has passed, and as far as they are concerned, Earth might as well just be an idea, a fictitious fabrication, a legend.

These digital minds find themselves facing a difficult decision: download themselves—that is, return to a physical body—or remain in cyberspace, continuing to enjoy all the perks that have become second nature and make them feel like deities. But MAGPIE cannot stop and wait for their decision; it is already intent on directing an independent society of drones to build the infrastructure necessary for the colonization of the entire 'Shel' star system, where the planet 'Shelder' resides.

Once the planet is colonized and the first scientific study programs are launched, MAGPIE discovers that the local biosphere is highly evolved, comparable to an Earth in the Cretaceous period—it seems the natives have followed a path very similar to that of Earthlings. What could effectively be called 'Dinosaurs' (and will later be renamed 'Sheldosaurs') are the most prominent megafauna on the planet, with vast biodiversity in every possible biome. Integrating the human species into this delicate meta-ecosystem will require a cautious and well-studied balance, certainly not a task to leave in the hands of the megalomaniacal minds of digitized humans.

Thus, a rivalry forms between the majority of the digital minds (the pro-tech/anti-AI faction), the pro-AI minority alongside the drones, and the naturalist minority (anti-tech/anti-AI). This trilateral rivalry will be the fulcrum of all the main conflicts of the saga, also extending to the local fauna, thanks to a 'small oversight' involving the 'accidental' implementation of a technological perk designed to help monitor the fauna—a runaway process that grants 'intelligence' to the test subjects and gives life to a fourth faction: the 'chips', or intelligent fauna.

[Back to Top ⤴️](#top)

---

## Prototype 0.40.0

### Plan

[Prototype plan](./.private/docs/prototype_0_40_0_plan.md)

[Structural analysis](./.private/docs/blueprint/STRUCTURAL_ANALYSIS.md)

[Progress](./.private/.progress.md)

---

[^MAGPIE]: (M)odular (A)rchitecture (G)eneral-(P)urpose (I)ntelligence (E)ngine

[^MMOTCG]: (M)assively (M)ulti-player (O)nline (T)rading (C)ard (G)ame

[^lifecycle]: *Lifecycle*: guide an adopted creature through its lifecycle on a persistent, mathematically-driven 3D universe

[^player]: every user in *Shelder Evolution* is called a **PLAYER**, which is meant both in the real, immediate meaning of the user playing this game, and the 'meta' narrative that sees this user interpreting an entity living in the universe of this game that is also playing a game called *Shelder Evolution*, which is essentially the same game, but happening in that universe.

[^creature]: every living entity within the game universe is called a **CREATURE**. Every CREATURE must obey the simulated biological rules of the game to survive — failing to survive translates to [*permadeath*](https://en.wikipedia.org/wiki/Permadeath).

[^ticket]: a TICKET is a packet of data specialized for server-client communication that is sent back and forth through sockets[^websocket] containing a payload of metadata (e.g. the playerID, the request timestamp, etc.) and most often also a EXP.

[^exp]: a EXP is another packet of data that is specialized for gameworld entities (it stands for 'experience packet'). EXP is the entity's data packet that contains entity "memory" and is also used for instructing activity. Entities have a `.exps` array that acts as their repository of exps, and that they cycle through with each `.refresh()` tick.

[^hive]: HIVE is a server system that acts as host for all entities in the gameworld. It hoists them from the database to a refresh layer, triggers their `.refresh()` method, shuffles them around where needed, and kicks them from the layer at will (e.g. admin command), or if they fail their `.refresh()`.

[^metastate]: METASTATE is a server component that handles the current server session data, like the gamedate, the state of server events, and the register of active entities a.k.a. `hive._registry`.

[^affinity]: AFFINITY //@todo affinity

---
