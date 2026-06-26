---
type: spec
version: 0.39.957
topic: adoption system
---

# CREATURE ADOPTION SYSTEM {#top}

referenced by [Github issue 185](https://github.com/Hastral-org/MAGPIE_Server/issues/185)

- [CREATURE ADOPTION SYSTEM {#top}](#creature-adoption-system-top)
  - [Overview](#overview)
    - [Recap](#recap)
  - [Desired UX](#desired-ux)

---

## Overview

In [ShelderEvo](../../../README.md), the [core gameplay loop](./gameplay_loop.md) involves **adopting** and raising a CREATURE[^entity].

### Recap

**Q: How does the PLAYER choose the species?**

A: list of available species taken fromdirectly from the database via a specific query

**Q: How is the adoption cost determined for non-free species?**

A: varies based on rarity and ecosystem impact of the species (.e.g an apex predator will likely have an high impact on the ecosystem, so, it will increase the cost of the embryos)

**Q: How is the individual embryo determined once the species is chosen?**

A: we will implement a seed-based population manager that generates the population on demand from the single encompassing entity using the seed and the species params, then updates the seed when changes are made to the population and compress it back to a single entity to save server resources. So, while it is technically generated on demand, it is intended to emulate an actual living population. The actual choice of embryo to grant to the player  prioritizes the embryo currently loaded in memory, which are most likely the offspring of the creatures of other players. This is a weighted dice that favours player-associated embryos. To recap, on adoption confirm: - create a pool by aggregating currently active embryos + decompress the entity of the selected species and filter by embryo, then, weighted-dice favoring active embryos => entityID => player adopt entityID, then, cleanup (compress species entity etc)

**Q: What specific constraints does the 'free-tier' subscription impose on the adoption process?**

A: [free-tier constraints](./subscription.md)

**Q: Are there limits on the number of adoptions for a free-tier player?**

A: there is a universal '1 CREATURE per slot' policy. A fresh 'free-tier' starts with 1 slot. Additional slots can be unlocked by increasing the subscription premium.

**Q: How is insufficient EVP handled during adoption?**

A: let's not overcomplicate this. The action is simply blocked. Classic game store mechanics.

**Q: What is the immediate state of the creature upon adoption?**

A: in the case of an active embryo, they just inherit whatever stage the embryo was in at. In the case of a seed-generated embryo, the growth value is randomly assigned -1 to 0, where 0 is birth (EMBRYO => INFANT)

**Q: Is species availability static or dynamic?**

A: that's what's EVP is for. Any embryo is available for adoption, with the only restricting factor being EVP cost

---

## Desired UX

We are planning for a no-frills adoption system:

- PLAYER can **only** choose the species, not the individual embryos
- embryos have an **adoption cost** in [^EVP] (most common species are 'freebies' and cost 0 EVP)
- PLAYER on free-tier [^free-tier] is locked out of the EVP pipeline, to incentivize paid-tier, thus turning free-tier into an unlimited demo version

---

[^entity]: a CREATURE is a type of [ENTITY](./entity.md) that is alive and goes through a lifecycle from birth to death[^permadeath]

[^permadeath]: once dead, a CREATURE stays dead. It remains in the database and in the gameworld while it decays through its decomposition stages until it runs out of traits to decompose, at which point it gets assimilated into its host entity — be it the local territory, an area, or the planet, whichever is closest.

[^EVP]: Evolution Points [EVP](./EVP.md)

[^free-tier]: Free-tier [subscription](./subscription.md)
