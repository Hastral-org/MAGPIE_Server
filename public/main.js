/**
 * @namespace MAGPIE_Client
 * @author Matheraptor
 * @licence GPL-3.0
 * @version 0.39.0
 *
 */
class MAGPIE_CLIENT {
  //
}
MAGPIE_CLIENT.meta = {
  name: "M.A.G.P.I.E. WebClient",
  desc: "",
  version: [0, 39, 0],
  firmwareName: "MAGPIE_Client",
  firmwareDate: "20260611",
};
MAGPIE_CLIENT.params = new URLSearchParams(window.location.search);
MAGPIE_CLIENT.pathParts = window.location.pathname.split("/");
MAGPIE_CLIENT.secure_socket = window.location.href.includes("https");
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
/**
 * @name
 * @desc
 *
 */
//========================================================================
// #region - SOCKET
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
    const target = document.getElementById("targetID");
    if (target) target.value = entityID;
    MAGPIE_CLIENT.MONITOR.currentID = Number(entityID);
    router.go("monitor");
  }
});
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
  MAGPIE_CLIENT.inspector.handleUpdate(data);
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
// #region - MONITOR
//========================================================================
MAGPIE_MONITOR.meta = {
  name: MAGPIE_CLIENT.meta.name + " monitor",
  desc: "",
  firmwareName: "MAGPIE_MONITOR",
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
// #region - ROUTER
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
