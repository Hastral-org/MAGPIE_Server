# Coding Conventions

**Analysis Date:** 2026-06-10

## Naming Patterns

**Files:**

- Core logic: lowercase with underscores (e.g., `auth_util.js`, `database_worker.js`).
- Handlers: camelCase with "Handler" suffix (e.g., `playerHandler.js`).
- Entry point: UPPERCASE (`SERVER.js`).

**Functions:**

- Generally camelCase (e.g., `processAction`, `updatePhysics`).

**Variables:**

- Local variables: camelCase.
- Global constants/objects: UPPERCASE (e.g., `MAGPIE_SERVER`, `STATE`).

**Types:**

- JSDoc `@typedef` is used extensively for type hinting in JS (e.g., `@typedef {import("./core/index").vector3} vector3`).

## Code Style

**Formatting:**

- Not explicitly defined by a config file (no `.prettierrc` found), but follows a consistent indentation pattern.

**Linting:**

- Not detected (no `.eslintrc` found).

## Import Organization

**Order:**

1. Node.js built-ins (`fs`, `path`, `node:vm`).
2. Third-party packages (`express`, `socket.io`).
3. Local core modules (`./core/config`, `./core/index`).
4. Local data modules (`./data/states`).

**Path Aliases:**

- Not detected; uses relative paths.

## Error Handling

**Patterns:**

- Use of `try...catch` blocks in handlers to prevent server crashes on bad input.
- Error messages sent back to clients via socket events.

## Logging

**Framework:** Custom implementation using `fs` and `console`.

**Patterns:**

- Logs are written to the `.logs/` directory.
- Use of `console.log` and `console.error` for runtime debugging.

## Comments

**When to Comment:**

- Extensive use of JSDoc for type definitions and function documentation.
- Use of `#region` and `#endregion` to organize large files (especially in `SERVER.js`).

**JSDoc/TSDoc:**

- Used for defining complex types and providing IDE intellisense in a JavaScript environment.

## Function Design

**Size:**

- Some functions are very large, particularly in `SERVER.js` and `core/entity.js`, indicating a need for decomposition.

**Parameters:**

- Standard positional parameters.

**Return Values:**

- Mixed; some return data, others rely on callbacks or socket emissions.

## Module Design

**Exports:**

- CommonJS `module.exports` pattern.

**Barrel Files:**

- `core/index.js` acts as a partial barrel for core functionality.

---

*Convention analysis: 2026-06-10.*
