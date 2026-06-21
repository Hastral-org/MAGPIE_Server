# Codebase Concerns

**Analysis Date:** 2026-06-10

## Tech Debt

**Server Orchestrator (`SERVER.js`):**

- Issue: Massive "God Object" file (2000+ lines) handling routing, setup, and logic.
- Files: `SERVER.js`
- Impact: High cognitive load, difficult to maintain, and prone to merge conflicts.
- Fix approach: Decompose into a `routes/` directory and separate the server configuration from the event routing.

**Core Component Logic:**

- Issue: Large, monolithic functions that need decomposition.
- Files: `core/component.js`
- Impact: Hard to test and modify specific component behaviors.
- Fix approach: Break down large methods into smaller, single-responsibility functions.

**Database Implementation:**

- Issue: Hardcoded queries that need templating.
- Files: `core/database.js`
- Impact: Reduced flexibility and potential for SQL injection if not handled carefully.
- Fix approach: Implement a proper query builder or template system.

## Known Bugs

**JWT Security:**

- Symptoms: Potential vulnerabilities in the login flow.
- Files: `SERVER.js`
- Trigger: Login process.
- Workaround: None identified.

**Ecosystem Listing:**

- Symptoms: Missing or incomplete ecosystem list.
- Files: `SERVER.js`
- Trigger: Requesting ecosystem data.

## Security Considerations

**Authentication:**

- Risk: JWT implementation may have security gaps (marked as `@todo` in `SERVER.js`).
- Files: `SERVER.js`, `core/auth_util.js`
- Current mitigation: Basic JWT token usage.
- Recommendations: Audit the JWT signing and verification process; implement token rotation.

**API Rate Limiting:**

- Risk: Potential for DoS attacks on expensive endpoints.
- Files: `SERVER.js`
- Current mitigation: `express-rate-limit` is installed and used.

## Performance Bottlenecks

**Physics Calculations:**

- Problem: Complex 3D kinematics and geometric algebra may become a bottleneck as entity count increases.
- Files: `core/physics.js`
- Cause: High frequency of calculations per tick.
- Improvement path: Optimize math operations or move physics to a separate worker thread.

**Database I/O:**

- Problem: Synchronous SQLite calls can block the event loop.
- Files: `core/database.js`
- Cause: SQLite is fundamentally synchronous.
- Improvement path: The current `database_worker.js` approach is the correct mitigation; ensure all heavy queries use the worker.

## Fragile Areas

**Entity Physics Integration:**

- Files: `core/entity.js`, `core/physics.js`
- Why fragile: Tight coupling between entity state and physics calculations; many `@todo` markers regarding collision and inertia.
- Safe modification: Implement a more robust physics interface and use unit tests to verify movement logic.
- Test coverage: None.

## Scaling Limits

**In-Memory State:**

- Current capacity: Limited by Node.js heap size.
- Limit: When `data/states.js` grows too large, the server will crash or slow down.
- Scaling path: Move volatile state to Redis or a similar distributed cache.

## Dependencies at Risk

**Not detected.**

## Missing Critical Features

**Automated Testing:**

- Problem: Complete lack of unit or integration tests.
- Blocks: Safe refactoring of the "God Object" `SERVER.js` and core physics logic.

**Collision System:**

- Problem: Proper collision detection is marked as `@todo`.
- Files: `core/physics.js`
- Blocks: Realistic physical interactions in the game world.

## Test Coverage Gaps

**Core Engine:**

- What's not tested: Physics, Entity lifecycle, Database workers.
- Files: `core/*.js`
- Risk: High. Regression in physics or DB logic could corrupt game state.
- Priority: High.

---

*Concerns audit: 2026-06-10.*
