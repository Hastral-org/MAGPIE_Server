# External Integrations

**Analysis Date:** 2026-06-10

## APIs & External Services

**Communication:**

- Socket.io - Real-time event-driven communication between server and clients.
  - SDK/Client: `socket.io` / `socket.io-client`

**Email:**

- Nodemailer - Outgoing email services for account verification/notifications.
  - Implementation: `core/mailer.js`

**Authentication:**

- JWT (JSON Web Tokens) - Stateless authentication.
  - SDK/Client: `jsonwebtoken`

## Data Storage

**Databases:**

- SQLite
  - Connection: Managed via `core/database.js` and `core/database_worker.js`.
  - Client: `better-sqlite3`

**File Storage:**

- Local filesystem - Used for logs (`.logs/`), temporary files (`tmp/`), and potentially database files.

**Caching:**

- Not detected (likely relying on in-memory state in `data/states.js`).

## Authentication & Identity

**Auth Provider:**

- Custom JWT-based implementation.
  - Implementation: `handlers/accountHandler.js` and `core/auth_util.js`.

## Monitoring & Observability

**Error Tracking:**

- Local logs in `.logs/`.

**Logs:**

- Custom logging implementation using `fs` and `console`.

## CI/CD & Deployment

**Hosting:**

- Not explicitly defined in codebase (likely self-hosted or VPS).

**CI Pipeline:**

- Not detected.

## Environment Configuration

**Required env vars:**

- Likely includes `JWT_SECRET`, `DB_PATH`, and Mailer credentials (SMTP host/user/pass).

**Secrets location:**

- Managed via `.env` files (loaded by `dotenv`).

## Webhooks & Callbacks

**Incoming:**

- Express API endpoints in `SERVER.js` and various handlers.

**Outgoing:**

- Not detected.

---

*Integration audit: 2026-06-10.*
