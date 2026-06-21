<!-- refreshed: 2026-06-10 -->
# Architecture

**Analysis Date:** 2026-06-10

## System Overview

```text
┌─────────────────────────────────────────────────────────────┐
│                      API & Socket Layer                      │
├──────────────────┬──────────────────┬───────────────────────┤
│   Express API   │   Socket.io     │    Admin UI            │
│  `SERVER.js`    │  `SERVER.js`    │   `@socket.io/admin-ui`│
└────────┬─────────┴────────┬─────────┴──────────┬────────────┘
         │                  │                     │
         ▼                  ▼                     ▼
┌─────────────────────────────────────────────────────────────┐
│                    Logic & Handling Layer                    │
│         `handlers/*.js` (e.g., `playerHandler.js`)            │
└─────────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────┐
│                    Core Engine Layer                        │
│         `core/*.js` (Physics, Entity, System, Database)       │
└─────────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────┐
│  Data & State Store                                          │
│  `data/*.js` and `better-sqlite3`                            │
└─────────────────────────────────────────────────────────────┘
```

## Component Responsibilities

| Component     | Responsibility                                | File               |
|---------------|-----------------------------------------------|--------------------|
| Server        | Entry point, Express/Socket setup, routing    | `SERVER.js`        |
| Core System   | Global state, timing, and system utilities    | `core/system.js`   |
| Core Physics  | Kinematics, rotors, and collision logic       | `core/physics.js`  |
| Core Entity   | Entity lifecycle, stats, and movement         | `core/entity.js`   |
| Core Database | SQLite wrapper and worker threads             | `core/database.js` |
| Handlers      | Translating network events to core actions    | `handlers/*.js`    |
| State         | In-memory data structures for active sessions | `data/states.js`   |

## Pattern Overview

**Overall:** Modular Event-Driven Architecture.

**Key Characteristics:**

- **Centralized Entry**: `SERVER.js` acts as the orchestrator.
- **Handler Pattern**: Logic is decoupled from the network layer via specialized handlers in `handlers/`.
- **Core Engine**: Heavy lifting (physics, entity management) is isolated in `core/`.
- **Worker-based DB**: Database operations are offloaded to `database_worker.js` to prevent event-loop blocking.

## Layers

**Network Layer:**

- Purpose: Handle HTTP requests and WebSocket events.
- Location: `SERVER.js`
- Contains: Express app, Socket.io server.
- Depends on: Handlers.
- Used by: External clients.

**Handler Layer:**

- Purpose: Process specific game/system logic requests.
- Location: `handlers/`
- Contains: `playerHandler.js`, `entityHandler.js`, `accountHandler.js`.
- Depends on: Core Engine.
- Used by: Network Layer.

**Core Engine Layer:**

- Purpose: Maintain game world integrity and physics.
- Location: `core/`
- Contains: `physics.js`, `entity.js`, `system.js`.
- Depends on: Data/Database.
- Used by: Handlers.

**Data Layer:**

- Purpose: Persistent and volatile storage.
- Location: `data/` and `db/`
- Contains: `states.js`, `components.js`.
- Depends on: `better-sqlite3`.
- Used by: Core Engine.

## Data Flow

### Primary Request Path (Socket Event)

1. Client emits event to `SERVER.js` (`SERVER.js`)
2. `SERVER.js` routes event to a specific handler (e.g., `playerHandler.js`)
3. Handler validates request and calls Core Engine method (e.g., `core/entity.js`)
4. Core Engine updates state/DB and returns result.
5. Handler emits response back to client via Socket.io.

## Key Abstractions

**Entity:**

- Purpose: Represents any object in the game world with stats and physics.
- Examples: `core/entity.js`
- Pattern: Component-based (referenced in `core/component.js`).

**Rotor/Bivector:**

- Purpose: Advanced geometric algebra for 3D rotations and physics.
- Examples: `core/physics.js`
- Pattern: Mathematical abstraction for orientation.

## Entry Points

**Main Server:**

- Location: `SERVER.js`
- Triggers: `npm start` or `node SERVER.js`
- Responsibilities: Bootstrapping, dependency injection, and network listening.

## Architectural Constraints

- **Threading:** Single-threaded Node.js event loop, with `database_worker.js` providing asynchronous DB access.
- **Global state:** Heavy use of global objects (e.g., `MAGPIE_SERVER`, `STATE`) for fast access across modules.
- **Circular imports:** Potential risk due to tight coupling between `entity.js` and `physics.js`.

## Anti-Patterns

### God Object (SERVER.js)

**What happens:** `SERVER.js` is extremely large (over 2000 lines) and handles too many responsibilities.
**Why it's wrong:** Hard to maintain, test, and scale.
**Do this instead:** Move more routing and setup logic into the `handlers/` or a dedicated `routes/` directory.

## Error Handling

**Strategy:** Mixed approach using try-catch blocks in handlers and potentially global error middleware in Express.

**Patterns:**

- Use of `console.error` for logging.
- Return of error objects/messages to clients via socket events.

## Cross-Cutting Concerns

**Logging:** Local file-based logging in `.logs/`.
**Validation:** Basic validation in handlers; JWT for session security.
**Authentication:** JWT-based token verification in `core/auth_util.js`.

---

*Architecture analysis: 2026-06-10.*
