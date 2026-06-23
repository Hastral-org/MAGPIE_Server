/**
 * @namespace MAGPIE_Client
 * @author Matheraptor
 * @licence GPL-3.0
 * @version 0.39.956
 *
 */
class MAGPIE_CLIENT {
  //
}
MAGPIE_CLIENT.meta = {
  name: "M.A.G.P.I.E. WebClient",
  desc: "",
  version: [0, 39, 92],
  firmwareName: "MAGPIE_Client",
  firmwareDate: "20260616",
};
MAGPIE_CLIENT.params = new URLSearchParams(window.location.search);
MAGPIE_CLIENT.pathParts = window.location.pathname.split("/");
MAGPIE_CLIENT.secure_socket = window.location.href.includes("https");
MAGPIE_CLIENT.elements = {
  monitor: {
    status: "monitor-status",
  },
};
MAGPIE_CLIENT.KEY = {};
MAGPIE_CLIENT.isProduction = true;
/**
 * @desc {@link MAGPIE_CLIENT.ACCOUNT.meta}
 */
MAGPIE_CLIENT.ACCOUNT = {};
MAGPIE_CLIENT.DATA = {};
/**
 * @type {player_data}
 */
MAGPIE_CLIENT.DATA.PLAYER = {};
/**
 * @static
 */
class MAGPIE_MONITOR {
  //
}
/**
 * @static
 */
class router {
  //
}
class KEY {
  //
}
/**
 * @name
 * @desc
 *
 */
//========================================================================
// #region - KEY
//========================================================================
KEY.PRINT = {};
KEY.PRINT.NA = "n/a";
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
// #region - Socket
//========================================================================
/** @type {import("socket.io-client").Socket} */
const socket = io(window.location.origin, {
  auth: {
    token: localStorage.getItem("jwt_token"),
  },
  query: {
    entityID: MAGPIE_CLIENT.params.get("entityID"),
    playerID: MAGPIE_CLIENT.params.get("playerID"),
  },
  transports: ["websocket", "polling"],
  secure: MAGPIE_CLIENT.secure_socket,
});
/**
 * @name
 * @desc
 *
 */
//------------------------------------------------------------------------
// #region > Connect
//------------------------------------------------------------------------
socket.on("connect", () => {
  console.log(
    `%c Connected to server! ID: ${socket.id}`,
    "color: green; font-weight: bold;",
  );
  console.log(
    "[DEBUG] Socket connected. Transport:",
    socket.io.engine.transport.name,
  );
  const entityID = MAGPIE_CLIENT.params.get("entityID");
  const hasVisited = localStorage.getItem("hasVisited");
  if (!hasVisited) socket.emit("new_visit");
  localStorage.setItem("hasVisited", true);
  /** @desc {@link router.loginSuccess} */
  const isLoggedIn = localStorage.getItem("playerID");
  if (Number(isLoggedIn)) {
    console.log(
      `[SOCKET] [am_I_allowed_back_in] [playerID-${isLoggedIn}] found in localStorage`,
    );
    socket.emit("am_I_allowed_back_in", {
      playerID: isLoggedIn,
    });
  }
  socket.emit("request_server_keys");
  if (entityID) {
    const entity = document.getElementById("entityID");
    if (entity) entity.value = entityID;
    router.go("monitor");
    MAGPIE_MONITOR.subscribe(entityID);
  }
});
socket.on("server_keys", (data) => {
  MAGPIE_CLIENT.KEY = data;
  MAGPIE_CLIENT.isProduction = !Boolean(MAGPIE_CLIENT.KEY?.SERVER?.IS_DEV);
  const message = `[SOCKET] [server_keys] received ${Object.keys(data).length}x keys. `;
  //
  console.log(message);
});
socket.on("connect_error", (err) => {
  if (err.message.includes("401")) {
    console.warn(
      "[AUTH] Stale or invalid token. Clearing and redirecting to login.",
    );
    localStorage.removeItem("jwt_token");
    localStorage.removeItem("playerID");
    localStorage.removeItem("username");
    router.go("login");
  }
});

