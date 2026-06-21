# Technology Stack

**Analysis Date:** 2026-06-10

## Languages

**Primary:**

- JavaScript Node.js (CommonJS) - Used throughout the server implementation.

**Secondary:**

- Not detected

## Runtime

**Environment:**

- Node.js (version not explicitly pinned in package.json, but using modern features like `--watch`)

**Package Manager:**

- npm
- Lockfile: present (implied by package.json)

## Frameworks

**Core:**

- Express ^5.2.1 - Web server and API routing.
- Socket.io ^4.2.0 - Real-time bidirectional communication.

**Testing:**

- Not detected (package.json `test` script is a placeholder).

**Build/Dev:**

- node --watch - Used for development auto-restarts.

## Key Dependencies

**Critical:**

- better-sqlite3 ^12.9.0 - High-performance local database.
- jsonwebtoken ^9.0.3 - Authentication and session tokens.
- socket.io-client ^4.8.3 - Client-side socket communication.
- express-rate-limit ^8.5.1 - API rate limiting and security.

**Infrastructure:**

- nodemailer ^8.0.10 - Email delivery.
- dotenv ^17.3.1 - Environment variable management.
- cli-progress / cli-spinner - Terminal UI for server status.
- @socket.io/admin-ui - Socket.io monitoring and administration.

## Configuration

**Environment:**

- Configured via `dotenv` and a dedicated config module in `core/config.js`.
- Key configs likely include DB paths, JWT secrets, and Mailer credentials.

**Build:**

- No complex build step; runs directly via `node`.

## Platform Requirements

**Development:**

- Node.js environment.
- SQLite3 binaries (handled by better-sqlite3).

**Production:**

- Linux/Windows server with Node.js runtime.

---

*Stack analysis: 2026-06-10.*
