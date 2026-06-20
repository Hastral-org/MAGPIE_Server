/**
 * @namespace MAGPIE_Server
 * @name session
 * @desc session Manager
 * @version 0.39.0
 * @typedef {import("socket.io").Server} io
 * @typedef {import("socket.io").Socket} socket
 * @typedef {import("../SERVER").socketID} socketID
 * @typedef {import("../SERVER").auth} auth
 * @typedef {import("../SERVER").graceTimer} graceTimer Enforce n-second grace period on disconnects (Anti-F5 spam) cancel timers upon successful reconnection.
 * @typedef {import("../SERVER").MAGPIE_SERVER} MAGPIE_SERVER
 * @typedef {import("../src/player").playerID} playerID
 * @typedef {import("../SERVER").player_cache} player_cache
 * @typedef {{
 * active: Map<playerID, player_cache>
 * }} session_data
 */
//========================================================================
// #region - MANAGER
//========================================================================
const manager = {};
const { MAGPIE } = require("../src/index");
const ePrefix = "[SESSION MANAGER] ";
/**
 * @param {auth} auth
 * @returns {String}
 */
manager.printPlayerAuth = function (auth) {
  return `[PLAYER-${auth?.playerID} | ${auth?.username}]`;
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
      };
    };
    if (auth?.playerID) {
      /** @type {player_cache} */
      const player_cache = session.get(auth.playerID);
      player_cache.sockets.push(socket.id);
      session.set(auth.playerID, player_cache);
    }
    // session.set(auth.playerID, {
    // 		sockets: ,
    // 		username: auth.username,
    // 		joinedAt: Date.now()
    // 	})
    server.log(`Total players: ${session.size - 1}`);
    socket.on("new_visit", () => {
      console.log(ePrefix + "[new_visit]. ");
      server.SESSION.newVisit();
    });
    socket.on("disconnect", () => {
      const playerID = auth?.playerID;
      if (!playerID) return;
      const player_cache = session.get(playerID);
      player_cache.graceTimer = setTimeout(() => {
        session.delete(playerID);
        server.log(
          `${ePrefix}${manager.printPlayerAuth(auth)}disconnected.\n` +
            `Total players: ${session.size - 1}`,
        );
      }, MAGPIE.KEY.SERVER.GRACE_TIMER_DISCONNECTION);
    });
    const visitors = session.get("visitors");
    if (visitors)
      socket.emit("visitor_counter_update", { count: visitors.count });
  } catch (e) {
    server.error(ePrefix + e.message, e);
  }
};