// #endregion
//------------------------------------------------------------------------
/**
 * @name
 * @desc
 *
 */
//------------------------------------------------------------------------
// #region > Debug
//------------------------------------------------------------------------
socket.on("DEBUG", (data) => {
  console.log(Object.entries(data));
  MAGPIE_CLIENT.DATA.DEBUG = data;
});
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
socket.on("metastate", (data) => {
  // Update your HTML elements
  const pad = (num, length = 2) => {
    return num.toString().padStart(length, "0");
  };
  const date = data.date;
  const year = date.year;
  const month = pad(date.month);
  const monthName = Object.keys(data.calendar.months)[date.month - 1];
  const day = pad(date.day);
  const hour = pad(date.hour);
  const minute = pad(date.minute);
  const second = pad(date.second);
  const weekDay = data.weekDayName;
  const timestring = `📅︎ [CALENDAR-${data?.calendarName} | ◴ ${weekDay} — ${year}/${month}/${day} — ${hour}:${minute}:${second} UTC]`;
  document.getElementById("metadate").textContent =
    `server metadate: ${timestring}`;
});
socket.on("visitor_counter_update", (data) => {
  const ePrefix = "[SOCKET] [visitor_counter_update] ";
  try {
    const count = data?.count;
    if (isNaN(count)) return;
    const value = count.toString().padStart(6, "0");
    const strips = document.querySelectorAll(".digit-strip");
    value.split("").forEach((digit, index) => {
      if (strips[index]) {
        const offset = digit * 1.2;
        strips[index].style.transform = `translateY(-${offset}rem)`;
      }
    });
    console.log(ePrefix + count);
  } catch (e) {
    console.error(ePrefix + e.message, e);
  }
});
// #endregion
//------------------------------------------------------------------------
/**
 * @name
 * @desc
 *
 */
//------------------------------------------------------------------------
// #region > Entity upd
//------------------------------------------------------------------------
socket.on("entity_update", (data) => {
  MAGPIE_MONITOR.handleUpdate(data);
});
socket.on("subscribed_entity", (entityID) => {
  MAGPIE_MONITOR.handleSubscription(entityID);
});
// #endregion
//------------------------------------------------------------------------
/**
 * @name
 * @desc
 * @typedef {Number} playerID
 * @typedef {String} username
 * @typedef {Number} creatureID
 * @typedef {Number} EVP
 * @typedef {Number} CLOUT
 * @typedef {Boolean} player_status
 * @typedef {{
 * playerID: playerID,
 * username: username,
 * playerSlots: creatureID[],
 * playerEVP: EVP,
 * playerCLOUT: CLOUT,
 * playerStatus: player_status
 * }} player_data
 * @typedef {{
 * code: Number,
 * message: String,
 * serverStatus: String,
 * playerData: player_data,
 * token: String
 * }} login_data
 */
//------------------------------------------------------------------------
// #region > Account
//------------------------------------------------------------------------
/**
 *
 */
