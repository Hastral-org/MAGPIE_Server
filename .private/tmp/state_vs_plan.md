---
type: Alignment Analysis
date: 2026-06-13
source: handoff_vs_codebase.md vs prototype_0_40_0_plan.md
status: STEP-1.3 Output
---

# State vs. Master Plan Alignment (v0.40.0)

**Document Purpose:** To compare the current implementation trajectory (Handoff + Codebase) against the overarching strategic goals defined in the Master Plan (`prototype_0_40_0_plan.md`).

**Analysis Date:** 2026-06-13

---

## 1. High-Level Alignment

Overall, the **Handoff** document is highly aligned with the core structural requirements of the **Master Plan**.

| Strategic Pillar | Master Plan Requirement | Handoff/Codebase State | Alignment |
| :--- | :--- | :--- | :--- |
| **Stack** | Node.js, Express, Socket.io, Better-sqlite3 | Successfully integrated and locked (Phase 1 complete). | 🟢 Perfect |
| **Password Security** | Use `scrypt` for password hashing. | Handoff mandates `scrypt`. Codebase still needs the implementation (Task 1.1). | 🟡 Pending Code |
| **Email Privacy** | Dual-Column: HMAC-SHA256 (Hash) + AES-256-GCM (Encrypted). | Handoff maps to this exactly. Codebase has structural bugs preventing it from working. | 🟡 Pending Code |
| **Env Management** | Process configs via `.env` to App Config. | Successfully transitioned to native `--env-file=.env`. | 🟢 Perfect |

---

## 2. Gaps Discovered in the Master Plan

The **Handoff document** contains several critical features and security patches that are currently *missing* from the formal **Master Plan**. To ensure the Master Plan accurately represents v0.40.0, the following items must be retroactively added to it:

### A. Handshake Gatekeeping & Connection Security

The Master Plan currently lacks documentation on how socket connections are secured against spam and rapid reconnections.

* **Missing from Plan:** The "Ephemeral vs. Absolute Security Zones" concept.
* **Missing from Plan:** The 10-second grace period (Anti-F5 spam) utilizing a `Map` for disconnect timers and `Set` for active cache.

### B. Game Metrics & UI Scaffolding

The Handoff mandates a visual visitor counter and database metrics, which are completely absent from the Master Plan's specification.

* **Missing from Plan:** `game_metrics` database table schema.
* **Missing from Plan:** RetroOdometer UI class, 7-digit slot structure, and `image-rendering: pixelated` requirements for the frontend.

### C. Cryptographic Integrity Checks

* **Missing from Plan:** Explicit requirement to use `crypto.timingSafeEqual()` to prevent timing attacks during password verification. (The plan mentions `scrypt` but not the verification mechanism).

---

## 3. The Path Forward (STEP-2.1)

The codebase is currently trailing behind the Master Plan in cryptographic implementation, while the Master Plan is trailing behind the Handoff in terms of operational security and metrics.

**Extrapolating the Final Tasklist:**
To achieve the v0.40.0 prototype, we must merge these contexts. The final task list will prioritize:

1. **Fixing the Codebase:** Implementing the buggy/missing crypto functions (`scrypt`, `timingSafeEqual`, hex bugs).
2. **Expanding the Codebase:** Building the Handshake Gatekeeping and Metrics features demanded by the Handoff.
3. **Updating the Master Plan:** Backporting the metrics, UI, and handshake concepts into `prototype_0_40_0_plan.md`.

---
**Status:** STEP-1.3 Complete. Ready to formulate the final tasklist (STEP-2.1) and update the master plan (STEP-2.2).
