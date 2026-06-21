---
type: Gap Analysis
date: 2026-06-13
source: 20260612_handoff.md vs STRUCTURAL_ANALYSIS.md
status: STEP-1.2 Comparison Output
---

# Handoff vs Codebase: Gap Analysis

**Document Purpose:** Compare the requirements in `20260612_handoff.md` against the current state documented in `STRUCTURAL_ANALYSIS.md`.

**Analysis Date:** 2026-06-13
**Codebase Version:** 0.39.4

---

## Executive Summary

| Phase | Status | Details |
| --- | --- | --- |
| PHASE 1 | 100% Done | Stack manifest locked; env handling uses `--env-file` flag |
| PHASE 2 | 33% Done | Security concepts documented; 5 crypto bugs found |
| PHASE 3 | 12% Done | 4 tasks defined; 0 implemented |
| Overall | 33% Complete | Core architecture sound; security fixes + features needed |

---

## PHASE 1: STACK MANIFEST & PROCESS CONFIGURATION

### Requirement: Locked Four-Piece Dependency Manifest

| Dependency | Status | Notes |
| --- | --- | --- |
| better-sqlite3 | Done | Integrated; src/database.js + database_worker.js with WAL mode |
| socket.io | Done | v4.2.0 installed; SERVER.js orchestration working |
| jsonwebtoken | Done | JWT generation + verification in src/services/crypto.js |
| crypto (native) | Partial | Imported but buggy; 5 implementation errors identified |

### Sub-requirement: Remove dotenv References

**Handoff Says:**
> "Remove any references to the third-party `dotenv` package from `package.json` and code headers."

**Codebase State:**

- package.json does NOT list dotenv as a dependency
- No require('dotenv') calls found in code
- **Status:** DONE

### Sub-requirement: Native Environment Variable Loading via `--env-file` Flag

**Handoff Says:**

```powershell
node --env-file=.env SERVER.js
```

**Codebase State:**

- Current: run_server.ps1 correctly launches via `node --env-file=.env SERVER.js`
- **Status:** DONE

---

## PHASE 2: SECURITY & CRYPTOGRAPHIC CONCEPTS

### Requirement 1: Constant-Time Verification

**Handoff Says:**
> Update verifyPassword() to use crypto.timingSafeEqual(bufferA, bufferB) instead of ===

**Codebase State:**

- File: src/services/crypto.js
- Current: Using string comparison (===) for password verification
- **Status:** PENDING (TIMING ATTACK VULNERABLE)

---

### Requirement 2: Blind-Indexing Emails (Dual-Column Strategy)

**Handoff Says:**

1. Column A (email_hash): HMAC-SHA256 with static HASH_SALT for O(1) lookups
2. Column B (email_encrypted): AES-256-GCM with unique IV per encryption

**Codebase State:**

- Functions exist: hashKey() and encryptEmail() / decryptEmail()
- **5 Implementation Bugs Found:**

| Bug | Location | Issue | Fix |
| --- | --- | --- | --- |
| 1 | encryptEmail() | Typo: "hec" instead of "hex" | Change to "hex" |
| 2 | decryptEmail() | Wrong variable: authTagHex assigned from ivHex | Use authTagHex correctly |
| 3 | hashKey() | Reference error: undefined method | Use crypto.randomBytes() |
| 4 | verifyPassword() | String comparison (===) used | Use crypto.timingSafeEqual() |
| 5 | Password storage | Missing salt:hash format | Verify salt_hex:hash_hex format |

**Status:** BUGGY — Concepts present; implementation broken

---

### Requirement 3: Handshake Gatekeeping & Ephemeral vs. Absolute Security

**Handoff Says:**

1. The Gate: Socket.io auth handshake with JWT + db lookup
2. The Ephemeral Zone: High-frequency events use in-memory socket.role
3. The Absolute Zone: Low-frequency ops check live db row

**Codebase State:**

- Handler registration exists but gatekeeping logic incomplete
- No explicit grace period or absolute zone enforcement found
- **Status:** PARTIAL

---

## PHASE 3: STEP-BY-STEP SOURCE INTEGRATION REFACTOR

### Task 1: Refactor Cryptographic Operations

**Target File:** src/services/crypto.js

| Sub-task | Requirement | Status |
| --- | --- | --- |
| 1.1 | Use crypto.scrypt with 16-byte salt; store as salt_hex:hash_hex | Review Needed |
| 1.2 | Update verifyPassword() to use crypto.timingSafeEqual() | Pending |
| 1.3 | Fix encryptEmail() typo: "hec" to "hex" | Pending |
| 1.4 | Fix decryptEmail() bug: use authTagHex not ivHex | Pending |
| 1.5 | Fix hashKey() reference error | Pending |