MAGPIE_CLIENT.ACCOUNT.meta = "";
socket.on("LOGIN_SUCCESS", (response) => {
  console.log(`[SOCKET] [LOGIN_SUCCESS] [${response?.code}] `);
  router.loginSuccess(response);
});
socket.on("RELOGGED", (respose) => {
  console.log(`[SOCKET] [RELOGGED] [${respose.code}] `);
  router.loginSuccess(respose);
});
socket.on("LOGIN_ERROR", (data) => {
  console.log(`[SOCKET] [LOGIN_ERROR] [${data.code}] `);
  router.loginFail(data);
});
socket.on("LOGGED_OUT", (data) => {
  console.log(`[SOCKET] [LOGGED_OUT] [${data.code}] `);
  router.loggedOut(data);
});
socket.on("RESUME_SESSION_SUCCESS", (response) => {
  console.log(`[SOCKET] [RESUME_SESSION_SUCCESS] [${response?.code}] `);
  router.loginSuccess(response);
});
socket.on("RESUME_SESSION_FAIL", (data) => {
  console.log(`[SOCKET] [RESUME_SESSION_FAIL] ${data?.message}`);
  router.loginFail(data);
});
socket.on("isAllowedBackIn", (data) => {
  const handle = `[PLAYER-${data?.playerData?.playerID}]`;
  console.log(`[SOCKET] [isAllowedBackIn] ${handle}`);
  router.rehydrateSession(data);
});
socket.on("sessionExpired", () => {
  console.log("[SOCKET] [sessionExpired]. ");
  MAGPIE_CLIENT.setAuthAll(false);
  router.go("login");
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
 * @name
 * @desc
 *
 */
//========================================================================
// #region - Monitor
//========================================================================

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
// #region - Router
//========================================================================
/**
 * @name
 * @desc
 *
 */
//------------------------------------------------------------------------
// #region > Redirect
//------------------------------------------------------------------------
/** @type {Map<String, {view: String, path: String[]>}} */
router.map = new Map();
router.isCurrentMapped = function () {
  try {
    const view = MAGPIE_CLIENT.params.get("view");
    if (!view) return;
    const match = router.map.get(view)?.view;
    if (!match) return;
    router.go(view);
  } catch (e) {
    console.error(e);
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
// #region > Handler
//------------------------------------------------------------------------
router.handlers = {};
/**
 *
 * @param {String} viewName
 * @param {Function} setupCallback
 */
router.on = function routerOn(viewName, setupCallback) {
  router.handlers[viewName] = setupCallback;
};
// #endregion
//------------------------------------------------------------------------
/**
 * @name
 * @desc
 *
 */
//------------------------------------------------------------------------
// #region > togglers
//------------------------------------------------------------------------
/**
 *
 * @param {String} elementId
 * @param {String} value
 * @returns {String}
 */
const update = (elementId, value) => {
  const element = document.getElementById(elementId);
  if (element && element.innerText !== String(value)) element.innerText = value;
  return value;
};
router.update = update;
/**
 *
 * @param {String} elementId
 * @param {Boolean} boolean
 * @returns {String}
 */
const toggle = (elementId, boolean) => {
  if (!elementId || typeof boolean !== "boolean") return;
  const element = document.getElementById(elementId);
  value = boolean ? "block" : "none";
  element.style.display = value;
  return value;
};
router.toggle = toggle;
// #endregion
//------------------------------------------------------------------------
/**
 * @name
 * @desc
 *
 */
//------------------------------------------------------------------------
// #region > go
//------------------------------------------------------------------------
/**
 *
 * @param {String} view
 * @param {Object} serverData
 */
router.go = function routerGo(view, serverData = null) {
  const ePrefix = "[HTML ROUTER].go: ";
  try {
    if (!view || typeof view !== "string")
      throw new Error(`${view} is invalid view. `);
    const container = document.getElementById("view-container");
    const template = document.getElementById(`view-${view}`);
    if (!template) throw new Error(`could not find [view-${view}].\n`);
    container.innerHTML = "";
    const content = template.content.cloneNode(true);
    container.appendChild(content);
    console.log(ePrefix + `${view}...`);
  } catch (e) {
    console.error(ePrefix + e.message, e);
    // socket?.emit("master_queue", { message: e.message, error: e });
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
// #region > Events
//------------------------------------------------------------------------
router.on("account", (content, data) => {
  if (!data) return;
  content.querySelector(".account-ID").textContent = data.playerID;
  content.querySelector(".account-status").textContent = data.status;
});
router.on("adoption", (content, data) => {
  if (!data) return;
  const container = content.querySelector(".store-grid");
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
 * @name
 * @desc
 *
 */
//========================================================================
// #region - STATE
//========================================================================
/**
 * @name
 * @desc
 *
 */
//------------------------------------------------------------------------
// #region > handling
//------------------------------------------------------------------------
MAGPIE_CLIENT.state = {
  authN: false,
  authZ: false,
};
// #endregion
//------------------------------------------------------------------------
/**
 * @name
 * @desc
 *
 */
//------------------------------------------------------------------------
// #region > Auth
//------------------------------------------------------------------------
MAGPIE_CLIENT.setAuthN = function (Boolean) {
  this.state.authN = Boolean;
  const classList = document.body.classList;
  const In = "logged-in";
  const Out = "logged-out";
  classList.remove(In);
  classList.remove(Out);
  classList.add(Boolean ? In : Out);
};
MAGPIE_CLIENT.setAuthZ = function (Boolean) {
  this.state.authZ = Boolean;
};
MAGPIE_CLIENT.setAuthAll = function (Boolean) {
  MAGPIE_CLIENT.setAuthN(Boolean);
  MAGPIE_CLIENT.setAuthZ(Boolean);
};
// #endregion
//------------------------------------------------------------------------
/**
 * @name
 * @desc
 *
 */
//------------------------------------------------------------------------
// #region > Gate
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
// #region - ROUTES
//========================================================================
/**
 * @name
 * @desc
 *
 */
//------------------------------------------------------------------------
// #region > Adoption
//------------------------------------------------------------------------
router.map.set("adoption", { view: "adoption" });

// #endregion
//------------------------------------------------------------------------
/**
 * @name
 * @desc
 *
 */
//------------------------------------------------------------------------
// #region > Monitor
//------------------------------------------------------------------------
router.map.set("monitor", { view: "monitor" });
MAGPIE_MONITOR.meta = {
  name: MAGPIE_CLIENT.meta.name + "monitor",
  desc: "",
  firmwareName: "MAGPIE_MONITOR",
};
//------------------------------------------------------------------------
//#region > subscribe
//------------------------------------------------------------------------
MAGPIE_MONITOR.currentID = null;
MAGPIE_MONITOR.MESSAGE = {};
MAGPIE_MONITOR.MESSAGE.STATUS = {
  off: "[OFF]",
  error: "[ERROR]",
  pending: "[SUBSCRIBING...]",
  on: "[ON-LISTENING...]",
  live: "[ON-FEEDING...]",
};
/**
 *
 * @param {Number} entityID
 */
MAGPIE_MONITOR.subscribe = function monitorSubscribe(entityID) {
  this.unsubscribe(); // Clear previous link first
  socket.emit("subscribe_entity", entityID);
  console.log(`[SOCKET] subscribing to [ENTITY-${entityID}]...`);
  document.getElementById("monitor-status").innerText =
    MAGPIE_MONITOR.MESSAGE.STATUS.pending;
  this.currentID = entityID;
};
MAGPIE_MONITOR.unsubscribe = function () {
  if (!this.currentID) return;
  socket.emit("unsubscribe_entity", this.currentID);
  this.currentID = null;
  // Clear all spans instead of overwriting the whole div
  document
    .querySelectorAll("#physics-stream span")
    .forEach((s) => (s.innerText = "---"));
  document.getElementById("monitor-status").innerText =
    MAGPIE_MONITOR.MESSAGE.STATUS.off;
};
MAGPIE_MONITOR.handleSubscription = function (entityID) {
  update(
    MAGPIE_CLIENT.elements.monitor.status,
    MAGPIE_MONITOR.MESSAGE.STATUS.on,
  );
  console.log(`[SOCKET] subscribed to [ROOM-${entityID}]`);
};
//#endregion
//------------------------------------------------------------------------
/**
 * @name
 * @desc
 *
 */
//------------------------------------------------------------------------
// #region > Update
//------------------------------------------------------------------------
MAGPIE_MONITOR.handleUpdate = function (data) {
  // if (data.entityID !== this.currentID) return;
  // Helper function to safely update text without breaking selection
  update("monitor-status", MAGPIE_MONITOR.MESSAGE.STATUS.live);
  const C0_lat = data.coords[0] || KEY.PRINT.NA;
  const C0_lon = data.coords[1] || KEY.PRINT.NA;
  const Ct_lat = data.targetCoords[0] || KEY.PRINT.NA;
  const Ct_lon = data.targetCoords[1] || KEY.PRINT.NA;
  update("val-id", data.entityID);
  update("val-name", data.entityName);
  update("val-C0", `${C0_lat}, ${C0_lon}`);
  // update('val-lat', data.coords[0].toFixed(10));
  // update('val-lon', data.coords[1].toFixed(10));
  if (data?.coords[2]) update("val-asl", data.coords[2]);
  update("val-Vmag", data.Vmag.toFixed(3));
  update("val-knots", Math.floor(data.Vknots));
  if (!isNaN(data?.Amag)) update("val-Amag", data.Amag?.toFixed(3));
  update("val-Tmag", data.Tmag?.toFixed(3));
  update("val-Rmag", data.Rmag.toFixed(3));
  update("val-states", data.states);
  if (data?.dRmag && !isNaN(data.dRmag))
    update("val-dRmag", Number(data.dRmag)?.toFixed(3));
  if (data?.heading) update("val-heading", data.heading);
  if (data?.pitch) update("val-pitch", data.pitch);
  if (data?.roll) update("val-roll", data?.roll);
  if (Number(data?.pR)) update("val-pR", data?.pR?.toFixed(1));
  update("val-body", data.CelestialBody);
  update("val-meta", data.metadate);
  if (!isNaN(data?.targetID)) update("val-targetID", data.targetID);
  if (data?.targetName && data.targetName !== "undefined")
    update("val-targetName", data.targetName);
  if (Ct_lat && Ct_lon) update("val-Ct", `${Ct_lat}, ${Ct_lon}`);
  // update('val-tlat', data.targetCoords[0].toFixed(10));
  // update('val-tlon', data.targetCoords[1].toFixed(10));
  if (data?.distanceTo) update("val-dist", Math.floor(data.distanceTo));
  if (data?.ETA) update("val-eta", data.ETA);
  //
  if (data?.dR && data.dR.every((n) => !isNaN(n))) update("val-dR", data.dR);
  if (data?.Bdist && data.Bdist.every((n) => !isNaN(n)))
    update("val-Bdist", data.Bdist);
  if (data?.R1) update("val-R1", data.R1);
  if (data?.T1) update("val-T1", data.T1);
};
MAGPIE_MONITOR.copyToClipboard = function copyToClipboard(buttonElement) {
  const monitor = document.getElementById("physics-stream");
  const text = monitor.innerText;
  navigator.clipboard.writeText(text).then(() => {
    // alert("Telemetry copied to clipboard!");
    const originalText = buttonElement.innerText;
    buttonElement.innerText = "Copied";
    setTimeout(() => (buttonElement.innerText = originalText), 2000);
  });
};
// #endregion
//------------------------------------------------------------------------
// #endregion
//------------------------------------------------------------------------
/**
 * @name
 * @desc
 *
 */
//------------------------------------------------------------------------
// #region > Login
//------------------------------------------------------------------------
router.map.set("login", { view: "login", path: "/account/login" });
/**
 * @audit-ok
 * @desc called by [view-login from-login]("./index.html")
 * @param {Event} event
 */
router.login = async function (event) {
  const ePrefix = "[ROUTER] [login]";
  try {
    event.preventDefault();
    const formData = new FormData(event.target);
    const email = formData.get("email");
    const password = formData.get("password");
    socket.emit("LOGIN", { email, password });
    router.loggingIn({ email, password });
  } catch (e) {
    console.error(ePrefix + e.message, e);
  }
};
/**
 *
 * @param {*} data
 */
router.loggingIn = function (data) {
  //@todo css/html styling while waiting for socket response
  const prefix = `[ROUTER] logging in`;
  const productionString = "...";
  const debugString = ` as: \n[USER-${data?.email}]\n[PASS-${data?.password}]\n[DEBUG] ⧖`;
  MAGPIE_CLIENT._log(prefix, debugString, debugString);
};
/**
 *@desc {@link MAGPIE_CLIENT.ACCOUNT.meta}
 * @param {login_data} response
 */
router.loginSuccess = function (response) {
  const { token } = response;
  const playerData = response?.playerData;
  const {
    playerID,
    username,
    playerSlots,
    playerEVP,
    playerCLOUT,
    playerStatus,
  } = playerData;
  localStorage.setItem("playerID", playerID);
  localStorage.setItem("username", username);
  localStorage.setItem("jwt_token", token);
  MAGPIE_CLIENT.DATA.PLAYER = playerData;
  MAGPIE_CLIENT.setAuthN(true);
  router.go("account");
};
router.loginFail = function (data) {
  //@todo router.loginFail
};
router.isLoggedIn = function (data) {
  //@todo router.isLoggedIn
};
router.logout = function (reason) {
  //@todo router.logout
  socket.emit("LOGOUT", reason);
};
router.loggedOut = function (data) {
  //@todo loggedOut
};
router.rehydrateSession = function (data) {
  const { token, server_status } = data;
  /** @type {player_data} */
  const playerData = data?.playerData;
  const currentToken = localStorage.getItem("jwt_token");
  localStorage.setItem("jwt_token", token);
  localStorage.setItem("server_status", server_status);
  localStorage.setItem("username", playerData.username);
  localStorage.setItem("slots", playerData.playerSlots);
  localStorage.setItem("playerEVP", playerData.playerEVP);
  localStorage.setItem("playerCLOUT", playerData.playerCLOUT);
  localStorage.setItem("playerStatus", playerData.playerStatus);
  MAGPIE_CLIENT.setAuthN(true);
  router.go("account");
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
router.map.set("register", { view: "register", path: "/account/login" });
/**
 * @audit-ok
 * @desc called by [view-register form-register]("./index.html")
 */
router.register = function () {
  const ePrefix = "[ROUTER] [register] ";
  try {
    router.go("register");
    setTimeout(() => {
      document.getElementById("register-email").value = "";
      document.getElementById("register-username").value = "";
      document.getElementById("register-password").value = "";
      document.getElementById("register-password-confirm").value = "";
      console.log(ePrefix + "inputs reset. ");
    }, 500);
  } catch (e) {
    console.error(ePrefix + e.message, e);
  }
};
router.registerSubmit = async function (event) {
  const ePrefix = "[ROUTER] [register submit] ";
  try {
    event.preventDefault();
    const formData = new FormData(event.target);
    const password = formData.get("password");
    const passwordConfirm = formData.get("password-confirm");
    if (password !== passwordConfirm) {
      const text = "WARNING: the provided passwords do not match.";
      const status_text = document.getElementById("status_message");
      status_text.innerText = text;
      status_text.className = "login-label-error";
      document.getElementById("password-label").style.color = "#cf1212";
      document.getElementById("password-confirm-label").style.color = "#cf1212";
      return console.warn(ePrefix + "[401] invalid credentials. ");
    }
    const email = formData.get("email");
    const username = formData.get("username");
    const registerMessage = `[ROUTER] registering`;
    const productionString = "...";
    const debugString = ` as: \n[USER-${email}|${username}]\n[PASS-${password}]\n⧖`;
    MAGPIE_CLIENT._log(registerMessage, productionString, debugString);
    socket.emit("REGISTER", { email, username, password });
  } catch (e) {
    console.error(ePrefix + e.message, e);
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
// #region > player
//------------------------------------------------------------------------
router.player = function () {
  const ePrefix = "[ROUTER] [player] ";
  try {
    //
  } catch (e) {
    console.error(e);
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
// #region - UTILITY
//========================================================================
/**
 * @name
 * @desc
 *
 */
//------------------------------------------------------------------------
// #region > Logging
//------------------------------------------------------------------------
MAGPIE_CLIENT._log = function (message, productionString, debugString) {
  if (!productionString && MAGPIE_CLIENT.isProduction) return;
  const suffix = MAGPIE_CLIENT.isProduction ? productionString : debugString;
  console.log(message + suffix);
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
router.isCurrentMapped();
