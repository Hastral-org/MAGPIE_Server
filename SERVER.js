/**
 * @name MAGPIE_Server
 * @desc
 * @author Matheraptor
 * @version 0.39.95
 * @typedef {MAGPIE_SERVER} MAGPIE_SERVER
 */
class MAGPIE_SERVER {
  //
}
/**
 * @name INDEX
 * @desc init & dependencies
 */
//========================================================================
// #region - INDEX
//========================================================================
/**
 * @name
 * @desc
 *
 */
//------------------------------------------------------------------------
// #region > require
//------------------------------------------------------------------------

MAGPIE_SERVER.config = require("./config/server_config");
const { timeEnd } = require("node:console");
const express = require("express");
const ratelimit = require("express-rate-limit");
const http = require("node:http");
const { createServer } = require("node:http");
const { Server } = require("socket.io");
const { instrument } = require("@socket.io/admin-ui");
const cliSpinner = require("cli-spinner");
const cliProgress = require("cli-progress");
const fs = require("fs");
const path = require("path");
const vm = require("node:vm");
const readline = require("readline");
/**
 * @typedef {import("jsonwebtoken")} jwt
 * @type {jwt}
 */
const jwt = require("jsonwebtoken");
MAGPIE_SERVER.MAIL = require("./src/services/mailer");
MAGPIE_SERVER.FS = fs;
MAGPIE_SERVER.PATH = path;
MAGPIE_SERVER.VM = vm;
MAGPIE_SERVER.JWT = jwt;
// #endregion
//------------------------------------------------------------------------
/**
 * @name
 * @desc
 *
 */
//------------------------------------------------------------------------
// #region > Internal
//------------------------------------------------------------------------
const { MAGPIE } = require("./src/index");
const SYSTEM = require("./src/system");
const { MAGPIE_PHYSICS } = require("./src/physics");
const COMPONENT = require("./src/component");
const { MAGPIE_ENTITY } = require("./src/entity");
const { MAGPIE_PLAYER } = require("./src/player");
const { MAGPIE_DATABASE } = require("./src/database");
const STATES = require("./data/states");
const COMPONENTS = require("./data/components");
const EMOTES = require("./data/emotes");
// MAGPIE.KEY.STATE.TYPE = STATE?.TYPE || {}
// MAGPIE.KEY.STATE.INDEX = STATE?.INDEX || {}
const {
  MAGPIE_SYSTEM,
  MAGPIE_LOG,
  MAGPIE_IO,
  MAGPIE_HIVE,
  MAGPIE_RUNTIME,
  MAGPIE_METASTATE,
  MAGPIE_DATE,
  MAGPIE_CALENDAR,
  MAGPIE_LOADBAR,
} = SYSTEM;
const {
  MAGPIE_COMPONENT,
  MAGPIE_STATE,
  MAGPIE_EMOTE,
  MAGPIE_EXP,
  MAGPIE_KEY,
  MAGPIE_CONTEXT,
  MAGPIE_TICKET,
  MAGPIE_SYMBOL,
  MAGPIE_ENGINE,
  MAGPIE_PROPULSOR,
  MAGPIE_POWERTRAIN,
  MAGPIE_CONTAINER,
} = COMPONENT;
MAGPIE_SERVER.registry = {
  MAGPIE,
  MAGPIE_SYSTEM,
  MAGPIE_LOG,
  MAGPIE_IO,
  MAGPIE_RUNTIME,
  MAGPIE_HIVE,
  MAGPIE_METASTATE,
  MAGPIE_DATE,
  MAGPIE_CALENDAR,
  MAGPIE_PHYSICS,
  MAGPIE_COMPONENT,
  MAGPIE_EXP,
  MAGPIE_KEY,
  MAGPIE_EMOTE,
  MAGPIE_ENTITY,
  MAGPIE_PLAYER,
  MAGPIE_DATABASE,
  MAGPIE_SYMBOL,
  MAGPIE_CONTEXT,
  MAGPIE_TICKET,
  MAGPIE_STATE,
  MAGPIE_ENGINE,
  MAGPIE_PROPULSOR,
  MAGPIE_POWERTRAIN,
  MAGPIE_CONTAINER,
  MAGPIE_LOADBAR,
};
// #endregion
//------------------------------------------------------------------------
/**
 * @name
 * @desc
 *
 */
//------------------------------------------------------------------------
// #region > Index
//------------------------------------------------------------------------
MAGPIE_SERVER.meta = MAGPIE.meta;
MAGPIE_SERVER.meta.name += " Server";
MAGPIE_SERVER.perf = {
  start: performance.now(),
  /** @type {Number} */
  end: NaN,
};
// #endregion
//------------------------------------------------------------------------
/**
 *
 * @desc back to {@link }
 *
 */
//========================================================================
// #endregion - IMPORT
//========================================================================
/**
 * @name
 * @desc
 * @typedef {import("./src/index").urgency} urgency
 * @typedef {import("./src/index").gravity} gravity
 * @typedef {import("./src/index").ambiguity} ambiguity
 */
//========================================================================
// #region - SERVER
//========================================================================
/**
 * @desc {@link MAGPIE_SERVER.SOCKET.meta}
 */
MAGPIE_SERVER.SOCKET = {};
/**
 * @desc {@link MAGPIE_SERVER.SESSION.meta}
 */
MAGPIE_SERVER.SESSION = {};
/**
 * @name
 * @desc
 *
 */
//------------------------------------------------------------------------
// #region > Logging
//------------------------------------------------------------------------
// MAGPIE_SERVER.LOG = MAGPIE_LOG
/**
 *
 * @param {String} message
 * @param {String} prefix
 * @param {Boolean} logToConsole
 */
MAGPIE_SERVER.log = function serverLog(message, prefix, logToConsole) {
  MAGPIE_SYSTEM.log(message, prefix, logToConsole);
  r.displayPrompt(true);
};
/**
 *
 * @param {String} message
 * @param {String} prefix
 * @param {Error} error
 */
MAGPIE_SERVER.sysLog = function systemLog(message, prefix, error = null) {
  MAGPIE_SYSTEM.sysLog(message, prefix, error);
  r?.displayPrompt(true);
};
/**
 *
 * @param {String} message
 * @param {String} prefix
 */
MAGPIE_SERVER.silentLog = function (message, prefix) {
  MAGPIE_SYSTEM.silentLog(message, prefix);
};
/**
 *
 * @param {String} message
 * @param {Error} error
 */
MAGPIE_SERVER.error = function serverError(message, error) {
  MAGPIE_SYSTEM.error.call(this, message, error);
};
/**
 *
 * @param {String} message
 * @returns
 */
MAGPIE_SYSTEM._logging_debug = function server_debug(message) {
  if (r.cursor > 0) return;
  console.clear();
  console.error(new Error(message + "\n"));
  r.displayPrompt();
  // lastMessage = message;
};
/**
 *
 * @param {String} message
 */
MAGPIE_SERVER._debug = function serverDebug(message) {
  MAGPIE_SYSTEM._logging_debug.call(this, message);
};
/**
 *
 * @param {String} message
 */
MAGPIE_SERVER.log_exp = function serverLogExp(message) {
  MAGPIE_SYSTEM.logging.log_exp.call(this, message);
};
// #endregion
//------------------------------------------------------------------------
/**
 * @name
 * @desc
 *
 */
//------------------------------------------------------------------------
// #region > System
//------------------------------------------------------------------------
MAGPIE_SERVER.SYSTEM = {};
// #endregion
//------------------------------------------------------------------------
/**
 * @name
 * @desc
 *
 */
//------------------------------------------------------------------------
// #region > Handlers
//------------------------------------------------------------------------
MAGPIE_SERVER.handlers = {
  account_socket: require("./handlers/account").account.init,
  client: require("./handlers/client"),
  email_api: require("./handlers/email_api"),
  entities: require("./handlers/entities"),
  players: require("./handlers/players"),
  session: require("./handlers/session"),
};
// MAGPIE_SERVER.SYSTEM._handlersPath = process.cwd() + "\\handlers";
// fs.readdirSync(MAGPIE_SERVER.SYSTEM._handlersPath).forEach((file) => {
//   const filename = file.replace(".js", "");
//   const handler = require(`./handlers/${filename}`);
//   const handlerName = filename;
//   MAGPIE_SERVER.handlers[handlerName] = handler;
// });
// #endregion
//------------------------------------------------------------------------
/**
 * @name
 * @desc
 *
 */
//------------------------------------------------------------------------
// #region > App
//------------------------------------------------------------------------
const app = express();
const server = createServer(app);
MAGPIE_SERVER.SOCKET.io = "Server";
const io = new Server(server, {
  //@audit-ok cors configs
  cors: {
    origin: [MAGPIE.KEY.SERVER.DOMAIN],
    methods: ["GET", "POST"],
    credentials: true,
  },
  transports: ["websocket", "polling"],
  allowUpgrades: true,
});
instrument(io, {
  auth: false,
  mode: "development",
});
app.use((req, res, next) => {
  // @audit-ok [HTTP REQUEST] debug logging
  MAGPIE_SERVER.log(`[HTTP REQUEST] ${req.method} ${req.url}`);
  next();
});
const static = MAGPIE_SERVER.PATH.join(process.cwd(), "public");
app.use(express.static(static));
console.log(static);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const accountRouter = require("./handlers/account").router;
app.use((req, res, next) => {
  req.server = MAGPIE_SERVER;
  next();
});
app.use("/account", accountRouter);
/**
 *
 *
 */
