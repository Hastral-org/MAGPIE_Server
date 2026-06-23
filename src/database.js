/**
 * @name DATABASE
 * @desc
 * @version 0.23.0
 */
//========================================================================
// #region - DATABASE
//========================================================================
const { response } = require("express");
const {
  verifyPassword,
  hashPassword,
  EmailSecurity,
} = require("./services/crypto");
const { MAGPIE } = require("./index");
const {
  MAGPIE_LOG,
  MAGPIE_SYSTEM,
  MAGPIE_METASTATE,
  MAGPIE_DATE,
} = require("./system.js");
const { MAGPIE_ENTITY } = require("./entity.js");
class MAGPIE_DATABASE {
  static {
    //
  }
}
/**
 * @name
 * @desc
 *
 */
//------------------------------------------------------------------------
// #region > Utility
//------------------------------------------------------------------------
/**
 * @typedef {import("../SERVER.js").epoch_real} epoch_real
 * @returns {epoch_real}
 */
MAGPIE_DATABASE.timestamp = function timestamp() {
  return Date.now();
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
 * @name WORKER
 * @desc
 *
 */
//========================================================================
// #region - WORKER
//========================================================================
MAGPIE_DATABASE._pending = new Map();
MAGPIE_DATABASE.sync = require("./services/database_worker");
const { Worker } = require("node:worker_threads");
const { MAGPIE_PLAYER } = require("./player.js");
const {
  MAGPIE_EXP,
  MAGPIE_KEY,
  MAGPIE_SYMBOL,
  MAGPIE_CONTEXT,
  MAGPIE_TICKET,
} = require("./component.js");
MAGPIE_DATABASE.worker = new Worker("./src/services/database_worker.js", {
  name: "database_worker",
  workerData: {},
});
MAGPIE_DATABASE.call = function call(method, ...args) {
  const requestID = Date.now() + Math.floor(Math.random() * 10000000);
  return new Promise((resolve, reject) => {
    if (MAGPIE_DATABASE._pending.has(requestID)) console.error("collision!");
    MAGPIE_DATABASE._pending.set(requestID, { resolve, reject });
    MAGPIE_DATABASE.worker.postMessage({ method, args, requestID });
  });
};
MAGPIE_DATABASE.worker.on("message", (response) => {
  const { requestID, result, error } = response;
  const tools = MAGPIE_DATABASE._pending.get(requestID);
  if (!tools) return;
  const { resolve, reject } = tools;
  if (error) reject(error);
  else resolve(result);
  MAGPIE_DATABASE._pending.delete(requestID);
});
MAGPIE_DATABASE.worker.on("error", (err) =>
  console.error("[DATABASE WORKER].ERROR: ", err),
);
MAGPIE_DATABASE.worker.on("exit", (code) =>
  console.log("[DATABASE WORKER].EXITED with code: ", code),
);
MAGPIE_DATABASE.pingWorker = async function pingWorker() {
  const ePrefix = "[DATABASE].pingWorker";
  MAGPIE_SYSTEM.log(ePrefix + "...", "console", true);
  try {
    const result = await MAGPIE_DATABASE.call("ping");
    MAGPIE_SYSTEM.log(ePrefix + `: ${result}`, "console", true);
  } catch (e) {
    MAGPIE_SYSTEM.log(ePrefix + `: ${e.message}`, "error", true);
  }
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
 * @name wrappers
 * @desc
 * @typedef {import("better-sqlite3").RunResult} worker_result
 * @typedef {import("./entity.js").entityID} entityID
 * @typedef {import("./services/database_worker").Database} Database
 *
 */
//========================================================================
// #region - WRAP
//========================================================================
/**
 * @name
 * @desc
 *
 */
//------------------------------------------------------------------------
// #region > utility
//------------------------------------------------------------------------
/**
 *
 * @param {String} tableName
 * @param {Number} rowID
 * @returns
 */
MAGPIE_DATABASE.getWorldRow = function (tableName, rowID) {
  const result = MAGPIE_DATABASE.sync.getRow(tableName, { ID: rowID });
  if (Array.isArray(result)) return result[0];
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
/**
 *
 * @returns {MAGPIE_METASTATE}
 *
 */
MAGPIE_DATABASE.loadMetastate = function loadMetastate() {
  const ePrefix = "[DATABASE].loadMetastate: ";
  try {
    const metastate = MAGPIE_DATABASE.sync.loadWorldRow("MAGPIE_METASTATE", {});
    if (!(metastate instanceof MAGPIE_METASTATE))
      throw new Error(`no metastate in database`);
    return metastate;
  } catch (e) {
    MAGPIE_SYSTEM.error(ePrefix + e.message, e);
  }
};
/**
 *
 * @param {MAGPIE_METASTATE} metastate
 * @returns {worker_result}
 */
MAGPIE_DATABASE.saveMetastate = function saveMetastate(metastate) {
  const ePrefix = "[DATABASE].saveMetastate: ";
  try {
    if (!(metastate instanceof MAGPIE_METASTATE))
      throw new Error(`${metastate} is invalid MAGPIE_METASTATE`);
    metastate.meta.updated = MAGPIE_DATABASE.timestamp();
    const save = MAGPIE_DATABASE.sync.saveWorldRow("MAGPIE_METASTATE", {
      key: "MAGPIE_METASTATE",
      data: metastate,
    });
    return save;
  } catch (e) {
    MAGPIE_SYSTEM.error(ePrefix + e.message, e);
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
// #region > Player
//------------------------------------------------------------------------
/**
 *
 * @param {username} username
 * @returns {Boolean}
 */
MAGPIE_DATABASE.isUsernameAvailable = function (username) {
  const ePrefix = "[DATABASE].isUsernameAvailable: ";
  try {
    if (!username || typeof username !== "string")
      throw new Error(`${username} is invalid username. `);
    const statement = MAGPIE_DATABASE.sync.server.prepare(
      "SELECT 1 FROM MAGPIE_PLAYER WHERE username = ? LIMIT 1",
    );
    return !!statement.get(username);
  } catch (e) {
    MAGPIE_SYSTEM.error(ePrefix + e.message, e);
  }
};
/**
 * @param {email} email
 */
MAGPIE_DATABASE.getPlayerByEmail = async function (email) {
  const ePrefix = "[DATABASE].getPlayerByEmail: ";
  try {
    const emailHash = EmailSecurity.hashEmail(email);
    const player = await MAGPIE_DATABASE.call(
      "loadServerRow",
      "MAGPIE_PLAYER",
      { email_hash: emailHash },
    );
    if (!player) return null;
    // 	throw new Error(`[USER-${email}] not found`)
    Object.setPrototypeOf(player, MAGPIE_PLAYER.prototype);
    return player;
  } catch (e) {
    MAGPIE_SYSTEM.error(ePrefix + e.message, e);
  }
};
MAGPIE_DATABASE.getPlayerEmail = async function (playerID) {
  const ePrefix = "[DATABASE]";
};
MAGPIE_DATABASE.getPlayerByUsername = async function (username) {
  const ePrefix = "[DATABASE].getPlayerByUsername: ";
  try {
    const player = await MAGPIE_DATABASE.call(
      "loadServerRow",
      "MAGPIE_PLAYER",
      { username: username },
    );
    if (!player) return null;
    // 	throw new Error(`[USER-${email}] not found`)
    Object.setPrototypeOf(player, MAGPIE_PLAYER.prototype);
    return player;
  } catch (e) {
    MAGPIE_SYSTEM.error(ePrefix + e.message, e);
  }
};
/**
 *
 * @param {Number} playerID
 * @returns {Promise<MAGPIE_PLAYER>}
 */
MAGPIE_DATABASE.loadPlayer = async function (playerID) {
  const ePrefix = "[DATABASE].loadPlayer: ";
  try {
    const player = await MAGPIE_DATABASE.call(
      "loadServerRow",
      "MAGPIE_PLAYER",
      { ID: playerID },
    );
    if (!player) throw new Error(`[PLAYER-${playerID}] not found`);
    Object.setPrototypeOf(player, MAGPIE_PLAYER.prototype);
    return player;
  } catch (e) {
    MAGPIE_SYSTEM.error(ePrefix + e.message, e);
  }
};
/**
 *
 * @param {Number} playerID
 * @returns {MAGPIE_PLAYER}
 */
MAGPIE_DATABASE.loadPlayerSync = function (playerID) {
  const ePrefix = "[DATABASE].loadPlayer: ";
  try {
    const player = MAGPIE_DATABASE.sync.loadServerRow("MAGPIE_PLAYER", {
      ID: playerID,
    });
    if (!(player instanceof MAGPIE_PLAYER))
      throw new Error(`[PLAYER-${playerID}] not found`);
    return player;
  } catch (e) {
    MAGPIE_SYSTEM.error(ePrefix + e.message, e);
  }
};
/**
 * @typedef {String} password
 * @param {email} email
 * @param {password} pass
 * @returns {Promise<MAGPIE_PLAYER>}
 */
MAGPIE_DATABASE.loginPlayer = async function loginPlayer(email, pass) {
  const ePrefix = `[DATABASE].loginPlayer: `;
  const code = MAGPIE.KEY.HTTP;
  try {
    if (!MAGPIE_DATABASE.isValidEmail(email)) return;
    const emailHash = EmailSecurity.hashEmail(email);
    const player = await MAGPIE_DATABASE.call(
      "loadServerRow",
      "MAGPIE_PLAYER",
      { email_hash: emailHash },
    );
    if (!player)
      return MAGPIE_SYSTEM.sysLog(ePrefix + `[${code.STATUS_404.code}]`);
    const valid = await MAGPIE_DATABASE.isValidPass(pass, player);
    if (!valid)
      return MAGPIE_SYSTEM.sysLog(ePrefix + `[${code.STATUS_401.code}]`);
    return player;
  } catch (e) {
    const message = `[${code.STATUS_500.code}]` + e.message;
    return MAGPIE_SYSTEM.error(ePrefix + message, e);
  }
};
/**
 *
 * @param {email} email
 * @returns {Boolean}
 */
MAGPIE_DATABASE.isValidEmail = function isValidEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};
/**
 *
 * @param {password} password
 * @returns {Boolean}
 */
MAGPIE_DATABASE.isValidPass = async function isValidPass(password, player) {
  return await verifyPassword(password, player.PASS);
};
/**
 * @typedef {import("./player").player_data} player_data
 * @param {player_data} data
 */
MAGPIE_DATABASE.createPlayer = async function createPlayer(playerData) {
  const ePrefix = "[DATABASE].createPlayer: ";
  try {
    const player = new MAGPIE_PLAYER(playerData);
    const result = await MAGPIE_DATABASE.savePlayer(player);
    if (!result) throw new Error(`${result} is invalid database result`);
    return player;
  } catch (e) {
    MAGPIE_SYSTEM.error(ePrefix + e.message, e);
    return e;
  }
};
/**
 *
 * @param {MAGPIE_PLAYER} player
 * @returns {Promise<worker_result>}
 */
MAGPIE_DATABASE.savePlayer = async function savePlayer(player) {
  const ePrefix = "[DATABASE].savePlayer: ";
  try {
    const payload = MAGPIE_DATABASE.preparePlayer(player);
    if (!payload) throw new Error(`${payload} is invalid player payload`);
    const result = await MAGPIE_DATABASE.call(
      "saveServerRow",
      "MAGPIE_PLAYER",
      payload,
    );
    if (!result) throw new Error(`unable to save [PLAYER-${player.ID}`);
    return result;
  } catch (e) {
    MAGPIE_SYSTEM.error(ePrefix + e.message, e);
  }
};
/**
 *
 * @param {MAGPIE_PLAYER} player
 * @returns {worker_result}
 */
MAGPIE_DATABASE.savePlayerSync = function savePlayerSync(player) {
  const ePrefix = "[DATABASE].savePlayer: ";
  try {
    const payload = MAGPIE_DATABASE.preparePlayer(player);
    if (!payload) throw new Error(`${payload} is invalid player payload`);
    const result = MAGPIE_DATABASE.sync.saveServerRow("MAGPIE_PLAYER", payload);
    if (!result) throw new Error(`unable to save [PLAYER-${player.ID}`);
    return result;
  } catch (e) {
    MAGPIE_SYSTEM.error(ePrefix + e.message, e);
  }
};
/**
 * @typedef {String} email
 * @typedef {String} username
 * @typedef {String} encrypted_password
 * @typedef {Number} epoch_real from Date.now()
 * @typedef {Number} epoch_game from metastate.date.timestamp()
 * @typedef {Number} binary_bool 0 for false, 1 for true
 * @typedef {{
 * 	ID: Number,
 *  username: username,
 * 	email: email,
 * 	PASS: encrypted_password,
 * 	updated: epoch_real,
 * 	isFrozen: binary_bool
 * }} player_payload
 * @param {MAGPIE_PLAYER} player
 * @returns {player_payload}
 */
MAGPIE_DATABASE.preparePlayer = function preparePlayer(player) {
  const ePrefix = "[DATABASE].preparePlayer: ";
  try {
    if (player?.constructor?.name !== "MAGPIE_PLAYER")
      throw new Error(`${player} is invalid MAGPIE_PLAYER`);
    const now = MAGPIE_DATABASE.timestamp();
    player.saved = now;
    const payload = {
      ID: player.ID,
      username: player.username,
      email_hash: player?.email_hash,
      email_encrypted: player?.email_encrypted,
      PASS: player.PASS,
      isFrozen: player.isFrozen ? 1 : 0,
      data: player,
    };
    return payload;
  } catch (e) {
    MAGPIE_SYSTEM.error(ePrefix + e.message, e);
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
// #region > Exp
//------------------------------------------------------------------------
/**
 *
 * @param {MAGPIE_EXP} exp
 * @returns {MAGPIE_KEY[]}
 */
MAGPIE_DATABASE.getExpKeys = function getExpKeys(exp) {
  const ePrefix = "[DATABASE].getExpKeys: ";
  try {
    if (!(exp instanceof MAGPIE_EXP))
      throw new Error(`${exp} is invalid MAGPIE_EXP`);
    const keys = exp.keys;
    if (!Array.isArray(keys) || keys.length < 1) return [];
    const db = MAGPIE_DATABASE.sync.world;
    const placeholders = keys.map(() => "?").join(", ");
    const sql = `SELECT * FROM MAGPIE_KEY WHERE ID IN (${placeholders})`;
    const rows = db.prepare(sql).all(keys);
    const rowMap = new Map(rows.map((row) => [row.ID, row]));
    return keys.map((id) => rowMap.get(id)).filter(Boolean);
  } catch (e) {
    MAGPIE_SYSTEM.error(ePrefix + e.message, e);
    return [];
  }
};
/**
 *
 * @param {Number} expID
 * @returns {Promise<MAGPIE_EXP>}
 */
MAGPIE_DATABASE.loadExp = async function loadExp(expID) {
  const ePrefix = "[DATABASE].loadExp: ";
  try {
    const exp = await MAGPIE_DATABASE.call("loadWorldRow", [
      "MAGPIE_EXP",
      { ID: expID },
    ]);
    if (!(exp instanceof MAGPIE_EXP))
      throw new Error(`[EXP-${expID}] is not in database`);
    return exp;
  } catch (e) {
    MAGPIE_SYSTEM.error(ePrefix + e.message, e);
  }
};
/**
 *
 * @param {Number} expID
 * @returns {MAGPIE_EXP}
 */
MAGPIE_DATABASE.loadExpSync = function loadExpSync(expID) {
  const ePrefix = "[DATABASE].loadExp: ";
  try {
    const exp = MAGPIE_DATABASE.sync.loadWorldRow("MAGPIE_EXP", { ID: expID });
    if (!(exp instanceof MAGPIE_EXP))
      throw new Error(`[EXP-${expID}] is not in database`);
    return exp;
  } catch (e) {
    MAGPIE_SYSTEM.error(ePrefix + e.message, e);
  }
};
/**
 * @typedef {{
 * ID: epoch_real,
 * subjectID: Number,
 * targetID: Number,
 * data: MAGPIE_EXP
 * }} exp_payload
 * @param {MAGPIE_EXP} exp
 * @returns {exp_payload}
 */
MAGPIE_DATABASE.prepareExp = function prepareExp(exp) {
  if (!(exp instanceof MAGPIE_EXP)) throw new Error(`${exp} is invalid EXP`);
  const payload = {
    ID: exp.ID,
    subjectID: exp.subjectID || null,
    targetID: exp.targetID || null,
    data: exp,
  };
  return payload;
};
/**
 *
 * @param {MAGPIE_EXP} exp
 * @returns {Promise<worker_result>}
 */
MAGPIE_DATABASE.saveExp = async function saveExp(exp) {
  const ePrefix = "[DATABASE].saveExp: ";
  try {
    const payload = MAGPIE_DATABASE.prepareExp(exp);
    const result = await MAGPIE_DATABASE.call(
      "saveWorldRow",
      "MAGPIE_EXP",
      payload,
    );
    if (!result) throw new Error(`unable to save [EXP-${exp.ID}]`);
    return result;
  } catch (e) {
    MAGPIE_SYSTEM.error(ePrefix + e.message, e);
  }
};
/**
 *
 * @param {MAGPIE_EXP} exp
 * @returns {worker_result}
 */
MAGPIE_DATABASE.saveExpSync = function saveExpSync(exp) {
  const ePrefix = "[DATABASE].saveExp: ";
  try {
    const payload = MAGPIE_DATABASE.prepareExp(exp);
    const result = MAGPIE_DATABASE.sync.saveWorldRow("MAGPIE_EXP", payload);
    if (!result) throw new Error(`unable to save [EXP-${exp.ID}]`);
    return result;
  } catch (e) {
    MAGPIE_SYSTEM.error(ePrefix + e.message, e);
  }
};
/**
 *
 * @param {MAGPIE_EXP} exp
 * @returns {worker_result}
 */
MAGPIE_DATABASE.saveExpRelation = function saveExpRelation(exp) {
  let payloads = [];
  exp.keys.forEach((key) => {
    const payload = {
      expID: exp.ID,
      keyID: key,
    };
    payloads.push(payload);
  });
  const result = MAGPIE_DATABASE.sync.makeTransaction(
    thMAGPIE_DATABASEis.sync.world,
    () => {
      for (const payload of payloads) {
        const { values, columns } = MAGPIE_DATABASE.sync.rowSetter(payload);
        MAGPIE_DATABASE.sync.setRow(
          "EXP_KEYS",
          values,
          columns,
          MAGPIE_DATABASE.sync.world,
        );
      }
      return true;
    },
  );
  if (!result) throw new Error(`unable to save relations for [EXP-${exp.ID}]`);
  return result;
};
/**
 *
 * @param {Number} expID
 * @returns {Promise<worker_result>}
 */
MAGPIE_DATABASE.deleteExp = async function deleteExp(expID) {
  const ePrefix = "[DATABASE].deleteExp: ";
  try {
    const result = await MAGPIE_DATABASE.call("deleteRow", "MAGPIE_EXP", {
      ID: expID,
    });
    if (!result) throw new Error(`unable to delete [EXP-${expID}]`);
    return result;
  } catch (e) {
    MAGPIE_SYSTEM.error(ePrefix + e.message, e);
  }
};
/**
 *
 * @param {Number} expID
 * @returns {worker_result}
 */
MAGPIE_DATABASE.deleteExpSync = function deleteExpSync(expID) {
  const ePrefix = "[DATABASE].deleteExp: ";
  try {
    MAGPIE_DATABASE.deleteExpKeysSync(expID);
    const result = MAGPIE_DATABASE.sync.deleteWorldRow("MAGPIE_EXP", {
      ID: expID,
    });
    if (!result) throw new Error(`unable to delete [EXP-${expID}]`);
    return result;
  } catch (e) {
    MAGPIE_SYSTEM.error(ePrefix + e.message, e);
  }
};
/**
 *
 * @param {Number} expID
 * @returns {worker_result}
 */
MAGPIE_DATABASE.deleteExpKeysSync = function deleteExpKeysSync(expID) {
  const ePrefix = "[DATABASE].deleteExpKeys: ";
  try {
    const result = MAGPIE_DATABASE.sync.world
      .prepare("DELETE FROM EXP_KEYS WHERE expID = ?")
      .run(expID);
    if (!result) throw new Error(`unable to delete [EXP-${expID}]`);
    const message = `deleted ${result.changes} key relations for [EXP-${expID}]`;
    MAGPIE_SYSTEM.log(ePrefix + message, "console", true);
    return result;
  } catch (e) {
    MAGPIE_SYSTEM.error(ePrefix + e.message, e);
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
// #region > Key
//------------------------------------------------------------------------
/**
 *
 * @param {Number} keyID
 * @returns {Promise<MAGPIE_KEY>}
 */
MAGPIE_DATABASE.loadKey = async function loadKey(keyID) {
  const ePrefix = "[DATABASE].loadKey: ";
  try {
    const key = await MAGPIE_DATABASE.call("loadWorldRow", [
      "MAGPIE_KEY",
      { ID: keyID },
    ]);
    if (!(key instanceof MAGPIE_KEY))
      throw new Error(`[KEY-${keyID}] not in database`);
    return key;
  } catch (e) {
    MAGPIE_SYSTEM.error(ePrefix + e.message, e);
  }
};
/**
 *
 * @param {Number} keyID
 * @returns {MAGPIE_KEY}
 */
MAGPIE_DATABASE.loadKeySync = function loadKeySync(keyID) {
  const ePrefix = "[DATABASE].loadKeySync: ";
  try {
    const key = MAGPIE_DATABASE.sync.getRow(
      "MAGPIE_KEY",
      { ID: keyID },
      MAGPIE_DATABASE.sync.world,
    )[0];
    if (!key?.ID) throw new Error(`[KEY-${keyID}] not in database`);
    Object.setPrototypeOf(key, MAGPIE_KEY.prototype);
    return key;
  } catch (e) {
    MAGPIE_SYSTEM.error(ePrefix + e.message, e);
  }
};
/**
 *
 * @typedef {{
 * ID: epoch_real,
 * type: Enumerator<Number>,
 * label: String,
 * originID: Number,
 * compoundID: Number,
 * symbolID: Number
 * }} key_payload
 * @param {MAGPIE_KEY} key
 * @returns {key_payload}
 */
MAGPIE_DATABASE.prepareKey = function prepareKey(key) {
  return {
    ID: Number(key.ID),
    type: Number(key.type),
    label: String(key.label) || "",
    originID: Number(key.originID) || NaN,
    compoundID: Number(key.compoundID) || NaN,
    symbolID: Number(key.symbolID) || NaN,
  };
};
/**
 *
 * @param {MAGPIE_KEY} key
 * @returns {Promise<worker_result>}
 */
MAGPIE_DATABASE.saveKey = async function saveKey(key) {
  const ePrefix = "[DATABASE].saveKey: ";
  try {
    const payload = MAGPIE_DATABASE.prepareKey(key);
    const result = await MAGPIE_DATABASE.call(
      "saveWorldRow",
      "MAGPIE_KEY",
      payload,
    );
    if (!result) throw new Error(`unable to save [KEY-${key.ID}]`);
    if (key.originID)
      await MAGPIE_DATABASE.call("saveWorldRow", [
        "key_legacies",
        {
          keyID: key.originID,
          legacyID: key.ID,
        },
      ]);
    if (key.compoundID)
      await MAGPIE_DATABASE.call("saveWorldRow", [
        "key_components",
        {
          keyID: key.compoundID,
          componentID: key.ID,
        },
      ]);
    return result;
  } catch (e) {
    MAGPIE_SYSTEM.error(ePrefix + e.messag, e);
  }
};
/**
 *
 * @param {MAGPIE_KEY} key
 * @returns {worker_result}
 */
MAGPIE_DATABASE.saveKeySync = function saveKeySync(key) {
  const ePrefix = "[DATABASE].saveKey: ";
  try {
    const payload = MAGPIE_DATABASE.prepareKey(key);
    const result = MAGPIE_DATABASE.sync.saveWorldRow("MAGPIE_KEY", payload);
    if (!result) throw new Error(`unable to save [KEY-${key.ID}]`);
    if (key.originID)
      MAGPIE_DATABASE.sync.saveWorldRow("key_legacies", {
        keyID: key.originID,
        legacyID: key.ID,
      });
    if (key.compoundID)
      MAGPIE_DATABASE.sync.saveWorldRow("key_components", {
        keyID: key.compoundID,
        componentID: key.ID,
      });
    return result;
  } catch (e) {
    MAGPIE_SYSTEM.error(ePrefix + e.messag, e);
  }
};
/**
 *
 * @param {Number} expID
 * @returns {worker_result}
 */
MAGPIE_DATABASE.deleteKeyLegacy = function deleteExpSync(expID) {
  const ePrefix = "[DATABASE].deleteEXP: ";
  try {
    const result = MAGPIE_DATABASE.sync.world
      .prepare("DELETE FROM EXP_KEYS WHERE expID = ?")
      .run(expID);
    if (!result) throw new Error(`unable to delete [EXP-${expID}]`);
    const message = `deleted ${result.changes} key relations for [EXP-${expID}]`;
    MAGPIE_SYSTEM.log(ePrefix + message, "console", true);
    return result;
  } catch (e) {
    MAGPIE_SYSTEM.error(ePrefix + e.message, e);
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
// #region > delete
//------------------------------------------------------------------------

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
 * @param {entityID} entityID
 * @returns {Promise<MAGPIE_ENTITY>}
 */
MAGPIE_DATABASE.loadEntity = async function loadEntity(entityID) {
  const ePrefix = `[DATABASE].loadEntity: `;
  try {
    const data = await MAGPIE_DATABASE.call("loadWorldRow", "MAGPIE_ENTITY", {
      ID: entityID,
    });
    if (!data?.ID) throw new Error(`[ENTITY-${entityID}] not found`);
    const entity = Object.setPrototypeOf(data, MAGPIE_ENTITY.prototype);
    return entity;
  } catch (e) {
    MAGPIE_SYSTEM.error(ePrefix + e.message, e);
  }
};
/**
 *
 * @param {entityID} entityID
 * @returns {MAGPIE_ENTITY}
 */
MAGPIE_DATABASE.loadEntitySync = function loadEntitySync(entityID) {
  const ePrefix = `[DATABASE].loadEntity: `;
  try {
    const entity = MAGPIE_DATABASE.sync.loadWorldRow("MAGPIE_ENTITY", {
      ID: entityID,
    });
    return entity;
  } catch (e) {
    MAGPIE_SYSTEM.error(ePrefix + e.message, e);
  }
};
/**
 *
 * @param {MAGPIE_ENTITY} entity
 * @returns {Promise<worker_result>}
 */
MAGPIE_DATABASE.saveEntity = async function saveEntity(entity) {
  const ePrefix = "[DATABASE].saveEntity: ";
  try {
    const payload = MAGPIE_DATABASE.prepareEntity(entity);
    if (!payload) throw new Error(`unable to prepare ${entity}`);
    const result = await MAGPIE_DATABASE.call(
      "saveWorldRow",
      "MAGPIE_ENTITY",
      payload,
    );
    if (!result) throw new Error(`unable to save [ENTITY-${entity.ID}`);
    return result;
  } catch (e) {
    MAGPIE_SYSTEM.error(ePrefix + e.message, e);
  }
};
/**
 *
 * @param {MAGPIE_ENTITY} entity
 * @returns {worker_result}
 */
MAGPIE_DATABASE.saveEntitySync = function saveEntitySync(entity) {
  const ePrefix = "[DATABASE].saveEntity: ";
  try {
    const payload = MAGPIE_DATABASE.prepareEntity(entity);
    if (!payload) throw new Error(`unable to prepare ${entity}`);
    const result = MAGPIE_DATABASE.sync.saveWorldRow("MAGPIE_ENTITY", payload);
    if (!result) throw new Error(`unable to save [ENTITY-${entity.ID}`);
    return result;
  } catch (e) {
    MAGPIE_SYSTEM.error(ePrefix + e.message, e);
  }
};
/**
 *
 * @param {MAGPIE_ENTITY[]} entityArray
 * @returns {Promise<Boolean>}
 */
MAGPIE_DATABASE.transactionSaveEntities = async function saveEntities(
  entityArray,
) {
  const ePrefix = "[DATABASE].saveEntities: ";
  try {
    const payloads = entityArray.map((entity) =>
      MAGPIE_DATABASE.prepareEntity(entity),
    );
    const result = await MAGPIE_DATABASE.call("saveEntities", payloads);
    return !!result;
  } catch (e) {
    MAGPIE_SYSTEM.error(ePrefix + e.message, e);
    return false;
  }
};
/**
 * @typedef {{
 * 	ID: Number,
 * 	type: Enumerator<Number>,
 * 	data: MAGPIE_ENTITY,
 * 	updated: epoch_real,
 * }} entity_payload
 * @param {MAGPIE_ENTITY} entity
 * @returns {entity_payload}
 */
MAGPIE_DATABASE.prepareEntity = function prepareEntity(entity) {
  const ePrefix = "[DATABASE].prepareEntity: ";
  try {
    if (!(entity instanceof MAGPIE_ENTITY))
      throw new Error(`${entity} is invalid MAGPIE_ENTITY`);
    const K = MAGPIE.KEY.STATS;
    const compoundID = entity.STATS[K.COMPOUND];
    const hostID = entity.STATS[K.HOST];
    const payload = {
      ID: entity.ID,
      type: entity.type,
      name: entity.name,
      updated: entity.updated,
      compoundID: compoundID || null,
      hostID: hostID || null,
      data: entity,
    };
    return payload;
  } catch (e) {
    MAGPIE_SYSTEM.error(ePrefix + e.message, e);
  }
};
/**
 *
 * @param {[String, ...args]} payload
 * @returns {Promise<worker_result>}
 */
MAGPIE_DATABASE._set_relationWorld = async function (payload) {
  const ePrefix = "[DATABASE].setRelation: ";
  try {
    return await MAGPIE_DATABASE.call("setRelationWorld", payload);
  } catch (e) {
    MAGPIE_SYSTEM.error(ePrefix + e.message, e);
  }
};
/**
 *
 * @param {[String, ...args]} payload
 */
MAGPIE_DATABASE._unset_relationWorld = async function (payload) {
  const ePrefix = "[DATABASE].unsetRelationWorld ";
  try {
    if (!payload) throw new Error(`${payload} is invalid payload. `);
    const [tableName, args] = payload;
    const values = Object.values(args);
    const columns = Object.keys(args);
    if (!values || values.length < 1)
      throw new Error(`${values} is invalid values. `);
    if (!columns || columns.length < 1)
      throw new Error(`${columns} is invalid columns. `);
    const criteria = {};
    for (const [column, value] of Object.entries(args)) {
      criteria[column] = value;
    }
    return await MAGPIE_DATABASE.call("deleteWorldRow", tableName, criteria);
  } catch (e) {
    MAGPIE_SYSTEM.error(ePrefix + e.message, e);
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
// #region > Symbol
//------------------------------------------------------------------------

/**
 *
 * @param {MAGPIE_SYMBOL} symbol
 * @returns {worker_result}
 */
MAGPIE_DATABASE.saveSymbolSync = function saveSymbolSync(symbol) {
  const ePrefix = "[DATABASE].saveSymbolSync: ";
  try {
    symbol._get_requirementIDs().forEach((ID) => {
      if (ID)
        MAGPIE_DATABASE.sync.saveWorldRow("symbol_recipes", {
          requirementID: ID,
          recipeID: symbol.ID,
        });
    });
    symbol._get_compoundIDs().forEach((ID) => {
      if (ID)
        MAGPIE_DATABASE.sync.saveWorldRow("symbol_components", {
          compoundID: ID,
          componentID: symbol.ID,
        });
    });
    const payload = MAGPIE_DATABASE.prepareSymbol(symbol);
    return MAGPIE_DATABASE.sync.saveWorldRow("MAGPIE_SYMBOL", payload);
  } catch (e) {
    MAGPIE_SYSTEM.error(ePrefix + e.message, e);
  }
};
/**
 *
 * @param {symbolID} requirementID
 * @param {symbolID} recipeID
 * @returns {worker_result}
 */
MAGPIE_DATABASE.saveSymbolRecipe = function saveSymbolRecipe(
  requirementID,
  recipeID,
) {
  return MAGPIE_DATABASE.sync.saveWorldRow("symbol_recipes", {
    requirementID: requirementID,
    recipeID: recipeID,
  });
};
/**
 *
 * @param {symbolID} compoundID
 * @param {symbolID} componentID
 * @returns {worker_result}
 */
MAGPIE_DATABASE.saveSymbolComponents = function saveSymbolComponents(
  compoundID,
  componentID,
) {
  return MAGPIE_DATABASE.sync.saveWorldRow("symbol_components", {
    compoundID: compoundID,
    componentID: componentID,
  });
};
MAGPIE_DATABASE.deleteSymbolSync = function deleteSymbolSync(symbolID) {
  const symbol = MAGPIE_DATABASE.loadSymbolSync(symbolID);
  symbol.requirements;
};
/**
 * @typedef {import("./component.js").symbolID} symbolID
 * @typedef {import("./component.js").symbol_type} symbol_type
 *
 * @typedef {{
 * ID: symbolID,
 * type: symbol_type,
 * requirementID: symbolID,
 * compoundID: symbolID,
 * data: MAGPIE_SYMBOL
 * }} symbol_payload
 * @param {MAGPIE_SYMBOL} symbol
 * @returns {symbol_payload}
 */
MAGPIE_DATABASE.prepareSymbol = function prepareSymbol(symbol) {
  /** @type {symbol_payload} */
  const payload = {
    ID: symbol.ID,
    type: symbol.type,
    name: symbol.name,
    data: symbol,
  };
  return payload;
};
/**
 *
 * @param {symbolID} symbolID
 * @returns {MAGPIE_SYMBOL}
 */
MAGPIE_DATABASE.loadSymbolSync = function loadSymbolSync(symbolID) {
  const ePrefix = "[DATABASE].loadSymbol: ";
  try {
    const symbol = MAGPIE_DATABASE.sync.loadWorldRow("MAGPIE_SYMBOL", {
      ID: symbolID,
    });
    if (!symbol) throw new Error(`error loading [SYMBOL-${symbolID}]`);
    return symbol;
  } catch (e) {
    MAGPIE_SYSTEM.error(ePrefix + e.message, e);
  }
};
/**
 * @audit dependent on disabled fts5
 * @param {String} tableName
 * @param {String} name
 * @returns {*}
 */
MAGPIE_DATABASE.loadWorldRowByName = function loadWorldRowByName(
  tableName,
  name,
) {
  const cleanName = name.trim();
  if (!cleanName) return [];
  const ftsQuery = cleanName
    .split(/\s+/)
    .map((word) => `"${word.replace(/"/g, '""')}"*`)
    .join(" ");
  const statement = MAGPIE_DATABASE.sync.world
    .prepare(`SELECT m.* FROM ${tableName} m
			JOIN ${tableName}_fts f ON m.ID = f.id
			WHERE f.name MATCH ?`);
  return MAGPIE_DATABASE.sync.resultsLoader(statement.all(ftsQuery));
};
// #endregion
//------------------------------------------------------------------------
/**
 * @name
 * @desc
 * @typedef {{
 * ID: Number,
 * type: Number,
 * updated: Number,
 * data: MAGPIE_CONTEXT
 * }} context_payload
 */
//------------------------------------------------------------------------
// #region > Context
//------------------------------------------------------------------------
/**
 *
 * @param {MAGPIE_CONTEXT} context
 * @returns {context_payload}
 */
MAGPIE_DATABASE.prepareContext = function prepareContext(context) {
  if (!context) return;
  /** @type {context_payload} */
  const payload = {
    ID: context.ID,
    type: context.type,
    name: context?.name,
    updated: context.updated,
    data: context,
  };
  return payload;
};
/**
 *
 * @param {Number} contextID
 * @returns {MAGPIE_CONTEXT}
 */
MAGPIE_DATABASE.loadContextSync = function loadContextSync(contextID) {
  const ePrefix = "[DATABASE].loadContext: ";
  try {
    const context = MAGPIE_DATABASE.sync.loadWorldRow("MAGPIE_CONTEXT", {
      ID: contextID,
    });
    if (!(context instanceof MAGPIE_CONTEXT))
      throw new Error(`unable to find [CONTEXT-${contextID}]`);
    return context;
  } catch (e) {
    MAGPIE_SYSTEM.error(ePrefix + e.message, e);
  }
};
/**
 *
 * @param {MAGPIE_CONTEXT} context
 * @returns {worker_result}
 */
MAGPIE_DATABASE.saveContextSync = function saveContextSync(context) {
  const ePrefix = "[DATABASE].saveContext: ";
  try {
    if (!(context instanceof MAGPIE_CONTEXT))
      throw new Error(`${context} is invalid MAGPIE_CONTEXT`);
    const payload = MAGPIE_DATABASE.prepareContext(context);
    const result = MAGPIE_DATABASE.sync.saveWorldRow("MAGPIE_CONTEXT", payload);
    if (!result) throw new Error(`unable to save [CONTEXT-${context.ID}`);
    return result;
  } catch (e) {
    MAGPIE_SYSTEM.error(ePrefix + e.message, e);
  }
};
/**
 *
 * @param {MAGPIE_CONTEXT} context
 * @returns {Promise<worker_result>}
 */
MAGPIE_DATABASE.saveContext = async function saveContext(context) {
  const ePrefix = "[DATABASE].saveContext: ";
  try {
    if (!(context instanceof MAGPIE_CONTEXT))
      throw new Error(`${context} is invalid MAGPIE_CONTEXT`);
    const payload = MAGPIE_DATABASE.prepareContext(context);
    const result = await MAGPIE_DATABASE.call(
      "saveWorldRow",
      "MAGPIE_CONTEXT",
      payload,
    );
    if (!result) throw new Error(`unable to save [CONTEXT-${context.ID}`);
    return result;
  } catch (e) {
    MAGPIE_SYSTEM.error(ePrefix + e.message, e);
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
// #region > Query
//------------------------------------------------------------------------
/**
 *
 * @param {entityID} parentID
 * @returns {MAGPIE_ENTITY[]}
 */
MAGPIE_DATABASE.loadChildrenSync = function loadChildrenSync(parentID) {
  const ePrefix = "[DATABASE].loadChildren: ";
  try {
    const result = MAGPIE_DATABASE.sync.getWorldRelatedRows(
      parentID,
      "parentID",
      "childID",
      "entity_children",
      "MAGPIE_ENTITY",
    );
    if (!result)
      throw new Error(`unable to find children for [ENTITY-${parentID}]`);
    return result;
  } catch (e) {
    MAGPIE_SYSTEM.error(ePrefix + e.message, e);
  }
};
/**
 *
 * @param {entityID} parentID
 * @returns {Promise<MAGPIE_ENTITY[]>}
 */
MAGPIE_DATABASE.loadChildren = async function loadChildren(parentID) {
  const ePrefix = "[DATABASE].loadChildren: ";
  try {
    const result = await MAGPIE_DATABASE.call("getWorldRelatedRows", [
      parentID,
      "parentID",
      "childID",
      "entity_children",
      "MAGPIE_ENTITY",
    ]);
    if (!result)
      throw new Error(`unable to find children for [ENTITY-${parentID}]`);
    return result;
  } catch (e) {
    MAGPIE_SYSTEM.error(ePrefix + e.message, e);
  }
};
/**
 *
 * @param {entityID} compoundID
 * @returns {Promise<MAGPIE_ENTITY[]>}
 */
MAGPIE_DATABASE.loadComponents = async function loadComponents(compoundID) {
  const ePrefix = "[DATABASE].loadComponents: ";
  try {
    const result = await MAGPIE_DATABASE.call("getWorldRelatedRows", [
      compoundID,
      "compoundID",
      "componentID",
      "entity_components",
      "MAGPIE_ENTITY",
    ]);
    if (!result)
      throw new Error(`unable to find components for [ENTITY-${compoundID}]`);
    return result;
  } catch (e) {
    MAGPIE_SYSTEM.error(ePrefix + e.message, e);
  }
};
/**
 *
 * @param {entityID} hostID
 * @returns {Promise<MAGPIE_ENTITY[]>}
 */
MAGPIE_DATABASE.loadEquips = async function loadEquips(hostID) {
  const ePrefix = "[DATABASE].loadEquips: ";
  try {
    const result = await MAGPIE_DATABASE.call("getWorldRelatedRows", [
      hostID,
      "hostID",
      "equipID",
      "entity_equips",
      "MAGPIE_ENTITY",
    ]);
    if (!result)
      throw new Error(`unable to find equips for [ENTITY-${hostID}]`);
    return result;
  } catch (e) {
    MAGPIE_SYSTEM.error(ePrefix + e.message, e);
  }
};
/**
 *
 * @param {entityID} hostID
 * @returns {MAGPIE_ENTITY[]}
 */
MAGPIE_DATABASE.loadEquipsSync = function loadEquipsSync(hostID) {
  const ePrefix = "[DATABASE].loadEquips: ";
  try {
    const result = MAGPIE_DATABASE.sync.getWorldRelatedRows(
      hostID,
      "hostID",
      "equipID",
      "entity_equips",
      "MAGPIE_ENTITY",
    );
    if (!result)
      throw new Error(`unable to find equips for [ENTITY-${hostID}]`);
    return result;
  } catch (e) {
    MAGPIE_SYSTEM.error(ePrefix + e.message, e);
  }
};
/**
 *
 * @param {entityID} compoundID
 * @returns {MAGPIE_ENTITY[]}
 */
MAGPIE_DATABASE.loadComponentsSync = function loadComponentsSync(compoundID) {
  const ePrefix = "[DATABASE].loadComponents: ";
  try {
    const result = MAGPIE_DATABASE.sync.getWorldRelatedRows(
      compoundID,
      "compoundID",
      "componentID",
      "entity_components",
      "MAGPIE_ENTITY",
    );
    if (!result)
      throw new Error(`unable to find components for [ENTITY-${compoundID}]`);
    return result;
  } catch (e) {
    MAGPIE_SYSTEM.error(ePrefix + e.message, e);
  }
};
/**
 *
 * @param {entityID} hostID
 * @returns {MAGPIE_ENTITY[]}
 */
MAGPIE_DATABASE.loadEquipsSync = function loadEquipsSync(hostID) {
  const ePrefix = "[DATABASE].loadEquips: ";
  try {
    const result = MAGPIE_DATABASE.sync.getWorldRelatedRows(
      hostID,
      "hostID",
      "equipID",
      "entity_equips",
      "MAGPIE_ENTITY",
    );
    if (!result)
      throw new Error(`unable to find equips for [ENTITY-${hostID}]`);
    return result;
  } catch (e) {
    MAGPIE_SYSTEM.error(ePrefix + e.message, e);
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
// #region - SETUP
//========================================================================
/**
 * @name
 * @desc
 *
 */
//------------------------------------------------------------------------
// #region > Symbol
//------------------------------------------------------------------------
/**
 * @todo template-ify this
 * Ensures the prototype tables, FTS5 indexes, and self-maintaining triggers
 * exist and are correctly configured on server boot.
 * @param {Database} db - The active better-sqlite3 database instance (MAGPIE_DATABASE.sync.world)
 */
MAGPIE_DATABASE.initializeTableSchema = function initializeTableSchema(
  tableName,
  tableSchema,
  db,
) {
  // Wrap the entire boot setup in a transaction for maximum speed and safety
  // const columnDefs = Object.entries(tableSchema).map(([name, type]) => {
  // 	return `${name.includes("fk") ? "" : name} ${type}`
  // })
  // const noRowID = schema["PRIMARY KEY"] ? " WITHOUT ROWID " : "";
  // const schema = `${columnDefs.join(", ")}`
  db.transaction(() => {
    // 1. Ensure the core prototype table exists

    db.exec(`
            CREATE TABLE IF NOT EXISTS ${tableName} (
                ID INTEGER PRIMARY KEY,
                type INTEGER,
                requirementID INTEGER,
                compoundID INTEGER,
                data TEXT,
                name TEXT
            );
        `);

    // 2. Ensure a standard index exists on the name column for standard lookups
    db.exec(`
            CREATE INDEX IF NOT EXISTS idx_magpie_symbol_name 
            ON MAGPIE_SYMBOL(name);
        `);

    // 3. Create the permanent FTS5 search index table
    db.exec(`
            CREATE VIRTUAL TABLE IF NOT EXISTS MAGPIE_SYMBOL_fts 
            USING fts5(id UNINDEXED, name, tokenize="porter");
        `);

    // 4. TRIGGER: Automated Sync on Insertion
    db.exec(`
            CREATE TRIGGER IF NOT EXISTS ts_symbol_insert 
            AFTER INSERT ON MAGPIE_SYMBOL
            BEGIN
                INSERT INTO MAGPIE_SYMBOL_fts(id, name) VALUES (new.ID, new.name);
            END;
        `);

    // 5. TRIGGER: Automated Sync on Updates
    db.exec(`
            CREATE TRIGGER IF NOT EXISTS ts_symbol_update 
            AFTER UPDATE OF name ON MAGPIE_SYMBOL
            BEGIN
                UPDATE MAGPIE_SYMBOL_fts SET name = new.name WHERE id = old.ID;
            END;
        `);

    // 6. TRIGGER: Automated Sync on Deletions
    db.exec(`
            CREATE TRIGGER IF NOT EXISTS ts_symbol_delete 
            AFTER DELETE ON MAGPIE_SYMBOL
            BEGIN
                DELETE FROM MAGPIE_SYMBOL_fts WHERE id = old.ID;
            END;
        `);

    // 7. Safety Backfill: Catch up the FTS index if rows were inserted offline
    db.exec(`
            INSERT INTO MAGPIE_SYMBOL_fts(id, name) 
            SELECT ID, name FROM MAGPIE_SYMBOL 
            WHERE ID NOT IN (SELECT id FROM MAGPIE_SYMBOL_fts) 
              AND name IS NOT NULL;
        `);
  })(); // Execute the transaction instantly

  console.log(
    "MAGPIE_SYMBOL table, FTS5 index, and sync triggers verified successfully.",
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
// #region > Tables
//------------------------------------------------------------------------
/**
 *
 * @returns
 */
MAGPIE_DATABASE.setup = function setupDatabase() {
  const ePrefix = "[DATABASE] ";
  const integer = "INTEGER NOT NULL";
  const integerNullable = "INTEGER";
  const integerKey = "INTEGER PRIMARY KEY";
  const foreignKey = " FOREIGN KEY";
  const blob = "JSON NOT NULL";
  const textNullable = "TEXT";
  const text = "TEXT NOT NULL";
  const textKey = "TEXT PRIMARY KEY";
  /** @type {Map<String, worker_result[]>} */
  const tables = new Map();
  try {
    const logs = this.sync.createServerTable("MAGPIE_LOG", {
      ID: integerKey,
      gravity: integer,
      urgency: integer,
    });
    tables.set("logs", logs);
    const entities = this.sync.createWorldTable("MAGPIE_ENTITY", {
      ID: integerKey,
      type: integer,
      name: textNullable,
      updated: integer,
      compoundID: integerNullable,
      hostID: integerNullable,
      growth: integerNullable,
      data: blob,
      fk1: "FOREIGN KEY (compoundID) REFERENCES MAGPIE_ENTITY(ID)",
      fk2: "FOREIGN KEY (hostID) REFERENCES MAGPIE_ENTITY(ID)",
    });
    tables.set("entities", entities);
    const entity_parent = this.sync.createWorldTable("entity_parent", {
      type: integerKey,
      desc: text,
    });
    const entity_children = this.sync.createWorldTable("entity_children", {
      parentID: integer,
      childID: integer,
      parentType: integer,
      "PRIMARY KEY": "(parentID, childID, parentType)",
      fk1: "FOREIGN KEY (parentID) REFERENCES MAGPIE_ENTITY(ID)",
      fk2: "FOREIGN KEY (childID) REFERENCES MAGPIE_ENTITY(ID)",
      fk3: "FOREIGN KEY (parentType) REFERENCES entity_parent(type)",
    });
    tables.set("entity_children", entity_children);
    const entity_components = this.sync.createWorldTable("entity_components", {
      compoundID: integer,
      componentID: integer,
      "PRIMARY KEY": "(compoundID, componentID)",
      fk1: "FOREIGN KEY (compoundID) REFERENCES MAGPIE_ENTITY(ID) ON DELETE CASCADE",
      fk2: "FOREIGN KEY (componentID) REFERENCES MAGPIE_ENTITY(ID)",
    });
    tables.set("entity_components", entity_components);
    const entity_equips = this.sync.createWorldTable("entity_equips", {
      hostID: integer,
      equipID: integer,
      "PRIMARY KEY": "(hostID, equipID)",
      fk1: "FOREIGN KEY (hostID) REFERENCES MAGPIE_ENTITY(ID) ON DELETE CASCADE",
      fk2: "FOREIGN KEY (equipID) REFERENCES MAGPIE_ENTITY(ID)",
    });
    tables.set("entity_equips", entity_equips);
    const events = this.sync.createWorldTable("MAGPIE_EVENT", {
      ID: integerKey,
      type: integer,
      parentID: integerNullable,
      status: integer,
      updated: integer,
      data: blob,
      fk1: "FOREIGN KEY (parentID) REFERENCES MAGPIE_EVENT(ID)",
    });
    tables.set("events", events);
    const event_children = this.sync.createWorldTable("event_children", {
      parentID: integer,
      childID: integer,
      fk1: "FOREIGN KEY (parentID) REFERENCES MAGPIE_EVENT(ID) ON DELETE CASCADE",
      fk2: "FOREIGN KEY (childID) REFERENCES MAGPIE_EVENT(ID)",
    });
    const keys = this.sync.createWorldTable("MAGPIE_KEY", {
      ID: integerKey,
      type: integer,
      label: textNullable,
      originID: integerNullable,
      compoundID: integerNullable,
      symbolID: integerNullable,
      fk1: "FOREIGN KEY (originID) REFERENCES MAGPIE_KEY(ID)",
      fk2: "FOREIGN KEY (compoundID) REFERENCES MAGPIE_KEY(ID)",
      fk3: "FOREIGN KEY (symbolID) REFERENCES MAGPIE_SYMBOL(ID)",
    });
    tables.set("keys", keys);
    const exps = this.sync.createWorldTable("MAGPIE_EXP", {
      ID: integerKey,
      subjectID: integerNullable,
      targetID: integerNullable,
      data: blob,
      fk1: "FOREIGN KEY (subjectID) REFERENCES MAGPIE_ENTITY(ID)",
      fk2: "FOREIGN KEY (targetID) REFERENCES MAGPIE_ENTITY(ID)",
    });
    tables.set("exps", exps);
    const exp_keys = this.sync.createWorldTable("EXP_KEYS", {
      expID: integer,
      keyID: integer,
      "PRIMARY KEY": "(expID, keyID)",
      fk1: "FOREIGN KEY (expID) REFERENCES MAGPIE_EXP(ID) ON DELETE CASCADE",
      fk2: "FOREIGN KEY (keyID) REFERENCES MAGPIE_KEY(ID)",
    });
    tables.set("exp_keys", exp_keys);
    const key_legacies = this.sync.createWorldTable("key_legacies", {
      keyID: integer,
      legacyID: integer,
      "PRIMARY KEY": "(keyID, legacyID)",
      fk1: "FOREIGN KEY (keyID) REFERENCES MAGPIE_KEY(ID) ON DELETE CASCADE",
      fk2: "FOREIGN KEY (legacyID) REFERENCES MAGPIE_KEY(ID)",
    });
    tables.set("key_legacies", key_legacies);
    const key_components = this.sync.createWorldTable("key_components", {
      keyID: integer,
      componentID: integer,
      "PRIMARY KEY": "(keyID, componentID)",
      fk1: "FOREIGN KEY (keyID) REFERENCES MAGPIE_KEY(ID) ON DELETE CASCADE",
      fk2: "FOREIGN KEY (componentID) REFERENCES MAGPIE_KEY(ID)",
    });
    tables.set("key_components", key_components);
    const symbols = this.sync.createWorldTable("MAGPIE_SYMBOL", {
      ID: integerKey,
      type: integer,
      name: textNullable,
      data: blob,
    });
    tables.set("symbols", symbols);
    const symbol_recipes = this.sync.createWorldTable("symbol_recipes", {
      requirementID: integer,
      recipeID: integer,
      "PRIMARY KEY": "(requirementID, recipeID)",
      fk1: "FOREIGN KEY (requirementID) REFERENCES MAGPIE_SYMBOL(ID)",
      fk2: "FOREIGN KEY (recipeID) REFERENCES MAGPIE_SYMBOL(ID)",
    });
    tables.set("symbol_recipes", symbol_recipes);
    const symbol_components = this.sync.createWorldTable("symbol_components", {
      compoundID: integer,
      componentID: integer,
      "PRIMARY KEY": "(compoundID, componentID)",
      fk1: "FOREIGN KEY (compoundID) REFERENCES MAGPIE_SYMBOL(ID)",
      fk2: "FOREIGN KEY (componentID) REFERENCES MAGPIE_SYMBOL(ID)",
    });
    tables.set("symbol_components", symbol_components);
    const metastate = this.sync.createWorldTable("MAGPIE_METASTATE", {
      key: textKey,
      data: blob,
    });
    tables.set("metastate", metastate);
    const contexts = this.sync.createWorldTable("MAGPIE_CONTEXT", {
      ID: integerKey,
      type: integer,
      name: textNullable,
      updated: integer,
      data: blob,
    });
    tables.set("contexts", contexts);
    const players = this.sync.createServerTable("MAGPIE_PLAYER", {
      ID: integerKey,
      username: text,
      email_hash: text,
      email_encrypted: text,
      PASS: text,
      isFrozen: integer,
      data: blob,
    });
    tables.set("players", players);
    // const metrics = this.sync.createServerTable("MAGPIE_METRICS", {

    // })
    // tables.set("metrics", metrics)
    const results = Array.from(tables.entries());
    if (results.every((r) => r[1])) return results;
    throw new Error(`unable to setup [${results.filter((r) => !r[1])}]`);
  } catch (e) {
    MAGPIE_SYSTEM.error(ePrefix + e.message, e);
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
module.exports = { MAGPIE_DATABASE };
/**
 *
 * @desc back to {@link }
 *
 */
//========================================================================
// END OF FILE
//========================================================================
