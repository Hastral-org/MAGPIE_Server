/**
 * @namespace MAGPIE_Client
 * @author Matheraptor
 * @licence GPL-3.0
 * @version 0.39.961
 *
 */
class MAGPIE_CLIENT {
  //
}
MAGPIE_CLIENT.meta = {
  name: `M.A.G.P.I.E.™`,
  desc: "",
  version: [0, 39, 966],
  firmwareName: "MAGPIE_Client",
  firmwareDate: "20260628",
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
/**
 * @desc {@link MAGPIE_CLIENT.ACCOUNT.REGISTER.meta}
 */
MAGPIE_CLIENT.ACCOUNT.REGISTER = {};
/**
 * @typedef {String} clientView
 */
/**
 *
 */
MAGPIE_CLIENT.DATA = {};
/**
 * @type {player_data}
 */
MAGPIE_CLIENT.DATA.PLAYER = {};
/**
 *
 * @type {clientView}
 */
MAGPIE_CLIENT.DATA.CURRENT_VIEW = null;
/**
 * @desc {@link MAGPIE_CLIENT.UI.meta}
 */
MAGPIE_CLIENT.UI = {};
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
 * @typedef {Number} playerID
 * @typedef {String} username
 * @typedef {Number} creatureID
 * @typedef {Number} EVP
 * @typedef {Number} CLOUT
 * @typedef {Boolean} player_status
 * @typedef {import("../handlers/account").playerRole} playerRole
 * @typedef {{
 * playerID: playerID,
 * playerUsername: username,
 * playerSlots: creatureID[],
 * playerRole: playerRole,
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
//========================================================================
// #region - KEY
//========================================================================
/**
 *
 */
KEY.PRINT = {};
KEY.PRINT.NA = "n/a";
KEY.SERVER_ON = "✅ RUNNING";
KEY.SERVER_OFF = "⚠️ NOT RESPONDING";
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
socket.on("disconnect", (reason) => {
  console.log(`[SOCKET] [disconnect] ${reason}`);
  localStorage.setItem("serverStatus", KEY.SERVER_OFF);
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
 * @desc {@link router.probeUsername}
 *
 */
//------------------------------------------------------------------------
// #region > Register
//------------------------------------------------------------------------
MAGPIE_CLIENT.ACCOUNT.REGISTER.meta = "";
socket.on("PROBE_USERNAME_AVAILABLE", () => {
  const usernameInput = MAGPIE_CLIENT.UI.usernameInput();
  const usernameFeedback = MAGPIE_CLIENT.UI.usernameFeedback();
  const registerSubmit = MAGPIE_CLIENT.UI.registerSubmit();
  registerSubmit.disabled = false;
  usernameFeedback.textContent = "✅ Username is available!";
  usernameFeedback.className = "feedback-text success";
  usernameInput.classList.remove("input-error");
  usernameInput.classList.add("input-success");
});
socket.on("PROBE_USERNAME_UNAVAILABLE", () => {
  const usernameInput = MAGPIE_CLIENT.UI.usernameInput();
  const usernameFeedback = MAGPIE_CLIENT.UI.usernameFeedback();
  const registerSubmit = MAGPIE_CLIENT.UI.registerSubmit();
  usernameFeedback.textContent = "⚠️ Username is unavailable.";
  usernameFeedback.className = "feedback-text error";
  usernameInput.classList.remove("input-success");
  usernameInput.classList.add("input-error");
  registerSubmit.disabled = true;
});
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
/**
 * @desc {@link router.recoverPassword}
 */
socket.on("RESET_PASSWORD_SUCCESS", () => {
  router.recoverPasswordConfirm();
});
socket.on("RESET_PASSWORD_CONFIRMED", (data) => {
  router.resetPasswordConfirmed(data);
});
// #endregion
//------------------------------------------------------------------------
/**
 * @name
 * @desc
 *
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
  MAGPIE_CLIENT.clearLocalStorage();
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
    sessionStorage.setItem("view", view);
    router.fillPlayerData();
    console.log(ePrefix + `${view}...`);
  } catch (e) {
    console.error(ePrefix + e.message, e);
    // socket?.emit("master_queue", { message: e.message, error: e });
  }
};
router.fillPlayerData = function () {
  const playerID = document.getElementById("playerID");
  const username = document.getElementById("playerUsername");
  const role = document.getElementById("playerRole");
  const slots = document.getElementById("playerSlots");
  const EVP = document.getElementById("playerEVP");
  const CLOUT = document.getElementById("playerCLOUT");
  const status = document.getElementById("playerStatus");
  const serverStatus = document.getElementById("serverStatus");
  if (playerID) playerID.textContent = localStorage.getItem("playerID");
  if (username) username.textContent = localStorage.getItem("playerUsername");
  if (role) role.textContent = localStorage.getItem("playerRole");
  if (slots) {
    slots.textContent = "";
    const playerSlots = localStorage.getItem("playerSlots");
    if (playerSlots) {
      const renderedSlots = playerSlots.split(",").map(Number);
      renderedSlots.forEach((slot) => {
        const btn = router.renderSlotButton(slot);
        slots.appendChild(btn);
      });
    }
  }
  if (EVP) EVP.textContent = localStorage.getItem("playerEVP");
  if (CLOUT) CLOUT.textContent = localStorage.getItem("playerCLOUT");
  if (status) {
    const playerStatus = localStorage.getItem("playerStatus");
    status.textContent = playerStatus ? "ONLINE" : "OFFLINE";
  }
  if (serverStatus)
    serverStatus.textContent = localStorage.getItem("serverStatus");
};
router.renderSlotButton = function (slot) {
  const btn = document.createElement("button");
  btn.id = `slot-${slot}`;
  btn.classList.add("nav-button");
  const icon = router.renderIcon(MAGPIE_CLIENT.UI.ICON_CREATURE);
  icon.style.marginRight = "8px";
  const textLabel = document.createTextNode(`[CREATURE-${slot}]`);
  btn.appendChild(icon);
  btn.appendChild(textLabel);
  btn.onclick = (e) => router.pop("slot", slot, e);
  return btn;
};
/**
 *
 * @param {Number} iconIndex
 * @returns
 */
router.renderIcon = function (iconIndex) {
  const icon = document.createElement("span");
  icon.classList.add("rpg-icon");
  const positionStyles = router.getIconStyles(iconIndex);
  Object.assign(icon.style, positionStyles);
  return icon;
};
/**
 *
 * @param {popupType} popupType
 * @param {creatureID} slot
 * @param {MouseEvent} event
 */
router.pop = function (popupType, slot, event) {
  const buttonRect = event.currentTarget.getBoundingClientRect();
  const overlay = document.createElement("div");
  overlay.classList.add("popup-overlay");
  const contentBox = document.createElement("div");
  contentBox.classList.add(`popup-${popupType}`);
  contentBox.style.top = `${buttonRect.bottom + window.scrollY + 4}px`;
  contentBox.style.left = `${buttonRect.left + window.scrollX}px`;
  contentBox.innerHTML = `
    <strong>[CREATURE-${slot}]</strong>
    <p style="margin: 4px 0 0 0;">Type: ${popupType}</p>`;
  overlay.onclick = (e) => {
    if (e.target === overlay) overlay.remove();
  };
  overlay.appendChild(contentBox);
  document.body.appendChild(overlay);
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
 * @name
 * @desc
 *
 */
//------------------------------------------------------------------------
// #region > Icons
//------------------------------------------------------------------------
router.getIconStyles = function (iconIndex) {
  const iconSize = 32;
  const gridWidth = 16;
  const x = (iconIndex % gridWidth) * iconSize;
  const y = Math.floor(iconIndex / gridWidth) * iconSize;
  return {
    backgroundPosition: `-${x}px -${y}px`,
  };
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
MAGPIE_CLIENT.clearLocalStorage = function () {
  localStorage.clear();
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
  MAGPIE_CLIENT._log(prefix, productionString, debugString);
};
/**
 *@desc {@link MAGPIE_CLIENT.ACCOUNT.meta}
 * @param {login_data} response
 */
router.loginSuccess = function (response) {
  router.rehydrateSession(response);
  router.go("account");
};
router.loginFail = function (data) {
  //@todo router.loginFail
  const status = document.getElementById("login-feedback");
  status.className = "feedback-text error";
  status.innerText = `[${data?.code}]: ${data?.message}`;
};
router.isLoggedIn = function (data) {
  //@todo router.isLoggedIn
};
router.logout = function (reason) {
  //@todo router.logout
  const playerID = localStorage.getItem("playerID");
  console.log(`[SOCKET] [logout] [PLAYER-${playerID}]: ${reason}`);
  socket.emit("LOGOUT", { reason, playerID });
};
router.loggedOut = function (data) {
  //@todo loggedOut
  MAGPIE_CLIENT.setAuthAll(false);
  router.go("home");
};
router.rehydrateSession = function (data) {
  const { token } = data;
  localStorage.setItem("jwt_token", token);
  const view = sessionStorage.getItem("view");
  router.rehydratePlayerData(data);
  MAGPIE_CLIENT.setAuthN(true);
  if (view) router.go(view);
};
/**
 *
 * @param {{
 * playerData: player_data
 * }} data
 */
router.rehydratePlayerData = function (data) {
  /** @type {player_data} */
  const playerData = data?.playerData;
  const serverStatus = playerData ? KEY.SERVER_ON : KEY.SERVER_OFF;
  localStorage.setItem("playerID", playerData.playerID);
  localStorage.setItem("serverStatus", serverStatus);
  localStorage.setItem("playerUsername", playerData.username);
  localStorage.setItem("playerSlots", playerData.playerSlots);
  localStorage.setItem("playerRole", playerData.playerRole);
  localStorage.setItem("playerEVP", playerData.playerEVP);
  localStorage.setItem("playerCLOUT", playerData.playerCLOUT);
  localStorage.setItem("playerStatus", playerData.playerStatus);
  console.log("[ROUTER] [rehydratePlayerData]: 200");
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
    const usernameInput = document.getElementById("register-username");
    usernameInput.addEventListener(
      "input",
      debounce((e) => {
        router.probeUsername(e.target.value.trim());
      }, 500),
    );
  } catch (e) {
    console.error(ePrefix + e.message, e);
  }
};
/**
 * @desc {@link MAGPIE_CLIENT.ACCOUNT.REGISTER.meta}
 * @param {String} username
 */
router.probeUsername = function (username) {
  console.log(`[ROUTER] [probeUsername]: [${username}]...`);
  const usernameInput = document.getElementById("register-username");
  const feedback = document.getElementById("username-feedback");
  if (usernameInput.value.length >= 4) {
    feedback.textContent = "Checking availability...";
    feedback.className = "feedback-text checking";
    socket.emit("PROBE_USERNAME", { username });
  } else {
    feedback.textContent = "⚠️ username too short!";
    feedback.className = "feedback-text error";
    MAGPIE_CLIENT.UI.registerSubmit().disabled = true;
  }
};
/**
 *
 * @param {HTMLFormElement} event
 * @returns
 */
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
// #region > Recover
//------------------------------------------------------------------------
/**
 *
 * @param {HTMLFormElement} event
 */
router.recoverPassword = function (event) {
  const ePrefix = "[ROUTER] [recoverPassword] ";
  try {
    event.preventDefault();
    const formData = new FormData(event.target);
    const email = formData.get("email");
    const registerMessage = ePrefix + "recovering";
    const productionString = "...";
    const debugString = ` as: \n[USER-${email}]\n\n⧖`;
    MAGPIE_CLIENT._log(ePrefix, productionString, debugString);
    socket.emit("RESET_PASSWORD_REQUEST", { email });
  } catch (e) {
    console.error(ePrefix + e.message, e);
  }
};
router.recoverPasswordConfirm = function () {
  const ePrefix = "[ROUTER] [recoverPasswordSuccess] ";
  console.log(ePrefix);
  const feedback = document.getElementById("recover-feedback");
  feedback.className = "feedback-text success";
  feedback.textContent = "Request sent. Check your email.";
};
/**
 *
 * @param {HTMLFormElement} event
 */
router.resetPassword = async function (event) {
  const ePrefix = "[ROUTER] [resetPassword] ";
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get("token");
  event.preventDefault();
  console.log(ePrefix);
  const feedback = document.getElementById("reset-password-feedback");
  const formData = new FormData(event.target);
  const password1 = formData.get("reset-password");
  const password2 = formData.get("reset-password-confirm");
  if (password1 !== password2) {
    const text = "WARNING: the provided passwords do not match.";
    const status_text = document.getElementById("status_message");
    status_text.innerText = text;
    status_text.className = "login-label-error";
    document.getElementById("password-label").style.color = "#cf1212";
    document.getElementById("password-confirm-label").style.color = "#cf1212";
    return console.warn(ePrefix + "[401] invalid credentials. ");
  }
  const resetMessage = `[ROUTER] resetting password`;
  const productionString = "...";
  const debugString = ` as: \n[PASS-${password1}]\n⧖`;
  MAGPIE_CLIENT._log(resetMessage, productionString, debugString);
  socket.emit("RESET_PASSWORD_SUBMIT", { token, password: password1 });
  const requestSuccess = await new Promise((parentResolve) => {
    const timedOut = setTimeout(() => {
      socket.off("RESET_PASSWORD_CONFIRMED");
      feedback.className = "feedback-text error";
      feedback.textContent = "[504] Server timed out. Please, try again.";
      parentResolve(false);
    }, 10_000);
    socket.once("RESET_PASSWORD_CONFIRMED", async (data) => {
      clearTimeout(timedOut);
      const code = data?.code;
      const SE = code === 500;
      const INV = code === 401;
      const fail = SE || INV;
      const error = !code || fail ? " error" : " success";
      feedback.className = `feedback-text${error}`;
      const messageError = "[500] Internal server error";
      const invalid = "[401] Invalid credentials";
      const success = "[205] Success!";
      feedback.textContent = SE ? messageError : INV ? invalid : success;
      await sleep(1000);
      parentResolve(!fail);
    });
  });
  if (requestSuccess) router.go("login");
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
router.syncPlayer = async function () {
  const ePrefix = "[ROUTER] [syncPlayer] ";
  const playerID = localStorage.getItem("playerID");
  if (!playerID)
    return console.warn(`${ePrefix}${playerID} is invalid playerID. `);
  socket.emit("please, sync my data", { playerID });
  console.log(
    `[SOCKET] [syncPlayer]: [please, sync my data] [PLAYER-${playerID}]`,
  );
  return new Promise((resolve, reject) => {
    socket.on("player_sync", (data) => {
      console.log(`[SOCKET] [player_sync] [${data?.code}]`);
      /** @type {player_data} */
      const playerData = data?.playerData;
      if (!playerData?.playerID) return;
      router.rehydratePlayerData(data);
      router.fillPlayerData();
    });
    socket.on("player_sync_error", (data) => {
      console.error(ePrefix);
      const status = document.getElementById("playerStatus");
      status.textContent = `[${data?.code}] ERROR`;
    });
  });
};
router.refreshPlayerHub = async function () {
  await router.syncPlayer();
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
 * @typedef {String} popupType
 */
//========================================================================
// #region - UI
//========================================================================
/**
 *
 */
MAGPIE_CLIENT.UI.meta = "";
/**
 * @name
 * @desc
 *
 */
//------------------------------------------------------------------------
// #region > Icons
//------------------------------------------------------------------------

MAGPIE_CLIENT.UI.ICON_DATE = 172;
MAGPIE_CLIENT.UI.ICON_SHELDEX = 173;
MAGPIE_CLIENT.UI.ICON_EGG = 235;
MAGPIE_CLIENT.UI.ICON_SPECIES = 234;
MAGPIE_CLIENT.UI.ICON_BREED = 237;
MAGPIE_CLIENT.UI.ICON_GROUP = 250;
MAGPIE_CLIENT.UI.ICON_CREATURE = 251;
MAGPIE_CLIENT.UI.ICON_MUTATION = 252;
MAGPIE_CLIENT.UI.ICON_TRAIT = 253;
MAGPIE_CLIENT.UI.ICON_MALE = 254;
MAGPIE_CLIENT.UI.ICON_FEMALE = 255;
MAGPIE_CLIENT.UI.ICON_PLAYER = 159;
MAGPIE_CLIENT.UI.ICON_EVOLUTION = 174;
MAGPIE_CLIENT.UI.ICON_CLOUT = 175;
MAGPIE_CLIENT.UI.ICON_DAWN = 282;
MAGPIE_CLIENT.UI.ICON_MORNING = 283;
MAGPIE_CLIENT.UI.ICON_NOON = 284;
MAGPIE_CLIENT.UI.ICON_AFTERNOON = 285;
MAGPIE_CLIENT.UI.ICON_DUSK = 286;
MAGPIE_CLIENT.UI.ICON_NIGHT = 287;
// #endregion
//------------------------------------------------------------------------
/**
 * @name
 * @desc
 *
 */
//------------------------------------------------------------------------
// #region > Popup
//------------------------------------------------------------------------
MAGPIE_CLIENT.UI.POPUP_TYPES = {};
MAGPIE_CLIENT.UI.POPUP_TYPES.SLOT = "slot";
// #endregion
//------------------------------------------------------------------------
/**
 * @name
 * @desc
 *
 */
//------------------------------------------------------------------------
// #region > HTML
//------------------------------------------------------------------------
MAGPIE_CLIENT.UI.usernameFeedback = () =>
  document.getElementById("username-feedback");
MAGPIE_CLIENT.UI.usernameInput = () =>
  document.getElementById("register-username");
MAGPIE_CLIENT.UI.registerSubmit = () =>
  document.getElementById("register-submit");
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
 * @name
 * @desc
 *
 */
//------------------------------------------------------------------------
// #region > Throttling
//------------------------------------------------------------------------
function sleep(ms) {
  return new Promise((res) => setTimeout(res, ms));
}
/**
 *
 * @param {Function} func
 * @param {Number} delay in ms
 * @returns
 */
function debounce(func, delay) {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(null, args);
    }, delay);
  };
}
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
