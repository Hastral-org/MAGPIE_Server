/**
 * @namespace MAGPIE_Server
 * @name session
 * @desc session Manager
 * @version 0.39.956
 * @typedef {import("socket.io").Server} io
 * @typedef {import("socket.io").Socket} socket
 * @typedef {import("../SERVER").socketID} socketID
 * @typedef {import("../SERVER").auth} auth
 * @typedef {import("../SERVER").graceTimer} graceTimer Enforce n-second grace period on disconnects (Anti-F5 spam) cancel timers upon successful reconnection.
 * @typedef {import("../SERVER").MAGPIE_SERVER} MAGPIE_SERVER
 * @typedef {import("../src/system").MAGPIE_METASTATE} MAGPIE_METASTATE
 * @typedef {import("../src/player").playerID} playerID
 * @typedef {import("../SERVER").player_cache} player_cache
 * @typedef {{
 * active: Map<playerID, player_cache>
 * }} session_data
 */
//========================================================================
// #region - MANAGER
//========================================================================
const session_manager = {};
const { MAGPIE } = require("../src/index");
const ePrefix = "[SESSION MANAGER] ";
/**
 * @param {auth} auth
 * @returns {String}
 */
session_manager.printPlayerAuth = function (auth) {
  return `[PLAYER-${auth?.playerID} | ${auth?.username}]`;
};
session_manager.disconnect = function (reason, socket, server) {
  /** @type {MAGPIE_METASTATE} */
  const state = server.METASTATE;
  state._socket_disconnect({ socket, server });
};
session_manager.reconnect = function (socket, server) {
  /** @type {MAGPIE_METASTATE} */
  const state = server.METASTATE;
  const player_cache = state.session.get(socket?.data?.playerID);
  if (!player_cache) return false;
  clearTimeout(player_cache.graceTimer);
  return true;
};
session_manager.connect = function (socket, server) {
  //@todo session_manager.connect
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
 *
 * @param {io} io
 * @param {socket} socket
 * @param {MAGPIE_SERVER} server
 *
 */
module.exports = function (io, socket, server) {
  try {
    /**  @type {auth} */
    const auth = socket.handshake.auth;
    /** @type {session_data}  */
    const session = server?.METASTATE?.session;
    const cache = (auth) => {
      return {
        sockets: [],
        username: auth?.username,
        joinedAt: Date.now(),
        graceTimer: null,
      };
    };
    if (auth?.playerID) {
      // /** @type {player_cache} */
      // const player_cache = session.get(auth.playerID) || cache(auth);
      // player_cache.sockets.push(socket.id);
      // session.set(auth.playerID, player_cache);
      const reconnecting = session_manager.reconnect(socket, server);
      if (!reconnecting) session_manager.connect(socket, server);
    }
    server.log(`Total players: ${session.size - 1}`);
    socket.on("new_visit", () => {
      console.log(ePrefix + "[new_visit]. ");
      server.SESSION.newVisit();
    });
    socket.on("disconnect", (reason) => {
      // const playerID = auth?.playerID;
      // if (!playerID) return;
      // const player_cache = session.get(playerID);
      // player_cache.graceTimer = setTimeout(() => {
      //   session.delete(playerID);
      //   server.log(
      //     `${ePrefix}${session_manager.printPlayerAuth(auth)}disconnected.\n` +
      //       `Total players: ${session.size - 1}`,
      //   );
      // }, MAGPIE.KEY.SERVER.GRACE_TIMER_DISCONNECTION);
      session_manager.disconnect(reason, socket, server);
    });
    socket.on("LOGOUT", (reason) => {
      session_manager.disconnect(reason, socket, server);
    });
    const visitors = session.get("visitors");
    if (visitors)
      socket.emit("visitor_counter_update", { count: visitors.count });
  } catch (e) {
    server.error(ePrefix + e.message, e);
  }
};
