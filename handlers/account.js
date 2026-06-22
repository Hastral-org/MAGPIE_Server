/**
 * @namespace accountHandler
 * @author Matheraptor
 * @version 0.39.956
 *
 *
 */
const account = {};
const express = require("express");
const router = express.Router();
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
 * @typedef {import("../src/system").MAGPIE_METASTATE} MAGPIE_METASTATE
 * @typedef {import("socket.io").Socket} Socket
 * @typedef {import("./session").player_cache} player_cache
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
      username: username,
      email: email,
      email_hashed: emailHash,
      email_encrypted: emailEncrypted,
      password_encrypted: securedPassword,
    };
    const player = await account.reserveRegistration(payload, server);
    if (!player) throw new Error(`${player} is invalid account:reservation. `);
    server.sysLog(
      ePrefix +
        `[PLAYER-${player?.ID}] reserved for [USER-${username}].\n` +
        `Registration link sent to user's email. `,
    );
    const sent = await mailer.sendConfirmation(email, token);
    if (!sent || !sent?.accepted)
      throw new Error("Could not deliver verification email.");
    server.sysLog(ePrefix + `registration link sent to [USER-${username}]`);
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
 * @param {Request} req
 * @param {Response} res
 * @param {String} token
 * @param {MAGPIE_SERVER} server
 * @returns {Promise<MAGPIE_PLAYER>}
 */
