/**
 * @namespace accountHandler
 * @author Matheraptor
 * @version 0.39.92
 *
 * @typedef {import("socket.io").Socket} Socket
 */
const account = {};
const { MAGPIE } = require("../src/index");
const jwt = require("jsonwebtoken");
const mailer = require("./email_api");
const crypto = require("../src/services/crypto");
const { hashPassword, verifyPassword } = crypto;
// const { MAGPIE } = require("../core/index")
const ePrefix = "[ACCOUNT HANDLER] ";
const http = MAGPIE.KEY.HTTP;
/**
 * @name
 * @desc
 * @typedef {import("../src/player").playerID} playerID
 * @typedef {import("../src/player").username} username
 * @typedef {import("../src/services/crypto").email} email
 * @typedef {import("../src/services/crypto").email_encrypted} email_encrypted
 * @typedef {import("../src/services/crypto").email_hashed} email_hashed
 * @typedef {import("../src/player").MAGPIE_PLAYER} MAGPIE_PLAYER
 * @typedef {import("../src/database").MAGPIE_DATABASE} MAGPIE_DATABASE
 */
//------------------------------------------------------------------------
// #region > Utility
//------------------------------------------------------------------------
/**
 *
 * @param {playerID} ID
 * @param {email} email
 * @param {username} username
 * @returns {String}
 */
const printPlayer = function (ID, email, username) {
  const handle = email ? email : username;
  return `[PLAYER-${ID} | ${handle}] `;
};
// #endregion
//------------------------------------------------------------------------
/**
 * @name
 * @desc
 *
 */
//========================================================================
// #region - AUTH-N
//========================================================================
/**
 * @name
 * @desc
 *
 */
//------------------------------------------------------------------------
// #region > Utility
//------------------------------------------------------------------------
/**
 *
 * @param {import("../src/player").MAGPIE_PLAYER} player
 * @returns {String}
 */
account.printPlayerAuth = function (player) {
  return `[PLAYER-${player?.ID} | ${player?.username}] `;
};
// #endregion
//------------------------------------------------------------------------
/**
 * @name
 * @desc
 *
 */
//------------------------------------------------------------------------
// #region > Register
//------------------------------------------------------------------------
/**
 * @desc Handles incoming player registration events over network sockets
 * @param {{
 * email: email,
 * username: username,
 * password: String
 * }} data
 * @param {Object} server
 * @returns {Promise<{player: MAGPIE_PLAYER, token: String, sent: }}
 */
account.register = async function (data, server) {
  try {
    if (!data) throw new Error("Invalid socket registration data");
    const { username, password, email } = data;
    const token = jwt.sign(
      {
        username,
        isRegistrationToken: true,
      },
      server.config.jwtSecret,
      { expiresIn: server.config.jwtExpire },
    );
    const emailHash = crypto.EmailSecurity.hashEmail(data.email);
    const emailEncrypted = crypto.EmailSecurity.encryptEmail(data.email);
    const securedPassword = await hashPassword(password);
    const payload = {
      email: email,
      email_hashed: emailHash,
      email_encrypted: emailEncrypted,
      password_encrypted: securedPassword,
    };
    const player = await account.reserveRegistration(payload, server);
    if (!player) throw new Error(`${player} is invalid account:reservation. `);
    server.log(`[USER-${username}] requested a registration link. `);
    const sent = await mailer.sendConfirmation(email, token);
    if (!sent || !sent?.accepted)
      throw new Error("Could not deliver verification email.");
    return { player, token, sent };
  } catch (e) {
    server.error(ePrefix + e.message, e);
  }
};
/**
 *
 * @param {{
 * email: email,
 * email_hashed: email_hashed,
 * email_encrypted: email_encrypted,
 * username: username,
 * password_encrypted: String
 * }} data
 * @param {*} server
 * @returns {Promise<MAGPIE_PLAYER>}
 */
account.reserveRegistration = async function (data, server) {
  try {
    /** @type {MAGPIE_DATABASE} */
    const db = server.DATABASE;
    const newPlayer = {
      username: data.username,
      PASS: data.password_encrypted,
      email_hash: data.email_hashed,
      email_encrypted: data.email_encrypted,
      isFrozen: true,
    };
    const existingPlayer = await db.getPlayerByEmail(data.email);
    /** @type {MAGPIE_PLAYER} */
    const PLAYER = !!existingPlayer
      ? existingPlayer
      : await db.createPlayer(newPlayer);
    return PLAYER;
  } catch (e) {
    server.error(ePrefix + e.message, e);
  }
};
/**
 *
 * @param {String} token
 * @param {*} server
 * @returns
 */
