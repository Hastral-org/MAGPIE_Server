# Brainstorming Scratchpad: Creature Adoption System

Date: 2026-06-24
Target Spec: [adoption](./adoption.md)

## Q&A History

Q: How does the PLAYER choose the species?
A: list of available species taken fromdirectly from the database via a specific query

Q: How is the adoption cost determined for non-free species?
A: varies based on rarity and ecosystem impact of the species (.e.g an apex predator will likely have an high impact on the ecosystem, so, it will increase the cost of the embryos)

Q: How is the individual embryo determined once the species is chosen?
A: we will implement a seed-based population manager that generates the population on demand from the single encompassing entity using the seed and the species params, then updates the seed when changes are made to the population and compress it back to a single entity to save server resources. So, while it is technically generated on demand, it is intended to emulate an actual living population. The actual choice of embryo to grant to the player  prioritizes the embryo currently loaded in memory, which are most likely the offspring of the creatures of other players. This is a weighted dice that favours player-associated embryos. To recap, on adoption confirm: - create a pool by aggregating currently active embryos + decompress the entity of the selected species and filter by embryo, then, weighted-dice favoring active embryos => entityID => player adopt entityID, then, cleanup (compress species entity etc)

Q: What specific constraints does the 'free-tier' subscription impose on the adoption process?
A: answeer is in the markdown footnotes

Q: Are there limits on the number of adoptions for a free-tier player?
A: I said: the answer is in the [^free-tier] footnote. It directs to subscription.md, which already has the answer
Q: How is insufficient EVP handled during adoption?
A: let's not overcomplicate this. The action is simply blocked. Classic game store mechanics.
Q: What is the immediate state of the creature upon adoption?
A: in the case of an active embryo, they just inherit whatever stage the embryo was in at. In the case of a seed-generated embryo, the growth value is randomly assigned -1 to 0, where 0 is birth (EMBRYO => INFANT)
Q: Is species availability static or dynamic?
A: that's what's EVP is for. Any embryo is available for adoption, with the only restricting factor being EVP cost
