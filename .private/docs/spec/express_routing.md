# Express Routing & Server Injection Pattern

## Problem

[issue #115](https://github.com/Hastral-org/MAGPIE_Server/issues/115)

When using `express.Router()` in separate handler files (e.g., `account.js`), the route handlers only receive `req` and `res`. Accessing the main server instance (`MAGPIE_SERVER`) for logging, database access, or configuration would normally require a `require` call, which creates a **circular dependency** since `SERVER.js` also requires the handlers.

## Solution: Request Middleware Injection

The recommended pattern is to attach the server instance to the `req` object using a middleware in the main application file before mounting the routers.

### Implementation

#### 1. Server-Side Injection (`SERVER.js`)

Add a middleware to the Express app that assigns the server instance to `req.server`.

```javascript
const accountRouter = require("./handlers/account").router;

// Injection Middleware
app.use((req, res, next) => {
  req.server = MAGPIE_SERVER;
  next();
});

app.use("/account", accountRouter);
```

#### 2. Handler-Side Access (`account.js`)

Extract the server instance from the request object within the route handler.

```javascript
router.post("/login", async (req, res) => {
  const server = req.server; // Access injected server instance

  try {
    // Use server for custom logging or services
    server.log("[POST /login] login attempt...");
    // ... logic
  } catch (e) {
    server.error("Login failed", e);
  }
});
```

## Advantages

- **Zero Circular Dependencies**: No `require` loop between the server and its handlers.
- **Standardized Access**: Every route in the application has a consistent way to access the server core.
- **Testability**: Allows for easy mocking of the server object during unit tests by simply adding a `server` property to the mock request object.
`