**Overall Status:** PENDING
**Estimated Effort:** 30 mins

---

### Task 2: Implement Metric Scaffolding

**Target File:** handlers/session.js

| Sub-task | Requirement | Status |
| --- | --- | --- |
| 2.1 | Connect to server.db via MAGPIE_DATABASE.sync | TBD |
| 2.2 | Create game_metrics table with schema | Pending |
| 2.3 | Pre-populate metrics: visitor_count, peak_concurrent_players | Pending |
| 2.4 | Provide helper queries for read + atomic increment | Pending |

**Overall Status:** PENDING
**Estimated Effort:** 1 hour

---

### Task 3: Secure Handshake Handling & Anti-F5 Spam Memory

**Target File:** handlers/account.js

| Sub-task | Requirement | Status |
| --- | --- | --- |
| 3.1 | Implement active user cache (Set) + disconnect timer (Map) | Pending |
| 3.2 | 10-second grace period on disconnect; cancel on reconnect | Pending |
| 3.3 | New user: increment visitor_count; broadcast counter-update | Pending |
| 3.4 | Returning user: skip db increment; send current count | Pending |
| 3.5 | Support multi-device access via server.session.players map | Review Needed |
| 3.6 | Join connection into private room: socket.join('account:...') | Review Needed |

**Overall Status:** PENDING
**Estimated Effort:** 1.5 hours

---

### Task 4: UI Presentation Layer Refactor

**Target Files:** public/home.css & public/main.js

| Sub-task | Requirement | Status |
| --- | --- | --- |
| 4.1 | Build RetroOdometer JavaScript class | Pending |
| 4.2 | Check localStorage.getItem("has_been_counted"); avoid double-counting | Pending |
| 4.3 | 7-digit slot structure with vertical ribbon (0-9 columns) | Pending |
| 4.4 | Animate on counter-update event with smooth CSS transition | Pending |
| 4.5 | Apply retro pixel-art rendering: image-rendering: pixelated | Pending |

**Overall Status:** PENDING
**Estimated Effort:** 2 hours

---

## Implementation Priority Matrix

| Phase | Task | Effort | Impact | Priority | Blocker |
| --- | --- | --- | --- | --- | --- |
| 2 | Crypto Bugs | 0.5h | Critical | P0 | Yes |
| 3 | Handshake Security | 1.5h | Critical | P0 | Yes |
| 3 | Metric Scaffolding | 1h | Medium | P1 | No |
| 3 | UI Odometer | 2h | Low | P2 | No |

---

## Key Misalignments & Concerns

### 1. Critical: Timing Attack Vulnerability

- Handoff requires crypto.timingSafeEqual() for password comparison
- Current code uses string === comparison
- **Risk:** Character-by-character password guessing via timing analysis
- **Action:** PHASE 3 Task 1.2 — HIGHEST PRIORITY

### 2. Critical: Email Encryption Bugs

- 3 bugs in crypto functions will cause runtime errors
- Dual-column strategy cannot be deployed until fixed
- **Action:** PHASE 3 Task 1 — HIGHEST PRIORITY

### 3. Incomplete: Handshake Gatekeeping

- Ephemeral vs. Absolute security zones not clearly implemented
- Grace period logic missing (F5 spam protection)
- **Action:** PHASE 3 Task 3 — HIGH PRIORITY

### 4. Missing: Metrics Infrastructure

- No game_metrics table
- Visitor counter not wired to database
- Retro odometer UI incomplete
- **Action:** PHASE 3 Tasks 2 & 4 — MEDIUM PRIORITY

### 5. Inconsistency: File Structure References

- Handoff references old structure (core/)
- Codebase is in src/
- Blueprint has been corrected
- **Status:** Minor; doesn't block implementation

---

## Next Steps (STEP-1.3)

This gap analysis will be combined with the master plan (prototype_0_40_0_plan.md) to produce a unified roadmap:

1. **STEP-1.3:** Compare HANDOFF + CODEBASE against MASTER PLAN
2. **STEP-2.1:** Extrapolate comprehensive new tasklist
3. **STEP-2.2:** Update prototype_0_40_0_plan.md with unified plan

---

## Summary Table: Handoff Coverage

| Phase | Complete | Partial | Pending | Coverage |
| --- | --- | --- | --- | --- |
| 1 | 5/5 | 0/5 | 0/5 | 100% |
| 2 | 0/3 | 1/3 | 2/3 | 33% |
| 3 | 0/16 | 2/16 | 14/16 | 12% |
| TOTAL | 5/24 | 3/24 | 16/24 | 37% |

**Interpretation:** Approximately 37% of handoff requirements are in place; the remainder require new work or bug fixes.
