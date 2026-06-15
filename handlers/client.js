const { MAGPIE } = require("../src/index");
/**
 * @version 0.38.2
 *
 * @typedef {import("socket.io").Server} io
 * @typedef {import("../SERVER.js").MAGPIE_SERVER} server
 * @typedef {import("socket.io").Socket} socket
 */
const accountHandler = require("./account");
const ePrefix = "[CLI HANDLER] ";
/**
 *
 * @param {io} io
 * @param {socket} socket
 * @param {server} server
 */
module.exports = function (io, socket, server) {
  try {
    if (!io) throw new Error(`${io} is invalid io`);
    if (!socket) throw new Error(`${socket} is invalid socket`);
    if (!server) throw new Error(`${server} is invalid server`);
    const data = {
      KEY: MAGPIE.KEY,
    };
    socket.emit("boot", data);
    server.log(
      `${ePrefix} [SOCKET-${socket.id}] initialized.`,
      "console",
      true,
    );
  } catch (e) {
    console.error(
      `${ePrefix} Failed to initialize [SOCKET-${socket.id}]: ${e.message}`,
      e,
    );
  }
  socket.on("RESET_PASSWORD_REQUEST", async (data) => {
    try {
      socket.emit("RESET_PASSWORD_SUCCESS", { email: data.email });
      server.log(`${ePrefix} resetpassword: success`, "console", true);
    } catch (e) {
      socket.emit("RESET_PASSWORD_ERROR", { message: e.message });
      throw e;
    }
  });
};
