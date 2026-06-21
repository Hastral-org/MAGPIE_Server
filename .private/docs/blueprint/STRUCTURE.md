# Codebase Structure

**Analysis Date:** 2026-06-10

## Directory Layout

```markdown
MAGPIE_Server/
├── .admin/          # Administrative tools/scripts
├── .logs/           # Server runtime logs
├── .planning/       # GSD planning and codebase maps
├── .tmp/            # Temporary runtime files
├── admin/           # Admin-facing logic/tools
├── config/          # Configuration files (e.g., config.json)
├── core/            # Core engine logic (Physics, Entity, System)
├── data/            # In-memory state and component definitions
├── db/              # Database schemas and migrations
├── handlers/        # Network event handlers (API/Socket)
├── plugins/         # Extensible server plugins
├── public/          # Static assets for the web server
└── SERVER.js        # Main entry point and orchestrator
```

## Directory Purposes

**core/:**

- Purpose: The "brain" of the server.
- Contains: Physics engine, entity management, system utilities, and DB workers.
- Key files: `physics.js`, `entity.js`, `system.js`, `database_worker.js`.

**handlers/:**

- Purpose: Bridge between network events and core logic.
- Contains: Logic for accounts, players, and entities.
- Key files: `playerHandler.js`, `accountHandler.js`, `entityHandler.js`.

**data/:**

- Purpose: Definition of game data and volatile state.
- Contains: Component definitions and active session states.
- Key files: `states.js`, `components.js`.

**plugins/:**

- Purpose: Modular extensions to the server functionality.
- Contains: Plugin implementations.

## Key File Locations

**Entry Points:**

- `SERVER.js`: Main server bootstrapper and network listener.

**Configuration:**

- `core/config.js`: Logic for loading and managing settings.
- `config/config.json`: Static configuration values.

**Core Logic:**

- `core/physics.js`: 3D kinematics and geometric algebra.
- `core/entity.js`: Entity state and behavior.

**Testing:**

- Not detected (no dedicated test directory).

## Naming Conventions

**Files:**

- Core modules: camelCase (e.g., `auth_util.js`, `database_worker.js`).
- Handlers: camelCase with "Handler" suffix (e.g., `playerHandler.js`).
- Main entry: UPPERCASE (`SERVER.js`).

**Directories:**

- Lowercase (e.g., `core`, `handlers`, `data`).

## Where to Add New Code

**New Feature (Game Logic):**

- Primary code: `core/` (for engine changes) or `handlers/` (for new network events).
- Data definitions: `data/`.

**New Network Event:**

- Implementation: `handlers/` (create a new handler or add to existing).
- Routing: `SERVER.js`.

**Utilities:**

- Shared helpers: `core/system.js` or `core/auth_util.js`.

## Special Directories

**.logs/:**

- Purpose: Stores runtime error and console logs.
- Generated: Yes.
- Committed: No.

**.planning/:**

- Purpose: Stores GSD architectural maps and plans.
- Generated: Yes.
- Committed: Yes.

---

*Structure analysis: 2026-06-10.*
