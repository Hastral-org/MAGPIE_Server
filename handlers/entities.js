/**
 * @name entities handler
 * @version 0.39.92
 *
 * @param {import("socket.io").Server} io
 * @param {import("socket.io").Socket} socket
 * @param {*} server
 */
module.exports = (io, socket, server) => {
  const ePrefix = `[ENTITY HANDLER] [SOCKET-${socket?.id}] `;
  server.sysLog(`registering ${ePrefix}`);
  const leaveEntityRooms = () => {
    socket.rooms.forEach((room) => {
      if (room.startsWith("entity_")) socket.leave(room);
    });
  };
  socket.on("subscribe_entity", (id) => {
    server.sysLog(ePrefix + `subscribing to [ENTITY-${id}]`);
    leaveEntityRooms();
    const roomName = `entity_${id}`;
    socket.join(roomName);
    socket.emit("subscribed_entity", roomName);
    server.sysLog(
      `[SOCKET-${socket.id}] subscribed to [ROOM-${roomName}]`,
      "console",
    );
  });
  socket.on("unsubscribe_entity", () => {
    leaveEntityRooms();
    server.log(
      `[SOCKET-${socket.id}] unsubscribed from all entities`,
      "console",
      false,
    );
  });
};
