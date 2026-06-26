/**
 * @namespace player
 * @author Matheraptor
 * @version 0.39.92
 *
 */
//========================================================================
// #region - INDEX
//========================================================================
const { MAGPIE } = require("./index");
const { MAGPIE_SYSTEM } = require("./system");
/**
 * @name
 * @desc
 * @param {{
 * ID: playerID,
 * username: username,
 * email: email_encrypted,
 * PASS: pass_encrypted,
 * isFrozen: Boolean,
 * EVP: Number,
 * CLOUT: Number,
 * slots: entityID[]
 * }} data
 * @returns {new MAGPIE_PLAYER}
 */
function MAGPIE_PLAYER(data) {
  this.initialize(data);
}
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
 * @typedef {Number} playerID
 * @typedef {String} username
 * @typedef {import("./services/crypto").email_encrypted} email_encrypted
 * @typedef {import("./services/crypto").email_hashed} email_hashed
 * @typedef {String} pass_encrypted
 * @typedef {import("./entity").entityID} entityID
 * @typedef {{
 * ID: playerID,
 * username: username,
 * email_hash: email_hashed,
 * email_encrypted: email_encrypted,
 * PASS: pass_encrypted,
 * isFrozen: Boolean,
 * EVP: Number,
 * CLOUT: Number,
 * slots: entityID[],
 * updated: Number
 * }} player_data
 * @param {player_data} data
 * @returns {new MAGPIE_PLAYER}
 */
//========================================================================
// #region - PLAYER
//========================================================================
/**
 * @name
 * @desc
 * @typedef {import("./database_worker").database_result} database_result
 * @typedef {import("./entity").MAGPIE_ENTITY} MAGPIE_ENTITY
 */
//------------------------------------------------------------------------
// #region > Proto
//------------------------------------------------------------------------
/**
 *
 * @param {player_data} data
 * @returns {new MAGPIE_PLAYER}
 */
MAGPIE_PLAYER.prototype.initialize = function initializePlayer(data) {
  this._firmware = "MAGPIE_PLAYER";
  const now = Date.now();
  this.ID = Number(data?.ID) || now;
  this.username = String(data?.username);
  this.email_hash = String(data?.email_hash);
  this.email_encrypted = String(data?.email_encrypted);
  this.PASS = String(data?.PASS);
  this.role = Number(data?.role) || 0;
  this.isFrozen = Boolean(data?.isFrozen);
  this.EVP = Number(data?.EVP) || 0;
  this.CLOUT = Number(data?.CLOUT) || 0;
  this.creatureID = this.ID;
  this.slots = data?.slots || [];
  this.updated = Number(data?.updated) || now;
  this.status = false;
  // @audit-issue this.setup();
};
/**
 *
 * @returns {Promise<Boolean>}
 */
MAGPIE_PLAYER.prototype.setup = async function setup() {
  const ePrefix = `[PLAYER-${this.ID}].setup: `;
  try {
    const creature =
      MAGPIE_PLAYER.__hiveSync("_get_entity", [this.ID]) ||
      MAGPIE_PLAYER.__hiveSync("_new_entity");
    /** @type {MAGPIE_ENTITY} */
    creature.ID = this.ID;
    creature.type = MAGPIE.KEY.SYMBOL.TYPE.PLAYER;
    creature.name = this.username;
    await creature.set();
    await this.set();
    return true;
  } catch (e) {
    MAGPIE_SYSTEM.error(ePrefix + e.message, e);
  }
};
/**
 *
 * @param {String} method
 * @param {[]} arguments
 * @returns {Promise<*>}
 */
MAGPIE_PLAYER.__hive = async function __hive(method, arguments) {
  //
};
/**
 *
 * @param {String} method
 * @param {[]} arguments
 * @returns {*}
 */
MAGPIE_PLAYER.__hiveSync = function __hiveSync(method, arguments) {
  //
};
/**
 *
 * @returns {Promise<database_result>}
 */
MAGPIE_PLAYER.prototype.set = async function set() {
  return await MAGPIE_PLAYER.__hive("_set_player", [this]);
};
/**
 *
 * @returns {database_result}
 */
MAGPIE_PLAYER.prototype.setSync = function setSync() {
  return MAGPIE_PLAYER.__hiveSync("_set_playerSync", [this]);
};
// #endregion
//------------------------------------------------------------------------
/**
 * @name
 * @desc
 *
 */
//------------------------------------------------------------------------
// #region > Status
//------------------------------------------------------------------------
/**
 *
 * @param {Boolean} status
 */
MAGPIE_PLAYER.prototype.setOnline = function setOnline(status = true) {
  this.status = status;
};
/**
 *
 * @returns {Boolean}
 */
MAGPIE_PLAYER.prototype.getOnline = function getOnline() {
  return this.status;
};
// #endregion
//------------------------------------------------------------------------
/**
 * @name
 * @desc
 *
 */
//------------------------------------------------------------------------
// #region > Self
//------------------------------------------------------------------------
/**
 *
 * @returns {MAGPIE_ENTITY}
 */
MAGPIE_PLAYER.prototype._self_creature = function () {
  return MAGPIE_PLAYER.__hiveSync("_get_entity", [this.creatureID]);
};
// #endregion
//------------------------------------------------------------------------
/**
 * @name
 * @desc
 *
 */
//------------------------------------------------------------------------
// #region > Adoption
//------------------------------------------------------------------------
MAGPIE_PLAYER.prototype.adopt = async function adopt(creatureID) {
  //@todo adoption
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
// #region - ACTION
//========================================================================
/**
 * @typedef {Object} action_payload
 * @param {action_payload} action_payload
 */
MAGPIE_PLAYER.prototype.processAction = function (action_payload) {
  // @todo player.processAction
};
/**
 *
 * @desc back to {@link }
 *
 */
//========================================================================
// #endregion -
//========================================================================
module.exports = { MAGPIE_PLAYER };
/**
 *
 * @desc back to {@link }
 *
 */
//========================================================================
// END OF FILE
//========================================================================