account.processEmailConfirmation = async function (req, res, token, server) {
  try {
    const db = server.DATABASE;
    const decoded = server.JWT.verify(token, server.config.jwtSecret);
    if (!decoded?.isRegistrationToken) return invalidToken();
    const username = decoded?.username;
    const player = await db.getPlayerByUsername(username);
    if (!player) throw new Error(`unable to fetch [PLAYER-${username}]`);
    player.isFrozen = false;
    await player.set();
    return player;
  } catch (e) {
    if (e.message.includes("jwt expired")) {
      const expired =
        "<p>The email confirmation token has expired.</p>" +
        "<p>Please, request a new registration link.</p>";
      res.status(MAGPIE.KEY.HTTP.STATUS_410.code).send(expired);
    }
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
/**
 *
 * @param {email} email
 * @param {String} password
 * @param {Object} server
 * @returns {{player: MAGPIE_PLAYER, token: String }}
 */
account.verifyCredentials = async function (email, password, server) {
  /** @type {MAGPIE_DATABASE} */
  const db = server.DATABASE;
  const level = "[verifyCredentials] ";
  /** @type {MAGPIE_PLAYER} */
  const player = await db.loginPlayer(email, password);
  const fail = http.STATUS_401.code;
  if (!player) return { code: fail };
  if (player.isFrozen) {
    const code = http.STATUS_403.code;
    const message = `${ePrefix}${level}[${code}] [PLAYER-${player.ID}]`;
    server.sysLog(message, "server");
    return { code: code };
  }
  const token = jwt.sign(
    {
      id: player.ID,
      username: player.username,
    },
    server.config.jwtSecret,
    { expiresIn: server.config.jwtExpire },
  );
  return { player, token, code: http.STATUS_200.code };
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
  const level = "[resumeSession] ";
  try {
    const { player, token, code } = await account.verifyCredentials(
      data.email,
      data.password,
      server,
    );
    if (code !== http.STATUS_200.code)
      throw new Error(`${ePrefix}${level} [${code}] `);
    const success = `${ePrefix}${account.printPlayerAuth(player)}resumed session. `;
    account.setPlayerSession(socket, player, success, server);
    const playerData = account.getPlayerData(player, true);
    socket.emit("RESUME_SESSION_SUCCESS", {
      code,
      token,
      server_status: server.meta?.status,
      playerData,
    });
    server.sysLog(success, "console");
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
/**
 *
 * @param {MAGPIE_PLAYER} player
 * @param {Socket} socket
 * @param {MAGPIE_SERVER} server
 * @returns {player_cache}
 */
account.setPlayerCache = function (player, socket, server) {
  const level = "[setPlayerCache] ";
  try {
    if (!player?.ID) throw new Error(`${player} is invalid MAGPIE_PLAYER`);
    const state = server.METASTATE.session;
    const playerID = player.ID;
    /** @type {player_cache} */
    const cache = state.get(playerID) || {
      sockets: [],
      playerID: player.ID,
      username: player.username,
      slot: player.slots,
      EVP: player.EVP,
      CLOUT: player.CLOUT,
      joined: Date.now(),
      graceTimer: null,
    };
    cache.sockets.push(socket.id);
    state.set(playerID, cache);
    server.sysLog(
      ePrefix +
        level +
        `[PLAYER-${playerID}] set.
      sockets: ${Number(cache.sockets.length)}
      username: ${String(cache.username)}
      joined: ${Number(cache.joined)}
      graceTimer: ${String(cache.graceTimer)}`,
    );
    return cache;
  } catch (e) {
    server.error(ePrefix + level + e.message, e);
  }
};
/**
 *
 * @param {Object} data
 * @param {Socket} socket
 * @param {MAGPIE_SERVER} server
 */
account.login = async function (data, socket, server) {
  const level = "[login] ";
  let http_code = NaN;
  try {
    const { player, token, code } = await account.verifyCredentials(
      data.email,
      data.password,
      server,
    );
    if (code !== 200) {
      http_code = code;
      throw new Error(`${ePrefix}${level}[${code}]`);
    }
    const server_status = server.meta?.status;
    const success = `${ePrefix}${account.printPlayerAuth(player)} logged in. `;
    account.setPlayerSession(socket, player, success, server);
    const playerData = account.getPlayerData(player, true);
    socket.emit("LOGIN_SUCCESS", {
      code,
      message: success,
      token,
      server_status,
      playerData,
    });
    server.sysLog(`${success}`, "console");
  } catch (e) {
    socket.emit(`LOGIN_ERROR`, { message: e.message, code: http_code });
    server.sysLog(ePrefix + e.message, "server", e);
  }
};
account.setPlayerSession = function (socket, player, message, server) {
  /** @type {MAGPIE_METASTATE} */
  const state = server.METASTATE.session;
  /** @type {player_cache} */
  const player_cache = account.setPlayerCache(player, socket, server);
  const isOnline = true;
  const data = account.setPlayerData(socket, player, isOnline);
  server.sysLog(
    ePrefix + `[setPlayerSession] socket.data: ${JSON.stringify(data)}`,
  );
};
/**
 * @audit replacing account.disconnect with [session.disconnect]("./session.js")
 */
account.disconnect = async function (reason, socket, server) {
  try {
    // /** @type {MAGPIE_METASTATE} */
    // const state = server.METASTATE;
    // state._socket_disconnect({ reason, socket, server });
  } catch (e) {
    server.error(ePrefix + e.message, e);
  }
};
account.logout = async function (data, socket, server) {
  try {
    //@todo logout logic here
    server.sysLog(`${ePrefix} [PLAYER-${data?.username}] logging out. `);
    socket.emit("LOGGED_OUT", {
      code: http.STATUS_205.code,
      message: "player logged out. ",
    });
  } catch (e) {
    server.error(ePrefix + e.message, e);
    socket.emit("LOGOUT_ERROR", {
      code: http.STATUS_500.code,
      message: "Logout failed. ",
    });
  }
};
account.relog = async function (data, socket, server) {
  const level = "[relog] ";
  try {
    /** @type {MAGPIE_METASTATE} */
    const state = server.METASTATE.session;
    if (!data?.playerID) {
      const code = http.STATUS_401.code;
      server.sysLog(
        ePrefix + level + `[${code}]: playerID: ${data?.playerID}. `,
      );
      return socket.emit("LOGIN_ERROR", {
        code: code,
        message: "Invalid credentials. Fresh login required. ",
      });
    }
    const playerID = data.playerID;
    /** @type {MAGPIE_PLAYER} */
    const player = await server.DATABASE.loadPlayer(playerID);
    if (!player) {
      state.delete(playerID);
      const code = http.STATUS_404.code;
      server.sysLog(ePrefix + level + `[${code}] `);
      return socket.emit("LOGIN_ERROR", {
        code: code,
        message: `[PLAYER-${playerID}] not in database. Please, register. `,
      });
    }
    const isOnline = true;
    /** @type {player_cache} */
    const player_cache = account.setPlayerCache(player, socket, server);
    player_cache.joined = Date.now();
    player_cache.graceTimer = null;
    account.setPlayerData(socket, player, isOnline);
    const playerData = account.getPlayerData(player, isOnline);
    const code = http.STATUS_200.code;
    const token = jwt.sign(
      { id: player.ID, username: player.username },
      server.config.jwtSecret,
      { expiresIn: server.config.jwtExpire },
    );
    const playerHandle = `[PLAYER-${playerID} | ${player.username}] `;
    const backOnline = `${playerHandle}is back online. `;
    socket.emit("RELOGGED", {
      code: code,
      message: backOnline,
      token,
      server_status: server.meta?.status,
      playerData,
    });
    server.sysLog(ePrefix + level + `[${code}]: ${backOnline}`);
  } catch (e) {
    socket.emit(`LOGIN_ERROR`, { message: e.message });
    server.error(ePrefix + e.message, e);
  }
};
/**
 *
 * @param {MAGPIE_PLAYER} player
 * @param {Boolean} isOnline
 * @returns {player_data}
 */
account.getPlayerData = function (player, isOnline = true) {
  if (!player) return false;
  return {
    playerID: player.ID,
    username: player.username,
    playerSlots: player.slots,
    playerEVP: player.EVP,
    playerCLOUT: player.CLOUT,
    playerStatus: isOnline,
  };
}; /**
 *
 * @param {*} socket
 * @param {MAGPIE_PLAYER} player
 * @param {Boolean} isOnline
 * @returns {Boolean}
 */
account.setPlayerData = function (socket, player, isOnline = true) {
  if (!socket || !player) return false;
  const data = account.getPlayerData(player, isOnline);
  for (const [key, value] of Object.entries(data)) {
    // Avoid '@socket.io/admin-ui' proxy crashing on `null` values
    socket.data[key] = value === null ? undefined : value;
  }
  return socket.data;
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
 * @name
 * @desc
 *
 */
//------------------------------------------------------------------------
// #region > Session
//------------------------------------------------------------------------
/**
 *
 * @param {playerID} playerID
 * @param {Socket} socket
 * @param {MAGPIE_SERVER} server
 */
account.verifySession = async function (playerID, socket, server) {
  const level = "[verifySession] ";
  try {
    const state = server.METASTATE.session;
    const handle = `[PLAYER-${playerID}]`;
    /** @type {player_cache} */
    const playerCache = state.get(playerID);
    if (playerCache) {
      const success = `${ePrefix}${level}${`resuming session for ${handle}. `}`;
      server.sysLog(success, "console");
      socket.emit("isAllowedBackIn", {
        playerData: playerCache,
        token: socket.data.token,
      });
    } else {
      const fail = `${ePrefix}${level}no active sessions for ${handle}.`;
      server.sysLog(fail, "console");
      socket.emit("sessionTimedOut");
    }
  } catch (e) {
    server.error(ePrefix + level + e.message, e);
    socket.emit("sessionTimedOut");
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
account.init = function (io, socket, server) {
  server.sysLog(
    ePrefix +
      `[SOCKET-${socket?.id}] initialized. ${server.meta.firmwareDate} `,
  );
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
  socket.on("REGISTER", async (data) => {
    server.sysLog(ePrefix + `[SOCKET-${socket.id}] [REGISTER] ⧖`);
    await account.register(data, server);
  });
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
  socket.on("disconnect", async (reason) => {
    await account.disconnect(reason, socket, server);
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
const resolveLimiter = function (key) {
  return (req, res, next) => {
    const limiter = req.server?.PUBLIC?.[key];
    if (limiter) return limiter(req, res, next);
    next();
  };
};
router.get("/login", async (req, res) => {
  const level = "[GET /login] ";
  const server = req.server;
  try {
    res.redirect("/?view=login");
  } catch (e) {
    server.sysLog(ePrefix + level + e.message, "error", e);
  }
});
router.post("/login", resolveLimiter("loginLimiter"), async (req, res) => {
  const level = "[POST /login] ";
  try {
    const { email, pass } = req.body;
    if (!email || !pass) throw new Error("Invalid credentials");
    const { token, code } = await account.verifyCredentials(
      email,
      pass,
      server,
    );
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
 *
 * @desc
 * */
router.post(
  "/register",
  resolveLimiter("registerLimiter"),
  async (req, res) => {
    const level = "[POST /register] ";
    const server = req.server;
    try {
      const { email, username, password } = req.body;
      console.log(
        ePrefix + level + `initiating registration for [PLAYER-${username}]`,
      );
      if (!email || !username || !password) {
        res.status(http.STATUS_401.code);
        throw new Error("Invalid credentials");
      }
      const { player, token, sent } = await account.register(
        { email, username, password },
        server,
      );
      if (!player || player?.constructor?.name !== "MAGPIE_PLAYER")
        throw new Error(`${player} is invalid MAGPIE_PLAYER`);
      if (!token || token === "") {
        res.status(http.STATUS_401.code);
        throw new Error(`${token} is invalid token. `);
      }
      const success = "registration successful. ";
      const responseBody = { message: success, token };
      const successMessage = ePrefix + level + `[PLAYER-${username}]` + success;
      res.status(http.STATUS_200.code).json(responseBody);
      server.sysLog(successMessage, "server");
      return responseBody;
    } catch (e) {
      server.sysLog(ePrefix + level + e.message, "error", e);
    }
  },
);
/** {@link account.register} */
router.get("/verify-email", async (req, res) => {
  /** @audit @desc email confirmation */
  const level = "[GET /verify-email] ";
  const server = req.server;
  try {
    res.setHeader(
      MAGPIE.KEY.SERVER.CSP.name,
      `default-src 'self' 'unsafe-inline'; connect-src 'self' ${MAGPIE.KEY.SERVER.DOMAIN} ${MAGPIE.KEY.SERVER.SOCKET_DOMAIN};`,
    );
    const { token } = req.query;
    if (!token) return invalidToken();
    const PLAYER = await account.processEmailConfirmation(
      req,
      res,
      token,
      server,
    );
    const handle = printPlayer(PLAYER?.ID, null, PLAYER?.username);
    if (!PLAYER?.ID) throw new Error(`${handle}is invalid MAGPIE_PLAYER. `);
    server.log(
      ePrefix + level + `${handle}registered.`,
      "console",
      MAGPIE.KEY.SERVER.IS_DEV,
    );
    /** @todo unified html responses */
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
router.get("/test", (req, res) => {
  const server = req.server;
  res.send("hello");
  server.log(ePrefix + "hello");
});

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
module.exports = { account, router };