account.processEmailConfirmation = async function (token, server) {
  try {
    const db = server.DATABASE;
    const decoded = server.JWT.verify(token, server.config.jwtSecret);
    if (!decoded?.isRegistrationToken) return invalidToken();
    const username = decoded?.username;
    const player = await db.getPlayerByUsername(username);
    if (!player) throw new Error(`unable to fetch [PLAYER-${username}]`);
    player.isFrozen = false;
    return player;
  } catch {
    server.error(ePrefix + e.message, e);
  }
};
// #endregion
//------------------------------------------------------------------------
/**
 * @name
 * @desc
 *
 */
//------------------------------------------------------------------------
// #region > Access
//------------------------------------------------------------------------
account.verifyCredentials = async function (email, password, server) {
  const db = server.DATABASE;
  const player = await db.loginPlayer(email, password);
  if (!player) throw new Error("Invalid credentials");
  if (player.isFrozen === 1) throw new Error("Account is frozen");
  const token = jwt.sign(
    {
      id: player.ID,
      username: player.username,
    },
    server.config.jwtSecret,
    { expiresIn: server.config.jwtExpire },
  );
  return { player, token };
};
account.authenticateToken = (req, res, server, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.sendStatus(401);
  jwt.verify(token, server.config.jwtSecret, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};
account.resumeSession = async function (data, socket, server) {
  try {
    const { player, token } = await account.verifyCredentials(
      data.email,
      data.password,
      server,
    );
    server.log(`${ePrefix}${account.printPlayerAuth(player)}resumed session. `);
    socket.emit("RESUME_SESSION_SUCCESS", { username: player.username, token });
  } catch (e) {
    socket.emit("RESUME_SESSION_FAIL", { message: e.message });
    server.error(ePrefix + e.message, e);
  }
};
/** @param {Socket} socket */
account.joinPrivateRoom = function (socket, playerID) {
  socket.join(`account:${player.ID}`);
  server.log();
};
account.login = async function (data, socket, server) {
  try {
    const { player, token } = await account.verifyCredentials(
      data.email,
      data.password,
      server,
    );
    server.log(`${ePrefix}${account.printPlayerAuth(player)} logged in. `);
    player.status = true;
    socket.emit("LOGIN_SUCCESS", {
      token,
      ID: player.ID,
      username: player.username,
      email: player.email,
      creatureID: player.creatureID,
      EVP: player.EVP,
      CLOUT: player.CLOUT,
      slots: player.slots,
      status: player.status,
      server: server.status,
    });
  } catch (e) {
    socket.emit(`LOGIN_ERROR`, { message: e.message });
    server.error(ePrefix + e.message, e);
  }
};
account.logout = async function (data, socket, server) {
  try {
    //@todo logout logic here
    server.log(`${ePrefix}logout called for [USER: ${data?.username}]. `);
  } catch (e) {
    server.error(ePrefix + e.message, e);
    socket.emit("LOGOUT_ERROR", { message: "Logout failed. " });
  }
};
account.relog = async function (data, socket, server) {
  try {
    const { player, token } = await server.DATABASE.loadPlayer(data?.playerID);
    if (!player)
      return socket.emit("LOGIN_ERROR", {
        message: "Unable to sync player data. ",
      });
    server.log(`${ePrefix}${account.printPlayerAuth(player)} logged in. `);
    player.status = true;
    socket.emit("LOGIN_SUCCESS", {
      token,
      ID: player.ID,
      username: player.username,
      email: player.email,
      creatureID: player.creatureID,
      EVP: player.EVP,
      CLOUT: player.CLOUT,
      slots: player.slots,
      status: player.status,
      server: server.status,
    });
  } catch (e) {
    socket.emit(`LOGIN_ERROR`, { message: e.message });
    server.error(ePrefix + e.message, e);
  }
};
// #endregion
//------------------------------------------------------------------------
/**
 * @name
 * @desc
 *
 */
//------------------------------------------------------------------------
// #region > Recover
//------------------------------------------------------------------------
account.requestPasswordReset = async function (data, socket, server) {
  try {
    const email = data?.email;
    if (!email) throw new Error(`${email} is invalid email`);
    // 1. Enforce the interface contract: Verify an object payload arrived
    server.log(`${ePrefix}Processing recovery request for: "${email}"`);
    const db = server.DATABASE;
    const player = await db.getPlayerByEmail(email);
    if (!player) {
      socket.emit("RESET_PASSWORD_SUCCESS", { email });
      return { success: true };
    }
    const recoveryToken = jwt.sign(
      {
        id: player.ID,
        isRecoveryToken: true,
      },
      server.config.jwtSecret,
      { expiresIn: server.config.jwtExpire },
    );
    try {
      await mailer.sendRecovery(email, recoveryToken);
    } catch (e) {
      server.error(ePrefix + "Mail delivery failed: " + e.message, e);
      throw new Error("Could not deliver recovery email");
    }
    socket.emit("RESET_PASSWORD_SUCCESS", { email });
    return { success: true, sent: true };
  } catch (e) {
    server.error(ePrefix + e.message, e);
    socket.emit("RESET_PASSWORD_ERROR", {
      message: e.message || "Recovery failed.",
    });
    // throw e
  }
};
account.processPasswordReset = async function (token, newPassword, server) {
  try {
    if (!token || !newPassword) throw new Error("Missing required reset data");
    const decoded = jwt.verify(token, server.config.jwtSecret);
    if (!decoded.isRecoveryToken) throw new Error("Invalid token type");
    const secureNewHash = await hashPassword(newPassword);
    const db = server.DATABASE;
    const oldPlayer = await db.loadPlayer(decoded.id);
    if (!oldPlayer) throw new Error("Account not found!");
    oldPlayer.PASS = secureNewHash;
    const updatedPlayer = await db.savePlayer(oldPlayer);
    if (!updatedPlayer) throw new Error("Unable to update account!");
    server.log(
      `${ePrefix}${account.printPlayerAuth(decoded)}password updated.`,
    );
    return { success: true };
  } catch (e) {
    server.error(ePrefix + e.message, e);
    return { success: false };
  }
};
// #endregion
//------------------------------------------------------------------------
/**
 *
 * @desc back to {@link }
 *
 */
//========================================================================
// #endregion -
//========================================================================
/**
 * @name
 * @desc
 *
 */
//========================================================================
// #region - AUTH-Z
//========================================================================
/**
 * @name
 * @desc
 *
 */
//------------------------------------------------------------------------
// #region > Roles
//------------------------------------------------------------------------

// #endregion
//------------------------------------------------------------------------
/**
 * @name
 * @desc
 *
 */
//------------------------------------------------------------------------
// #region > Permit
//------------------------------------------------------------------------

// #endregion
//------------------------------------------------------------------------
/**
 *
 * @desc back to {@link }
 *
 */
//========================================================================
// #endregion -
//========================================================================
/**
 * @name
 * @desc
 *
 */
//========================================================================
// #region - EXPORT
//========================================================================
/**
 * @name
 * @desc
 *
 */
//------------------------------------------------------------------------
// #region > Helpers
//------------------------------------------------------------------------
const invalidToken = () => {
  res.status(http.STATUS_401.code).send(`<h1>Invalid credentials</h1>
    <p>Please, request a new email confirmation link.`);
};
// #endregion
//------------------------------------------------------------------------
/**
 * @name
 * @desc
 *
 */
//------------------------------------------------------------------------
// #region > Socket
//------------------------------------------------------------------------
/**
 *
 * @param {import("socket.io").Server} io
 * @param {import("socket.io").Socket} socket
 * @param {import("../SERVER").MAGPIE_SERVER} server
 */
module.exports.account = function (io, socket, server) {
  socket.on("PROBE_USERNAME", async (data) => {
    const now = Date.now();
    /**
     * @audit @desc [C.L.I.E.N.T.](../src/cli/client.js)
     * */
    const cooldown = 1000;
    const lastProbe = socket.data?.lastProbe || 0;
    if (now - lastProbe < cooldown)
      return socket.emit("PROBE_USERNAME_ERROR", {
        code: MAGPIE.KEY.HTTP.STATUS_403.code,
        message: "Please, wait...",
      });
    socket.data.lastProbe = now;
    const isAvailableUsername = server.DATABASE.isUsernameAvailable(
      data?.username,
    );
    const not = isAvailableUsername ? " " : " not ";
    const message = ePrefix + `[USERNAME-${data.username}] is${not}available. `;
    if (isAvailableUsername)
      return socket.emit("PROBE_USERNAME_AVAILABLE", {
        code: MAGPIE.KEY.HTTP.STATUS_200.code,
        message: message,
      });
    return socket.emit("PROBE_USERNAME_UNAVAILABLE", {
      code: MAGPIE.KEY.HTTP.STATUS_409.code,
      message: message,
    });
  });
  // socket.on("REGISTER", async (data) => {
  //   await account.register(data, socket, server);
  // });
  socket.on("LOGIN", async (data) => {
    await account.login(data, socket, server);
  });
  socket.on("LOGOUT", async (data) => {
    await account.logout(data, socket, server);
  });
  socket.on("RELOG", async (data) => {
    await account.relog(data, socket, server);
  });
  socket.on("RESET_PASSWORD_REQUEST", async (data) => {
    await account.requestPasswordReset(data, socket, server);
  });
};
// #endregion
//------------------------------------------------------------------------
/**
 * @name
 * @desc
 *
 */
//------------------------------------------------------------------------
// #region > Http
//------------------------------------------------------------------------
/**
 * @audit-issue
 * @param {import("express").Express} app
 * @param {import("../SERVER").MAGPIE_SERVER} server
 */
module.exports.routes = function (app, server) {
  app.post("/login", server?.PUBLIC?.loginLimiter, async (req, res) => {
    const level = "[POST /login] ";
    try {
      const { email, pass } = req.body;
      if (!email || !pass) throw new Error("Invalid credentials");
      const { token } = await account.verifyCredentials(email, pass, server);
      server.log(
        ePrefix + level + " login passed. ",
        "console",
        MAGPIE.KEY.SERVER.IS_DEV,
      );
      return res.status(http.STATUS_200.code).json({ token });
    } catch (e) {
      const status = e.message?.includes("Invalid credentials")
        ? http.STATUS_401.code
        : e.message?.includes("Account is frozen")
          ? http.STATUS_403.code
          : http.STATUS_500.code;
      if (status === 500) server.error(ePrefix + e.message, e);
      return res.status(status);
    }
  });
  /**
   * @todo server.public.registerLimiter
   * @desc
   * */
  app.post("/register", server.PUBLIC.registerLimiter, async (req, res) => {
    const level = "[POST /register] ";
    try {
      const { email, username, password } = req.body;
      if (!email || !username || !password) {
        res.status(http.STATUS_401);
        throw new Error("Invalid credentials");
      }
      const { player, token, sent } = account.register(
        { email, username, password },
        server,
      );
      if (!token || token === "") {
        res.status(http.STATUS_401);
        throw new Error(`${token} is invalid token. `);
      }
      const success = "registration successful. ";
      server.sysLog(ePrefix + level + success, "server");
      return res.status(http.STATUS_200.code).json({ message: success, token });
    } catch (e) {
      server.sysLog(ePrefix + level + e.message, "error", e);
    }
  });
  /** {@link account.register} */
  app.get("/verify-email", async (req, res) => {
    /** @audit @desc email confirmation */
    const level = "[GET /verify-email] ";
    try {
      res.setHeader(
        MAGPIE.KEY.SERVER.CSP.name,
        `default-src 'self' 'unsafe-inline'; connect-src 'self' ${MAGPIE.KEY.SERVER.DOMAIN} ${MAGPIE.KEY.SERVER.SOCKET_DOMAIN};`,
      );
      const { token } = req.query;
      if (!token) return invalidToken();
      const PLAYER = await account.processEmailConfirmation(token, server);
      const handle = printPlayer(PLAYER.ID, null, PLAYER.username);
      if (!PLAYER?.ID) throw new Error(`${handle} is invalid `);
      server.log(
        ePrefix + level + `${handle}registered.`,
        "console",
        MAGPIE.KEY.SERVER.IS_DEV,
      );
      const successMessage = `<h1>Success!</h1>
        <p>Your account has been activated.</p>
        <p>You may now close this window.</p>`;
      res.status(http.STATUS_200.code).send(successMessage);
      return PLAYER;
    } catch (e) {
      server.error(ePrefix + level + e.message, e);
      res
        .status(http.STATUS_500.code)
        .send(MAGPIE.KEY.SERVER.MESSAGE.INTERNAL_ERROR);
    }
  });
};
// #endregion
//------------------------------------------------------------------------
/**
 *
 * @desc back to {@link }
 *
 */
//========================================================================
// #endregion -
//========================================================================
/**
 *
 * @desc back to {@link account}
 *
 */
//========================================================================
// END OF FILE
//========================================================================
