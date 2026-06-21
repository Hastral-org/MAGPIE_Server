---
name: MAGPIE ShelderEvo MMORPG pre-production 0.4*.* prototype plan
type: implementation plan
version: 0.39.5 20260613
---

# M.A.G.P.I.E. Shelder Evolution

## Pre-production Prototype {#top}

- [M.A.G.P.I.E. Shelder Evolution](#magpie-shelder-evolution)
  - [Pre-production Prototype {#top}](#pre-production-prototype-top)
  - [1. SPEC](#1-spec)
    - [1.1. Purpose](#11-purpose)
    - [1.2. Package](#12-package)
    - [1.3. Current state](#13-current-state)
    - [1.4. Prototype attempt 0.38.\*](#14-prototype-attempt-038)
    - [1.5. Full-stack](#15-full-stack)
  - [2. MMORPG Server](#2-mmorpg-server)
    - [2.1. Nodejs](#21-nodejs)
    - [2.2. Express](#22-express)
    - [2.3. Socket.io](#23-socketio)
    - [2.4. Handlers](#24-handlers)
    - [2.5. JWT](#25-jwt)
    - [2.6. Scrypt](#26-scrypt)
    - [2.7. Nodemailer](#27-nodemailer)
    - [2.8. Better-sqlite3](#28-better-sqlite3)
    - [2.9. Security \& Cryptography](#29-security--cryptography)
    - [2.10. Handshake Gatekeeping \& Connection Security](#210-handshake-gatekeeping--connection-security)
    - [2.11. Game Metrics \& Retro UI Scaffolding](#211-game-metrics--retro-ui-scaffolding)
  - [3. MMORPG Client](#3-mmorpg-client)
    - [3.1. NWjs](#31-nwjs)
    - [3.2. RPG Maker MZ](#32-rpg-maker-mz)
    - [3.3. Socket.io-client](#33-socketio-client)
  - [4. External dependencies](#4-external-dependencies)
  - [5. Resources](#5-resources)
  - [6. Assets](#6-assets)
  - [7. Budget](#7-budget)
  - [8. TARGET architecture](#8-target-architecture)

[Back to top ⤴️](#top)

---

## 1. SPEC

---

### 1.1. Purpose

---

### 1.2. Package

---

### 1.3. Current state

---

### 1.4. Prototype attempt 0.38.*

---

### 1.5. Full-stack

[Back to top ⤴️](#top)

---

## 2. MMORPG Server

**Structure:**

```markdown
`MAGPIE_Server`/
├── `SERVER.js`              # Main entry point & Socket.io orchestrator
├── `package.json`           # Dependencies & scripts
├── config/
│   └── `config.js`          # Processes .env → App Configuration
├── data/
│   └── `*.js`               # JSON-like data injected at boot
├── public/                # Statically served frontend
│   ├── `index.html`         # Homepage
│   ├── `main.js`            # Client-side logic
│   ├── `home.css`           # Homepage styles
│   └── routes/            # Other HTML/CSS/JS areas
└── src/
    ├── `*.js`               # General application code
    ├── plugins/
    │   └── `*.js`           # Modular plugin extensions
    ├── services/
    │   ├── `*.js`           # Background workers / Business logic
    │   └── `mailer.js`      # Nodemailer implementation
    └── handlers/
        └── `*.js`           # Decoupled io.on() event handlers
```

[Back to top ⤴️](#top)

---

### 2.1. Nodejs

**Require stack:**

[SERVER.js](../../SERVER.js)

```javascript
MAGPIE_SERVER.config = require("./config/server_config")
const { timeEnd } = require("node:console")
const express = require("express")
const ratelimit = require("express-rate-limit")
const { createServer } = require("node:http")
const { Server } = require("socket.io")
const { instrument } = require("@socket.io/admin-ui")
const cliSpinner = require("cli-spinner")
const cliProgress = require("cli-progress")
const fs = require("fs")
const path = require("path")
const vm = require("node:vm")
const readline = require("readline")
/**
 * @typedef {import("jsonwebtoken")} jwt
 * @type {jwt}
 */
const jwt = require("jsonwebtoken")
MAGPIE_SERVER.MAIL = require("./src/services/mailer")
MAGPIE_SERVER.FS = fs
MAGPIE_SERVER.PATH = path
MAGPIE_SERVER.VM = vm
MAGPIE_SERVER.JWT = jwt
```

[Back to top ⤴️](#top)

---

### 2.2. Express

```javascript
//@region IMPORT
const { express } = require("express")
const { createServer } = require("node:http")
```

[Back to top ⤴️](#top)

---

### 2.3. Socket.io

**Server-side:**

```javascript
//JAVASCRIPT

//@region IMPORT
const { express } = require("express")
const { createServer } = require("node:http")
const { Server } = require("socket.io")
const { instrument } = require("@socket.io/admin-ui")
//@region SERVER/App
const app = express()
const server = createServer(app)
const io = new Server(server, {
    //@audit-ok cors configs
    cors: {
    origin: [MAGPIE.KEY.SERVER.DOMAIN],
    methods: ["GET", "POST"],
    credentials: true
  },
  transports: ["websocket", "polling"],
  allowUpgrades: true
})
instrument(io, {
    auth: false,
    mode: "development"
})
app.use((req, res, next) => {
    // @audit-ok [HTTP REQUEST] debug logging
    MAGPIE_SERVER.log(`[HTTP REQUEST] ${req.method} ${req.url}`)
    next()
})
```

---

**Client-side:**

[`public/` domain homepage:](../../public/main.js):

```javascript
//========================================================================
// #region - SOCKET
//========================================================================
/** @type {import("socket.io-client").Socket} */
const socket = io(window.location.origin, {
    auth: {
        token: localStorage.getItem("jwt_token")
    },
    query: {
        entityID: MAGPIE_CLIENT.params.get("entityID"),
        playerID: MAGPIE_CLIENT.params.get("playerID")
    },
    transports: ["websocket", "polling"],
    secure: MAGPIE_CLIENT.secure_socket
})
```

```html
<script src="/socket.io/socket.io.js"></script>
<script type="text/javascript" src="/main.js"></script>
```

[Desktop client app / 'launcher'](../../../ShelderEvo/index.html)

```html
<script src="https://cdn.socket.io/4.7.5/socket.io.min.js"></script>
<script src="js/plugins/app/cli.js"></script>
```

[Back to top ⤴️](#top)

---

### 2.4. Handlers

---

### 2.5. JWT

---

### 2.6. Scrypt

Native Nodejs 'crypto' & Identity Security.

**Password Hashing:**

- Use `scrypt` for password storage to resist brute-force and hardware acceleration attacks.

**Email Privacy (Dual-Column Strategy):**
To ensure player privacy and GDPR compliance while maintaining high-performance lookups, the system implements a split-storage model:

1. **Searchable Identity (`email_hash`)**:
   - **Algorithm**: `HMAC-SHA256` with a static `HASH_SALT`.
   - **Purpose**: Deterministic lookup. Allows the server to find a user by email without storing the plaintext email in a searchable format.
   - **Complexity**: $O(1)$ index lookup.

2. **Recoverable Identity (`email_encrypted`)**:
   - **Algorithm**: `AES-256-GCM` (Authenticated Encryption).
   - **Structure**: `iv:authTag:encryptedData`.
   - **Purpose**: Secure storage for communication. Only decryptable via the `EMAIL_MASTER_KEY`.
   - **IV (Initialization Vector)**: Unique random bytes per encryption to prevent pattern analysis.
   - **Auth Tag**: Ensures the encrypted data hasn't been tampered with.

**Workflow**:

- **Registration**: $\text{Email} \rightarrow \text{Hash}(\text{Salt}) \rightarrow \text{db Column A}$ AND $\text{Email} \rightarrow \text{Encrypt}(\text{Key}) \rightarrow \text{db Column B}$.
- **Login**: $\text{Input Email} \rightarrow \text{Hash}(\text{Salt}) \rightarrow \text{Query Column A}$.
- **Communication**: $\text{Column B} \rightarrow \text{Decrypt}(\text{Key}) \rightarrow \text{Plaintext Email}$.

---

### 2.7. Nodemailer

---

### 2.8. Better-sqlite3

[Back to top ⤴️](#top)

---

### 2.9. Security & Cryptography

**Dual-Column Email Privacy & Password Hashing:**

- **Email Storage:** Implements a dual-column strategy. Column A uses HMAC-SHA256 for deterministic $O(1)$ lookups. Column B uses AES-256-GCM for encrypted data storage.
- **Password Security:** Uses `crypto.scrypt` with 16-byte random salts. Verification logic strictly mandates `crypto.timingSafeEqual()` to mitigate timing attacks.

---

### 2.10. Handshake Gatekeeping & Connection Security

**Ephemeral vs. Absolute Security Zones:**

- **The Gate:** Socket.io auth handshake verifies JWTs against database lookups.
- **Ephemeral Zone:** High-frequency socket events utilize an in-memory `socket.role`.
- **Absolute Zone:** Low-frequency, high-impact operations query a live database row.
- **Anti-F5 Spam Memory:** Connection handlers utilize a 10-second grace period powered by a `Map` (disconnect timers) and a `Set` (active cache) to prevent reconnections from spamming server events.

---

### 2.11. Game Metrics & Retro UI Scaffolding

**Server-Side Metrics:**

- Connects to the database to manage a `game_metrics` table tracking global usage (e.g., `visitor_count`, `peak_concurrent_players`).
- Atomic increments broadcast real-time updates to connected clients via a `counter-update` event.

**Client-Side Presentation:**

- **RetroOdometer Class:** A 7-digit animated slot structure rendering with vertical ribbons (0-9 columns).
- **Styling:** Adheres strictly to `image-rendering: pixelated` to maintain aesthetic fidelity.
- **State Check:** Uses `localStorage.getItem("has_been_counted")` to prevent duplicate metric bumps on refresh.

---

## 3. MMORPG Client

### 3.1. NWjs

### 3.2. RPG Maker MZ

### 3.3. Socket.io-client

[Back to top ⤴️](#top)

---

## 4. External dependencies

---

## 5. Resources

---

## 6. Assets

---

## 7. Budget

[Back to top ⤴️](#top)

---

## 8. TARGET architecture

---
