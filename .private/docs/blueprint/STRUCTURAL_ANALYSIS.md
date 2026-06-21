---
type: Blueprint Analysis
date: 2026-06-13
status: Current State (Updated from 0.39.4)
---

# MAGPIE Server Structural Analysis

**Analysis Date:** 2026-06-13
**Project Version:** 0.39.4
**Analysis Scope:** Current physical and architectural state

## Table of contents {#top}

- [MAGPIE Server Structural Analysis](#magpie-server-structural-analysis)
  - [Table of contents {#top}](#table-of-contents-top)
  - [1. DIRECTORY STRUCTURE \& ORGANIZATION](#1-directory-structure--organization)
    - [1.1 Physical Layout](#11-physical-layout)
    - [1.2 Scalability Observations](#12-scalability-observations)
  - [2. ARCHITECTURAL PATTERNS](#2-architectural-patterns)
    - [2.1 Overall Architecture](#21-overall-architecture)
    - [2.2 Key Integration Seams](#22-key-integration-seams)
    - [2.3 Data Flow: Account Registration Example](#23-data-flow-account-registration-example)
    - [2.4 Architectural Gaps \& Inconsistencies](#24-architectural-gaps--inconsistencies)
  - [3. TECHNOLOGY STACK \& INTEGRATION POINTS](#3-technology-stack--integration-points)
    - [3.1 Tech Stack](#31-tech-stack)
    - [3.2 Integration Points](#32-integration-points)
    - [3.3 Environment Configuration](#33-environment-configuration)
  - [4. CODE QUALITY OBSERVATIONS](#4-code-quality-observations)
    - [4.1 Naming Conventions](#41-naming-conventions)
    - [4.2 Async Patterns](#42-async-patterns)
    - [4.3 Error Handling](#43-error-handling)
    - [4.4 Logging](#44-logging)
    - [4.5 Type Safety \& Documentation](#45-type-safety--documentation)
    - [4.6 Testing](#46-testing)
    - [4.7 Code Organization \& Decomposition](#47-code-organization--decomposition)
    - [4.8 Security Observations](#48-security-observations)
  - [5. IMPLEMENTATION SEAMS \& EXTENSION POINTS](#5-implementation-seams--extension-points)
    - [5.1 Where to Add New Code](#51-where-to-add-new-code)
    - [5.2 Known Constraints](#52-known-constraints)
  - [6. SUMMARY TABLE: STRUCTURE vs. SPECIFICATION](#6-summary-table-structure-vs-specification)
  - [7. RECOMMENDED NEXT STEPS](#7-recommended-next-steps)

[Back to top ⤴️](#top)

---

## 1. DIRECTORY STRUCTURE & ORGANIZATION

### 1.1 Physical Layout

The project follows a **layered, event-driven modular structure** with clear separation between networking, event handling, core logic, and data persistence:

```markdown
MAGPIE_Server/
├── .private/                  # Private documentation and internal tools
│   ├── docs/blueprint/        # Architecture blueprints (this analysis)
│   ├── docs/spec/             # Formal specifications (entity, system, security)
│   └── scripts/               # Internal utility scripts
├── config/                    # Server configuration
│   └── server_config.js       # Config loader (reads process.env)
├── src/                       # **Core application logic**
│   ├── index.js               # Bootstrap and dependency registry
│   ├── system.js              # System utilities, logging, HIVE, METASTATE
│   ├── physics.js             # 3D kinematics, rotors, geometric algebra
│   ├── entity.js              # Entity lifecycle, stats, behaviors
│   ├── player.js              # Player entity specialization
│   ├── component.js           # Component registry (STATE, EMOTE, EXP, etc.)
│   ├── database.js            # SQLite wrapper with worker-thread integration
│   ├── services/              # Utility services
│   │   ├── crypto.js          # Email encryption, password hashing, key management
│   │   ├── database_worker.js # Worker thread for non-blocking DB operations
│   │   ├── fsio.js            # File system I/O utilities
│   │   └── mailer.js          # Email delivery (Nodemailer + SendGrid)
│   └── plugins/               # Extensible plugin system
│       └── scratchpad.js      # Development/debugging plugin
├── handlers/                  # **Network event handlers (Socket.io middleware)**
│   ├── account.js             # Account registration, verification, login
│   ├── players.js             # Player socket connection, session management
│   ├── entities.js            # Entity subscription and state sync
│   ├── client.js              # Client connection setup
│   ├── session.js             # Session management
│   └── email_api.js           # Email API routes
├── data/                      # Static game data and enumerators
│   ├── states.js              # State type definitions
│   ├── components.js          # Component type definitions
│   ├── emotes.js              # Emote enumerator
│   └── entity_types.js        # Entity type enumerator
├── db/                        # SQLite database files
│   ├── server.db              # Authentication, accounts, sessions
│   └── world.db               # Entities, world state, relationships
├── logs/                      # Runtime console and error logs
├── public/                    # Static web assets
│   ├── index.html             # Homepage and Socket.io test client
│   ├── main.js                # Client-side Socket.io code
│   ├── home.css               # Homepage styles
│   └── SEtitle.png            # Branding assets
├── plugins/                   # Legacy plugin directory (see src/plugins/)
│   └── scratchpad.js          # Symlinked to src/plugins/scratchpad.js
├── scripts/                   # Shell scripts for deployment
│   ├── start.sh               # Production startup
│   ├── monitor.sh             # Server monitoring
│   ├── throttle_node.sh       # Resource throttling
│   └── update.sh              # Deployment update
├── SERVER.js                  # **Entry point and main orchestrator**
├── package.json               # Dependencies and metadata
├── run_server.ps1             # PowerShell startup script (Windows)
├── run_server.sh              # Bash startup script (Unix)
└── README.md                  # Project documentation
```

[Back to top ⤴️](#top)

---

### 1.2 Scalability Observations

**Positive (supports scaling):**

- Worker threads for DB isolation (`database_worker.js`) prevents event-loop blocking
- WAL (Write-Ahead Logging) mode in SQLite enables concurrent reads/writes
- Socket.io rooms for entity/player subscriptions allow targeted broadcasts
- Service layer isolation (crypto, mailer, fsio) enables independent scaling

**Constraints (limit current scaling):**

- Single `MAGPIE_SERVER` global registry — no horizontal scaling support (state isn't distributed)
- All entity physics computed on main thread — CPU-bound bottleneck at entity count > ~500
- In-memory `MAGPIE_HIVE` (entity container) reloaded per boot — no persistence of runtime state
- Database worker queue (`_pending` Map) can accumulate if DB queries back up
- No explicit clustering or load-balancing layer

[Back to top ⤴️](#top)

---

## 2. ARCHITECTURAL PATTERNS

### 2.1 Overall Architecture

**Pattern Name:** Modular Event-Driven Architecture with Worker Thread Isolation

```markdown
CLIENT (Socket.io)
    │
    ▼
┌─────────────────────────────────────────────────────────┐
│         NETWORK LAYER (SERVER.js)                       │
│  - Express static server                                │
│  - Socket.io server + admin-ui                          │
│  - JWT authentication middleware                        │
│  - Rate limiting                                        │
└────────────────┬────────────────────────────────────────┘
                 │
                 ▼ (io.on("connection"))
┌─────────────────────────────────────────────────────────┐
│    HANDLER LAYER (handlers/*.js)                        │
│  - account.js: registration, login, verification       │
│  - players.js: player session management               │
│  - entities.js: entity subscriptions                   │
│  - client.js: initial socket setup                     │
│  - session.js: session lifecycle                       │
│  - email_api.js: email endpoints                       │
└────────────────┬────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────┐
│       CORE ENGINE LAYER (src/*.js)                      │
│  ┌──────────────────────────────────────────────────┐  │
│  │ SYSTEM (src/system.js)                           │  │
│  │  - Logging, timing, event emission               │  │
│  │  - HIVE: entity container & lifecycle            │  │
│  │  - RUNTIME: layer management                     │  │
│  │  - METASTATE: global state tracking              │  │
│  └──────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────┐  │
│  │ PHYSICS (src/physics.js)                         │  │
│  │  - 3D kinematics, rotors, geodetic math          │  │
│  │  - Movement, collision, targeting                │  │
│  └──────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────┐  │
│  │ ENTITY (src/entity.js)                           │  │
│  │  - Entity lifecycle, stats, components           │  │
│  │  - Action processing, state mutations            │  │
│  └──────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────┐  │
│  │ PLAYER (src/player.js)                           │  │
│  │  - Player-specific behaviors & permissions       │  │
│  │  - Account linking, session state                │  │
│  └──────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────┐  │
│  │ DATABASE (src/database.js)                       │  │
│  │  - Async DB calls via worker_threads             │  │
│  │  - Promise-based interface (call method)         │  │
│  │  - Caches pending requests in Map                │  │
│  └──────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────┐  │
│  │ COMPONENT (src/component.js)                     │  │
│  │  - Component registry (STATE, EMOTE, EXP, etc)   │  │
│  │  - Attribute system, contextual data             │  │
│  └──────────────────────────────────────────────────┘  │
└────────────────┬────────────────────────────────────────┘
                 │
    ┌────────────┼────────────┐
    ▼            ▼            ▼
┌──────────┐ ┌─────────┐ ┌────────┐
│SERVICES  │ │ DATA    │ │DATABASE│
│crypto.js │ │states.js│ │*.db    │
│mailer.js │ │comps.js │ │(WAL)   │
│fsio.js   │ │emotes.js│ └────────┘
└──────────┘ └─────────┘
```

[Back to top ⤴️](#top)

---

### 2.2 Key Integration Seams

**Seam 1: Handler → Core Logic:**

**File:** `handlers/players.js` (lines 1-50)

```javascript
// Handler receives socket event
socket.on("player_action", (payload) => {
    if (player) player.processAction(payload);  // ← Delegate to entity
});
```

**Flow:**

1. Socket event arrives at handler
2. Handler retrieves entity from HIVE
3. Handler calls entity method (`processAction`, `setOnline`, etc.)
4. Entity updates internal state and may emit to HIVE

**Pattern:** Handlers are thin adapters; they **validate, route, and delegate** to core logic.

[Back to top ⤴️](#top)

---

**Seam 2: Core Engine → Database (Worker Thread):**

**File:** `src/database.js` (lines 60–85)

```javascript
MAGPIE_DATABASE.worker = new Worker("./src/services/database_worker.js");
MAGPIE_DATABASE.call = function call(method, ...args) {
    const requestID = Date.now() + Math.floor(Math.random() * 10000000);
    return new Promise((resolve, reject) => {
        if(MAGPIE_DATABASE._pending.has(requestID)) console.error("collision!");
        MAGPIE_DATABASE._pending.set(requestID, { resolve, reject });
        MAGPIE_DATABASE.worker.postMessage({ method, args, requestID });
    });
};
```

**Flow:**

1. Core code calls `MAGPIE_DATABASE.call(methodName, ...args)`
2. Main thread posts message to worker thread
3. Worker thread executes SQLite operation (non-blocking)
4. Worker thread returns result via `parentPort.postMessage`
5. Main thread resolves Promise and cleans up `_pending` Map

**Pattern:** Async task queue. Requests are serialized in a pending map. Results are correlation via `requestID`.

[Back to top ⤴️](#top)

---

**Seam 3: Handlers Register Dynamically on Connection:**

**File:** `SERVER.js` (lines 300-330)

```javascript
// Dynamic handler registration
fs.readdirSync(MAGPIE_SERVER.SYSTEM._handlersPath)
    .forEach(file => {
        const handler = require(path.join(MAGPIE_SERVER.SYSTEM._handlersPath, file))
        const handlerName = path.parse(file)
        MAGPIE_SERVER.handlers[handlerName] = handler
    })

// On socket connection, invoke each handler
io.on("connection", (socket) => {
    Object.values(MAGPIE_SERVER.handlers).forEach(handler => {
        if(typeof handler === "function")
            handler(io, socket, MAGPIE_SERVER)  // ← Handler registers its own events
    })
})
```

**Pattern:** **Dependency Injection.** Each handler is a function that receives `(io, socket, server)` and wires itself into the socket's event listeners. This allows handlers to operate independently and be added/removed without modifying `SERVER.js`.

[Back to top ⤴️](#top)

---

### 2.3 Data Flow: Account Registration Example

```markdown
CLIENT: emit("register", { username, password, email })
    │
    ▼
HANDLER: account.register()
    │
    ├─→ hashPassword() [crypto service]
    │
    ├─→ jwt.sign() with token config
    │
    └─→ mailer.sendConfirmation()
        │
        └─→ nodemailer.sendMail()
            │
            └─→ Email delivery (Gmail/SendGrid)

CLIENT: receives "REGISTER_AWAITING_VERIFICATION"
    │
    ▼
CLIENT: clicks email verification link
    │
    ▼
HTTP GET: /verify?token=<jwt>
    │
    ▼
HANDLER: account.verify()
    │
    ├─→ jwt.verify() to decode token
    │
    ├─→ MAGPIE_DATABASE.call("createAccount", ...)
    │
    └─→ database_worker.js executes SQL INSERT (non-blocking)

DATABASE: INSERT INTO accounts ...
    │
    ▼
HANDLER: returns "ACCOUNT_CREATED"
    │
    ▼
CLIENT: redirected to login
```

[Back to top ⤴️](#top)

---

### 2.4 Architectural Gaps & Inconsistencies

| Gap                                                 | Location                            | Impact                                                                                            | Recommendation                                                                              |
|-----------------------------------------------------|-------------------------------------|---------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------|
| **No service abstraction for handlers**             | `handlers/*.js`                     | Handlers directly import and call services; tight coupling makes testing harder                   | Create a `HandlerService` class that encapsulates handler dependencies                      |
| **Entity HIVE not persisted**                       | `src/system.js` HIVE                | Entities loaded only at boot; state lost on crash; no recovery mechanism                          | Add snapshot/checkpoint system to persist HIVE state to `world.db` before shutdown          |
| **Database request collision detection incomplete** | `src/database.js` line 62           | Collision detection logs but doesn't fail; could mask race conditions                             | Change to `throw` on collision instead of silent error                                      |
| **Handler registration naming inconsistency**       | `SERVER.js` line 260                | Handlers use inconsistent naming (account.js vs email_api.js); some don't follow "Handler" suffix | Standardize handler exports to be functions matching pattern `(io, socket, server) => void` |
| **No error recovery in worker thread**              | `src/services/database_worker.js`   | If worker crashes, pending requests hang indefinitely                                             | Implement worker restart logic with exponential backoff                                     |
| **Circular dependency potential**                   | `src/database.js` + `src/player.js` | Both import each other indirectly through `src/index.js`                                          | Audit imports to remove cycles; consider explicit dependency graph                          |
| **Magic string event names**                        | `handlers/*.js`, `SERVER.js`        | Socket event names scattered throughout (e.g., "player_action", "subscribe_entity")               | Create centralized event enum or constant file                                              |

[Back to top ⤴️](#top)

---

## 3. TECHNOLOGY STACK & INTEGRATION POINTS

### 3.1 Tech Stack

| Layer                 | Technology                | Version        | Purpose                                            |
|-----------------------|---------------------------|----------------|----------------------------------------------------|
| **Runtime**           | Node.js                   | (unpinned)     | JavaScript execution                               |
| **Package Manager**   | npm                       | (unpinned)     | Dependency management                              |
| **Web Server**        | Express                   | 5.2.1          | HTTP server, static file serving, route handling   |
| **Real-time**         | Socket.io                 | 4.2.0          | Bidirectional WebSocket + fallback (polling)       |
| **Admin UI**          | @socket.io/admin-ui       | 0.5.1          | Socket.io monitoring dashboard                     |
| **Database**          | better-sqlite3            | 12.9.0         | Synchronous SQLite wrapper (used in worker thread) |
| **Authentication**    | jsonwebtoken              | 9.0.3          | JWT token creation and verification                |
| **Email**             | nodemailer                | 8.0.10         | Email delivery via SMTP (Gmail/SendGrid)           |
| **Rate Limiting**     | express-rate-limit        | 8.5.1          | HTTP request throttling                            |
| **CLI Tools**         | cli-progress, cli-spinner | 3.12.0, 0.2.10 | Terminal progress bars and spinners                |
| **Geometric Algebra** | ganja.js                  | 1.0.204        | Rotor math for 3D physics (experimental)           |

### 3.2 Integration Points

**Express + Static Files:**

`SERVER.js` lines 280-290:

```javascript
const static = MAGPIE_SERVER.PATH.join(process.cwd(), "public")
app.use(express.static(static))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
```

**Point:** `/public/` directory served at `/` (root). Any changes to static files are immediately available.

---

**Socket.io + Handlers:**

`SERVER.js` lines 340–360:

```javascript
io.on("connection", (socket) => {
    Object.values(MAGPIE_SERVER.handlers).forEach(handler => {
        handler(io, socket, MAGPIE_SERVER)  // Each handler registers its events
    })
})
```

**Point:** Handlers are independent modules. Adding a new handler is as simple as creating a file in `handlers/` that exports `(io, socket, server) => { /* register events */ }`.

[Back to top ⤴️](#top)

---

**JWT Token Flow:**

`handlers/account.js` lines 1–30:

```javascript
const pendingRegistrationToken = jwt.sign({
    username, PASS: securedPassword, email, isRegistrationToken: true
}, server.config.jwtSecret, { expiresIn: server.config.jwtExpire })
```

**Point:** Tokens are signed with `jwtSecret` from env and expire after `jwtExpire` seconds (default: "15" → 15 seconds).

[Back to top ⤴️](#top)

---

**Email Delivery (Nodemailer):**

`src/services/mailer.js` lines 1–20:

```javascript
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",  // or SendGrid
    port: 587,
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
})

module.exports = {
    sendConfirmation: async (toEmail, token) => {
        await transporter.sendMail({
            from: `'Shelder Evolution' <${MAGPIE.KEY.SERVER.NO_REPLY}>`,
            to: toEmail,
            subject: "Activate your Shelder Evolution account 🪐",
            html: `<a href="${link}">${link}</a>`
        })
    }
}
```

**Point:** Email credentials come from `process.env` (`.env` file). Emails are HTML-formatted with verification links.

[Back to top ⤴️](#top)

---

**Database Worker Thread:**

`src/database.js` + `src/services/database_worker.js`:

```javascript
// Main thread
const result = await MAGPIE_DATABASE.call("loginPlayer", email, password)

// Worker thread (database_worker.js)
parentPort.on("message", async ({ method, args, requestID }) => {
    const result = await worker[method](...args)  // Execute DB method
    parentPort.postMessage({ requestID, result })
})
```

**Point:** All SQLite calls are async via worker thread. Main thread never blocks on disk I/O.

---

### 3.3 Environment Configuration

**File:** `config/server_config.js`

```javascript
module.exports = {
    PORT: process.env.PORT,
    jwtSecret: process.env.jwtSecret,
    jwtExpire: "15",
    domain: process.env.domain,
    NODE_ENV: process.env.isProduction ? true : false,
    EMAIL_MASTER_KEY: process.env.EMAIL_MASTER_KEY,
    HASH_SALT: process.env.HASH_SALT,
    // ... 10+ more keys from .env
}
```

**Required env variables:**

- `PORT` — Server listening port
- `jwtSecret` — Secret for signing JWTs
- `domain` — Domain used in email links (e.g., `https://example.com`)
- `EMAIL_USER`, `EMAIL_PASS` — SMTP credentials
- `EMAIL_MASTER_KEY` — AES-256 key for encrypting emails (32 bytes, hex-encoded)
- `HASH_SALT` — Salt for email hashing (32 bytes)

[Back to top ⤴️](#top)

---

## 4. CODE QUALITY OBSERVATIONS

### 4.1 Naming Conventions

**Actual Patterns (as observed in code):**

| Category                   | Pattern         | Examples                                                      |
|----------------------------|-----------------|---------------------------------------------------------------|
| **Entry Points**           | UPPERCASE       | `SERVER.js`, `MAGPIE_SERVER`                                  |
| **Classes (Constructors)** | UPPERCASE_SNAKE | `MAGPIE_ENTITY`, `MAGPIE_PLAYER`, `MAGPIE_DATABASE`           |
| **Service Objects**        | UPPERCASE_SNAKE | `MAGPIE_SYSTEM`, `MAGPIE_HIVE`, `MAGPIE_IO`                   |
| **Module Files**           | camelCase       | `crypto.js`, `mailer.js`, `fsio.js`                           |
| **Handler Files**          | camelCase       | `account.js`, `players.js`, `entities.js`                     |
| **Data Files**             | camelCase       | `states.js`, `components.js`, `emotes.js`                     |
| **Functions**              | camelCase       | `hashPassword()`, `verifyPassword()`, `encryptEmail()`        |
| **Local Vars**             | camelCase       | `requestID`, `playerID`, `socket`                             |
| **Constants**              | UPPERCASE_SNAKE | `HASH_SALT`, `EMAIL_KEY`, `ePrefix` (error prefix)            |
| **Private/Internal**       | `_prefixed`     | `_pending` (Map), `_get_player()`, `_target_queue_geodetic()` |

**Consistency Issues:**

- Some files use `_snake_case` (e.g., `database_worker.js`, `database_worker()`) while others use `camelCase`
- Prefix convention not enforced (some error prefixes use `ePrefix`, others `errorPrefix`)
- Handler functions not consistently named (some export objects with methods, others export functions directly)

[Back to top ⤴️](#top)

---

### 4.2 Async Patterns

**Good (Non-blocking):**

```javascript
// Database calls via worker thread (non-blocking)
const result = await MAGPIE_DATABASE.call("loginPlayer", email, password)

// Email delivery (async)
await mailer.sendConfirmation(email, token)

// Password hashing (async, uses bcryptjs)
const securedPassword = await hashPassword(password)
```

**Fragile (Can block event loop):**

```javascript
// Large file reads in synchronous context
const static = MAGPIE_SERVER.PATH.join(process.cwd(), "public")
app.use(express.static(static))  // ← Synchronous stat on every request until cached

// Worker thread postMessage is sync but can queue up if not awaited
MAGPIE_DATABASE.worker.postMessage({ method, args, requestID })
```

[Back to top ⤴️](#top)

---

### 4.3 Error Handling

**Pattern 1: Try-Catch in Handlers:**

`handlers/account.js` lines 13–50:

```javascript
account.register = async function(data, socket, server) {
    try {
        // ... business logic
        socket.emit("REGISTER_AWAITING_VERIFICATION", { email })
    }
    catch(e) {
        server.error(ePrefix + e.message, e)
        socket.emit("REGISTER_ERROR", { message: e.message })
    }
}
```

**Good:** Error caught and sent to client
**Gap:** No retry logic; no error categorization (user error vs. system error)

[Back to top ⤴️](#top)

---

**Pattern 2: Worker Thread Error Handling:**

`src/services/database_worker.js` lines 50–65:

```javascript
parentPort.on("message", async ({ method, args = [], requestID }) => {
    try {
        if(!worker[method]) throw new Error(`[DATABASE WORKER].${method} is invalid method`)
        const result = await worker[method](...args)
        parentPort.postMessage({ requestID, result })
    }
    catch(e) {
        console.error("[DATABASE WORKER ERROR]: ", e)
        parentPort.postMessage({ requestID, error: e.message })
    }
})
```

**Good:** Errors propagated back to main thread
**Gap:** If `postMessage` fails, pending request hangs forever

[Back to top ⤴️](#top)

---

### 4.4 Logging

**Custom Implementation:**

`SERVER.js` + `src/system.js` define:

```javascript
MAGPIE_SERVER.log = function(message, target = "file", timestamp = true) { ... }
MAGPIE_SERVER.error = function(message, errorObj) { ... }
```

**Outputs to:**

- `logs/console{YYYYMMDD}.log` — Console output
- `logs/error{YYYYMMDD}.log` — Error output
- `console.log/error` — Stdout (visible in terminal)

**Example Log Pattern:**

```log
[HTTP REQUEST] GET /
[SOCKET-abc123def] connected
[PLAYER-42] connected and subscribed to [SOCKET-xyz789]
[ACCOUNT HANDLER] Account registration requested for user@example.com
[DATABASE WORKER]: executing loginPlayer(user@example.com, ***)
```

**Gaps:**

- No log rotation (files grow unbounded)
- No structured logging (all text-based; hard to grep/filter)
- No request tracing (no correlation IDs across handlers)

[Back to top ⤴️](#top)

---

### 4.5 Type Safety & Documentation

**Pattern: JSDoc + TypeDef:**

`src/database.js` lines 1–30:

```javascript
/**
 * @name DATABASE
 * @desc
 * @version 0.23.0
 */

class MAGPIE_DATABASE {
    static { /* ... */ }
}

/**
 * @typedef {import("../SERVER.js").epoch_real} epoch_real
 * @returns {epoch_real}
 */
MAGPIE_DATABASE.timestamp = function timestamp() {
    return Date.now()
}
```

**Coverage:**

- Most functions have JSDoc comments
- Type hints use `@typedef` and `@import`
- Major classes documented
- **Gap:** No formal TypeScript; still JavaScript with type hints. IDE support depends on JSDoc quality.

[Back to top ⤴️](#top)

---

### 4.6 Testing

**Current State:** No automated tests

```json
// package.json
"test": "echo \"Error: no test specified\" && exit 1"
```

**What needs testing:**

1. **Handler layer:** Account registration, login, token verification
2. **Crypto:** Email encryption/decryption, password hashing
3. **Database:** Queries, worker thread communication, collision detection
4. **Physics:** Entity movement, collision, rotor math (ganja.js)
5. **Entity lifecycle:** Creation, state mutations, deletion

**Recommended test framework:** Jest or Vitest (Node.js native, fast)

[Back to top ⤴️](#top)

---

### 4.7 Code Organization & Decomposition

**Large Files (need refactoring):**

| File                  | Lines  | Content                                                                   | Issue                                                                                 |
|-----------------------|--------|---------------------------------------------------------------------------|---------------------------------------------------------------------------------------|
| `SERVER.js`           | ~1000+ | Entry, Express setup, Socket.io setup, handlers, auth middleware, logging | Mixing concerns; should split into `bootstrap.js`, `socket-setup.js`, `middleware.js` |
| `src/entity.js`       | ~800+  | Entity lifecycle, stat management, component binding, action processing   | Can extract to `entity-stats.js`, `entity-actions.js`, `entity-components.js`         |
| `src/physics.js`      | ~600+  | Rotor math, movement, collision, targeting                                | Can extract targeting logic to `entity-targeting.js`                                  |
| `handlers/account.js` | ~150+  | Registration, verification, login, password recovery                      | Can split into `account-registration.js`, `account-login.js`                          |

---

### 4.8 Security Observations

**Strengths:**

- JWT token expiration enforced (15 seconds default)
- Passwords hashed with bcryptjs (secure, configurable cost)
- Email encryption with AES-256-GCM (authenticated encryption)
- Rate limiting on login attempts

**Concerns:**

- JWT secret hardcoded in config (should be loaded only from env, never logged)
- Email encryption keys not rotated
- No CSRF protection (assuming frontend sends JWT in Authorization header)
- Admin UI (`@socket.io/admin-ui`) exposed with `auth: false` in dev mode
- No input sanitization on handlers (relies on try-catch)
- SQL queries not visible; need to audit for SQL injection

[Back to top ⤴️](#top)

---

## 5. IMPLEMENTATION SEAMS & EXTENSION POINTS

### 5.1 Where to Add New Code

**For a new account-related feature (e.g., two-factor auth):**

1. Add handler in `handlers/` exporting `(io, socket, server) => { socket.on("2fa_verify", ...) }`
2. Add crypto utilities in `src/services/crypto.js` (e.g., `generate2FACode()`)
3. Add database methods in `src/services/database_worker.js` (e.g., `store2FACode()`)
4. Hook into `handlers/account.js` verification flow

**For a new entity behavior (e.g., regeneration over time):**

1. Add state type to `data/states.js`
2. Add component to `data/components.js`
3. Implement logic in `src/entity.js` or create `src/entity-regeneration.js`
4. Invoke from `src/system.js` game loop (if exists) or via Socket.io event

**For a new game service (e.g., guild management):**

1. Create `src/services/guild.js` or `src/guild.js` (class-based)
2. Add database schema + methods to `src/services/database_worker.js`
3. Create handler in `handlers/guild.js` for Socket.io events
4. Register handler automatically (no code needed; filesystem-driven)

---

### 5.2 Known Constraints

| Constraint                       | Implication                                             | Workaround                                                                |
|----------------------------------|---------------------------------------------------------|---------------------------------------------------------------------------|
| **Single-process only**          | Cannot scale horizontally across multiple servers       | Use reverse proxy (nginx) for load balancing + implement distributed HIVE |
| **In-memory HIVE**               | Entities lost on restart                                | Implement HIVE snapshotting to `world.db`                                 |
| **Synchronous SQLite in worker** | All DB calls serialize; high latency under load         | Split databases or use async Postgres driver                              |
| **No message queue**             | Handler events processed immediately; no job scheduling | Add Bull or RabbitMQ for async task queues                                |
| **Fixed JWT expiry (15s)**       | Short-lived tokens; clients must refresh frequently     | Add refresh token support                                                 |

[Back to top ⤴️](#top)

---

## 6. SUMMARY TABLE: STRUCTURE vs. SPECIFICATION

| Aspect                 | Current State                                | Spec/Intent (if known)   | Gap                                                   |
|------------------------|----------------------------------------------|--------------------------|-------------------------------------------------------|
| **Directory layout**   | src/, handlers/, services/                   | "core/" (outdated docs)  | Docs reference `core/` but code uses `src/`           |
| **Handler pattern**    | Dependency injection + dynamic registration  | Not formalized           | Implicit pattern; should be documented                |
| **Database threading** | Worker thread with pending queue             | Non-blocking I/O desired | Implementation is correct                             |
| **Error propagation**  | Try-catch in handlers, errors sent to client | Structured error codes   | No error enum; magic strings ("REGISTER_ERROR", etc.) |
| **Testing**            | None                                         | Not specified            | Recommendation: add Jest suite                        |
| **Logging**            | File-based, dated logs                       | Not specified            | Recommendation: structured logging (JSON)             |
| **API versioning**     | No versioning detected                       | Not specified            | No backward compatibility strategy                    |
| **Documentation**      | Inline JSDoc                                 | This analysis            | Need to update `.private/docs/blueprint/`             |

---

## 7. RECOMMENDED NEXT STEPS

1. **Immediate:** Update `STRUCTURE.md` and `ARCHITECTURE.md` to reflect actual `src/` layout (not `core/`)
2. **Short-term:** Create centralized event enum (`src/constants/events.js`) to eliminate magic strings
3. **Short-term:** Add Jest test suite with handler and crypto tests
4. **Medium-term:** Extract concerns from `SERVER.js` into separate modules (bootstrap, middleware, socket-config)
5. **Medium-term:** Implement HIVE snapshotting for runtime state persistence
6. **Long-term:** Add horizontal scaling support (distributed HIVE, message queue, Redis caching)

[Back to top ⤴️](#top)

---

**End of Analysis.**
