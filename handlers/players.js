const { MAGPIE_SYSTEM, MAGPIE_HIVE } = require("../src/system");
module.exports = (io, socket) => {
    const { playerID } = socket.handshake.query;
    if(!playerID || playerID === "undefined" || playerID === "null") 
        return
    socket.join(`player_${playerID}`)
    const player = MAGPIE_HIVE._get_player(playerID)
    if(!player)
        return MAGPIE_SYSTEM.log(`[PLAYER] unable to find [PLAYER-${playerID}]`, "console", false)
    const ePrefix = `[PLAYER-${playerID}] `;
    const socketPrefix = `[SOCKET-${socket.id}]`
    player.setOnline(true)
    io.emit("player_connected", player)
    MAGPIE_SYSTEM.log(ePrefix + `connected and subscribed to ${socketPrefix}`)
    // @todo Bind the socket to the player entity in the HIVE 
    // const playerEntity = MAGPIE_HIVE.getEntity(playerID);

    socket.on("player_action", (payload) => {
        MAGPIE_SYSTEM.log(`${ePrefix} Action received: ${payload.type}`, "console", false);
        // Delegate to the entity's internal logic
        if (player) player.processAction(payload);
    });
    socket.on("player_request_sync", () => {
        const data = player._get_data()
        socket.emit("sync_player_data", data)
    })
    socket.on("disconnect", (reason) => {
        MAGPIE_SYSTEM.log(`${ePrefix} disconnected -- ${reason}`, "console", false);
        // Clean up: Mark entity as offline in the HIVE
        if (player) player.setOnline(false);
        socket.data = {};
        const leavePlayerRooms = () => {
            socket.rooms.forEach(room => {
                if(room.startsWith("player_")) socket.leave(room)
            })
        }
    });
    socket.on("request_sync", (payload) => {
        const { playerID } = payload;
        const player = MAGPIE_HIVE._get_player(playerID)
        if(!player)
            socket.emit("request_sync_error", { message: `unable to find [PLAYER-${playerID}]`})
        player.status = true;
        socket.emit("request_sync_success", {
            ID: playerID,
            username: player.username,
            email: player.email,
            creatureID: player.creatureID,
            EVP: player.EVP,
            CLOUT: player.CLOUT,
            slots: player.slots,
            status: player.status
        })
    })
};