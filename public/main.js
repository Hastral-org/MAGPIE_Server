/**
 * @namespace MAGPIE_Client
 * @author Matheraptor
 * @licence GPL-3.0
 * @version 0.39.94
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
  const entityID = MAGPIE_CLIENT.params.get("entityID");
  if (entityID) {
    const entity = document.getElementById("entityID");
    if (entity) entity.value = entityID;
    router.go("monitor");
    MAGPIE_MONITOR.subscribe(entityID);
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
MAGPIE_MONITOR.meta = {
  name: MAGPIE_CLIENT.meta.name + " monitor",
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
  const ePrefix = "[HTML ROUTER] ";
  try {
    if (!view || typeof view !== "string")
      throw new Error(`${view} is invalid view. `);
    const container = document.getElementById("view-container");
    const template = document.getElementById(`view-${view}`);
    if (!template) throw new Error(`could not find [view-${view}].\n`);
    container.innerHTML = "";
    const content = template.content.cloneNode(true);
    container.appendChild(content);
  } catch (e) {
    console.error(ePrefix + e.message, e);
    socket?.emit("master_queue", { message: e.message, error: e });
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
// #region - UTILITY
//========================================================================
/**
 *
 * @desc back to {@link }
 *
 */
//========================================================================
// #endregion -
//========================================================================