MAGPIE_SERVER.PUBLIC = {};
MAGPIE_SERVER.PUBLIC.loginLimiter = ratelimit.rateLimit({
  windowMs: MAGPIE.KEY.SERVER.LOGIN_COOLDOWN * 60 * 1000,
  max: MAGPIE.KEY.SERVER.LOGIN_MAX_ATTEMPTS,
  handler: (req, res, next, options) => {
    const code = MAGPIE.KEY.HTTP.STATUS_429.code;
    const resetTime = req.rateLimit.resetTime;
    const remainingMs = resetTime - Date.now();
    const minutes = Math.ceil(remainingMs / (60 * 1000));
    res.status(code).json({
      status: code,
      error: MAGPIE.KEY.SERVER.LOGIN_MAX_ATTEMPTS,
      message: `Please, wait ${minutes} minute(s) before trying again.`,
      retryAfter: minutes,
    });
  },
  standardHeaders: true,
  legacyHeaders: false,
});
MAGPIE_SERVER.PUBLIC.registerLimit = ratelimit.rateLimit({
  windowMs: MAGPIE.KEY.SERVER.LOGIN_COOLDOWN * 60 * 1000,
  max: MAGPIE.KEY.SERVER.LOGIN_MAX_ATTEMPTS,
  handler: (req, res, next, options) => {
    const code = MAGPIE.KEY.HTTP.STATUS_429.code;
    const resetTime = req.rateLimit.resetTime;
    const remainingMs = resetTime - Date.now();
    const minutes = Math.ceil(remainingMs / (60 * 1000));
    res.status(code).json({
      status: code,
      error: MAGPIE.KEY.SERVER.LOGIN_MAX_ATTEMPTS,
      message: `Please, wait ${minutes} minute(s) before trying again.`,
      retryAfter: minutes,
    });
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// #endregion
//------------------------------------------------------------------------
/**
 * @name
 * @desc
 *
 */
//------------------------------------------------------------------------
// #region > Inbox
//------------------------------------------------------------------------
MAGPIE_SERVER.INBOX = {};
MAGPIE_SERVER.INBOX.handles = {
  runtime: 0,
  hive: 1,
  account: 2,
  ux: 3,
  message: 4,
  log: 5,
};
/** @type {Map<ticketID, MAGPIE_TICKET>} */
MAGPIE_SERVER.INBOX.runtime = new Map();
/** @type {Map<ticketID, MAGPIE_TICKET>} */
MAGPIE_SERVER.INBOX.hive = new Map();
/** @type {Map<ticketID, MAGPIE_TICKET>} */
MAGPIE_SERVER.INBOX.account = new Map();
/** @type {Map<ticketID, MAGPIE_TICKET>} */
MAGPIE_SERVER.INBOX.ux = new Map();
/** @type {Map<ticketID, MAGPIE_TICKET>} */
MAGPIE_SERVER.INBOX.message = new Map();
/** @type {Map<ticketID, MAGPIE_TICKET>} */
MAGPIE_SERVER.INBOX.log = new Map();
/**
 * @typedef {import("socket.io").Event} socketEvent
 * @typedef {import("./src/component").ticket_payload} ticket_payload
 * @typedef {import("./src/component").ticket_data} ticket_data
 * @typedef {import("./src/component").ticketID} ticketID
 *
 * @param {socket} socket
 * @param {socketEvent} event
 * @param {Number} queue
 */
MAGPIE_SERVER.INBOX.route = function routeSocketEvent(socket, event) {
  const ePrefix = "[INBOX] ";
  try {
    if (!event || typeof event !== "object")
      throw new Error(`${event} is invalid socketEvent. `);
    const handle = event[1]?.handle;
    /** @type {Map<ticketID, MAGPIE_TICKET>} */
    const queue = MAGPIE_SERVER.INBOX[handle];
    if (!queue || Object.prototype.toString.call(queue) !== "[Object map]")
      throw new Error(`${handle} is invalid INBOX handle. `);
    /** @type {ticket_data} */
    const ticket_data = {
      event: socketEvent[0],
      payload: socketEvent[1],
      arguments: socketEvent.slice(2),
      urgency: Number(event?.urgency),
      gravity: Number(event?.gravity),
      ambiguity: Number(event?.ambiguity),
    };
    const ticket = new MAGPIE_TICKET(ticket_data);
    queue.set(ticket.ID, ticket);
    MAGPIE_SERVER.log(ePrefix + `[SOCKET-${socket.id}]: ${event[0]}`);
  } catch {
    MAGPIE_SERVER.error(ePrefix + e.message, e);
  }
};
/**
 * @typedef {import("./src/component").MAGPIE_TICKET} MAGPIE_TICKET
 * @param {MAGPIE_TICKET} ticket
 * @param {Number} queue
 */
MAGPIE_SERVER.INBOX.assign = function assignTicket(ticket, queue) {
  const ePrefix = "[INBOX] ";
  try {
  } catch {
    MAGPIE_SERVER.error(ePrefix + e.message, e);
  }
};
// #endregion
//------------------------------------------------------------------------
/**
 * @name
 * @desc
 * @typedef {import("socket.io").Socket} socket
 * @typedef {String} socketID
 * @typedef {String} jwt_token
 * @typedef {import("./src/player").playerID} playerID
 * @typedef {import("./src/player").username} username
 * @typedef {import("./src/player").email_encrypted} email_encrypted
 * @typedef {import("./src/entity").entityID} entityID
 * @typedef {{
 * token: jwt_token,
 * playerID: playerID,
 * username: username,
 * entityID: entityID
 * }} auth
 */
//------------------------------------------------------------------------
// #region > Socket
//------------------------------------------------------------------------
MAGPIE_SERVER.SOCKET.meta = {
  //
};
io.use((socket, next) => {
  /**
   *
   * @type {auth}
   * */
  const auth = socket.handshake.auth;
  const token = auth?.token;
  const config = MAGPIE.config;
  const isDev = config.devMode;
  const ePrefix = `[SOCKET-${socket?.id}] `;
  const code = MAGPIE.KEY.HTTP.STATUS_401.code;
  if (!token) {
    if (isDev) {
      socket.data.playerID = 999;
      return next();
    }
    socket.data.playerID = 0;
    return next(new Error(`[${code}]: missing token`));
  }
  try {
    // @todo JWT login security
    const decoded = MAGPIE_SERVER.JWT.verify(token, config.jwtSecret);
    socket.data.playerID = decoded.id;
    next();
  } catch (e) {
    socket.data.playerID = 0;
    const err = new Error(errorMessage);
    const code = MAGPIE.KEY.HTTP.STATUS_401.code;
    socket.emit("AUTH_EXPIRED", {
      code: code,
      message: errorMessage,
    });
    const message = `[AUTH - ${code}] [SOCKET-${socket.id}] ${err.message}. `;
    MAGPIE_SERVER.silentLog(message, "console");
    next(new Error(message));
  }
});
io.on("connection", (socket) => {
  const playerID = String(socket.data.playerID);
  const ePrefix = `[SOCKET-${socket?.id}] `;
  const ePlayer = `[PLAYER-${playerID}] `;
  MAGPIE_SERVER.log(ePrefix + "connected");
  socket.use(([event, ...args], next) => {
    MAGPIE_SERVER.log(
      `${ePrefix}${ePlayer}${event} — ${JSON.stringify(args)}`,
      "console",
      false,
    );
    if (socket.data.isFrozen && event !== "chat message") {
      socket.emit("error_message", "You are frozen!");
      return MAGPIE_SERVER.log(`${ePrefix}${ePlayer} is frozen`);
    }
    next();
  });
  MAGPIE_SERVER.handlers.account_socket(io, socket, MAGPIE_SERVER);
  MAGPIE_SERVER.handlers.client(io, socket, MAGPIE_SERVER);
  MAGPIE_SERVER.handlers.entities(io, socket, MAGPIE_SERVER);
  MAGPIE_SERVER.handlers.players(io, socket, MAGPIE_SERVER);
  MAGPIE_SERVER.handlers.session(io, socket, MAGPIE_SERVER);
  socket.on(MAGPIE.KEY.SERVER.EVENT_REQUEST, (event) => {
    try {
      if (!event) throw new Error(`${event} is invalid socketEvent. `);
      /** @type {MAGPIE_TICKET} */
      const ticket = MAGPIE_SERVER.INBOX.route(socket, event);
      /** @type {ticket_payload} */
      const ticket_payload = {
        code: MAGPIE.KEY.HTTP.STATUS_200.code,
        event: "REQUEST_ERROR",
        handleID: MAGPIE_SERVER.INBOX.handles.log,
        message: `[TICKET-${ticket?.ID}] queued. `,
      };
      socket.emit(MAGPIE.KEY.SERVER.EVENT_RESPONSE, ticket_payload);
    } catch {
      MAGPIE_SERVER.error(ePrefix + e.message, e);
    }
  });
  socket.on(MAGPIE.KEY.SERVER.EVENT_RESPONSE, (event) => {});
  socket.on("disconnect", (reason) => {
    if (playerID !== 0)
      MAGPIE_SERVER.log(
        `${ePrefix}${ePlayer} disconnected: ${reason}`,
        "console",
        false,
      );
  });
  socket.on("error", (err) => {
    socket.emit("error_message", err.message);
  });
});
MAGPIE_SERVER.status = {};
/**
 *
 * @param {String} socketID
 */
MAGPIE_SERVER.SOCKET.auth_dev = function auth_dev(socketID) {
  MAGPIE_SERVER.log(
    "[AUTH] [DEV] Dev-mode active. bypassing JWT for " + `[SOCKET-${socketID}]`,
  );
};
// #endregion
//------------------------------------------------------------------------
/**
 * @name
 * @desc
 *
 */
//------------------------------------------------------------------------
// #region > Routes
//------------------------------------------------------------------------

// #endregion
//------------------------------------------------------------------------
/**
 * @name
 * @desc
 *
 */
//------------------------------------------------------------------------
// #region > Tests
//------------------------------------------------------------------------
MAGPIE_SERVER.TEST = {};
MAGPIE_SERVER.TEST.meta = {
  name: MAGPIE.meta.name + "testing",
};
MAGPIE_SERVER.TEST.Path = ".tests";
MAGPIE_SERVER.TEST.list = fs
  .readdirSync(path.join(process.cwd(), MAGPIE_SERVER.TEST.Path))
  .filter((string) => string.includes(".js"));
if (MAGPIE_SERVER.TEST.list && MAGPIE_SERVER.TEST.list.length > 0) {
  MAGPIE_SERVER.TEST.list.forEach((testFile) => {
    const testName = testFile.replace(".js", "");
    console.log(`[TEST] processing ${testName}...`);
    const fullPath = path.resolve(
      process.cwd(),
      MAGPIE_SERVER.TEST.Path,
      testFile,
    );
    MAGPIE_SERVER.TEST[testName] = require(fullPath);
  });
}
MAGPIE_SERVER.testLog = function (message, prefix = "log", error = "") {
  const callback = console[prefix];
  callback(message, error);
  fs.appendFileSync(
    path.join(process.cwd(), MAGPIE_SERVER.TEST.Path, ".test.log"),
    message,
  );
};

//   tests.forEach((testFile) => {
//     const testName = testFile.replace(".js", "");
//     MAGPIE_SERVER.TEST[testName] = require(`${testPath}\\${testFile}`);
//   });
// }
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
// #region - SERVICE
//========================================================================
/**
 * @name runtime
 * @desc
 *
 */
//------------------------------------------------------------------------
// #region > Runtime
//------------------------------------------------------------------------
/**
 *
 * @param {MAGPIE_SYSTEM} guest
 * @param {Number} layerID
 * @param {Number} switchID
 * @param {Number} layer_frame
 *
 */
MAGPIE_RUNTIME.prototype.guestRefresh = function guestRefresh(
  guest,
  layerID,
  switchID,
  layer_frame,
) {
  /** @type {MAGPIE_SYSTEM} */
  const system = r.context[guest];
  if (!system || isNaN(layerID)) return;
  const pass = system.refresh(layerID, switchID, layer_frame);
  if (!pass) this.kick(guest, layerID);
};
// MAGPIE_SERVER.SYS._runtime_guestRefresh = MAGPIE_RUNTIME.__guestRefresh;
// MAGPIE_SERVER.SYS._runtime_loadMetastate = MAGPIE_RUNTIME._loadMetastate;
MAGPIE_RUNTIME.prototype.loadMetastate = function loadMetastate() {
  const ePrefix = "[RUNTIME].loadMetastate: ";
  let state = null;
  try {
    state = MAGPIE_DATABASE.loadMetastate();
    if (!(state instanceof MAGPIE_METASTATE))
      throw new Error(`${state} is invalid MAGPIE_METASTATE`);
    if (!(state.date instanceof MAGPIE_DATE)) state.date = new MAGPIE_DATE();
  } catch (e) {
    MAGPIE_SERVER.error(ePrefix + e.message, e);
    state = new MAGPIE_METASTATE();
  } finally {
    this.host("METASTATE", 0);
    r.context["METASTATE"] = state;
    const message =
      `[metastate-${state.meta.updated}] loaded | ` +
      `[metadate-${state.date.printDate()}Z]`;
    MAGPIE_LOG.pushConsole(ePrefix + message);
  }
};
/**
 *
 * @returns
 */
MAGPIE_RUNTIME.prototype.saveMetastate = function saveMetastate() {
  const state = r.context.METASTATE;
  if (!state) return;
  return MAGPIE_DATABASE.saveMetastate(state);
};
// #endregion
//------------------------------------------------------------------------
/**
 * @name
 * @desc
 *
 */
//------------------------------------------------------------------------
// #region > Physics
//------------------------------------------------------------------------
/**
 *
 * @param {{
 * C: MAGPIE_ENTITY,
 * C0: coords,
 * C1: coords,
 * CB: vector3
 * }} data
 * @returns {{Ac: vector3, Tc: bivector}}
 */
MAGPIE_PHYSICS._geod_checkCollisions = function _geod_checkCollisions(data) {
  const ePrefix = "[PHYSICS].checkCollisions: ";
  try {
    const { C, C0, C1, CB } = data;
    // MAGPIE_SERVER.HIVE._geod_checkCollisions()
    const Ac = [0, 0, 0];
    const Tc = [0, 0, 0];
    return { Ac, Tc };
  } catch (e) {
    MAGPIE_SERVER.error(ePrefix + e.message, e);
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
// #region > Metastate
//------------------------------------------------------------------------
// MAGPIE_SERVER.SYS._metastate_tick_base = MAGPIE_METASTATE._TICK_base;
MAGPIE_METASTATE.__getSync = function (method, arguments) {
  const callback = MAGPIE_DATABASE[method];
  return callback(...arguments);
};
MAGPIE_METASTATE.__set = async function (method, arguments) {
  const callback = MAGPIE_DATABASE[method];
  return await callback(...arguments);
};
MAGPIE_METASTATE.__setSync = function (method, arguments) {
  const callback = MAGPIE_DATABASE[method];
  return callback(...arguments);
};
MAGPIE_METASTATE.prototype.TICK_base = async function TICK_base(
  layerID,
  switchID,
) {
  const now = performance.now();
  this.date.millisecond = Math.floor(now % 1000);
  if (switchID === 2) {
    this._socketEmit();
    return this.date.TICK();
  }
};
MAGPIE_METASTATE.prototype.TICK_game = async function TICK_game() {
  //
};
MAGPIE_METASTATE.prototype.TICK_standard = async function TICK_standard() {
  //
};
MAGPIE_METASTATE.prototype.TICK_super = async function TICK_super() {
  //
};
MAGPIE_METASTATE.prototype.TICK_mega = async function TICK_mega() {
  //
};
MAGPIE_METASTATE.prototype.TICK_ultra = async function TICK_ultra() {
  //
};
/**
 * {@link MAGPIE_METASTATE._socketEmit}
 */
MAGPIE_METASTATE.prototype._socketEmit = function _socketEmit() {
  const metastate = {};
  const calendar = this.date.getCalendar();
  metastate.meta = this.meta;
  metastate.date = this.date;
  metastate.weekDayName = this.date.getWeekDayName();
  ((metastate.calendar = this.date.getCalendar()),
    (metastate.hive = this.hive),
    (metastate.contents = this.contents));
  metastate.calendarName = calendar.name;
  io.emit("metastate", metastate);
};

// #endregion
//------------------------------------------------------------------------
/**
 * @name Hive
 * @desc
 * @typedef {MAGPIE_ENTITY[]} hive_buffer
 */
//------------------------------------------------------------------------
// #region > Hive
//------------------------------------------------------------------------
MAGPIE_HIVE.__server = {};

/**
 * @name
 * @typedef {import("./core/index").duration} duration
 *
 */
//------------------------------------------------------------------------
// #region refresh
//------------------------------------------------------------------------
/**
 *
 * @param {Number} layerID
 * @param {Number} runtimeID
 * @param {Number} layer_frame
 *
 * @returns {Promise<Boolean>}
 */
MAGPIE_HIVE.refresh = function refresh(runtimeID, switchID, layer_frame) {
  const ePrefix = "[HIVE].refresh: ";
  try {
    MAGPIE_SYSTEM.refresh.call(this);
    const layer = MAGPIE.KEY.RUNTIME.LAYER;
    const Base = 0;
    const Game = 1;
    const TICK = 2;
    const Super = 3;
    const Mega = 4;
    const Ultra = 5;
    const layerBase = layer.get(Base);
    const layerGame = layer.get(Game);
    const layerTICK = layer.get(TICK);
    const layerSuper = layer.get(Super);
    const layerMega = layer.get(Mega);
    const layerUltra = layer.get(Ultra);
    const f = layer_frame;
    if (switchID === 0)
      MAGPIE_HIVE.tick_buffer(layerBase.name, Base, Base, layerBase.dt, f);
    if (switchID === 1) {
      MAGPIE_HIVE.tick_buffer(layerBase.name, Base, Game, layerBase.dt, f);
      MAGPIE_HIVE.tick_buffer(layerGame.name, Game, Game, layerGame.dt, f);
    }
    if (switchID === 2) {
      MAGPIE_HIVE.tick_buffer(layerBase.name, Base, TICK, layerBase.dt, f);
      MAGPIE_HIVE.tick_buffer(layerGame.name, Game, TICK, layerBase.dt, f);
      MAGPIE_HIVE.tick_buffer(layerTICK.name, TICK, TICK, layerTICK.dt, f);
    }
    if (switchID === 3) {
      MAGPIE_HIVE.tick_buffer(layerBase.name, Base, Super, layerBase.dt, f);
      MAGPIE_HIVE.tick_buffer(layerGame.name, Game, Super, layerBase.dt, f);
      MAGPIE_HIVE.tick_buffer(layerTICK.name, TICK, Super, layerBase.dt, f);
      MAGPIE_HIVE.tick_remote(layerSuper.name, Super, Super, layerSuper.dt, f);
      MAGPIE_HIVE.save();
    }
    if (switchID === 4) {
      MAGPIE_HIVE.tick_buffer(layerBase.name, Base, Mega, layerBase.dt, f);
      MAGPIE_HIVE.tick_buffer(layerGame.name, Game, Mega, layerBase.dt, f);
      MAGPIE_HIVE.tick_buffer(layerTICK.name, TICK, Mega, layerBase.dt, f);
      MAGPIE_HIVE.tick_remote(layerSuper.name, Super, Mega, layerBase.dt, f);
      MAGPIE_HIVE.tick_remote(layerMega.name, Mega, Mega, layerMega.dt, f);
    }
    if (switchID === 5) {
      MAGPIE_HIVE.tick_buffer(layerBase.name, Base, Ultra, layerBase.dt, f);
      MAGPIE_HIVE.tick_buffer(layerGame.name, Game, Ultra, layerBase.dt, f);
      MAGPIE_HIVE.tick_buffer(layerTICK.name, TICK, Ultra, layerBase.dt, f);
      MAGPIE_HIVE.tick_remote(layerSuper.name, Super, Ultra, layerBase.dt, f);
      MAGPIE_HIVE.tick_remote(layerMega.name, Mega, Ultra, layerBase.dt, f);
      MAGPIE_HIVE.tick_remote(layerUltra.name, Ultra, Ultra, layerUltra.dt, f);
    }
    return true;
  } catch (e) {
    MAGPIE_SERVER.error(ePrefix + e.message, e);
  }
};
/**
 *
 * @param {String} layerName
 * @param {Number} layerID
 * @param {Number} switchID
 * @param {duration} dt
 * @param {Number} layer_frame
 */
MAGPIE_HIVE.tick_buffer = function tick_buffer(
  layerName,
  layerID,
  switchID,
  dt,
  layer_frame = 0,
) {
  const ePrefix = "[HIVE].tick_buffer: ";
  const layer = this[layerName];
  const slots = MAGPIE.KEY.RUNTIME.LAYER.get(layerID).slots;
  const now = Date.now();
  for (let i = 0; i < slots; i++) {
    try {
      const slot = i;
      /** @type {MAGPIE_ENTITY} */
      const entity = MAGPIE_HIVE.getSlot(slot, layerID);
      if (!entity) continue;
      if (!(entity instanceof MAGPIE_ENTITY))
        throw new Error(`${entity} is invalid MAGPIE_ENTITY`);
      if (entity.type < 1) continue;
      // if((now - entity.updated) > dt * 3000) @audit-issue what's wrong with this?
      // 	this.kick(entity.ID, `timed-out`)
      const pass = entity.refresh(switchID, dt, layer_frame);
      if (!pass) this.kick(entity.ID, "failed update", slot, layerID);
    } catch (e) {
      MAGPIE_SERVER.error(ePrefix + e.message, e);
    }
  }
};
/**
 *
 * @param {String} layerName
 * @param {Number} layerID
 * @param {Number} switchID
 * @param {duration} dt
 */
MAGPIE_HIVE.tick_remote = function tick_remote(
  layerName,
  layerID,
  switchID,
  dt,
) {
  const ePrefix = "[HIVE].tick_remote: ";
  for (let i = 0; i < MAGPIE_HIVE[layerName].length; i++) {
    const entityID = MAGPIE_HIVE[layerName][i];
    try {
      if (isNaN(entityID)) MAGPIE_HIVE[layerName][i] = 0;
      if (!entityID) continue;
      const entity = MAGPIE_HIVE.loadEntitySync(entityID);
      if ((!entity) instanceof MAGPIE_ENTITY)
        throw new Error(`[ENTITY-${entityID}] is invalid entity`);
      const pass = entity.refresh(switchID, dt);
      if (!pass) throw new Error(`[ENTITY-${entityID}] has failed to refresh`);
      const save = MAGPIE_HIVE.saveEntitySync(entity);
      if (!save) throw new Error(`unable to update [ENTITY-${this.ID}]`);
    } catch (e) {
      MAGPIE_SERVER.error(ePrefix + e.message, e);
      MAGPIE_HIVE.kick(entityID, layerID, i);
      continue;
    }
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
// #region getters
//------------------------------------------------------------------------
// /**
//  * @desc {@link MAGPIE_HIVE.__getSlot}
//  * @param {Number} slot
//  * @param {Number} layerID
//  * @returns {MAGPIE_ENTITY}
//  */
// MAGPIE_HIVE.getSlot = function getSlot(slot, layerID)
// {
// 	const ePrefix = "[HIVE].getSlot: ";
// 	try
// 	{
// 		const layerName = MAGPIE.KEY.RUNTIME.LAYER.get(layerID)?.name;
// 		if(!layerName)
// 			throw new Error(`${layerName} is invalid layer name`)
// 		const entity = this[layerName][slot]
// 		const valid = layerID < MAGPIE.KEY.HIVE.BUFFER_SIZE
// 			? entity?.ID
// 			: !isNaN(entity);
// 		if(!valid)
// 			return
// 			// throw new Error(`[LAYER-${layerID}][${slot}] is invalid entity slot`)
// 		return entity
// 	}
// 	catch(e)
// 	{
// 		MAGPIE_SERVER.error(ePrefix + e.message, e)
// 	}
// }
MAGPIE_SERVER._get_Metastate = function () {
  return r.context.METASTATE;
};
/**
 *
 * @param {entityID} entityID
 * @returns {MAGPIE_ENTITY}
 */
MAGPIE_HIVE._get_entity = function _get_entity(entityID) {
  const ePrefix = "[HIVE]._get_entity: ";
  try {
    const entry = MAGPIE_HIVE._registry.get(entityID);
    if (!entry || entry?.layerID >= MAGPIE.KEY.HIVE.BUFFER_SIZE)
      return MAGPIE_DATABASE.loadEntitySync(entityID);
    const index = entry.slot;
    return MAGPIE_HIVE.getSlot(index, entry.layerID);
  } catch (e) {
    MAGPIE_SERVER.error(ePrefix + e.message, e);
  }
};
/**
 *
 * @param {String} rT name of relatives table
 * @param {String} pK name of parent foreign key
 * @param {String} fK name of child foreign key
 * @returns {Promise<MAGPIE_ENTITY[]>}
 */
MAGPIE_HIVE._get_entity_relatives = async function getEntityRelatives(
  entityID,
  rT,
  pK,
  fK,
) {
  const ePrefix = `[HIVE].getEntityRelatives: `;
  try {
    const payload = [entityID, pK, fK, rT, "MAGPIE_ENTITY"];
    const result = await MAGPIE_DATABASE.call("getWorldRelatedRows", payload);
    if (!result || result?.length < 1) throw new Error(`unable to fetch ${rT}`);
    return result;
  } catch (e) {
    MAGPIE_SERVER.error(ePrefix + e.message, e);
  }
};
/**
 *
 * @param {MAGPIE_EXP} exp
 * @returns {MAGPIE_KEY[]}
 */
MAGPIE_HIVE._get_expKeys = function _get_expKeys(exp) {
  const ePrefix = "[HIVE].getExpKeys: ";
  try {
    const keyIDs = exp.keys;
    if (!Array.isArray(keyIDs))
      throw new Error(`${keyIDs} is invalid exp.keys array`);
    if (keyIDs.length < 1) return;
    const keys = [];
    for (const keyID of keyIDs) {
      try {
        const key = MAGPIE_HIVE._get_key(keyID);
        if (!(key instanceof MAGPIE_KEY))
          throw new Error(`unable to find [KEY-${keyID}]`);
        keys.push(key);
      } catch (e) {
        MAGPIE_SERVER.error(ePrefix + e.message, e);
      }
    }
    return keys;
  } catch (e) {
    MAGPIE_SERVER.error(ePrefix + e.message, e);
  }
};
MAGPIE_HIVE.__get_serverSync = function __get_serverSync(method, arguments) {
  const callback = MAGPIE_SERVER[method];
  return callback(...arguments);
};
/**
 *
 * @param {entityID} data
 * @param {Number} layerID
 * @returns {Promise<new MAGPIE_ENTITY>}
 */
MAGPIE_HIVE._set_new_entity = async function newEntity(data, layerID) {
  const entity = MAGPIE_HIVE._new_entity(data);
  await entity.set();
  return MAGPIE_HIVE.host(entity, layerID);
};
/**
 *
 * @param {entity_data} data
 * @param {{
 * dummy: Boolean
 * }} options
 * @returns {new MAGPIE_ENTITY}
 */
MAGPIE_HIVE._new_entity = function (data, dummy) {
  const entity = new MAGPIE_ENTITY(data);
  if (dummy) entity.ID = 0;
  return entity;
};
// #endregion
//------------------------------------------------------------------------
/**
 * @name
 * @desc
 *
 */
//------------------------------------------------------------------------
// #region > Setters
//------------------------------------------------------------------------
/**
 *
 * @param {String} method
 * @param {*} arguments
 * @returns {Promise<database_result>}
 */
MAGPIE_HIVE._set_database = async function _set_database(method, arguments) {
  const callback = MAGPIE_DATABASE[method];
  return await callback(...arguments);
};
/**
 *
 * @param {String} method
 * @param {*} arguments
 * @returns {database_result}
 */
MAGPIE_HIVE._set_databaseSync = function _set_database(method, arguments) {
  const callback = MAGPIE_DATABASE[method];
  return callback(...arguments);
};
// #endregion
//------------------------------------------------------------------------
/**
 * @name
 * @desc
 *
 */
//------------------------------------------------------------------------
// #region boot
//------------------------------------------------------------------------
/**
 * @typedef {import("./core/system").hive_vault} hive_vault
 *
 */
MAGPIE_HIVE.awake = async function awake() {
  const ePrefix = `[HIVE].awake: `;
  try {
    if (this.isActive) return;
    /** @type {hive_vault} */
    const hive = r.context["METASTATE"]?.hive;
    if (Object.prototype.toString.call(hive?.registry) !== "[object Map]")
      throw new Error(`${hive} is invalid hive registry`);
    const entities = Array.from(hive.registry.entries()).filter(
      (e) => e[0] > 10,
    );
    const layer = MAGPIE.KEY.RUNTIME.LAYER;
    entities.forEach((entry) => {
      try {
        const entityID = entry[0];
        const record = entry[1];
        const layerID = Number(record?.layerID) || 3;
        const contexts = record?.contexts;
        const entity = MAGPIE_DATABASE.loadEntitySync(entityID);
        MAGPIE_HIVE.host(entity, layerID, layerID);
        if (contexts?.length > 0) record.contexts = contexts;
      } catch (e) {
        MAGPIE_SYSTEM.error(ePrefix + e.message, e);
      }
    });
    MAGPIE_SERVER.CLI._incrementLoadBar();
    MAGPIE_SERVER.silentLog(ePrefix + `loaded ${entities.length}x entities`);
    hive.contexts.forEach((contextID) => {
      MAGPIE_HIVE._host_context(MAGPIE_DATABASE.loadContextSync(contextID));
    });
    MAGPIE_SERVER.CLI._incrementLoadBar();
    MAGPIE_HIVE._validate_layers();
    MAGPIE_SERVER.silentLog(
      ePrefix + `loaded ${hive.contexts.length}x contexts`,
    );
  } catch (e) {
    MAGPIE_SYSTEM.error(ePrefix + e.message, e);
    this.pause();
  }
};
// #endregion
//------------------------------------------------------------------------
/**
 * @name
 * @desc
 * @typedef {import("./core/entity").entityID} entityID
 * @typedef {import("./core/entity").entity_data} entity_data
 */
//------------------------------------------------------------------------
// #region database
//------------------------------------------------------------------------
/**
 *
 * @param {String} method
 * @param {*} arguments
 * @returns {Promise<*>}
 */
MAGPIE_HIVE._get_database = async function _get_database(method, arguments) {
  const callback = MAGPIE_DATABASE[method];
  return await callback(...arguments);
};
/**
 *
 * @param {String} method
 * @param {*} arguments
 * @returns {*}
 */
MAGPIE_HIVE._get_databaseSync = function _get_databaseSync(method, arguments) {
  const callback = MAGPIE_DATABASE[method];
  return callback(...arguments);
};
/**
 *
 * @param {String} method
 * @param {*} arguments
 * @returns {Promise<database_result>}
 */
MAGPIE_HIVE._set_database = async function _set_database(method, arguments) {
  const callback = MAGPIE_DATABASE[method];
  return await callback(...arguments);
};
/**
 *
 * @param {String} method
 * @param {*} arguments
 * @returns {database_result}
 */
MAGPIE_HIVE._set_databaseSync = function _set_databaseSync(method, arguments) {
  const callback = MAGPIE_DATABASE[method];
  return callback(...arguments);
};
/**
 * @desc {@link MAGPIE_HIVE.__loadEntitySync}
 * @param {entityID} entityID
 * @returns {MAGPIE_ENTITY}
 */
MAGPIE_HIVE.loadEntitySync = function loadEntitySync(entityID) {
  return MAGPIE_DATABASE.loadEntitySync(entityID);
};
/**
 *
 * @param {entityID} entityID
 * @returns {Promise<MAGPIE_ENTITY>}
 */
MAGPIE_HIVE.loadEntity = async function loadEntity(entityID) {
  return await MAGPIE_DATABASE.loadEntity(entityID);
};
/**
 * @typedef {import("./core/database_worker").database_result} database_result
 * @param {MAGPIE_ENTITY} entity
 * @returns {Promise<database_result>}
 */
MAGPIE_HIVE.saveEntity = async function saveEntity(entity) {
  return await MAGPIE_DATABASE.saveEntity(entity);
};
/**
 * @desc {@link MAGPIE_HIVE.__saveEntitySync}
 * @param {MAGPIE_ENTITY} entity
 * @returns {database_result}
 */
MAGPIE_HIVE.saveEntitySync = function saveEntitySync(entity) {
  return MAGPIE_DATABASE.saveEntitySync(entity);
};
/**
 *
 * @desc {@link MAGPIE_HIVE.__loadEntities}
 * @param {entityID[]} entityIDs
 * @returns {MAGPIE_ENTITY[]}
 */
MAGPIE_HIVE.loadEntities = function loadEntities(entityIDs) {
  const ePrefix = "[HIVE].loadEntities: ";
  let list = [];
  for (const entityID of entityIDs) {
    const entity = MAGPIE_DATABASE.loadEntitySync(entityID);
    list.push(entity);
  }
  return list;
};
// #endregion
//------------------------------------------------------------------------
/**
 *
 * back to {@link MAGPIE_HIVE.__server}
 */
// #endregion
//------------------------------------------------------------------------
/**
 * @name
 * @desc
 *
 */
//------------------------------------------------------------------------
// #region > Entity
//------------------------------------------------------------------------
/**
 *
 * @param {String} method
 * @param {*} arguments
 * @returns {*}
 */
MAGPIE_ENTITY.__hiveSync = function __hiveSync(method, arguments) {
  const callback = MAGPIE_HIVE[method];
  return callback(...arguments);
};
/**
 *
 * @param {String} method
 * @param {*} arguments
 * @returns {Promise<*>}
 */
MAGPIE_ENTITY.__hive = async function __hive(method, arguments) {
  const callback = MAGPIE_HIVE[method];
  return callback(...arguments);
};
/**
 *
 * @param {Number[]} output
 * @param {MAGPIE_EXP} exp
 * @param {MAGPIE_ENTITY} entity
 * @param {MAGPIE_ENTITY} P_C
 * @param {POVART} POVART1
 * @param {Number} dt
 * @param {Number} switchID
 * @param {Number} layer_frame
 */
MAGPIE_ENTITY.__socketEmit = function entitySocketEmit(
  output,
  exp,
  entity,
  P_C,
  POVART1,
  dt,
  switchID,
  layer_frame,
) {
  const ePrefix = `[ENTITY-${entity.ID}].socketEmit: `;
  try {
    if (!MAGPIE_PHYSICS.isValidPOVART(POVART1))
      throw new Error(`(${POVART1}) is invalid POVART₁`);
    const { P0, V0, A0 } = MAGPIE_PHYSICS.decomp_POVART(POVART1);
    const Kp = MAGPIE.KEY.POVART;
    // MAGPIE_SERVER._debug(`stats: ${entity.STATS}`);
    const C = P_C;
    const P1 = entity._get_P0();
    const O1 = entity._get_O0();
    const V1 = entity._get_V0();
    // const V1hdg = MAGPIE_PHYSICS._get_V0_heading(P1, V1);
    // MAGPIE_SERVER._debug(`V1hdg: ${V1hdg}`)
    const A1 = entity._get_A0();
    const R1 = entity._get_R0();
    const T1 = entity._get_T0();
    const lat = Number(output[0]);
    const lon = Number(output[1]);
    const ASL = Number(output[2]);
    const r = Number(output[3]);
    const forces = output?.slice(4);
    const Vmag = Number(MAGPIE_PHYSICS.mag(V1));
    const S0 = Vmag > 1e-9 ? Vmag : 0;
    const Vknots = Number(MAGPIE_PHYSICS._U_MPStoKnots(Vmag));
    const Amag = Number(MAGPIE_PHYSICS.mag(A1) / dt);
    const Rmag = Number(MAGPIE_PHYSICS.mag(R1));
    const Tmag = Number(MAGPIE_PHYSICS.mag(T1) / dt);
    const normP1 = MAGPIE_PHYSICS.normalizeVector(P1);
    const unitP1mag = MAGPIE_PHYSICS.mag(normP1);
    // MAGPIE_SERVER._debug(`O1: ${O1} | P1: ${P1}`);
    const [roll, pitch, hdg] =
      unitP1mag !== 1
        ? [NaN, NaN, NaN]
        : MAGPIE_PHYSICS._rotor_toEulerAbs(O1, P1);
    const target = entity._get_target();
    const Pt = target?.STATS?.slice(0, Kp.P_C) || [NaN, NaN, NaN];
    const validTarget = MAGPIE_PHYSICS.isValidVector(Pt);
    // MAGPIE_SERVER._debug(`output: ${output}`)
    const Ct =
      validTarget && r > 1
        ? MAGPIE_PHYSICS.cartesianToGeodetic(Pt, r)
        : [NaN, NaN, NaN];
    const dist = MAGPIE_PHYSICS._geod_distanceTo(P1, Pt, r);
    const ETA_s = dist > 1 && S0 > 1 ? Number(Math.floor(dist / S0)) : 0;
    // MAGPIE_SERVER._debug(`ETA_s: ${ETA_s} | dist: ${dist} | S0: ${S0}`);
    const ETA = Number(ETA_s) ? MAGPIE_SYSTEM.Utility.printETA(ETA_s) : "N/A";
    const raw = output?.emote?.raw || output?.target?.raw || [];
    const index = MAGPIE.KEY.INDEX;
    const dRmag = Number(raw?.dRmag) || NaN;
    const dR = Array.isArray(raw?.dR) ? raw.dR : [NaN, NaN, NaN];
    const pR = Number(raw?.pR);
    const Bdist = Array.isArray(raw?.Bdist) ? raw.Bdist : [NaN, NaN, NaN];
    // MAGPIE_SYSTEM._logging_debug(`raw: ${Object.entries(raw)}`);
    const form = MAGPIE_SYSTEM.Utility._format_num;
    const states = (stateID) => {
      return MAGPIE_STATE.INDEX.get(stateID)?.name;
    };
    const formN = (num) => (Number(num) ? form(num, 1, true) : undefined);
    const data = {
      switchID,
      entityID: entity.ID,
      entityName: entity.name,
      metadate: entity.updated,
      coords: [form(lat, 10, true), form(lon, 10, true), form(ASL, 1, true)],
      states: entity._get_states(this).map((n) => states(n)),
      Vmag: Vmag,
      Vknots: Vknots,
      Amag: switchID !== 1 ? Amag : layer_frame % 10 === 0 ? Amag : undefined,
      Rmag: Rmag,
      Tmag: Tmag,
      dRmag: dRmag,
      dR: dR.map((n) => form(n, 5, true)),
      R1: R1.map((n) => form(n, 5, true)),
      T1: T1.map((n) => form(n, 5, true)),
      Bdist: Bdist?.map((n) => form(n, 5, true)),
      heading: formN(hdg),
      pitch: formN(pitch),
      roll: formN(roll),
      pR: pR,
      CelestialBody: C.name,
      targetID: target?.ID,
      targetName: target?.name,
      targetCoords: [
        form(Ct[0], 10, true),
        form(Ct[1], 10, true),
        form(Ct[2], 1, true),
      ],
      distanceTo: dist,
      ETA: ETA,
      forces: forces,
    };
    // MAGPIE_SERVER._debug(data.Rstate)
    const V0_mag = MAGPIE_PHYSICS.mag(V0);
    const A0_mag = MAGPIE_PHYSICS.mag(A0);
    if (!MAGPIE_ENTITY?._delta) MAGPIE_ENTITY._delta = Date.now();
    MAGPIE_ENTITY._delta += dt * 1000;
    io.to(`entity_${entity.ID}`).emit("entity_update", data);
    return true;
  } catch (e) {
    MAGPIE_SYSTEM.error(ePrefix + e.message, e);
    entity.selfKick(`socketEmit fail: ${e.message}`);
    return false;
  }
};
/**
 *
 * @param {String} method
 * @param  {*} argument
 * @returns {Promise<database_result>}
 */
MAGPIE_ENTITY._database = async function _database(method, argument) {
  const callback = MAGPIE_DATABASE[method];
  return await callback(argument);
};
/**
 *
 * @param {String} method
 * @param  {*} argument
 * @returns {*}
 */
MAGPIE_ENTITY._database_Sync = function _database_Sync(method, argument) {
  const callback = MAGPIE_DATABASE[method];
  return callback(argument);
};
// #endregion
//------------------------------------------------------------------------
/**
 * @name
 * @desc
 *
 */
//------------------------------------------------------------------------
// #region > Player
//------------------------------------------------------------------------
MAGPIE_PLAYER.__hive = async function __hive(method, arguments) {
  const callback = MAGPIE_HIVE[method];
  return await callback(...arguments);
};
MAGPIE_PLAYER.__hiveSync = function __hiveSync(method, arguments) {
  const callback = MAGPIE_HIVE[method];
  return callback(...arguments);
};
// #endregion
//------------------------------------------------------------------------
/**
 * @name
 * @desc
 *
 */
//------------------------------------------------------------------------
// #region > Compon.
//------------------------------------------------------------------------
/**
 *
 * @param {String} method
 * @param {*} arguments
 * @returns {MAGPIE_COMPONENT}
 */
MAGPIE_COMPONENT.__get = function get(method, arguments) {
  const callback = MAGPIE_HIVE[method];
  return callback(...arguments);
};
/**
 *
 * @param {String} method
 * @param {*} arguments
 * @returns {Promise<database_result>}
 */
MAGPIE_COMPONENT.__set = async function set(method, arguments) {
  const callback = MAGPIE_HIVE[method];
  return await callback(...arguments);
};
/**
 *
 * @param {String} method
 * @param {*} arguments
 * @returns {database_result}
 */
MAGPIE_COMPONENT.__setSync = function setSync(method, arguments) {
  const callback = MAGPIE_HIVE[method];
  return callback(...arguments);
};
/**
 * @typedef {import("./data/components").component} component
 */
MAGPIE_COMPONENT.setup = function () {
  /** @type {Map<String, component>} */
  MAGPIE_COMPONENT.INDEX = COMPONENTS.INDEX;
};
// #endregion
//------------------------------------------------------------------------
/**
 * @name
 * @desc
 *
 */
//------------------------------------------------------------------------
// #region > Context
//------------------------------------------------------------------------
MAGPIE_CONTEXT.__hive = async function __hive(method, arguments) {
  const callback = MAGPIE_HIVE[method];
  return await callback(...arguments);
};
MAGPIE_CONTEXT.__hiveSync = function __hiveSync(method, arguments) {
  const callback = MAGPIE_HIVE[method];
  return callback(...arguments);
};
// #endregion
//------------------------------------------------------------------------
/**
 * @name
 * @desc
 * @typedef {import("./core/index").keyID} keyID
 */
//------------------------------------------------------------------------
// #region > Key
//------------------------------------------------------------------------
MAGPIE_SERVER.key = {};
/**
 *
 */
MAGPIE_KEY.setup = async function setup() {
  const ePrefix = "[KEY].setup: ";
  try {
    // MAGPIE_SERVER.log("loading keys...", null, true);
    // const db = MAGPIE_DATABASE.sync.world;
    // const sql = "SELECT label FROM MAGPIE_KEY WHERE type = ?";
    // /** @param {Enumerator<Number>} type @returns {String[]} */
    // const query = (type) => {
    // 	const results = db.prepare(sql).all(type)
    // 	return results.map(result => result.label)
    // }
    // const axioms = query(MAGPIE.KEY.TYPE.AXIOM);
    // MAGPIE_SERVER.log(`loaded ${axioms.length}x keys`);
    // MAGPIE_SERVER.CLI._incrementLoadBar();
    /** @param {Map<Number, String>} type */
    const index = (type) => {
      const start = type?.get("start");
      const end = type?.get("end");
      const types = Object.keys(MAGPIE.KEY.INDEX).slice(start, end + 1);
      types.forEach((label) => {
        type?.set(MAGPIE.KEY.INDEX[label], label);
      });
      return types.length;
    };
    const vspeeds = `indexed ${index(MAGPIE.KEY.INDEX.VSPEEDS)}x Vspeeds`;
    MAGPIE_LOG.pushConsole(vspeeds);
    MAGPIE_SERVER.CLI._incrementLoadBar();
    return { vspeeds };
  } catch (e) {
    MAGPIE_SERVER.error(ePrefix + e.message, e);
    return false;
  }
};
/**
 *
 * @param {String} method
 * @param {[]} arguments
 * @returns {Promise<database_result>}
 */
MAGPIE_KEY.__hive = async function __hive(method, arguments) {
  const callback = MAGPIE_HIVE[method];
  return await callback(...arguments);
};
/**
 *
 * @param {String} method
 * @param {[]} arguments
 * @returns {database_result}
 */
MAGPIE_KEY.__hiveSync = function __hiveSync(method, arguments) {
  const callback = MAGPIE_HIVE[method];
  return callback(...arguments);
};
// #endregion
//------------------------------------------------------------------------
/**
 * @name
 * @desc
 *
 */
//------------------------------------------------------------------------
// #region > Exp
//------------------------------------------------------------------------
MAGPIE_EXP.__hiveSync = function __hiveSync(method, arguments) {
  const callback = MAGPIE_HIVE[method];
  return callback(...arguments);
};
MAGPIE_EXP.__hive = async function __hive(method, arguments) {
  const callback = MAGPIE_HIVE[method];
  return await callback(...arguments);
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
// #region - CLI
//========================================================================
MAGPIE_SERVER.CLI = {};
/**
 * @name
 * @desc
 *
 */
//------------------------------------------------------------------------
// #region > Spinner
//------------------------------------------------------------------------
/**
 * @typedef {import("cli-spinner").Spinner} Spinner
 */
MAGPIE_SERVER.CLI.SPINNER = cliSpinner.Spinner;
MAGPIE_SERVER.CLI.spinners = {};
/**
 *
 * @param {{
 * name: "spinner1",
 * string: "|/-",
 * message: ""
 * }} options
 * @returns {new Spinner}
 */
MAGPIE_SERVER.CLI._createSpinner = function (options = {}) {
  if (!options?.name) options.name = "spinner1";
  if (!options?.string) options.message = "";
  const Spinner = MAGPIE_SERVER.CLI.SPINNER;
  MAGPIE_SERVER.CLI.spinners[options.name] = new Spinner(
    options.message + "%s",
  );
  const spinner = MAGPIE_SERVER.CLI.spinners[options.name];
  if (options?.string) spinner.setSpinnerString(options.string);
  spinner.start();
  return spinner;
};
MAGPIE_SERVER.CLI._changeSpinnerChars = function (
  index,
  spinnerName = "spinner1",
) {
  const spinner = MAGPIE_SERVER.CLI.spinners[spinnerName];
  spinner.chars = MAGPIE_SERVER.CLI.SPINNER.spinners[index];
};
MAGPIE_SERVER.CLI._stopSpinner = function (spinnerName = "spinner1") {
  const SpinnerClass = MAGPIE_SERVER.CLI.SPINNER;
  const spinner = MAGPIE_SERVER.CLI.spinners[spinnerName];
  spinner.stop(true);
};
// #endregion
//------------------------------------------------------------------------
/**
 * @name
 * @desc
 * @typedef {import("./src/system").MAGPIE_LOADBAR} MAGPIE_LOADBAR
 * @typedef {import("./src/system").loadbar_options} loadbar_options
 */
//------------------------------------------------------------------------
// #region > loadbar
//------------------------------------------------------------------------
MAGPIE_SERVER.CLI.loadbar = {
  isInit: true,
  isActive: false,
};
/**
 * Safely clears the current line or previous lines in the REPL
 * @param {number} linesUp - Number of lines to move up before clearing (default: 0)
 */
MAGPIE_SERVER.CLI.clearREPLline = function clearREPLline(linesUp = 0) {
  const stream = r.output;
  const right = 0;
  const left = -1;
  const full_line = 1;
  // 1. Move cursor vertically if targeting a previous line
  if (linesUp > 0) readline.moveCursor(stream, right, -linesUp);
  // 2. Clear the target line completely (0 = right, -1 = left, 1 = entire line)
  readline.clearLine(stream, right);
  // 3. Snap the cursor back to the far left column
  readline.cursorTo(stream, right);
};
MAGPIE_SERVER.CLI.log = function logOnLoadbar(message, barName = "bar1") {
  //@todo logOnLoadbar
  // const ansi = MAGPIE.KEY.ANSI
  // const stream = r.output
  // void stream.write(`${ansi.MOVE_UP}${ansi.CLEAR_LINE}`.repeat(3))
  // void stream.write(`${message}\n`)
  // void stream.write("\n")
  const bar = MAGPIE_SERVER.CLI[barName];
  if (bar instanceof MAGPIE_LOADBAR && bar.isActive)
    bar.render({ log: message });
};
/**
 *
 * @param {loadbar_data} options
 */
MAGPIE_SERVER.CLI._createLoadBar = function (options) {
  if (!options) options = {};
  if (!options?.name) options.name = "bar1";
  // MAGPIE_SERVER.CLI.loadbar = new cliProgress.MultiBar({
  // 	clearOnComplete: options?.clearOnComplete || true,
  // 	hideCursor: options?.hideCursor || true
  // }, cliProgress.Presets.shades_classic)
  // MAGPIE_SERVER.CLI[options.name] = MAGPIE_SERVER.CLI.loadbar.create(100,0)
  MAGPIE_SERVER.CLI.loadbar.isActive = true;
  return (MAGPIE_SERVER.CLI[options.name] = new MAGPIE_LOADBAR(options));
};
/**
 *
 * @param {Number} value
 * @param {String} name
 */
MAGPIE_SERVER.CLI._updateLoadBar = function updateLoadBar(progress, name) {
  // MAGPIE_SERVER.CLI[name].update(value)
  if (!name || typeof name !== "string") name = "bar1";
  /** @type {MAGPIE_LOADBAR} */
  const bar = MAGPIE_SERVER.CLI[name];
  bar.update({ amount: progress });
};
/**
 *
 * @param {Number} value
 * @param {String} name
 */
MAGPIE_SERVER.CLI._incrementLoadBar = function incrementLoadBar(
  value = 1,
  name,
) {
  if (!name || typeof name !== "string") name = "bar1";
  /** @type {MAGPIE_LOADBAR} */
  const bar = MAGPIE_SERVER.CLI[name];
  bar.increment({ amount: value });
};
/**
 *
 * @param {String} name
 */
MAGPIE_SERVER.CLI._stop = function stopLoadbar(name = "bar1") {
  /** @type {MAGPIE_LOADBAR} */
  const bar = MAGPIE_SERVER.CLI[name];
  bar.isActive = false;
  bar.clear();
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
// #region - PAD
//========================================================================
MAGPIE_SERVER.PAD = {};
MAGPIE_SERVER.PAD.file = `${process.cwd() + "\\src\\plugins\\scratchpad.js"}`;
MAGPIE_SERVER.PAD.load = async function load(fileName) {
  const filePath = MAGPIE_SERVER.PAD.file;
  const prefix = "[SCRATCHPAD].load: ";
  try {
    const { content, startMarker, startIndex, endIndex } =
      MAGPIE_SERVER.PAD.read();
    if (startIndex === -1 || endIndex === -1)
      return console.log(prefix + "regions not found. Skipping execution");
    const codeToRun = content
      .substring(startIndex + startMarker.length, endIndex)
      .trim();
    if (!codeToRun) {
      console.log(prefix + "no code found");
      return r.displayPrompt();
    }
    const sandbox = {
      MAGPIE_SERVER,
      api: MAGPIE_SERVER.api,
      console,
      require,
    };
    vm.createContext(sandbox);
    await new Promise((resolve) =>
      setTimeout(() => {
        try {
          eval(codeToRun);
          console.log("ok");
          resolve();
        } catch (e) {
          console.error(e);
        }
      }, 100),
    );
    MAGPIE_SYSTEM.PS.playSound(MAGPIE.KEY.WMEDIA.CHORD);
    const newContent =
      content.substring(0, startIndex + startMarker.length) +
      "\n\n" +
      content.substring(endIndex);
    fs.writeFileSync(filePath, newContent);
    console.log(prefix + `[PUNCH-IN: ${filePath}] executed and cleared`);
    r.displayPrompt();
  } catch (e) {
    console.error(prefix + "error: ", e);
  }
};
MAGPIE_SERVER.PAD.read = function read() {
  const filePath = MAGPIE_SERVER.PAD.file;
  const content = fs.readFileSync(filePath, "utf-8");
  const startMarker = "// #region - Scratchpad";
  const endMarker = "// #endregion";
  const startIndex = content.indexOf(startMarker);
  const endIndex = content.indexOf(endMarker);
  return { content, startMarker, endMarker, startIndex, endIndex };
};
MAGPIE_SERVER.PAD.log = function log(input) {
  const prefix = "[SCRATCHPAD].load: ";
  const filePath = MAGPIE_SERVER.PAD.file;
  fs.appendFileSync(filePath, `\n\n${input}\n`);
  console.log(prefix + `[PUNCH-OUT: ${filePath}] logged`);
};
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
// #region - SESSION
//========================================================================
MAGPIE_SERVER.SESSION.meta = {
  //
};
/**
 * @typedef {() => {}} graceTimer Enforce n-second grace period on disconnects (Anti-F5 spam) cancel timers upon successful reconnection.
 * @typedef {{
 * sockets: socketID[],
 * username: String,
 * joined: epoch_real
 * graceTimer: graceTimer
 * }} player_cache
 * @type {player_cache}
 */
MAGPIE_SERVER.SESSION.active = new Map();
/**
 *
 * @desc back to {@link MAGPIE_SERVER.meta}
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
// #region - REPL
//========================================================================
MAGPIE_SERVER.context = {};
// MAGPIE_SERVER.prototype.constructor = MAGPIE_SERVER
/**
 *
 * @returns {Number}
 */
MAGPIE_SERVER._REPL_boot = function bootREPLconsole() {
  Object.keys(MAGPIE_SERVER.registry).forEach((k) => {
    MAGPIE_SERVER.context[k] = MAGPIE_SERVER.registry[k];
  });
  const keys = Object.keys(MAGPIE_SERVER.context);
  keys.forEach((k) => {
    r.context[k] = MAGPIE_SERVER.context[k];
    MAGPIE_SERVER.CLI._incrementLoadBar();
  });
  return keys.length;
};
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
 * @typedef {import("node:http").Server} node_server
 */
//========================================================================
// #region - BOOT
//========================================================================
MAGPIE_SERVER.BOOT = {};
/** @type {node_server} */
MAGPIE_SERVER.NODE_HTTP = {};
/**
 * @name
 * @desc
 *
 */
//------------------------------------------------------------------------
// #region > Connect
//------------------------------------------------------------------------
MAGPIE_SERVER.BOOT.connect = async function serverConnect() {
  const S = MAGPIE.KEY.SERVER;
  MAGPIE_SERVER.NODE_HTTP = server.listen(S.PORT, "0.0.0.0", () => {
    const domain = `${MAGPIE.KEY.SERVER.DOMAIN}`;
    const message = `${S.MESSAGE.BOOTED}${domain}...`;
    MAGPIE_SERVER.log(message);
  });
  // MAGPIE_SERVER.CLI._incrementLoadBar(20);
  return true;
};
MAGPIE_SERVER.BOOT.logBootTime = function serverLogBootTime() {
  const bootTime = `[BOOT time: ${(MAGPIE_SERVER.perf.end = performance.now())}]`;
  MAGPIE_SERVER.log(MAGPIE_SERVER.BOOT.splash_message(bootTime));
};
/**
 *
 * @returns {String}
 */
MAGPIE_SERVER.BOOT.splash_message = function serverSplashMessage(text) {
  const version = MAGPIE_SYSTEM.Utility.version(MAGPIE.meta.version);
  return `${MAGPIE.meta.name} v${version} ${MAGPIE.meta.firmwareDate} ${text}`;
};
// #endregion
//------------------------------------------------------------------------
/**
 * @name
 * @desc
 *
 */
//------------------------------------------------------------------------
// #region > Repl
//------------------------------------------------------------------------
const REPL = require("repl");
console.clear();
const r = REPL.start({
  prompt: "MAGPIE:> ",
  preview: true,
  ignoreUndefined: false,
  writer: function (output) {
    if (output === undefined) return "";
    return require("util").inspect(output, { colors: true });
  },
});
/**
 *
 * @param {String} text
 * @returns
 */
function print(text) {
  return void r.output.write(`${text}`);
}
r.context.print = print;
/**
 *
 * @param {Number} count
 * @returns
 */
r.context.clearLines = (count = 1) => {
  const ansi = MAGPIE.KEY.ANSI;
  const sequence = `${ansi.MOVE_UP}${ansi.CLEAR_LINE}`.repeat(count);
  return print(sequence);
};
r.context.printAt = (linesUp, text) => {
  const ansi = MAGPIE.KEY.ANSI;
  const sequence = `${ansi.SAVE_CURSOR}${ansi.moveUpCustom(linesUp)}${ansi.CLEAR_LINE}${ansi.CARRIAGE_RETURN}${text}${ansi.RESTORE_CURSOR}`;
  return print(sequence);
};
r.context.r = r;
// #endregion
//------------------------------------------------------------------------
/**
 * @name
 * @desc
 *
 */
//------------------------------------------------------------------------
// #region > bootstrap
//------------------------------------------------------------------------
const main = async function main() {
  await MAGPIE_SYSTEM.Utility.wait(100);
  MAGPIE_SERVER.CLI._createLoadBar({ percentage: true });
  /** @type {MAGPIE_LOADBAR} */
  const bar = MAGPIE_SERVER.CLI.bar1;
  MAGPIE_SERVER.CLI._createSpinner({
    string: MAGPIE_SERVER.CLI.SPINNER.spinners[18],
  });
  /** @type {Spinner} */
  const spinner = MAGPIE_SERVER.CLI.spinners.spinner1;
  spinner.setSpinnerTitle("loading data...");
  await MAGPIE_SYSTEM.Utility.wait(100);
  const repl_contexts = MAGPIE_SERVER._REPL_boot();
  spinner.setSpinnerTitle(`${repl_contexts}x REPL contexts loaded`);
  await MAGPIE_SYSTEM.Utility.wait(100);
  //
  spinner.setSpinnerTitle("Loading MAGPIE_RUNTIME...");
  await MAGPIE_SYSTEM.Utility.wait(100);
  MAGPIE_SERVER.RUNTIME = new MAGPIE_RUNTIME();
  bar.increment();
  //
  spinner.setSpinnerTitle("Loading MAGPIE_DATABASE...");
  await MAGPIE_SYSTEM.Utility.wait(100);
  MAGPIE_SERVER.DATABASE = MAGPIE_DATABASE;
  bar.increment();
  //
  spinner.setSpinnerTitle("Loading MAGPIE_EMOTE...");
  await MAGPIE_SYSTEM.Utility.wait(100);
  await MAGPIE_EMOTE.setup();
  bar.increment();
  spinner.setSpinnerTitle(`${MAGPIE_EMOTE.INDEX.size}x emotes loaded.`);
  await MAGPIE_SYSTEM.Utility.wait(100);
  //
  spinner.setSpinnerTitle("Loading MAGPIE_STATE...");
  MAGPIE_STATE.setup();
  spinner.setSpinnerTitle(`${MAGPIE_STATE.INDEX.size}x states loaded.`);
  await MAGPIE_SYSTEM.Utility.wait(100);
  bar.increment();
  spinner.setSpinnerTitle(`${MAGPIE_STATE.TYPE.size}x state types loaded.`);
  //
  spinner.setSpinnerTitle("Loading MAGPIE_COMPONENT...");
  MAGPIE_COMPONENT.setup();
  await MAGPIE_SYSTEM.Utility.wait(100);
  bar.increment();
  spinner.setSpinnerTitle("MAGPIE_COMPONENT setup is placeholder.");
  //
  spinner.setSpinnerTitle("Loading MAGPIE_KEY...");
  const key_results = await MAGPIE_KEY.setup();
  bar.increment();
  spinner.setSpinnerTitle(key_results["vspeeds"]);
  await MAGPIE_SYSTEM.Utility.wait(100);
  //
  spinner.setSpinnerTitle("Loading MAGPIE_HIVE...");
  MAGPIE_SERVER.HIVE = MAGPIE_HIVE;
  MAGPIE_HIVE.setup();
  bar.increment();
  spinner.setSpinnerTitle("MAGPIE_KEY setup is placeholder.");
  await MAGPIE_SYSTEM.Utility.wait(100);
  //
  /** @type {new MAGPIE_METASTATE} */
  MAGPIE_SERVER.METASTATE = null;
  spinner.setSpinnerTitle("Setting REPL contexts...");
  r.context.MAGPIE = MAGPIE;
  r.context.SERVER = MAGPIE_SERVER;
  r.context.RUNTIME = MAGPIE_RUNTIME;
  r.context.SYSTEM = MAGPIE_SYSTEM;
  r.context.HIVE = MAGPIE_HIVE;
  r.context.DATABASE = MAGPIE_DATABASE;
  r.context.PHYSICS = MAGPIE_PHYSICS;
  r.context.STATE = MAGPIE_STATE;
  r.context.EMOTE = MAGPIE_EMOTE;
  r.context.LOADBAR = MAGPIE_LOADBAR;
  r.context.io = io;
  await MAGPIE_SYSTEM.Utility.wait(100);
  bar.increment();
  spinner.setSpinnerTitle("Loading METASTATE...");
  MAGPIE_SERVER.RUNTIME.loadMetastate();
  await MAGPIE_SYSTEM.Utility.wait(100);
  bar.increment();
  spinner.setSpinnerTitle("Hosting HIVE...");
  MAGPIE_SERVER.RUNTIME.host("HIVE", 0);
  await MAGPIE_SYSTEM.Utility.wait(100);
  bar.increment();
  spinner.setSpinnerTitle("Awaking RUNTIME...");
  MAGPIE_SERVER.RUNTIME.awake();
  await MAGPIE_SYSTEM.Utility.wait(100);
  bar.increment();
  spinner.setSpinnerTitle("Awaking HIVE...");
  MAGPIE_SERVER.HIVE.awake();
  await MAGPIE_SYSTEM.Utility.wait(100);
  bar.update({ amount: 100, log: "MAGPIE_Server ready." });
  MAGPIE_SERVER.CLI._stop();
  spinner.setSpinnerTitle("Serving NODE_HTTP...");
  MAGPIE_SERVER.BOOT.connect();
  await MAGPIE_SYSTEM.Utility.wait(100);
  setTimeout(() => {
    MAGPIE_SERVER.BOOT.logBootTime();
    r.displayPrompt();
  }, 100);
  MAGPIE_SERVER.CLI._stopSpinner();
};
main();
fs.watchFile(MAGPIE_SERVER.PAD.file, { interval: 1000 }, (curr, prev) => {
  if (curr.mtime > prev.mtime) {
    console.log("--- Executing VScode scratchpad ---");
    MAGPIE_SERVER.PAD.load("scratchpad.js");
  }
});
// global.SERVER = MAGPIE_SERVER;
// global.r = r;
// #endregion
//------------------------------------------------------------------------
/**
 * @name
 * @desc
 *
 */
//------------------------------------------------------------------------
// #region > Shutdown
//------------------------------------------------------------------------
/**
 * @typedef {Number} exit_signal
 * @param {exit_signal} signal
 */
MAGPIE_SERVER.BOOT.shutdown = async function shutdown(signal = 0) {
  const ePrefix = "[BOOT | SHUTDOWN] ";
  MAGPIE_SERVER.CLI._createSpinner({
    string: MAGPIE_SERVER.CLI.SPINNER.spinners[18],
  });
  /** @type {Spinner} */
  const spinner = MAGPIE_SERVER.CLI.spinners.spinner1;
  spinner.setSpinnerTitle(
    `[SIGNAL-${signal}] received: initiating shutdown sequence...`,
  );
  if (io) {
    const fallbackTimeout = setTimeout(() => {
      const error = new Error(`${ePrefix}Shutdown timeout: forcing shutdown...
                -------------------------------\n\n`);
      spinner.stop(true);
      MAGPIE_SERVER.error(error.message, error);
      process.exit(signal);
    }, 10000);
    try {
      // @todo await MAGPIE_HIVE.save();
      MAGPIE_SERVER.log(ePrefix + "save complete.");
      spinner.setSpinnerTitle("terminating database worker...");
      await MAGPIE_SYSTEM.Utility.wait(100);
      MAGPIE_DATABASE.worker.postMessage({ method: "close" });
      await new Promise((resolve) => {
        MAGPIE_DATABASE.worker.once("exit", () => {
          spinner.setSpinnerTitle("");
          MAGPIE_SERVER.log(ePrefix + "database_worker closed.", null, true);
          resolve();
        });
      });
      spinner.setSpinnerTitle("closing socket.io server...");
      await new Promise((resolve) => {
        io.close((err) => {
          if (err) MAGPIE_SERVER.error(ePrefix + "[io] " + err.message, err);
          spinner.setSpinnerTitle("");
          MAGPIE_SERVER.log(ePrefix + "Socket.io server closed.", null, true);
          resolve();
        });
      });
      spinner.start();
      await MAGPIE_SYSTEM.Utility.wait(1000);
      // await new Promise((resolve) => {
      // 	MAGPIE_SERVER.NODE_HTTP.close((err) => {
      // 		if(err) MAGPIE_SERVER.error(ePrefix + err.message, err);
      // 		spinner.stop(true)
      // 		process.stdout.write("\n")
      // 		MAGPIE_SERVER.log(ePrefix + "HTTP server closed.", null, true)
      // 		resolve();
      // 	})
      // })
      MAGPIE_SERVER.log(ePrefix + "sequence complete.", "console", true);
      spinner.setSpinnerTitle("Exiting...");
      spinner.start();
      await MAGPIE_SYSTEM.Utility.wait(100);
      // if(typeof r !== 'undefined' && typeof r.displayPrompt === 'function')
      // 	r.displayPrompt();
      spinner.stop(true);
      clearTimeout(fallbackTimeout);
      return process.exit(signal);
    } catch (e) {
      spinner.stop(true);
      MAGPIE_SERVER.error(ePrefix + e.message, e);
      clearTimeout(fallbackTimeout);
      return process.exit(1);
    }
  }
};
MAGPIE_SERVER.restart = function restart() {
  MAGPIE_SERVER.BOOT.shutdown(2);
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
 * @desc back to {@link MAGPIE_SERVER.meta}
 *
 */
//========================================================================
// END OF FILE
//========================================================================
