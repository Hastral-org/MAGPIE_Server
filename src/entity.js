/**
 * @name MAGPIE_ENTITY
 * @version 0.39.967
 * @desc
 * @param {{
 * name: String,
 * type: Enumerator<Number>,
 * STATS: entity_stats,
 * fitness: entity_fitness,
 * exps: MAGPIE_EXP[],
 * host: entityID,
 * equip: entityID[]
 * }} data
 * @returns {new MAGPIE_ENTITY}
 *
 */
//========================================================================
// #region - INDEX
//========================================================================
function MAGPIE_ENTITY(data = {}) {
  this.initialize(data);
}
const { MAGPIE } = require("./index");
const { MAGPIE_SYSTEM, MAGPIE_DATE } = require("./system");
const {
  MAGPIE_STATE,
  MAGPIE_EMOTE,
  MAGPIE_EXP,
  MAGPIE_KEY: MAGPIE_KEY,
  MAGPIE_CONTEXT,
  MAGPIE_COMPONENT,
  MAGPIE_SYMBOL,
} = require("./component");
const STATE = require("../data/states");
const { MAGPIE_PHYSICS } = require("./physics");
const ENTITY_TYPES = require("../data/entity_types");
/**
 *
 * @typedef {import("./index").duration} duration
 * @typedef {import("./component").key_data} key_data
 * @typedef {import("./component").contextID} contextID
 */
/**
 *
 * @desc back to {@link }
 *
 */
//========================================================================
// #endregion -
//========================================================================
/**
 * @name Entity
 * @desc
 *
 */
//========================================================================
// #region - ENTITY
//========================================================================
MAGPIE_ENTITY.meta = {};
/**
 * @name Static
 * @desc
 *
 * @version 0.20.6
 *
 * @changelog
 *
 * @version 0.20.6
 * - ADDED: destructure/recompose POVART with new POVART+ORBIT+STATS format
 * - ADDED: placeholder hive helpers link helpers in SERVER.js
 *
 */
//------------------------------------------------------------------------
// #region > Static
//------------------------------------------------------------------------
/**
 * @typedef {import("./index").key_stats} key_stats
 * @param {STATS} STATS
 * @returns {key_stats}
 */
MAGPIE_ENTITY._stat_destructure = function statDestructure(STATS) {
  const K = MAGPIE.KEY.STATS;
  const statsSize = K.ARRAY - MAGPIE.KEY.POVART.ARRAY;
  const stats = Object.keys(K).slice(1, statsSize + 1);
  const result = {};
  stats.forEach((key, index) => {
    result[key] = STATS[index];
  });
  return result;
};
MAGPIE_ENTITY._povart_destructure = function povartDestructure(POVART) {
  const K = MAGPIE.KEY.POVART;
  const keys = Object.keys(K).slice(1, K.ARRAY + 1);
  const result = {};
  keys.forEach((key, index) => {
    result[key] = POVART[index];
  });
  return result;
};
/**
 *
 * @param {entity_stats} entity_stats
 * @returns { {POVART: POVART, STATS: STATS } }
 */
MAGPIE_ENTITY._stats_destructure = function statsDestructure(entity_stats) {
  const K = MAGPIE.KEY.POVART;
  const POVART = entity_stats.slice(0, K.ARRAY + 1);
  const STATS = entity_stats.slice(K.ARRAY + 1);
  return { POVART, STATS };
};
/**
 *
 * @param {String} method
 * @param {*} arguments
 * @returns {Promise<database_result>}
 */
MAGPIE_ENTITY.__hive = async function __hive(method, arguments) {
  //
};
/**
 *
 * @param {String} method
 * @param {*} arguments
 * @returns {*}
 */
MAGPIE_ENTITY.__hiveSync = function __hiveSync(method, arguments) {
  //
};
MAGPIE_ENTITY.__database = function __database(method, arguments) {
  //
};
/**
 *
 * @param {MAGPIE_ENTITY} entity
 * @returns {Boolean}
 */
MAGPIE_ENTITY._hive_setEntitySync = function _hive_setEntitySync(entity) {
  return MAGPIE_ENTITY.__hiveSync("_set_entitySync", [entity]);
};
/**
 *
 * @param {MAGPIE_ENTITY} entity
 * @returns {Promise<Boolean>}
 */
MAGPIE_ENTITY._hive_setEntity = async function _hive_setEntity(entity) {
  return await MAGPIE_ENTITY.__hive("_set_entity", [entity]);
};
/**
 *
 * @param {MAGPIE_EXP} exp
 * @returns {Promise<database_result>}
 */
MAGPIE_ENTITY._hive_setExp = async function _hive_setExp(exp) {
  return await MAGPIE_ENTITY.__hive("_set_exp", [exp]);
};
/**
 *
 * @param {MAGPIE_EXP} exp
 * @returns {database_result}
 */
MAGPIE_ENTITY._hive_setExpSync = function _hive_setExpSync(exp) {
  return MAGPIE_ENTITY.__hiveSync("_set_expSync", [exp]);
};
/**
 *
 * @param {STATS} STATS
 * @returns {Boolean}
 */
MAGPIE_ENTITY.isValidSTATS = function isValidSTATS(STATS) {
  const size = MAGPIE.KEY.STATS.ARRAY;
  if (!STATS || STATS?.length !== size || STATS.some((n) => isNaN(n)))
    return false;
  return true;
};
/**
 *
 * @param {entity_stats} stats
 * @returns
 */
MAGPIE_ENTITY.isValidEntityStats = function isValidEntityStats(stats) {
  const size = MAGPIE.KEY.STATS.ARRAY - MAGPIE.KEY.POVART.ARRAY;
  if (!stats || stats?.length !== size || stats.some((n) => isNaN(n)))
    return false;
  return true;
};
/**
 *
 * @param {entity_fitness} fitness
 * @returns {Boolean}
 */
MAGPIE_ENTITY.isValidFitness = function isValidFitness(fitness) {
  if (!fitness || fitness?.length < 1 || fitness.some((n) => isNaN(n)))
    return false;
  return true;
};
/**
 *
 * @param {MAGPIE_ENTITY} entity
 * @returns {Boolean}
 */
MAGPIE_ENTITY.isValidCelestial = function isValidCelestial(entity) {
  const K = MAGPIE.KEY.ENTITY.TYPE;
  const celestial = K.get("CELESTIAL").type;
  const materia = K.get("MATERIA").type;
  if (!entity || entity.type < celestial || entity.type >= materia)
    return false;
  return true;
};
/**
 *
 * @param {entityID[]} property
 * @param {String} propertyName property of the depdendencies on this entity
 * @param {String} dependencyName property on the dependencies of this entity
 */
MAGPIE_ENTITY._setDependency = async function setDependency(
  property,
  propertyName,
  dependencyName,
) {
  if (!property?.length < 1 || property.some((n) => isNaN(n)))
    throw new Error(`${property} is invalid ${propertyName}`);
  let list = [];
  for (const ID of property) {
    const entity = await MAGPIE_ENTITY.__hive("_get_entity", ID);
    if (entity instanceof MAGPIE_ENTITY) list.push(entity);
  }
  if (list.length < property.length)
    throw new Error(`could not fetch all ${propertyName}`);
  let errors = [];
  for (const entity of list) {
    entity[dependencyName].push(this.ID);
    const result = await MAGPIE_ENTITY._hive_setEntity(entity);
    if (!result) errors.push(entity.ID);
  }
  if (errors.length > 0)
    throw new Error(
      `could not set ${dependencyName} for ${propertyName}[${errors}]`,
    );
};
// #endregion
//------------------------------------------------------------------------

/**
 * @name Proto
 * @desc
 *
 * @version 0.20.6
 *
 * @changelog
 *
 * @version 0.20.6
 * - ADDED: new format and functionality
 * - TWEAKED: "@" is now "_firmware"
 * - TWEAKED: ".created", ".updated", "".saved", and ".metadate" all combined
 * into ".updated" as type epoch_real_s
 * - TWEAKED: ".POVART" and ".STATS" combined together into ".STATS"
 * - TWEAKED: ".traits", "_reserve", ".states", "._discard", "._injury",
 * "._stamina", combined into ".fitness", with "".ID" at index 0, and "deckSize"
 * at index 1
 * - TWEAKED: ".inventory" and ".equip" combined into ".equip"
 * - TWEAKED: ".sensors" and ".emitters" removed, and their logic integrated
 * as trait cards
 * - TWEAKED: "._vault" removed and its logic integrated into ".exps" for
 * the buffer and using exp aggregation so that STM and LTM is now an
 * emergent property of the ".exps" buffer cycle
 *
 * @typedef {import("./index").index} index
 * @typedef {import("./index").state_index} state_index
 * @typedef {import("./index").stamina_index} stamina_index
 * @typedef {Number} entityID Date.now()
 * @typedef {import("./physics").POVART} POVART [
 * ...P,
 * ...orbit_data,
 * P_C,
 * ...O,
 * ...V,
 * ...A,
 * ...R,
 * ...T,
 * E_ID
 * ]
 * @typedef {Float64Array} STATS POVART + STATS
 * @typedef {Number} deckSize
 * @typedef {Float64Array} entity_fitness
 * [
 * E_ID,
 * deckSize,
 * ...traitID[],
 * ...stateID[],
 * ...equipID[],
 * ...wasteIndex[],
 * ...injuryID[],
 * ...staminaIndex[]
 * ]
 * @typedef {Number[]} entity_stats
 * @typedef {Number[]} entity_povart
 * @typedef {Number[]} entity_params
 * @typedef {Enumerator<Number>} entity_type {@link MAGPIE.KEY.ENTITY.TYPE}
 * @typedef {import("./index").orbit_data} orbit_data
 * @typedef {import("./index").orbit} orbit [a,e,i,raan,aop,nu,T0,M0]
 * @typedef {Number[]} fitness
 * @typedef {import("./index").epoch_real_s} epoch_real_s time in s since epoch J2000
 * @typedef {import("../data/entity_types").traitID} traitID
 * @typedef {import("./component").symbolID} symbolID
 * @typedef {Number} stateID
 * @typedef {Number} wasteIndex
 * @typedef {Number} injuryID
 * @typedef {import("../data/entity_types").expID} expID
 * @typedef {import("./index").distance} distance
 * @typedef {import("./index").ratio} ratio
 * @typedef {import("./index").angle_rad} angle_rad
 * @typedef {import("./index").angle_deg} angle_deg
 * @typedef {import("./index").vector3} vector3
 * @typedef {import("./index").bivector} bivector
 * @typedef {import("./index").rotor} rotor
 * @typedef {import("./physics").magnitude} magnitude
 * @typedef {import("./index").acceleration} acceleration
 * @typedef {import("./index").force} force
 * @typedef {import("./index").physics_forces} physics_forces [FG, FF, FD, FL, AOA, Atm, OAT, Dew, Breeze, Lit, Rad]
 * @typedef {angle_deg} lat
 * @typedef {angle_deg} lon
 * @typedef {distance} ASL
 * @typedef {import("./physics").pitch} pitch
 * @typedef {import("./physics").roll} roll
 * @typedef {import("./physics").heading} heading
 * @typedef {import("./physics").angle_euler} angle_euler
 * @typedef {{
 * name: String,
 * type: Enumerator<Number>,
 * STATS: [...entity_povart, ...entity_stats],
 * fitness: entity_fitness,
 * exps: MAGPIE_EXP[],
 * host: entityID,
 * equip: entityID[]
 * }} entity_data
 *
 * @typedef {Number} fitness_index this.fitness[index]
 * @typedef {import("../data/states").state_output} state_output
 *
 *
 *
 * @typedef {import("./system").database_result} database_result
 * @typedef {import("./index").keyID} keyID
 * @typedef {import("./component").emoteID} emoteID
 *
 * @typedef {Number} STAT
 *
 * @param {entity_data} data
 * @returns {new MAGPIE_ENTITY}
 *
 */
//------------------------------------------------------------------------
// #region > proto
//------------------------------------------------------------------------
MAGPIE_ENTITY.prototype.initialize = function initialize(data) {
  const now = Date.now();
  this._firmware = "MAGPIE_ENTITY";
  /** @type {entityID} */
  this.ID = Number(data?.ID) || now;
  this.name = String(data?.name);
  /** @type {entity_type} @desc {@link MAGPIE.KEY.ENTITY.TYPE}*/
  this.type = Number(data?.type || 0);
  /** @type {epoch_real_s} time in s since epoch J2000 */
  this.updated = now;
  const stats = Array.isArray(data?.STATS) ? data.STATS : 0;
  /** @type {STATS} @desc {@link MAGPIE.KEY.STATS.meta} */
  this.STATS = new Float64Array(stats);
  /**
   * @type {entity_fitness}
   * @desc {@link MAGPIE.KEY.TRAIT} {@link MAGPIE.KEY.ECG}
   *
   **/
  this.fitness = data?.fitness || [];
  /** @type {expID[]} */
  this.exps = data?.exps || [];
  // if(data && data?.STATS)
  //   setTimeout(() => {
  //     this.setup(data);
  //   }, 1000);
};
MAGPIE_ENTITY.prototype.isValid = function isValid() {
  return true;
};
MAGPIE_ENTITY.prototype._stat_endurance = function _stat_endurance() {
  const K = MAGPIE.KEY.STATS;
  return this.STATS[K.END] || 1;
};
/**
 *
 * @param {entity_data} data
 * @returns {Promise<Boolean>}
 */
MAGPIE_ENTITY.prototype.setup = async function setup(data) {
  const ePrefix = `[ENTITY-${this.ID}].setup: `
  try {
    if (this.type < 1) return;
    this.birth = Number(data?.birth) || 0;
    this.setupSTATS(data?.STATS);
    await this.setupParents();
    await this.setupCompound();
    await this.setupHost();
    this.setupFitness(fitness);
    return true
  } catch(e) {
    MAGPIE_SYSTEM.error(ePrefix + e.message, e)
  }
};
/**
 * @audit-issue git-issue #12
 * @param {[...entity_povart, ...entity_stats]} STATS
 * @returns
 */
MAGPIE_ENTITY.prototype.setupSTATS = function setupSTATS(STATS) {
  const ePrefix = `[ENTITY-${this.ID}].setupSTATS: `;
  try {
    const length = MAGPIE.KEY.STATS.ARRAY;
    const valid = STATS?.length === length;
    const array = valid ? Array.from(STATS) : length;
    this.STATS = new Float64Array(array);
    const K = MAGPIE.KEY.POVART;
    this.STATS[K.E_ID] = this.ID;
    if (!this.STATS[K.P_C]) this.STATS[K.P_C] = MAGPIE.KEY.ENTITY.UNIVERSE;
    if (!MAGPIE_PHYSICS.isValidRotor(this._get_O0()))
      this._set_O1(MAGPIE_PHYSICS._rotor_identity());
  } catch (e) {
    MAGPIE_SYSTEM.error(ePrefix + e.message, e);
  }
};
MAGPIE_ENTITY.prototype.setupParents = async function setupParents() {
  const ePrefix = `[ENTITY-${this.ID}].setupParents: `;
  try {
    const mother = await this.setupMother();
    if (!mother) throw new Error("unable to setup mother-child relation");
    const father = await this.setupFather();
    if (!father) throw new Error("unable to setup father-child relation");
  } catch (e) {
    MAGPIE_SYSTEM.error(ePrefix + e.message, e);
  }
};
/**
 *
 * @returns {Promise<import("better-sqlite3").RunResult>}
 */
MAGPIE_ENTITY.prototype.setupMother = async function setupMoter() {
  const STATS = this.STATS;
  const K = MAGPIE.KEY.STATS;
  const motherID = STATS[K.MOTHER];
  const motherType = 0;
  if (isNaN(motherID)) return;
  const mother_payload = [
    "entity_children",
    {
      parentID: motherID,
      childID: this.ID,
      parentType: motherType,
    },
  ];
  return await MAGPIE_ENTITY._set_relation(mother_payload);
};
/**
 *
 * @returns {Promise<import("better-sqlite3").RunResult>}
 */
MAGPIE_ENTITY.prototype.setupFather = async function setupFather() {
  const STATS = this.STATS;
  const K = MAGPIE.KEY.STATS;
  const fatherType = 1;
  const fatherID = STATS[K.FATHER];
  if (isNaN(fatherID)) return;
  const father_payload = [
    "entity_children",
    {
      parentID: fatherID,
      childID: this.ID,
      parentType: fatherType,
    },
  ];
  return await MAGPIE_ENTITY._set_relation(father_payload);
};
/**
 *
 * @returns {Promise<import("better-sqlite3").RunResult>}
 */
MAGPIE_ENTITY.prototype.setupCompound = async function setupCompound() {
  const K = MAGPIE.KEY.STATS.COMPOUND;
  const ID = this.STATS[K];
  if (!ID || isNaN(ID)) return;
  const payload = [
    "entity_components",
    {
      entityID: ID,
      componentID: this.ID,
    },
  ];
  return await MAGPIE_ENTITY._set_relation(payload);
};
/**
 *
 * @returns {Promise<import("better-sqlite3").RunResult>}
 */
MAGPIE_ENTITY.prototype.setupHost = async function setupHost(hostID) {
  const K = MAGPIE.KEY.STATS.HOST;
  if(Number(hostID)) {
    MAGPIE_ENTITY._entity_exists(hostID);
    this.STATS[K] = hostID;
  }
  const ID = this.STATS[K];
  if (!ID || isNaN(ID)) return;
  const payload = [
    "entity_equips",
    {
      entityID: ID,
      equipID: this.ID,
    },
  ];
  return await MAGPIE_ENTITY._set_relation(payload);
};
/**
 *
 * @param {symbolID} fitness_data
 * @returns {Boolean}
 *
 *
 */
MAGPIE_ENTITY.prototype.setupFitness = function setupFitness(fitness_data) {
  const ePrefix = `[ENTITY-${this.ID}].setupFitness: `;
  const fitness = fitness_data || [];
  const deckSize = fitness.length;
  if (!deckSize) return false;
  try {
    const FIT = MAGPIE.KEY.FITNESS;
    const deckZones = FIT.ZONES;
    const index_entityID = FIT.E_ID;
    const index_deckSize = FIT.DECKSIZE;
    const offset = FIT.TRAITS;
    const arraySize = offset + deckSize * deckZones + this._stat_endurance();
    this.fitness = new Float64Array(arraySize).fill(0);
    if (!MAGPIE_ENTITY.isValidFitness(this.fitness))
      throw new Error(`${fitness} is invalid fitness`);
    this.fitness[index_entityID] = this.ID;
    this.fitness[index_deckSize] = deckSize;
    fitness.forEach((traitID, index) => {
      this.fitness[index + offset] = traitID;
    });
    return true;
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
// #region > I/O
//------------------------------------------------------------------------
/**
 *
 * @param {String} method
 * @param  {*} argument
 * @returns {Promise<database_result>}
 */
MAGPIE_ENTITY._database = async function _database(method, argument) {
  //
};
/**
 *
 * @param {String} method
 * @param  {*} argument
 * @returns {database_result}
 */
MAGPIE_ENTITY._database_Sync = function _database_Sync(method, argument) {
  //
};
// #endregion
//------------------------------------------------------------------------
/**
 * @name
 * @desc
 *
 */
//------------------------------------------------------------------------
// #region > getters
//------------------------------------------------------------------------
/**
 * 
 * @param {entityID} entityID 
 * @returns {Boolean}
 */
MAGPIE_ENTITY._entity_exists = function(entityID) {
  return MAGPIE_ENTITY.__hiveSync("_entity_exists", [entityID])
}
/**
 *
 * @param {MAGPIE_ENTITY} entity
 * @returns {POVART}
 */
MAGPIE_ENTITY._get_POVART = function getPOVART(entity) {
  return entity.STATS.slice(0, MAGPIE.KEY.POVART.ARRAY);
};
/**
 *
 * @param {POVART} POVART
 * @returns
 */
MAGPIE_ENTITY._get_decomp_POVART = function getDecompPOVART(POVART) {
  return MAGPIE_PHYSICS.decomp_POVART(POVART);
};
/**
 * @param {MAGPIE_ENTITY} entity
 * @returns {stateID[]} Number[]
 */
MAGPIE_ENTITY._get_States = function _get_States(entity) {
  const K = MAGPIE.KEY.FITNESS;
  const deckSize = entity.fitness[K.DECKSIZE];
  const offset = K.TRAITS;
  const stateOffset = K.STATES;
  const states = Array.from(entity.fitness)
    .slice(offset + deckSize, offset + deckSize * stateOffset + 1)
    .filter((n) => !!n);
  return states;
};
/**
 * @returns {MAGPIE_ENTITY}
 */
MAGPIE_ENTITY.prototype._get_celestial = function _get_celestial() {
  const celestialID = this.STATS[MAGPIE.KEY.POVART.P_C];
  return MAGPIE_ENTITY.__hiveSync("_get_entity", [celestialID]);
};
/**
 *
 * @returns {MAGPIE_ENTITY}
 */
MAGPIE_ENTITY.prototype._get_host = function _get_host() {
  const hostID = this.STATS[MAGPIE.KEY.STATS.HOST];
  return MAGPIE_ENTITY.__hiveSync("_get_entity", [hostID]);
};
/**
 *
 * @returns {MAGPIE_ENTITY[]}
 */
MAGPIE_ENTITY.prototype._get_guestsSync = function _get_guestsSync() {
  return MAGPIE_ENTITY.__hiveSync("_get_databaseSync", [
    "loadEquipsSync",
    [this.ID],
  ]);
};
/**
 *
 * @returns {distance}
 */
MAGPIE_ENTITY.prototype._get_radius = function getRadius() {
  return this.STATS[MAGPIE.KEY.CELESTIAL.R];
};
/**
 *
 * @returns {vector3}
 */
MAGPIE_ENTITY.prototype._get_P0 = function getP0() {
  const K = MAGPIE.KEY.POVART;
  return [this.STATS[K.P_X], this.STATS[K.P_Y], this.STATS[K.P_Z]];
};
/**
 * @returns {coords}
 */
MAGPIE_ENTITY.prototype._get_C0 = function getC0() {
  const r = this._get_celestial()._get_radius();
  return MAGPIE_PHYSICS.cartesianToGeodetic(this._get_P0(), r);
};
/**
 *
 * @returns {rotor}
 */
MAGPIE_ENTITY.prototype._get_O0 = function getO0() {
  const K = MAGPIE.KEY.POVART;
  return [
    this.STATS[K.O_YZ],
    this.STATS[K.O_XZ],
    this.STATS[K.O_XY],
    this.STATS[K.O_W],
  ];
};
/**
 *
 * @returns {vector3}
 */
MAGPIE_ENTITY.prototype._get_V0 = function getV0() {
  const K = MAGPIE.KEY.POVART;
  return [this.STATS[K.V_X], this.STATS[K.V_Y], this.STATS[K.V_Z]];
};
/**
 *
 * @returns {vector3}
 */
MAGPIE_ENTITY.prototype._get_A0 = function getA0() {
  const K = MAGPIE.KEY.POVART;
  return [this.STATS[K.A_X], this.STATS[K.A_Y], this.STATS[K.A_Z]];
};
/**
 *
 * @returns {bivector}
 */
MAGPIE_ENTITY.prototype._get_R0 = function getR0() {
  const K = MAGPIE.KEY.POVART;
  return [this.STATS[K.R_YZ], this.STATS[K.R_XZ], this.STATS[K.R_XY]];
};
/**
 *
 * @returns {bivector}
 */
MAGPIE_ENTITY.prototype._get_T0 = function getT0() {
  const K = MAGPIE.KEY.POVART;
  return [this.STATS[K.T_YZ], this.STATS[K.T_XZ], this.STATS[K.T_XY]];
};
/**
 *
 * @returns {STAT[]}
 */
MAGPIE_ENTITY.prototype._get_STATS = function getSTATS() {
  return Array.from(this.STATS).slice(MAGPIE.KEY.POVART.ARRAY);
};
/**
 *
 * @returns {traitID[]}
 */
MAGPIE_ENTITY.prototype._get_traits = function getTraits() {
  const K = MAGPIE.KEY.FITNESS;
  return Array.from(this.fitness).slice(
    K.TRAITS,
    this.fitness[K.DECKSIZE] + K.TRAITS,
  );
};
/**
 * 
 * @returns {MAGPIE_SYMBOL[]}
 */
MAGPIE_ENTITY.prototype._get_all_traits = function() {
  const ePrefix = `[ENTITY-${this.ID}].getAllTraits: `
  try {
    const traitIDs = this._get_traits();
    if(!Array.isArray(traitIDs)) 
      throw new Error(`${traits} is invalid traitsIDs. `)
    if(traitIDs.length < 1) return []
    const traits = traitIDs.map(traidID => MAGPIE_ENTITY.__hiveSync("_get_symbol", [traidID]))
    if(!Array.isArray(traits || traits.length))
      throw new Error(`${traits} is invalid traits. `);
    return traits
  } catch(e) {
    MAGPIE_SYSTEM.error(ePrefix + e.message, e)
  }
}
/**
 *
 * @returns {stateID[]} stateID[]
 */
MAGPIE_ENTITY.prototype._get_states = function getStates() {
  return MAGPIE_ENTITY._get_States(this);
};
/**
 *
 * @returns {entityID[]}
 */
MAGPIE_ENTITY.prototype._get_equips = function _get_equips() {
  const K = MAGPIE.KEY.FITNESS;
  const deckSize = K.DECKSIZE;
  const zone = K.EQUIPS;
  const start = K.TRAITS + deckSize * zone;
  const end = start + deckSize;
  return this.fitness.slice(start, end + 1);
};
/**
 * 
 * @returns {state_index[]}
 */
MAGPIE_ENTITY.prototype._get_tributes = function () {
  const K = MAGPIE.KEY.FITNESS;
  const deckSize = K.DECKSIZE;
  const zone = K.TRIBUTE;
  const start = K.TRAITS + deckSize * zone;
  const end = start + deckSize;
  return this.fitness.slice(start, end + 1)
}
/**
 *
 * @returns {MAGPIE_ENTITY[]}
 */
MAGPIE_ENTITY.prototype._get_equipEntities = function () {
  return this._get_equips().map((entityID) => {
    if (entityID) return MAGPIE_ENTITY.__hiveSync("_get_entity", [entityID]);
  });
};
/**
 *
 * @returns {Number}
 */
MAGPIE_ENTITY.prototype._get_growthLevel = function _get_growthLevel() {
  return this.STATS[MAGPIE.KEY.STATS.G_LVL];
};
/**
 * @returns {stateID}
 */
MAGPIE_ENTITY.prototype._get_growthState = function getEntityGrowthState() {
  const states = this._get_states()
  if(!states) return false
  /** @type {stateID[]} */
  const range = Object.values(MAGPIE.KEY.GROWTH).map(e => e[0]);
  for(const stateID of range) {
    if(states.includes(stateID))
      return stateID
  }
  return null
}
/**
 *
 * @returns {stateID[]}
 */
MAGPIE_ENTITY.prototype._get_injuries = function _get_injuries() {
  const K = MAGPIE.KEY.FITNESS;
  const deckSize = K.DECKSIZE;
  const zone = K.INJURY;
  const start = K.TRAITS + deckSize * zone;
  const end = start + deckSize;
  return this.fitness.slice(start, end + 1);
};
/**
 *
 * @returns {Number}
 */
MAGPIE_ENTITY.prototype._get_fatLevel = function _get_fatLevel() {
  const injuries = this._get_injuries();
  if (injuries.length < 1) return 0;
  const fat = injuries.filter((injuryID) => injuryID === STATE.INDEX.FAT);
  return fat;
};
/**
 *
 * @param {expID} expID
 * @returns {MAGPIE_EXP}
 */
MAGPIE_ENTITY._hive_getExp = function _hive_getExp(expID) {
  return MAGPIE_ENTITY.__hiveSync("_get_exp", [expID]);
};
/**
 * {@link MAGPIE_HIVE._get_entity_relatives}
 * @param {String} rT name of relatives table
 * @param {String} pK name of parent foreign key
 * @param {String} fK name of child foreign key
 * @returns {Promise<MAGPIE_ENTITY[]>}
 */
MAGPIE_ENTITY._hive_getRelatives = async function _hive_getRelatives(
  rT,
  pK,
  fK,
) {
  return await MAGPIE_ENTITY.__hive("_get_relatives", [this.ID, rT, pK, fK]);
};
/**
 *
 * @returns {MAGPIE_ENTITY}
 */
MAGPIE_ENTITY.prototype.getMother = function getMother() {
  const motherID = this.STATS[MAGPIE.KEY.STATS.MOTHER];
  return MAGPIE_ENTITY.__hiveSync("_get_entity", [motherID]);
};
/**
 *
 * @returns {MAGPIE_ENTITY}
 */
MAGPIE_ENTITY.prototype.getFather = function getFather() {
  const fatherID = this.STATS[MAGPIE.KEY.STATS.FATHER];
  return MAGPIE_ENTITY.__hiveSync("_get_entity", [fatherID]);
};
/**
 *
 * @returns {MAGPIE_ENTITY}
 */
MAGPIE_ENTITY.prototype.getCompound = function getCompound() {
  const compoundID = this.STATS[MAGPIE.KEY.STATS.COMPOUND];
  return MAGPIE_ENTITY.__hiveSync("_get_entity", [compoundID]);
};
/**
 *
 * @returns {MAGPIE_ENTITY}
 */
MAGPIE_ENTITY.prototype.getHost = function getHost() {
  const hostID = this.STATS[MAGPIE.KEY.STATS.HOST];
  return MAGPIE_ENTITY.__hiveSync("_get_entity", [hostID]);
};
/**
 * @returns {Promise<MAGPIE_ENTITY[]>}
 */
MAGPIE_ENTITY.prototype.getChildren = async function getChildren() {
  return await MAGPIE_ENTITY._hive_getRelatives(
    "entity_children",
    "parentID",
    "childID",
  );
};
/**
 * @returns {Promise<MAGPIE_ENTITY[]>}
 */
MAGPIE_ENTITY.prototype.getComponents = async function getComponents() {
  return await MAGPIE_ENTITY._hive_getRelatives(
    "entity_components",
    "compoundID",
    "componentID",
  );
};
/**
 * @returns {Promise<MAGPIE_ENTITY[]>}
 */
MAGPIE_ENTITY.prototype.getEquips = async function getEquips() {
  return await MAGPIE_ENTITY._hive_getRelatives(
    "entity_equips",
    "hostID",
    "equipID",
  );
};
/**
 *
 * @returns {POVART}
 */
MAGPIE_ENTITY.prototype._get_POVART = function _get_POVART() {
  return MAGPIE_ENTITY._get_POVART(this);
};
/**
 *
 * @returns {contextID[]}
 */
MAGPIE_ENTITY.prototype._get_contextIDs = function getContextIDs() {
  return MAGPIE_ENTITY.__hiveSync("_get_entity_contextIDs", [this.ID]);
};
/**
 *
 * @returns {MAGPIE_CONTEXT[]}
 */
MAGPIE_ENTITY.prototype._get_contexts = function getContexts() {
  return MAGPIE_ENTITY.__hiveSync("_get_entity_contexts", [this.ID]);
};
/**
 * @returns {entity_data}
 */
MAGPIE_ENTITY.prototype._get_data = function getData() {
  /** @type {entity_data} */
  return (data = {
    ID: this.ID,
    type: this.type,
    name: this.name,
    updated: this.updated,
    STATS: Array.from(this.STATS),
    fitness: Array.from(this.fitness),
    exps: Array.from(this.exps),
  });
};
/**
 *
 * @typedef {{
 * Vmax: velocity,
 * Vsafe: velocity,
 * Vcruise: velocity,
 * Vcreep: velocity,
 * Vdock: velocity,
 * Rmax: omega,
 * Rcruise: omega,
 * Rcreep: omega,
 * Rdock: omega,
 * Amax: acceleration,
 * Asafe: acceleration,
 * Acruise: acceleration,
 * Acreep: acceleration,
 * Adock: acceleration,
 * Tmax: alpha,
 * Tsafe: alpha,
 * Tcruise: alpha,
 * Tcreep: alpha,
 * Tdock: alpha
 * }} entity_speeds
 * @param {entity_speeds} overrideVspeed
 */
MAGPIE_ENTITY.prototype._get_speeds = function getSpeed(overrideVspeed) {
  const symbol = this._get_type();
  const Vspeeds = symbol.getVspeeds();
  /** @type {entity_speeds} */
  const speeds = {}
  speeds.Vmax = overrideVspeed?.VMAX || Vspeeds?.VMAX || 0;
  speeds.Vsafe = overrideVspeed?.VSAFE || Vspeeds?.VSAFE || speeds.Vmax * 0.85;
  speeds.Vcruise = overrideVspeed?.VCRUISE || Vspeeds?.VCRUISE || speeds.Vmax * 0.65;
  speeds.Vcreep = overrideVspeed?.VCREEP || Vspeeds?.VCREEP || speeds.Vmax * 0.35;
  speeds.Vdock = overrideVspeed?.VDOCK || Vspeeds?.VDOCK || speeds.Vmax * 0.05;
  speeds.Amax = overrideVspeed?.AMAX || Vspeeds?.AMAX || 0;
  speeds.Asafe = overrideVspeed?.ASAFE || Vspeeds?.ASAFE || speeds.Amax * 0.85;
  speeds.Acruise = overrideVspeed?.ACRUISE || Vspeeds?.ACRUISE || speeds.Amax * 0.65;
  speeds.Acreep = overrideVspeed?.ACREEP || Vspeeds?.ACREEP || speeds.Amax * 0.35;
  speeds.Adock = overrideVspeed?.ADOCK || Vspeeds?.ADOCK || speeds.Amax * 0.05;
  speeds.Rmax = overrideVspeed?.RMAX || Vspeeds?.RMAX || 0;
  speeds.Rsafe = overrideVspeed?.RSAFE || Vspeeds?.RSAFE || speeds.Rmax * 0.85;
  speeds.Rcruise = overrideVspeed?.RCRUISE || Vspeeds?.RCRUISE || speeds.Rmax * 0.65;
  speeds.Rcreep = overrideVspeed?.RCREEP || Vspeeds?.RCREEP || speeds.Rmax * 0.35;
  speeds.Rdock = overrideVspeed?.RDOCK || Vspeeds?.RDOCK || speeds.Rmax * 0.05;
  speeds.Tmax = overrideVspeed?.TMAX || Vspeeds?.TMAX || 0;
  speeds.Tsafe = overrideVspeed?.TSAFE || Vspeeds?.TSAFE || speeds.Tmax * 0.85;
  speeds.Tcruise = overrideVspeed?.TCRUISE || Vspeeds?.TCRUISE || speeds.Tmax * 0.65;
  speeds.Tcreep = overrideVspeed?.TCREEP || Vspeeds?.TCREEP || speeds.Tmax * 0.35;
  speeds.Tdock = overrideVspeed?.TDOCK || Vspeeds?.TDOCK || speeds.Tmax * 0.05;
  speeds.Rmax_x = overrideVspeed?.RMAX_X || Vspeeds?.RMAX_X || 0;
  speeds.Rsafe_x = overrideVspeed?.RSAFE_X || Vspeeds?.RSAFE_X || 0;
  speeds.Rcruise_x = overrideVspeed?.RCRUISE_X || Vspeeds?.RCRUISE_X || 0;
  speeds.Rcreep_x = overrideVspeed?.RCREEP_X || Vspeeds?.RCREEP_X || 0;
  speeds.Rmax_y = overrideVspeed?.RMAX_Y || Vspeeds?.RMAX_Y || 0;
  speeds.Rsafe_y = overrideVspeed?.RSAFE_Y || Vspeeds?.RSAFE_Y || 0;
  speeds.Rcruise_y = overrideVspeed?.RCRUISE_Y || Vspeeds?.RCRUISE_Y || 0;
  speeds.Rcreep_y = overrideVspeed?.RCREEP_Y || Vspeeds?.RCREEP_Y || 0;
  speeds.Rmax_z = overrideVspeed?.RMAX_Z || Vspeeds?.RMAX_Z || 0;
  speeds.Rsafe_z = overrideVspeed?.RSAFE_Z || Vspeeds?.RSAFE_Z || 0;
  speeds.Rcruise_z = overrideVspeed?.RCRUISE_Z || Vspeeds?.RCRUISE_Z || 0;
  speeds.Rcreep_z = overrideVspeed?.RCREEP_Z || Vspeeds?.RCREEP_Z || 0;
  speeds.Tmax_x = overrideVspeed?.TMAX_X || Vspeeds?.TMAX_X || 0;
  speeds.Tsafe_x = overrideVspeed?.TSAFE_X || Vspeeds?.TSAFE_X || 0;
  speeds.Tcruise_x = overrideVspeed?.TCRUISE_X || Vspeeds?.TCRUISE_X || 0;
  speeds.Tcreep_x = overrideVspeed?.TCREEP_X || Vspeeds?.TCREEP_X || 0;
  speeds.Tmax_y = overrideVspeed?.TMAX_Y || Vspeeds?.TMAX_Y || 0;
  speeds.Tsafe_y = overrideVspeed?.TSAFE_Y || Vspeeds?.TSAFE_Y || 0;
  speeds.Tcruise_y = overrideVspeed?.TCRUISE_Y || Vspeeds?.TCRUISE_Y || 0;
  speeds.Tcreep_y = overrideVspeed?.TCREEP_Y || Vspeeds?.TCREEP_Y || 0;
  speeds.Tmax_z = overrideVspeed?.TMAX_Z || Vspeeds?.TMAX_Z || 0;
  speeds.Tsafe_z = overrideVspeed?.TSAFE_Z || Vspeeds?.TSAFE_Z || 0;
  speeds.Tcruise_z = overrideVspeed?.TCRUISE_Z || Vspeeds?.TCRUISE_Z || 0;
  speeds.Tcreep_z = overrideVspeed?.TCREEP_Z || Vspeeds?.TCREEP_Z || 0;
  return speeds;
};
/**
 * 
 * @returns 
 */
MAGPIE_ENTITY.prototype._decomp_POVART = function() {
  const POVART0 = this._get_POVART();
  return MAGPIE_ENTITY._get_decomp_POVART(POVART0)
}
/**
 * 
 * @returns {{ pitch: pitch, roll: roll, hdg: heading }}
 */
MAGPIE_ENTITY.prototype._get_eulerAbs = function() {
  const ePrefix = `[ENTITY-${this.ID}]._get_eulerAbs: `;
  try {
    const { P0, O0 } = this._decomp_POVART();
    const [pitch, roll, hdg] = MAGPIE_PHYSICS._rotor_toEulerAbs(O0, P0);
    return { pitch, roll, hdg }
  } catch(e) {
    MAGPIE_SYSTEM.error(ePrefix + e.message, e)
  }
}
/**
 * @name
 * @desc
 *
 */
//------------------------------------------------------------------------
// #region celestial
//------------------------------------------------------------------------
/**
 *
 * @param {MAGPIE_ENTITY} entity
 * @returns {distance}
 */
MAGPIE_ENTITY._get_celestialRadius = function radius(entity) {
  if (!MAGPIE_ENTITY.isValidCelestial(entity))
    throw new Error(`${entity} is invalid celestial body`);
  return entity.STATS[MAGPIE.KEY.CELESTIAL.R];
};
// #endregion
//------------------------------------------------------------------------
/**
 *
 * @returns {{
 * a: distance,
 * e: ratio,
 * i: angle_rad,
 * raan: angle_rad,
 * aop: angle_rad,
 * nu: angle_rad,
 * T0: duration,
 * M0: angle_rad
 * }}
 */
MAGPIE_ENTITY.prototype._get_orbit_data = function getOrbitData() {
  /** @type {orbit_data} */
  const orbit_data = {};
  const K = MAGPIE.KEY.POVART;
  orbit_data.a = this.STATS[K.P_O_A];
  orbit_data.e = this.STATS[K.P_O_E];
  orbit_data.i = this.STATS[K.P_O_I];
  orbit_data.raan = this.STATS[K.P_O_RAAN];
  orbit_data.aop = this.STATS[K.P_O_AOP];
  orbit_data.nu = this.STATS[K.P_O_NU];
  orbit_data.T0 = this.STATS[K.P_O_T0];
  orbit_data.M0 = this.STATS[K.P_O_M0];
  return orbit_data;
};
/**
 *
 * @returns {orbit}
 */
MAGPIE_ENTITY.prototype._get_orbit = function getOrbit() {
  const K = MAGPIE.KEY.POVART;
  const offset = K.P_C + 1;
  const end = K.P_O_M0 + 1;
  return this.STATS.slice(offset, end);
};
// #endregion
//------------------------------------------------------------------------
/**
 * @name
 * @desc
 *
 */
//------------------------------------------------------------------------
// #region > setters
//------------------------------------------------------------------------
/**
 *
 * @returns {database_result}
 */
MAGPIE_ENTITY.prototype.setSync = function setSync() {
  return MAGPIE_ENTITY._hive_setEntitySync(this);
};
/**
 *
 * @returns {Promise<database_result>}
 */
MAGPIE_ENTITY.prototype.set = async function set() {
  return await MAGPIE_ENTITY._hive_setEntity(this);
};
/**
 *
 * @param {[String, ...args]} payload
 * @returns {Promise<database_result>}
 */
MAGPIE_ENTITY._set_relation = async function _set_relation(payload) {
  return await MAGPIE_ENTITY.__hiveSync("_set_databaseSync", ["_set_relationWorld", payload]);
};
/**
 * 
 * @param {[String, ...args]} payload 
 * @returns {Promise<database_result>}
 */
MAGPIE_ENTITY._unset_relation = async function _unset_relation(payload) {
  return await MAGPIE_ENTITY.__hive("_set_databaseSync", ["_unset_relationWorld", payload])
}
/**
 *
 * @param {orbit_data} orbit_data
 */
MAGPIE_ENTITY.prototype._set_orbit_data = function setOrbitData(orbit_data) {
  if (!orbit_data || Object.values(orbit_data).some((n) => isNaN(n))) return;
  const K = MAGPIE.KEY.POVART;
  this.STATS[K.P_O_A] = orbit_data.a;
  this.STATS[K.P_O_E] = orbit_data.e;
  this.STATS[K.P_O_I] = orbit_data.i;
  this.STATS[K.P_O_RAAN] = orbit_data.raan;
  this.STATS[K.P_O_AOP] = orbit_data.aop;
  this.STATS[K.P_O_NU] = orbit_data.nu;
  this.STATS[K.P_O_T0] = orbit_data.M0;
  this.STATS[K.P_O_M0] = orbit_data.M0;
};
/**
 *
 * @param {orbit} orbit
 */
MAGPIE_ENTITY.prototype._set_Orbit = function setOrbit(orbit) {
  if (!orbit || orbit.some((n) => isNaN(n)))
    throw new Error(`${orbit} is invalid orbit`);
  const K = MAGPIE.KEY.POVART;
  const offset = K.P_C + 1;
  orbit.forEach((value, index) => {
    this.STATS[offset + index] = value;
  });
};
/**
 *
 * @param {vector3} P1
 * @param {entityID} P_C
 * @param {orbit} orbit
 * @param {rotor} O1
 * @param {vector3} V1
 * @param {vector3} A1
 * @param {bivector} R1
 * @param {bivector} T1
 * @param {entityID} E_ID
 * @returns {POVART}
 */
MAGPIE_ENTITY._set_POVART_recompose = function _set_POVART_recompose(
  P1,
  P_C,
  orbit,
  O1,
  V1,
  A1,
  R1,
  T1,
  E_ID,
) {
  return MAGPIE_PHYSICS._POVART_recompose(
    P1,
    P_C,
    orbit,
    O1,
    V1,
    A1,
    R1,
    T1,
    E_ID,
  );
};
/**
 *
 * @param {{
 * P1: vector3,
 * P_C: entityID,
 * orbit: orbit,
 * O1: rotor,
 * V1: vector3,
 * A1: vector3,
 * R1: bivector,
 * T1: bivector
 * }} POVART1
 */
MAGPIE_ENTITY.prototype._set_POVART = function _set_POVART(POVART1) {
  if (!POVART1) return;
  if (POVART1?.P1) this._set_P1(POVART1.P1);
  if (POVART1?.P_C) this.STATS[MAGPIE.KEY.POVART.P_C] = POVART1.P_C;
  if (POVART1?.O1) this._set_O1(POVART1.O1);
  if (POVART1?.V1) this._set_V1(POVART1.V1);
  if (POVART1?.A1) this._set_A1(POVART1.A1);
  if (POVART1?.R1) this._set_R1(POVART1.R1);
  if (POVART1?.T1) this._set_T1(POVART1.T1);
};
/**
 *
 * @param {vector3} P1
 * @returns {vector3} [x,y,z]
 */
MAGPIE_ENTITY.prototype._set_P1 = function _set_P1(P1) {
  // if(!MAGPIE_PHYSICS.isValidVector(P1))
  // 	throw new Error(`${P1} is invalid position vector`)
  const [x, y, z] = P1;
  const K = MAGPIE.KEY.POVART;
  this.STATS[K.P_X] = x;
  this.STATS[K.P_Y] = y;
  this.STATS[K.P_Z] = z;
  return [x, y, z];
};
/**
 *
 * @param {rotor} O1
 * @returns {rotor}
 */
MAGPIE_ENTITY.prototype._set_O1 = function _set_O1(O1) {
  // if(!MAGPIE_PHYSICS.isValidRotor(O1))
  // 	throw new Error(`${O1} is invalid rotor`)
  const [yz, xz, xy, w] = O1;
  const K = MAGPIE.KEY.POVART;
  this.STATS[K.O_YZ] = yz;
  this.STATS[K.O_XZ] = xz;
  this.STATS[K.O_XY] = xy;
  this.STATS[K.O_W] = w;
  return O1
};
/**
 *
 * @param {vector3} V1
 */
MAGPIE_ENTITY.prototype._set_V1 = function _set_V1(V1) {
  // if(!MAGPIE_PHYSICS.isValidVector(V1))
  // 	throw new Error(`${V1} is invalid velocity vector`)
  const [x, y, z] = V1;
  const K = MAGPIE.KEY.POVART;
  this.STATS[K.V_X] = x;
  this.STATS[K.V_Y] = y;
  this.STATS[K.V_Z] = z;
};
/**
 *
 * @param {vector3} A1
 */
MAGPIE_ENTITY.prototype._set_A1 = function _set_A1(A1) {
  // if(!MAGPIE_PHYSICS.isValidVector(A1))
  // 	throw new Error(`${A1} is invalid acceleration vector`)
  const [x, y, z] = A1;
  const K = MAGPIE.KEY.POVART;
  this.STATS[K.A_X] = x;
  this.STATS[K.A_Y] = y;
  this.STATS[K.A_Z] = z;
};
/**
 *
 * @param {bivector} R1
 */
MAGPIE_ENTITY.prototype._set_R1 = function _set_R1(R1) {
  // if(!MAGPIE_PHYSICS.isValidVector(R1))
  // 	throw new Error(`${R1} is invalid rotation bivector`)
  const [yz, xz, xy] = R1;
  const K = MAGPIE.KEY.POVART;
  this.STATS[K.R_YZ] = yz;
  this.STATS[K.R_XZ] = xz;
  this.STATS[K.R_XY] = xy;
};
/**
 *
 * @param {bivector} T1
 */
MAGPIE_ENTITY.prototype._set_T1 = function _set_T1(T1) {
  // if(!MAGPIE_PHYSICS.isValidVector(T1))
  // 	throw new Error(`${T1} is invalid torque bivector`)
  const [yz, xz, xy] = T1;
  const K = MAGPIE.KEY.POVART;
  this.STATS[K.T_YZ] = yz;
  this.STATS[K.T_XZ] = xz;
  this.STATS[K.T_XY] = xy;
};
/**
 * 
 * @param {angle_euler} angle_euler 
 * @returns {rotor}
 */
MAGPIE_ENTITY.prototype._set_heading = function(angle_euler) {
  const ePrefix = `[ENTITY-${this.ID}]._set_heading: `;
  try {
    const { P0, O0 } = this._decomp_POVART();
    const [pitch, roll, hdg] = MAGPIE_PHYSICS._rotor_toEulerAbs(O0, P0)
    return this._set_O1(MAGPIE_PHYSICS._rotor_fromEulerAbs(angle_euler, pitch, roll, P0))
  } catch(e) {
    MAGPIE_SYSTEM.error(ePrefix + e.message, e)
  }
}
/**
 * 
 * @param {angle_euler} angle_euler 
 * @returns {rotor}
 */
MAGPIE_ENTITY.prototype._set_pitch = function(angle_euler) {
  const ePrefix = `[ENTITY-${this.ID}]._set_heading: `;
  try {
    const { P0, O0 } = this._decomp_POVART();
    const [pitch, roll, hdg] = MAGPIE_PHYSICS._rotor_toEulerAbs(O0, P0)
    return this._set_O1(MAGPIE_PHYSICS._rotor_fromEulerAbs(hdg, angle_euler, roll, P0))
  } catch(e) {
    MAGPIE_SYSTEM.error(ePrefix + e.message, e)
  }
}
/**
 * 
 * @param {angle_euler} angle_euler 
 * @returns {rotor}
 */
MAGPIE_ENTITY.prototype._set_roll = function(angle_euler) {
  const ePrefix = `[ENTITY-${this.ID}]._set_heading: `;
  try {
    const { P0, O0 } = this._decomp_POVART();
    const [pitch, roll, hdg] = MAGPIE_PHYSICS._rotor_toEulerAbs(O0, P0)
    return this._set_O1(MAGPIE_PHYSICS._rotor_fromEulerAbs(hdg, pitch, angle_euler, P0))
  } catch(e) {
    MAGPIE_SYSTEM.error(ePrefix + e.message, e)
  }
}
// #endregion
//------------------------------------------------------------------------
/**
 * @name
 * @desc
 *
 */
//------------------------------------------------------------------------
// #region > Stats
//------------------------------------------------------------------------

// #endregion
//------------------------------------------------------------------------
/**
 * @name
 * @desc
 *
 */
//------------------------------------------------------------------------
// #region > Celestial
//------------------------------------------------------------------------
/**
 *
 * @param {Number[]} traits
 */
MAGPIE_ENTITY.prototype._C_importTraits = function importCelestialTraits(
  traits,
) {
  if (!traits || traits.length < 1 || traits.some((n) => isNaN(n)))
    throw new Error(`${traits} is invalid celestial traits`);
  const [
    mass,
    CMF,
    axial,
    rotation,
    albedo,
    greenhouse,
    age,
    radius,
    g,
    Ve,
    surf_temp,
    atm,
    atmo_dens,
    atmo_comp,
  ] = traits;
  const K = MAGPIE.KEY.CELESTIAL;
  this.STATS[K.MASS] = mass;
  this.STATS[K.CMF] = CMF;
  this.STATS[K.AXIAL] = axial;
  this.STATS[K.ROTATION] = rotation;
  this.STATS[K.ALBEDO] = albedo;
  this.STATS[K.GREENHOUSE] = greenhouse;
  this.STATS[K.AGE] = age;
  this.STATS[K.R] = radius;
  this.STATS[K.G] = g;
  this.STATS[K.ESCAPE] = Ve;
  this.STATS[K.SURF_TEMP] = surf_temp;
  this.STATS[K.ATM] = atm;
  this.STATS[K.ATD] = atmo_dens;
  this.STATS[K.COMP] = atmo_comp;
};
// #endregion
//------------------------------------------------------------------------
/**
 * @name
 * @desc
 *
 */
//------------------------------------------------------------------------
// #region > Materia
//------------------------------------------------------------------------
/**
 *
 * @param {Number[]} STATS
 */
MAGPIE_ENTITY.prototype._M_importSTATS = function importMateriaSTATS(STATS) {
  if (!STATS || STATS.length < 1 || STATS.some((n) => isNaN(n)))
    throw new Error(`${STATS} is invalid materia stats`);
  const [
    FIT,
    END,
    PWR,
    MASS,
    SEN,
    DEX,
    RT,
    EVO,
    G_R,
    G_I,
    INERT_X,
    INERT_Y,
    INERT_Z,
    TMAX_X,
    TMAX_Y,
    TMAX_Z,
    FB,
    CM,
    MASSKG,
    DENSITY,
    LENGTH,
    HEIGHT,
    WIDTH,
    VOLUME,
    FT,
    VMAX,
    AMAX,
    BMAX,
    GMAX,
    CF,
    CL,
    CD,
    COM,
    COL,
  ] = STATS;
  const K = MAGPIE.KEY.STATS;
  this.STATS[K.FIT] = FIT;
  this.STATS[K.END] = END;
  this.STATS[K.PWR] = PWR;
  this.STATS[K.MASS] = MASS;
  this.STATS[K.SEN] = SEN;
  this.STATS[K.DEX] = DEX;
  this.STATS[K.RT] = RT;
  this.STATS[K.EVO] = EVO;
  this.STATS[K.G_R] = G_R;
  this.STATS[K.G_I] = G_I;
  this.STATS[K.INERT_X] = INERT_X;
  this.STATS[K.INERT_Y] = INERT_Y;
  this.STATS[K.INERT_Z] = INERT_Z;
  this.STATS[K.TMAX_X] = TMAX_X;
  this.STATS[K.TMAX_Y] = TMAX_Y;
  this.STATS[K.TMAX_Z] = TMAX_Z;
  this.STATS[K.FB] = FB;
  this.STATS[K.CM] = CM;
  this.STATS[K.MASSKG] = MASSKG;
  this.STATS[K.DENSITY] = DENSITY;
  this.STATS[K.LENGTH] = LENGTH;
  this.STATS[K.HEIGHT] = HEIGHT;
  this.STATS[K.WIDTH] = WIDTH;
  this.STATS[K.VOLUME] = VOLUME;
  this.STATS[K.FT] = FT;
  this.STATS[K.VMAX] = VMAX;
  this.STATS[K.AMAX] = AMAX;
  this.STATS[K.BMAX] = BMAX;
  this.STATS[K.GMAX] = GMAX;
  this.STATS[K.CF] = CF;
  this.STATS[K.CL] = CL;
  this.STATS[K.CD] = CD;
  this.STATS[K.COM] = COM;
  this.STATS[K.COL] = COL;
};
// #endregion
//------------------------------------------------------------------------
/**
 * @name
 * @desc
 * @typedef {import("./physics").coords} coords
 */
//------------------------------------------------------------------------
// #region > POVART
//------------------------------------------------------------------------
/**
 *
 * @param {coords} C1
 * @param {distance} r
 * @returns {vector3} P₁ [x,y,z]
 */
MAGPIE_ENTITY.prototype._set_C1 = function _set_C1(C1, r = NaN) {
  const ePrefix = `[ENTITY-${this.ID}].setC1: `;
  try {
    if (!Array.isArray(C1) || C1.some((n) => isNaN(n)) || C1.length !== 3)
      throw new Error(`${C1} is invalid coords [lat,lon,ASL]`);
    if (!r || isNaN(r)) r = this._get_celestial()._get_radius();
    if (isNaN(r) || r < 1) throw new Error(`${r} is invalid radius`);
    const P1 = this._set_P1(MAGPIE_PHYSICS.geodeticToCartesian(C1, r));
    if (MAGPIE_PHYSICS.isValidVector(P1)) return P1;
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
// #region > Target
//------------------------------------------------------------------------
/**
 * @param {String} method
 * @param {[]} args
 * @returns {Promise<database_result>}
 */
MAGPIE_ENTITY.prototype._update = async function update(
  method = null,
  args = [],
) {
  if (method) this[method](...args);
  return await MAGPIE_ENTITY._hive_setEntity(this);
};
/**
 *
 * @param {String} method
 * @param {[]} args
 * @returns {database_result}
 */
MAGPIE_ENTITY.prototype._updateSync = function updateSync(
  method = null,
  args = [],
) {
  if (method) this[method](...args);
  return MAGPIE_ENTITY._hive_setEntitySync(this);
};
/**
 *
 * @param {String} method
 * @param {[]} args
 * @returns {database_result}
 */
MAGPIE_ENTITY.prototype._target_update = function _target_update(
  method = null,
  args = [],
) {
  const target = this._get_target();
  if (!target) return;
  return target._updateSync(method, args);
};
/**
 * 
 * @param {{
 * name: String,
 * type: entity_type,
 * ID: entityID,
 * STATS: STATS,
 * coords: coords
 * }} options 
 * @returns {database_result}
 */
MAGPIE_ENTITY.prototype._edit = function (options) {
  if(options?.name)
    this.name = options.name;
  if(options?.type)
    this.type = options.type;
  if(options?.ID)
    this.ID = options.ID;
  if(options?.STATS)
    this.STATS = options.STATS;
  if(options.coords)
    this._set_C1(coords);
  return this.setSync();
}
/**
 * 
 * @param {Number} index 
 * @returns {MAGPIE_ENTITY}
 */
MAGPIE_ENTITY.prototype._get_targetLabel = function(index) {
  const exp = this._get_exps()[0];
  return exp.getKeys()[index]._get_entity_label()
}
// #endregion
//------------------------------------------------------------------------
/**
 *
 * @desc back to {@link MAGPIE_ENTITY.meta}
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
// #region - REFRESH
//========================================================================
/**
 * @desc
 * @todo how to switch between POVART/orbital?
 * @param {Number} switchID
 * @param {duration} dt in s
 * @param {Number} layer_frame
 * @returns {Boolean}
 */
MAGPIE_ENTITY.prototype.refresh = function refresh(switchID, dt, layer_frame) {
  const ePrefix = `[ENTITY-${this.ID}].refresh: `;
  try {
    if (isNaN(switchID)) throw new Error(`${switchID} is invalid switchID`);
    if (isNaN(dt)) throw new Error(`${dt} is invalid dT`);
    this.updated = Date.now();
    // @todo different refresh methods according on type?
    if (this.type < MAGPIE.KEY.ENTITY.TYPE.get("MATERIA").type) return true;
    const input = this.processExp(switchID, dt, layer_frame);
    const key = this.processKeys(input);
    const emote = this.processEmote(switchID, dt, input, key);
    const { exp: state, target } = this.processStates(
      switchID,
      dt,
      emote?.exp || input,
    );
    this.processAgency(switchID, dt, state, input?.keys || []);
    const intent = emote?.target ? emote.target : target;
    const POVART0 = this._get_POVART();
    const C = this._get_celestial(POVART0[MAGPIE.KEY.POVART.P_C]);
    const { output, POVART1 } = this.updatePhysics(
      switchID,
      dt,
      intent,
      C,
      POVART0,
    );
    if (!output) throw new Error(`${output} is invalid output`);
    if (!POVART1) throw new Error(`${POVART1} is invalid POVART₁`);
    if (target) output.target = target;
    if (emote) output.emote = emote;
    const emit = MAGPIE_ENTITY.__socketEmit(
      output,
      input,
      this,
      C,
      POVART1,
      dt,
      switchID,
      layer_frame,
    );
    if (!emit) return false;
    return true;
  } catch (e) {
    MAGPIE_SYSTEM.error(ePrefix + e.message, e);
    return false;
  }
};
/**
 *
 * @param {String} reason
 * @returns {entityID}
 */
MAGPIE_ENTITY.prototype.selfKick = function selfKick(reason = "dev") {
  const ID = structuredClone(this.ID);
  return MAGPIE_ENTITY.__hiveSync("kick", [ID, reason]);
};
/**
 * @name
 * @desc
 *
 */
//------------------------------------------------------------------------
// #region > Socket
//------------------------------------------------------------------------
/**
 *
 * @param {Float64Array} output
 * @param {MAGPIE_EXP} exp
 * @param {MAGPIE_ENTITY} entity
 * @param {MAGPIE_ENTITY} P_C
 * @param {POVART} POVART1
 * @param {duration} dt
 */
MAGPIE_ENTITY.__socketEmit = function __socketEmit(
  output,
  exp,
  entity,
  P_C,
  POVART1,
  dt,
) {
  //
};
// #endregion
//------------------------------------------------------------------------
/**
 * @name
 * @desc
 *
 */
//------------------------------------------------------------------------
// #region exp
//------------------------------------------------------------------------
/**
 *
 * @param {Number} switchID
 * @param {duration} dt
 * @param {Number} layer_frame
 * @returns {MAGPIE_EXP}
 */
MAGPIE_ENTITY.prototype.processExp = function (switchID, dt, layer_frame) {
  const ePrefix = `[ENTITY-${this.ID}].processExp: `;
  const exps = this._get_array_expID();
  // return MAGPIE_SYSTEM._logging_debug(layer_frame)
  if (exps.length < 1) return;
  const expID = this._get_nextExpID(layer_frame);
  if (!expID) throw new Error(`${expID} is invalid EXP.ID`);
  try {
    const exp = MAGPIE_ENTITY.__hiveSync("_get_exp", [expID]);
    if (!(exp instanceof MAGPIE_EXP)) throw new Error(`${exp} is invalid EXP`);
    return exp;
  } catch (e) {
    MAGPIE_SYSTEM.error(ePrefix + e.message, e);
  }
};
/**
 * @returns {expID[]}
 */
MAGPIE_ENTITY.prototype._get_array_expID = function getArrayExpID() {
  // MAGPIE_SYSTEM._logging_debug(this.exps)
  return this.exps;
};
/**
 * @param {Number} layer_frame
 * @returns {expID}
 */
MAGPIE_ENTITY.prototype._get_nextExpID = function getNextExpID(layer_frame) {
  const exps = this._get_array_expID();
  if (!Array.isArray(exps) || exps.length < 1)
    throw new Error(`${exps} is invalid EXP array`);
  if (layer_frame >= exps.length) layer_frame = layer_frame % exps.length;
  const expID = exps[layer_frame];
  if (isNaN(expID))
    throw new Error(
      `[ENTITY-${this.ID}].getNextExpID: ${expID} is invalid expID`,
    );
  return expID;
};
// #endregion
//------------------------------------------------------------------------
/**
 * @name
 * @desc
 *
 */
//------------------------------------------------------------------------
// #region emote
//------------------------------------------------------------------------

/**
 *
 * @param {Number} switchID
 * @param {duration} dt
 * @param {MAGPIE_EXP} exp
 * @param {MAGPIE_KEY} key
 * @returns {{exp: MAGPIE_EXP, target: {At: vector3, Tt: bivector}}}
 */
MAGPIE_ENTITY.prototype.processEmote = function processEmote(
  switchID,
  dt,
  exp,
  key,
) {
  const ePrefix = `[ENTITY-${this.ID}].processEmote: `;
  if (!exp) return;
  try {
    if (!(exp instanceof MAGPIE_EXP))
      throw new Error(`${exp} is invalid MAGPIE_EXP`);
    if (key instanceof MAGPIE_KEY && key.label)
      return this._act_emote(MAGPIE.KEY.EMOTE.INDEX[key.label], exp);
    const emote = MAGPIE_EMOTE.INDEX.get(exp.emoteID);
    if (!emote) return { exp: exp };
    const index = exp._get_stamina_index();
    if (!index) return;
    const output = emote.onAction(exp, this, index);
    return output;
  } catch (e) {
    MAGPIE_SYSTEM.error(ePrefix + e.message, e);
    return { exp: exp };
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
// #region states
//------------------------------------------------------------------------
/**
 *
 * @param {Number} switchID
 * @param {duration} dt
 * @param {MAGPIE_EXP} exp
 * @return {{exp: MAGPIE_EXP, target: {At: vector3, Tt: bivector}}}
 */
MAGPIE_ENTITY.prototype.processStates = function processStates(
  switchID,
  dt,
  exp,
) {
  const ePrefix = `[ENTITY-${this.ID}].processStates: `;
  const target = { At: [0, 0, 0], Tt: [0, 0, 0] };
  try {
    const states = this._get_states();
    if (states.length < 1) return { exp, target };
    states.sort((a, b) => b - a);
    const standardSwitch = 0;
    const K = MAGPIE.KEY.FITNESS;
    states.forEach((stateID, index) => {
      try {
        const state = MAGPIE_STATE.INDEX.get(stateID);
        if (!(state instanceof MAGPIE_STATE))
          throw new Error(`${stateID} is invalid MAGPIE_STATE`);
        const state_index = this._get_index_state(index);
        const output = state.onUpdate(exp, this, switchID, state_index);
        // MAGPIE_SYSTEM._logging_debug(Object.entries(output))
        if (output)
          Object.keys(output).forEach((k) => {
            target[k] = output[k];
          });
        // MAGPIE_SYSTEM._logging_debug(`debug: ${JSON.stringify(target, null, 1)}`)
      } catch (e) {
        MAGPIE_SYSTEM.error(ePrefix + e.message, e);
      }
    });
    const debug_data = JSON.stringify(target, null, 1);
    return { exp, target };
  } catch (e) {
    MAGPIE_SYSTEM.error(ePrefix + e.message, e);
    return { exp, target };
  }
};
/**
 *
 * @param {index} state_index
 * @returns {fitness_index}
 */
MAGPIE_ENTITY.prototype._get_index_state = function getStateIndex(state_index) {
  const K = MAGPIE.KEY.FITNESS;
  return K.TRAITS + this.fitness[K.DECKSIZE] * K.STATES + state_index;
};
// #endregion
//------------------------------------------------------------------------
/**
 * @name
 * @desc
 *
 */
//------------------------------------------------------------------------
// #region agency
//------------------------------------------------------------------------

/**
 *
 * @param {Number} switchID
 * @param {duration} dt
 * @param {MAGPIE_EXP} exp
 * @param {MAGPIE_KEY[]}
 */
MAGPIE_ENTITY.prototype.processAgency = function processAgency(
  switchID,
  dt,
  exp,
  keys,
) {
  const ePrefix = `[ENTITY-${this.ID}].processAgency: `;
  if (!exp) return;
  try {
    if (!(exp instanceof MAGPIE_EXP))
      throw new Error(`${exp} is invalid MAGPIE_EXP`);
    if (!keys || keys.length < 1) return;
    const S1 = this.processS1(switchID, dt, exp, keys);
    const S2 = this.processS2(switchID, S1, keys);
    const S3 = this.processS3(switchID, S1, S2, keys);
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
// #region physics
//------------------------------------------------------------------------
/**
 *
 * @param {Number} switchID
 * @param {duration} dt
 * @param {{
 * At: vector3,
 * Tt: bivector,
 * exp: MAGPIE_EXP,
 * raw: action_output
 * }} intent
 * @param {MAGPIE_ENTITY} C
 * @param {POVART} POVART0
 * @returns {{
 * output: [lat,lon,ASL,radius: distance,Fg: acceleration,...force[]],
 * POVART1: POVART
 * }}
 */
MAGPIE_ENTITY.prototype.updatePhysics = function updatePhysics(
  switchID,
  dt,
  intent,
  C,
  POVART0,
) {
  const ePrefix = `[ENTITY-${this.ID}].updatePhysics: `;
  const defaults = { output: null, POVART1: null };
  const nonPhys = { output: [], POVART1: POVART0 };
  try {
    const valid =
      MAGPIE_PHYSICS.isValidPOVART(POVART0) &&
      POVART0[MAGPIE.KEY.POVART.E_ID] === this.ID;
    if (!valid) throw new Error(`${POVART0} is invalid POVART₀`);
    let { P0, orbit, O0, V0, A0, R0, T0, E_ID } =
      MAGPIE_ENTITY._get_decomp_POVART(POVART0);
    if (MAGPIE_PHYSICS.mag(P0) < 1) return nonPhys;
    const r = C?._get_radius();
    if (!Number(r)) return defaults;
    let C0 = MAGPIE_PHYSICS.cartesianToGeodetic(P0, r);
    if (O0[3] === 1) {
      nonPhys.output = [C0[0], C0[1], C0[2], r];
      return nonPhys;
    }
    const CB = MAGPIE_PHYSICS._calculate_collisionBox(this);
    // MAGPIE_SYSTEM._logging_debug(`C: ${C?.name}`)
    const floor = MAGPIE_PHYSICS._geod_clampToGround(r, C0, POVART0, dt);
    if (floor.clamped) {
      P0 = floor.Pg;
      O0 = floor.Og;
      V0 = floor.Vg;
      C0 = MAGPIE_PHYSICS.cartesianToGeodetic(P0, r);
    }
    // @todo entity.updatePhysics check obstacles and calculate Ac/Tc
    const forcesData = {
      dt,
      r,
      P0,
      P_C: C,
      O0,
      V0,
      A0,
      R0,
      T0,
      C0,
      CB,
      STATS: this.STATS,
      switchID,
    };
    const { Af, Tf, forces } = MAGPIE_PHYSICS._apply_forces(forcesData);
    const state = { Af, Tf, A0, T0, forces };
    const { Ax, Tx } = this._apply_intent(intent, state, forces, switchID, dt);
    const dA = MAGPIE_PHYSICS.scaleVector(
      MAGPIE_PHYSICS.addVectors(Af, Ax),
      dt,
    );
    const dT = MAGPIE_PHYSICS.scaleVector(
      MAGPIE_PHYSICS.addVectors(Tf, Tx),
      dt,
    );
    const T1 = dT; //MAGPIE_PHYSICS.addVectors(T0, dT);
    const dR = MAGPIE_PHYSICS.addVectors(R0, T1)
    const R1 = MAGPIE_PHYSICS.mag(dR) > 1e-9 ? dR : [0, 0, 0];
    const dO = MAGPIE_PHYSICS.rotorFromBivector(R1, dt);
    // HASTAL Doctrine: Right-side multiplication for local frame rotation (O_new = O_old * R_delta)
    const O1 = MAGPIE_PHYSICS.rotorCompose(O0, dO);
    //
    const A1 = dA; //MAGPIE_PHYSICS.addVectors(A0, dA);
    const dV = MAGPIE_PHYSICS.addVectors(V0, A1);
    const V1 = MAGPIE_PHYSICS.mag(dV) > 1e-9 ? dV : [0, 0, 0];
    //
    const dP = MAGPIE_PHYSICS.scaleVector(V1, dt);
    const P1 = MAGPIE_PHYSICS.addVectors(P0, dP);
    const C1 = MAGPIE_PHYSICS.cartesianToGeodetic(P1, r);
    const [lat, lon, ASL] = C1;
    const output = new Float64Array([lat, lon, ASL, r, ...forces]);
    //
    this._set_POVART({ P1, O1, V1, A1, R1, T1 });
    const POVART1 = this._get_POVART();
    if (!MAGPIE_PHYSICS.isValidPOVART(POVART1))
      throw new Error(`${POVART1} is invalid POVART₁`);
    return { output, POVART1: POVART1 };
  } catch (e) {
    MAGPIE_SYSTEM.error(ePrefix + e.message, e);
    return defaults;
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
// #region > Eval
//------------------------------------------------------------------------
/**
 *
 * @param {String} label
 * @param {MAGPIE_EXP} exp
 * @returns {{exp: MAGPIE_EXP, target: {At: vector3, Tt: bivector}}}
 */
MAGPIE_ENTITY.prototype._key_processEmote = function _key_processEmote(
  label,
  exp,
) {
  const { At, Tt } = this[`_emote_${label}`](exp);
  if (!MAGPIE_PHYSICS.isValidVector(At) || !MAGPIE_PHYSICS.isValidVector(Tt))
    return { exp };
  return { exp, target: { At, Tt } };
};
// #endregion
//------------------------------------------------------------------------
/**
 * @name
 * @desc
 *
 */
//------------------------------------------------------------------------
// #region helpers
//------------------------------------------------------------------------

/**
 *
 * @param {MAGPIE_EXP} exp
 * @returns {MAGPIE_KEY}
 */
MAGPIE_ENTITY.prototype.processKeys = function processKeys(exp) {
  const ePrefix = `[ENTITY-${this.ID}].processKeys: `;
  if (!exp) return;
  try {
    if (!(exp instanceof MAGPIE_EXP))
      throw new Error(`${exp} is invalid MAGPIE_EXP`);
    const keyList = exp.keys;
    if (keyList.length < 1) return;
    const keys = exp.getKeys();
    if(!keys || !Array.isArray(keys)) 
      return this.selfKick(`corrupt keys in [EXP-${exp.ID}]`)
    if (keys.length < 1) return;
    const key = keys.find((key) => key.type === MAGPIE.KEY.TYPE.EMOTE);
    if (key) return key;
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
// #region - STAT
//========================================================================
/**
 * @name
 * @desc
 *
 */
//------------------------------------------------------------------------
// #region > Get
//------------------------------------------------------------------------
/**
 *
 * @returns {STAT}
 */
MAGPIE_ENTITY.prototype._get_MASS = function getMASS() {
  return this.STATS[MAGPIE.KEY.STATS.MASS];
};
/**
 *
 * @returns {STAT}
 */
MAGPIE_ENTITY.prototype._get_PWR = function getPWR() {
  return this.STATS[MAGPIE.KEY.STATS.PWR];
};
/**
 *
 * @returns {STAT}
 */
MAGPIE_ENTITY.prototype._get_DEX = function getDEX() {
  return this.STATS[MAGPIE.KEY.STATS.DEX];
};
/**
 *
 * @returns {STAT}
 */
MAGPIE_ENTITY.prototype._get_SEN = function getSEN() {
  return this.STATS[MAGPIE.KEY.STATS.SEN];
};
/**
 *
 * @returns {STAT}
 */
MAGPIE_ENTITY.prototype._get_END = function getEND() {
  return this.STATS[MAGPIE.KEY.STATS.END];
};
/**
 *
 * @returns {STAT}
 */
MAGPIE_ENTITY.prototype._get_RT = function getRT() {
  return this.STATS[MAGPIE.KEY.STATS.RT];
};
/**
 *
 * @returns {STAT}
 */
MAGPIE_ENTITY.prototype._get_EVO = function getEVO() {
  return this.STATS[MAGPIE.KEY.STATS.EVO];
};
/**
 *
 * @returns {STAT}
 */
MAGPIE_ENTITY.prototype._get_GLVL = function getGLVL() {
  return this.STATS[MAGPIE.KEY.STATS.G_LVL];
};
/**
 *
 * @returns {STAT}
 */
MAGPIE_ENTITY.prototype._get_GI = function getGI() {
  return this.STATS[MAGPIE.KEY.STATS.G_I];
};
/**
 *
 * @returns {STAT}
 */
MAGPIE_ENTITY.prototype._get_GR = function getGR() {
  return this.STATS[MAGPIE.KEY.STATS.G_R];
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
// #region - SYMBOLS
//========================================================================
/**
 * @name
 * @desc
 *
 */
//------------------------------------------------------------------------
// #region > Getters
//------------------------------------------------------------------------
/**
 * {@link MAGPIE_HIVE._get_symbol}
 * @returns {MAGPIE_SYMBOL}
 */
MAGPIE_ENTITY.prototype._get_type = function getType() {
  return MAGPIE_ENTITY.__hiveSync("_get_symbol", [this.type]);
};
// #endregion
//------------------------------------------------------------------------
/**
 * @name
 * @desc
 * {@link MAGPIE.KEY.ENTITY.CONTAINER.meta}
 */
//------------------------------------------------------------------------
// #region > Container
//------------------------------------------------------------------------
MAGPIE_ENTITY.container = {};
/**
 * @typedef {Map<keyID, {
 * amount: Number,
 * maxAmount: Number,
 * contextKey: keyID
 * }>} container {@link MAGPIE.KEY.ENTITY.CONTAINER.meta}
 * @returns {container}
 */
MAGPIE_ENTITY.prototype._container_get_resources = function () {
  const ePrefix = `[ENTITY-${this.ID}]: `;
  try {
    const arr = Array.from(this.fitness);
    if (arr.length < 1) return;
    const values = MAGPIE.KEY.ENTITY.CONTAINER.SERIES;
    const series = arr.length / values;
    if (series % Math.floor(series) > 0)
      return MAGPIE_SYSTEM.log(`container fitness not a multiple of ${values}`);
    /** @type {container} */
    const resources = new Map();
    for (let i = 0; i < series; i++) {
      const offset = i * values;
      resources.set(arr[offset], {
        amount: arr[offset + 1],
        maxAmount: arr[offset + 2],
        contextKey: arr[offset + 3],
      });
    }
    return resources;
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
// #region > Generation
//------------------------------------------------------------------------
// @todo entity.inheritTraits MAGPIE_ENTITY.prototype.
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
// #region - TRAITS
//========================================================================
/**
 * @name
 * @desc
 *
 */
//------------------------------------------------------------------------
// #region > Get
//------------------------------------------------------------------------
/**
 *
 * @returns {deckSize}
 */
MAGPIE_ENTITY.prototype._get_deckSize = function getDeckSize() {
  return this.fitness[MAGPIE.KEY.FITNESS.DECKSIZE];
};
/**
 *
 * @param {symbolID} symbolID
 * @returns {index}
 */
MAGPIE_ENTITY.prototype._trait_getIndexOf = function getTraitIndex(symbolID) {
  return Array.from(this.fitness).findIndex((n) => n === symbolID);
};
/**
 *
 * @returns {MAGPIE_SYMBOL[]}
 */
MAGPIE_ENTITY.prototype._fetch_traits = function fetchTraits() {
  return this._get_traits().map((traitID) =>
    MAGPIE_ENTITY.__hiveSync("_get_symbol", [traitID]),
  );
};
/**
 * @returns {symbolID[]}
 */
MAGPIE_ENTITY.prototype._trait_getType = function getTypeTraits() {
  const ePrefix = `[ENTITY-${this.ID}].getTypeTraits: `;
  try {
    const archetype = this._get_type();
    const reqs = archetype._get_requirementIDs();
    const comps = archetype._get_compoundIDs();
    return [archetype.ID, ...reqs, ...comps];
  } catch (e) {
    MAGPIE_SYSTEM.error(ePrefix + e.message, e);
    return [];
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
// #region > Set
//------------------------------------------------------------------------
/**
 * @param {traitID}
 * @param {symbolID} symbolID
 * @returns {deckSize} deckSize
 */
MAGPIE_ENTITY.prototype._trait_add = function addTrait(symbolID) {
  const ePrefix = `[ENTITY-${this.ID}].addTrait: `;
  try {
    if (isNaN(symbolID)) throw new Error(`${symbolID} is invalid traitID`);
    const arr = new Array(...this.fitness);
    const traits_offset = MAGPIE.KEY.FITNESS.TRAITS;
    const deckSize = MAGPIE.KEY.FITNESS.DECKSIZE;
    const remove = 0;
    arr.splice(traits_offset + this._get_deckSize(), remove, symbolID);
    arr[deckSize]++;
    this.fitness = new Float64Array(arr);
    return arr[deckSize];
  } catch (e) {
    MAGPIE_SYSTEM.error(ePrefix + e.message, e);
    return false;
  }
};

/**
 *
 * @param {symbolID} symbolID
 * @returns {deckSize}
 */
MAGPIE_ENTITY.prototype._trait_remove = function removeTrait(symbolID) {
  const ePrefix = `[ENTITY-${this.ID}].removeTrait: `;
  try {
    const index = this._trait_getIndexOf(symbolID);
    const traitID = this.fitness[index];
    if (isNaN(traitID) || traitID !== symbolID)
      throw new Error(`.fitness[${index}] is not [TRAIT-${symbolID}]`);
    const traits = this._get_traits();
    const arr = new Array(...this.fitness);
    const lastTrait = traits[traits.length - 1];
    arr[index] = lastTrait;
    const offset = MAGPIE.KEY.FITNESS.TRAITS;
    const deckSize = MAGPIE.KEY.FITNESS.DECKSIZE;
    const remove = 1;
    arr.splice(offset + deckSize, remove);
    arr[deckSize]--;
    this.fitness = new Float64Array(arr);
    return deckSize;
  } catch (e) {
    MAGPIE_SYSTEM.error(ePrefix + e.message, e);
  }
};
// #endregion
//------------------------------------------------------------------------
/**
 * @name
 * @desc
 * @typedef {trait_output[]} fitness_output
 */
//------------------------------------------------------------------------
// #region > Fitness
//------------------------------------------------------------------------
MAGPIE_ENTITY.fitness = {};
/**
 * @param {{
 * At: vector3,
 * Tt: bivector,
 * exp: MAGPIE_EXP,
 * raw: action_output
 * }} intent
 * @param {{
 * Af: vector3,
 * Tf: bivector,
 * A0: vector3,
 * T0: bivector,
 * forces: physics_forces
 * }} state
 * @param {physics_forces} forces
 * @param {Number} switchID
 * @param {duration} dt
 * @returns {{ Ax: vector3, Tx: bivector }}
 */
MAGPIE_ENTITY.prototype._apply_intent = function _apply_intent(
  intent,
  state,
  forces,
  switchID,
  dt,
) {
  const ePrefix = `[ENTITY-${this.ID}].applyIntent: `;
  try {
    //@todo generate locomotion from intent and forces
    const K = MAGPIE.KEY.STATS;
    const Amax = this.STATS[K.AMAX];
    const R = MAGPIE.KEY.POVART.R_AXES;
    //@audit
    return { Ax: intent.At, Tx: intent.Tt };
    const { dA, dT } = this._apply_locomotion(intent, state);
    const Ax_raw = MAGPIE_PHYSICS.addVectors(state.A0, dA);
    const Ax = MAGPIE_PHYSICS.vector_clamp_mag(Ax_raw, Amax);
    const Tx_raw = MAGPIE_PHYSICS.addVectors(state.T0, dT);
    const pitch = Math.min(Tx_raw[R.get("pitch")], this.STATS[K.TMAX_X]);
    const roll = Math.min(Tx_raw[R.get("roll")], this.STATS[K.TMAX_Y]);
    const heading = Math.min(Tx_raw[R.get("roll")], this.STATS[K.TMAX_Z]);
    return { Ax, Tx: [pitch, roll, heading] };
  } catch (e) {
    MAGPIE_SYSTEM.error(ePrefix + e.message, e);
  }
};
/**
 *
 * @param {fitness_index} fitness_index
 * @param {{
 * At: vector3,
 * Tt: bivector,
 * exp: MAGPIE_EXP,
 * raw: action_output
 * }} intent
 * @param {{
 * Af: vector3,
 * Tf: bivector,
 * A0: vector3,
 * T0: bivector
 * }} state
 * @returns {{}} dA
 */
MAGPIE_ENTITY.prototype._apply_locomotion = function _apply_locomotion(
  intent,
  state,
) {
  const ePrefix = `[ENTITY-${this.ID}].applyLocomotion: `;
  const defaults = { dA: [0, 0, 0], dT: [0, 0, 0] };
  try {
    const fitness_index = intent?.raw?.fitness_index || NaN;
    if (isNaN(fitness_index)) return defaults;
    const index =
      this._get_index_trait(fitness_index, "STATES") -
      MAGPIE.KEY.FITNESS.TRAITS;
    const trait = this._fetch_traits()[index];
    if (!(trait instanceof MAGPIE_SYMBOL))
      throw new Error(`unable to find trait[${index}]`);
    const { speeds, forces } = trait._get_locomotion();
    const dA = Number(speeds?.Amax)
      ? MAGPIE_PHYSICS.scaleVector(intent.At, speeds.Amax)
      : [0, 0, 0];
    const dT = Number(speeds?.Tmax)
      ? MAGPIE_PHYSICS.scaleVector(intent.Tt, speeds.Tmax)
      : [0, 0, 0];
    // MAGPIE_SYSTEM._logging_debug(`speeds: ${Object.entries(speeds)}`)
    // return defaults
    if (!MAGPIE_PHYSICS.isValidVector(dA))
      throw new Error(`${dA} is invalid ΔA vector`);
    if (!MAGPIE_PHYSICS.isValidVector(dT))
      throw new Error(`${dT} is invalid ΔT bivector`);
    return { dA, dT };
  } catch (e) {
    MAGPIE_SYSTEM.error(ePrefix + e.message, e);
    return defaults;
  }
};
/**
 *
 * @param {fitness_index} fitness_index
 * @param {String} zone {@link MAGPIE.KEY.FITNESS.ZONES}
 * @returns {fitness_index}
 */
MAGPIE_ENTITY.prototype._get_index_trait = function _get_index_trait(
  fitness_index,
  zone,
) {
  const K = MAGPIE.KEY.FITNESS;
  const deckSize = K.DECKSIZE;
  const offset = K.TRAITS;
  const mult = K[zone];
  const section = fitness_index - deckSize * mult;
  return section;
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
// #region - FITNESS
//========================================================================
/**
 * @name
 * @desc
 *
 */
//------------------------------------------------------------------------
// #region > Get
//------------------------------------------------------------------------

/**
 *
 * @param {index} index
 * @param {Number} zone
 * @returns {fitness_index}
 */
MAGPIE_ENTITY.prototype._fitness_offset = function fitnessOffset(index, zone) {
  const ePrefix = `[ENTITY-${this.ID}].fitnessOffset: `;
  try {
    if (
      isNaN(index) ||
      index < this.fitness.length ||
      index >= this.fitness.length
    )
      return;
    const K = MAGPIE.KEY.FITNESS;
    const zones = K.ZONES;
    const deckSize = K.DECKSIZE;
    const offset = K.TRAITS + deckSize * zones + index;
    if (this.fitness[offset]) return this.fitness[offset];
    return;
  } catch (e) {
    MAGPIE_SYSTEM.error(ePrefix + e.message, e);
  }
};
/**
 *
 * @param {index} index
 * @param {Enumerator<Number>} zoneID
 * @returns {fitness_index}
 */
MAGPIE_ENTITY.prototype._trait_offset = function traitOffset(index, zoneID) {
  const ePrefix = `[ENTITY-${this.ID}].traitOffset: `;
  try {
    if (isNaN(index) || index < 0 || index >= this.fitness.length) return;
    const K = MAGPIE.KEY.FITNESS;
    const trait_index = K.TRAITS + index;
    if (this._get_traits()[trait_index] !== this.fitness[trait_index]) return;
    return this.fitness[trait_index];
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
// #region > CCG
//------------------------------------------------------------------------
/**
 *
 * @returns {fitness_index}
 */
MAGPIE_ENTITY.prototype._fitness_draw = function drawFitness() {
  const ePrefix = `[ENTITY-${this.ID}].fitnessDraw: `;
  try {
    const reserve = this._get_RESERVE();
    const index = Math.floor(Math.random() * (reserve.length - 1));
    const traits = this._get_traits();
    const fitness_index = traits.indexOf(reserve[index]) - 2;
    if (this.fitness[fitness_index]) return fitness_index;
    return;
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
// #region - GROWTH
//========================================================================
MAGPIE_ENTITY.GROWTH = {};
/**
 * @name
 * @desc
 * @typedef {Number} creature_level
 */
//------------------------------------------------------------------------
// #region > Get
//------------------------------------------------------------------------
/**
 *
 * @returns {stateID}
 */
MAGPIE_ENTITY.prototype.growthStage = function growthStage() {
  const ePrefix = `[ENTITY-${this.ID}].growthStage: `;
  try {
    const G_LVL = this._get_growthLevel();
    if (G_LVL >= MAGPIE.KEY.GROWTH.ELDER[1]) return MAGPIE.KEY.GROWTH.ELDER[0];
    if (G_LVL < MAGPIE.KEY.GROWTH.INFANT[1]) return MAGPIE.KEY.GROWTH.EMBRYO[0];
    if (G_LVL < MAGPIE.KEY.GROWTH.JUVENILE[1])
      return MAGPIE.KEY.GROWTH.JUVENILE[0];
    if (G_LVL < MAGPIE.KEY.GROWTH.ADOLESCENT[1])
      return MAGPIE.KEY.GROWTH.ADOLESCENT[0];
    if (G_LVL < MAGPIE.KEY.GROWTH.ADULT[1]) return MAGPIE.KEY.GROWTH.ADULT[0];
    throw new Error(`unable to assign growthStage from [GROWTH-${G_LVL}]`);
  } catch (e) {
    MAGPIE_SYSTEM.error(ePrefix + e.message, e);
  }
};
/**
 *
 * @returns {STAT}
 */
MAGPIE_ENTITY.prototype.growth = function () {
  return this.STATS[MAGPIE.KEY.STATS.G_LVL];
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
 * @typedef {{
 * dR: bivector,
 * dRmag: magnitude,
 * Bdist: bivector,
 * fitness_index: fitness_index
 * }} action_output
 */
//========================================================================
// #region - ACTION
//========================================================================
/**
 * @name
 * @desc
 *
 */
//------------------------------------------------------------------------
// #region > Act
//------------------------------------------------------------------------
/**
 *
 * @param {emoteID} emoteID
 * @param {MAGPIE_EXP} exp
 * @returns {{exp: MAGPIE_EXP, target: {At: vector3, Tt: bivector}}}
 */
MAGPIE_ENTITY.prototype._act_emote = function _act_emote(emoteID, exp) {
  const ePrefix = `[ENTITY-${this.ID}].actEmote: `;
  try {
    if (isNaN(emoteID)) throw new Error(`${emoteID} is invalid emoteID`);
    if (!(exp instanceof MAGPIE_EXP)) throw new Error(`${exp} is invalid EXP`);
    const emote = MAGPIE_EMOTE.INDEX.get(emoteID);
    if (!emote) throw new Error(`unable to find [EMOTE-${emoteID}]`);
    return emote.onAction(exp, this);
  } catch (e) {
    MAGPIE_SYSTEM.error(ePrefix + e.message, e);
  }
};
/**
 *
 * @param {Number} dice
 * @returns {Boolean}
 */
MAGPIE_ENTITY.prototype._emote_dice = function _emote_dice(dice = 6) {
  return Math.ceil(Math.random() * dice) === dice;
};
// #endregion
//------------------------------------------------------------------------
/**
 * @name
 * @desc
 *
 */
//------------------------------------------------------------------------
// #region > Eval
//------------------------------------------------------------------------
/**
 *
 * @param {MAGPIE_EXP} exp
 * @returns {() => {}}
 */
MAGPIE_ENTITY.prototype._emote_eval = function _emote_eval(exp) {
  const ePrefix = `[ENTITY-${this.ID}]._emote_eval: `;
  try {
    const key = exp.getKeys().find((key) => key.type === MAGPIE.KEY.TYPE.EVAL);
    if (!key) return;
    eval(`${key.label.replace("$", exp.value)}`);
    key._set_type(MAGPIE.KEY.TYPE.EXP);
    return { At: [0, 0, 0], Tt: [0, 0, 0] };
  } catch (e) {
    MAGPIE_SYSTEM.error(ePrefix + e.message, e);
  }
};
// #endregion
//------------------------------------------------------------------------
/**
 * @name seekTarget
 * @desc
 *
 */
//------------------------------------------------------------------------
// #region > Seek1
//------------------------------------------------------------------------
MAGPIE_ENTITY._seekTarget = 1;
/**
 * 
 * @param {MAGPIE_EXP} exp 
 * @param {fitness_index} fitness_index 
 * @param {POVART} POVART0
 * @param {Object} options
 */
MAGPIE_ENTITY.prototype._emote_stop = function(exp, fitness_index, POVART0, options) {
  const ePrefix = `[ENTITY-${this.ID}]._emote_stop: `;
  try {
    const idling = STATE.INDEX.IDLING;
    const stopping = STATE.INDEX.STOPPING;
    if(!POVART0) POVART0 = this._get_POVART();
    const { At, Tt, raw, stopped } = MAGPIE_PHYSICS._emote_stop(POVART0, options)
    this.switchState(fitness_index, stopped ? idling : stopping)
    return { At, Tt, exp, raw }
  } catch(e) {
    MAGPIE_SYSTEM.error(ePrefix + e.message, e)
  }
}
/**
 * 
 * @param {MAGPIE_EXP} exp 
 * @param {*} data
 * @returns {Object} 
 */
MAGPIE_ENTITY.prototype._get_emoteSeekOptions = function(exp, data) {
  const ePrefix = `[ENTITY-${this.ID}].getEmoteSeekOptions: `;
  try {
    const tolerance = 1; //@todo dynamic seekTarget tolerance
    const pR = 1; //@todo dynamic seekTarget priority ratio
    const intensity = exp.value;
    const keys = exp.getKeys();
    const geodetic = true; //@todo dynamic geodetic flag
    const surface = true; //@todo dynamic surface flag
    const options = {
      intensity: intensity,
      fwd: MAGPIE.KEY.POVART.FWD,
      agility: this.STATS[MAGPIE.KEY.STATS.DEX],
      tolerance: tolerance,
      geodetic: geodetic,
      surface: surface,
    };
    const overrideVspeed = exp._key_mapVspeeds();
    // MAGPIE_SYSTEM._logging_debug(`Vspeeds: ${Object.entries(overrideVspeed)}`)
    const speeds = this._get_speeds(overrideVspeed);
    for(const [key, value] of Object.entries(speeds)) {
      if(key && !isNaN(value)) options[key] = value;
    };
    options.Rstate = this._get_Rstate();
    // if(this.ID === 1782090960583)
    // MAGPIE_SYSTEM._logging_debug(`Vcruise: ${options.Vcruise}`)
    options.STATS = this.STATS;
    const WPkey = exp._key_findWPoptions();
    const WPoptions = exp._key_mapWPoptions(WPkey) || {};
    for(const [key, value] of Object.values(WPoptions)) {
      if(!isNaN(value)) options[key] = value;
    }
    return options
  } catch(e) {
    MAGPIE_SYSTEM.error(ePrefix + e.message, e)
    return {}
  }
}
/**
 *
 * @param {MAGPIE_EXP} exp
 * @param {fitness_index} fitness_index
 * @returns {state_output}
 */
MAGPIE_ENTITY.prototype._emote_seekTarget = function (exp, fitness_index) {
  const ePrefix = `[ENTITY-${this.ID}]._emote_seekTarget: `;
  let output = { At: [0, 0, 0], Tt: [0, 0, 0], exp: exp, raw: [] };
  try {
    if (!(exp instanceof MAGPIE_EXP)) throw new Error(`${exp} is invalid EXP`);
    const currentTarget = this._get_target()
    const targetID = currentTarget?.ID
    // || exp._target_next(this);
    const POVART0 = this._get_POVART();
    const data = {};
    const options = this._get_emoteSeekOptions(exp, data)
    // MAGPIE_SYSTEM._logging_debug(`options: ${Object.entries(options)}`)
    const { P0, V0 } = MAGPIE_ENTITY._get_decomp_POVART(POVART0);
    const target = !targetID ? null : MAGPIE_ENTITY.__hiveSync("_get_entity", [targetID]);
    if(!target) return this._emote_stop(exp, fitness_index, POVART0, options)
    const Pt = target._get_P0();
    let contact = false;
    const dist = this._target_getDistance(P0, Pt);
    contact = this._target_isSensed(target, dist);
    if(!contact) {
      const spoofed = STATE.INDEX.SPOOFED;
      options.state = spoofed;
      MAGPIE_SYSTEM.logging.log_exp(ePrefix + "no contact. ");
      this.switchState(fitness_index, spoofed)
    } else if(dist < this.STATS[MAGPIE.KEY.STATS.LENGTH]) {
        options.state = STATE.INDEX.ON_TARGET;
        this.switchState(fitness_index, STATE.INDEX.ON_TARGET)
        if(MAGPIE_PHYSICS.mag(V0) < 1e-6) return output;
        else return this._emote_stop(exp, fitness_index, POVART0, options)
    } 
    output = MAGPIE_PHYSICS._emote_seekTarget(this, Pt, options);
    this.switchState(fitness_index, options.state);
    return { At: output.At, Tt: output.Tt, exp: output.exp, raw: output.raw };
  } catch (e) {
    MAGPIE_SYSTEM.error(ePrefix + e.message, e);
    this.selfKick()
    return output;
  }
};
/**
 *
 * @param {MAGPIE_EXP} exp
 * @param {fitness_index} fitness_index
 * @returns {state_output}
 */
MAGPIE_ENTITY.prototype._emote_onTarget = function _emote_onTarget(
  exp,
  fitness_index,
) {
  const ePrefix = `[ENTITY-${this.ID}].reachTarget: `;
  try {
    const next = this._target_next();
    if (next) {
      // MAGPIE_SYSTEM._logging_debug(ePrefix + `next: ${next.ID}`)
      return this.switchState(fitness_index, STATE.INDEX.SEEKING_TARGET);
    }
    //@todo entity._emote_onTarget
    return this._emote_seekTarget(exp, fitness_index);
  } catch (e) {
    MAGPIE_SYSTEM.error(ePrefix + e.message, e);
  }
};
/**
 *
 * @param {MAGPIE_EXP} exp
 * @param {fitness_index} fitness_index
 * @returns {state_output}
 */
MAGPIE_ENTITY.prototype._emote_approachTarget = function _emote_approachTarget(
  exp,
  fitness_index,
) {
  const ePrefix = `[ENTITY-${this.ID}].reachTarget: `;
  try {
    if (this._target_next())
      return this.switchState(fitness_index, STATE.INDEX.SEEKING_TARGET);
    return this._emote_seekTarget(exp, fitness_index);
  } catch (e) {
    MAGPIE_SYSTEM.error(ePrefix + e.message, e);
  }
};
/**
 *
 * @param {MAGPIE_EXP} exp
 * @param {fitness_index} fitness_index
 * @returns {state_output}
 */
MAGPIE_ENTITY.prototype._emote_reachTarget = function _emote_reachTarget(
  exp,
  fitness_index,
) {
  const ePrefix = `[ENTITY-${this.ID}].reachTarget: `;
  try {
    // MAGPIE_SYSTEM._logging_debug(ePrefix)
    if (this._target_next())
      return this.switchState(fitness_index, STATE.INDEX.SEEKING_TARGET);
    return this._emote_seekTarget(exp, fitness_index);
  } catch (e) {
    MAGPIE_SYSTEM.error(ePrefix + e.message, e);
  }
};
/**
 *
 * @param {MAGPIE_EXP} exp
 * @param {fitness_index} fitness_index
 * @returns {state_output}
 */
MAGPIE_ENTITY.prototype._emote_idling = function _emote_idling(
  exp,
  fitness_index,
) {
  const ePrefix = `[ENTITY-${this.ID}].idling: `;
  try {
    //@todo idling logic?
    // return this._emote_stop(exp, fitness_index);
    // MAGPIE_SYSTEM._logging_debug(ePrefix)
    return this._emote_seekTarget(exp, fitness_index);
  } catch (e) {
    MAGPIE_SYSTEM.error(ePrefix + e.message, e);
  }
};
MAGPIE_ENTITY.prototype._emote_stopping = function (exp, fitness_index) {
  const ePrefix = `[ENTITY-${this.ID}].idling: `;
  try {
    //@todo stopping logic?
    return this._emote_seekTarget(exp, fitness_index);
  } catch (e) {
    MAGPIE_SYSTEM.error(ePrefix + e.message, e);
  }
};
/**
 *
 * @param {MAGPIE_EXP} exp
 * @param {fitness_index} fitness_index
 * @returns {state_output}
 */
MAGPIE_ENTITY.prototype._emote_lockingTarget = function _emote_lockingTarget(
  exp,
  fitness_index,
) {
  const ePrefix = `[ENTITY-${this.ID}].lockingTarget: `;
  try {
    //@todo locking logic?
    return this._emote_seekTarget(exp, fitness_index);
  } catch (e) {
    MAGPIE_SYSTEM.error(ePrefix + e.message, e);
  }
};
/**
 *
 * @param {MAGPIE_EXP} exp
 * @param {fitness_index} fitness_index
 * @returns {state_output}
 */
MAGPIE_ENTITY.prototype._emote_aligningTarget = function _emote_aligningTarget(
  exp,
  fitness_index,
) {
  const ePrefix = `[ENTITY-${this.ID}].aligningTarget: `;
  try {
    //@todo aligning logic?
    return this._emote_seekTarget(exp, fitness_index);
  } catch (e) {
    MAGPIE_SYSTEM.error(ePrefix + e.message, e);
  }
};
/**
 *
 * @param {MAGPIE_EXP} exp
 * @param {fitness_index} fitness_index
 * @returns {state_output}
 */
MAGPIE_ENTITY.prototype._emote_facingTarget = function _emote_facingTarget(
  exp,
  fitness_index,
) {
  const ePrefix = `[ENTITY-${this.ID}].facingTarget: `;
  try {
    //@todo facingTarget logic?
    return this._emote_seekTarget(exp, fitness_index);
  } catch (e) {
    MAGPIE_SYSTEM.error(ePrefix + e.message, e);
  }
};
/**
 *
 * @param {MAGPIE_EXP} exp
 * @param {fitness_index} fitness_index
 * @returns {state_output}
 */
MAGPIE_ENTITY.prototype._emote_drifting = function _emote_drifting(
  exp,
  fitness_index,
) {
  const ePrefix = `[ENTITY-${this.ID}].drifting: `;
  try {
    //@todo drifting logic?
    return this._emote_seekTarget(exp, fitness_index);
  } catch (e) {
    MAGPIE_SYSTEM.error(ePrefix + e.message, e);
  }
};
/**
 *
 * @param {MAGPIE_EXP} exp
 * @param {fitness_index} fitness_index
 * @returns {state_output}
 */
MAGPIE_ENTITY.prototype._emote_spoofed = function _emote_spoofed(
  exp,
  fitness_index,
) {
  const ePrefix = `[ENTITY-${this.ID}].spoofed: `;
  try {
    //@todo spoofed logic?
    return this._emote_seekTarget(exp, fitness_index);
  } catch (e) {
    MAGPIE_SYSTEM.error(ePrefix + e.message, e);
  }
};
// #endregion
//------------------------------------------------------------------------
/**
 * @name seekFood
 * @desc
 *
 */
//------------------------------------------------------------------------
// #region > Seek2
//------------------------------------------------------------------------
MAGPIE_ENTITY._seekFood = 2;
/**
 *
 * @param {MAGPIE_EXP} exp
 * @returns {state_output}
 */
MAGPIE_ENTITY.prototype._emote_seekNRG = function seekNRG(exp) {
  const ePrefix = `[ENTITY-${this.ID}].seekFood: `;
  try {
    const oldExp = exp;
    exp = new MAGPIE_EXP({
      subject: this.ID,
      keys: [MAGPIE.KEY.INDEX.ECG_HUNGRY],
    });
    //@todo target food?
    const equips = this._get_equipEntities();
    if (equips.length > 0) {
      const species = MAGPIE.KEY.SYMBOL.TYPE.SPECIES;
      const food = equips.find(
        (e) => !!e && e._get_type() && e._get_type().type === species,
      );
      if (food) {
        const fitness_index = this.fitness.indexOf(food.ID);
        return this._emote_eat(exp, food, fitness_index);
      }
    }
    const SEN = this._get_SEN();
    const findNRG = this._sense_for(MAGPIE.KEY.INDEX.ECG.get("ENERGY"), SEN);
    if (!findNRG) return;
    const territory = findNRG._get_territories()[0];
    if (!territory) return;
    if (exp.targetID === territory.ID)
      exp.targetID = territory._territory_explore();
    exp.targetID = territoryID;
    const fitness_index = this._get_states().findIndex(
      (stateID) =>
        MAGPIE_STATE.INDEX.get(stateID)?.type === STATE.TYPE.FSM_POSTURE,
    );
    if (fitness_index > -1) return this._emote_seekTarget(exp, fitness_index);
  } catch (e) {
    MAGPIE_SYSTEM.error(ePrefix + e.message, e);
    this.selfKick("error");
  }
};
/**
 *
 * @param {MAGPIE_EXP} exp
 * @param {MAGPIE_ENTITY} entity
 * @param {fitness_index} fitness_index
 * @returns {state_output}
 */
MAGPIE_ENTITY.prototype._emote_eat = function _emote_eat(
  exp,
  entity,
  fitness_index,
) {
  if ((!entity) instanceof MAGPIE_ENTITY) return;
  let MASS = entity._get_MASS();
  MASS -= 1;
  if (MASS < 1) {
    entity.STATS[MAGPIE.KEY.STATS.HOST] = 101;
    entity.selfKick("digested");
  }
  exp.targetID = entity.ID;
  const key_index = exp.keys.indexOf(keyID === MAGPIE.KEY.INDEX.ECG_HUNGRY);
  if (key_index) exp.keys[key_index] = MAGPIE.KEY.INDEX.ECG_SATIATED;
  /** @type {action_output} */
  const raw = { fitness_index: fitness_index };
  return raw;
};
/**
 *
 * @param {keyID} keyID
 * @param {SEN} SENSE
 * @returns {MAGPIE_CONTEXT}
 */
MAGPIE_ENTITY.prototype._sense_for = function _sense_for(keyID, SENSE) {
  const contexts = this._get_contexts();
  if (contexts.length < 1) return false;
  const local = MAGPIE.KEY.CONTEXT.LOCAL;
  return contexts.find(
    (context) =>
      context.type === local && context.keys.includes(keyID === keyID),
  );
};
/**
 *
 * @returns {MAGPIE_CONTEXT[]}
 */
MAGPIE_ENTITY.prototype._get_contexts = function getContexts() {
  return MAGPIE_ENTITY.__hiveSync("_fetch_entity_context", [this.ID]);
};
// #endregion
//------------------------------------------------------------------------
/**
 * @name
 * @desc
 *
 */
//------------------------------------------------------------------------
// #region >
//------------------------------------------------------------------------

// #endregion
//------------------------------------------------------------------------
/**
 * @name
 * @desc
 *
 */
//------------------------------------------------------------------------
// #region > schedule
//------------------------------------------------------------------------
/**
 * @todo update _emote_schedule key handling to 0.23.0
 * @param {MAGPIE_EXP} exp
 * @returns
 */
MAGPIE_ENTITY.prototype._emote_schedule = function _emote_schedule(exp) {
  const ePrefix = `[ENTITY-${this.ID}].schedule: `;
  try {
    const keys = exp.getKeys();
    const trigger = keys.find((key) => key.type === MAGPIE.KEY.TYPE.TRIGGER);
    if (!trigger) return;
    const triggered = Date.now() > trigger.ID;
    MAGPIE_SYSTEM._logging_debug(triggered);
    if (!triggered) return;
    exp._key_remove(MAGPIE.KEY.EMOTE.INDEX.SCHEDULE);
    const result = trigger._set_type(MAGPIE.KEY.TYPE.EMOTE);
  } catch (e) {
    MAGPIE_SYSTEM.error(ePrefix + e.message, e);
  } finally {
    return { At: [0, 0, 0], Tt: [0, 0, 0] };
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
// #region - KEYS
//========================================================================
/**
 * @name
 * @desc
 *
 */
//------------------------------------------------------------------------
// #region > Utilities
//------------------------------------------------------------------------
/**
 *
 * @param {MAGPIE_EXP} exp
 * @param {Number} keyIndex
 * @returns {keyID}
 */
MAGPIE_ENTITY.prototype._exp_keyPluck = function expKeyPluck(exp, keyIndex) {
  const key = exp.keys[keyIndex];
  exp.keys[keyIndex] = exp.keys[exp.keys.length - 1];
  exp.keys.pop();
  return key;
};
// #endregion
//------------------------------------------------------------------------
/**
 * @name
 * @desc
 *
 */
//------------------------------------------------------------------------
// #region > Setters
//------------------------------------------------------------------------
/**
 * 
 * @param {key_data} key_data
 * @returns {Promise<database_result>}
 */
MAGPIE_ENTITY.prototype._add_new_key = async function (key_data) {
  const ePrefix = `[ENTITY-${this.ID}] `;
  try {
    const context = this._get_contexts()[0];
    if(!(context instanceof MAGPIE_CONTEXT))
      throw new Error(`${context} is invalid MAGPIE_CONTEXT. `);
    const key = await context._add_new_key(key_data);
    if(!key)
      throw new Error(`unable to create key. `)
    const exp = this._get_exps()[0];
    if(!(exp instanceof MAGPIE_EXP))
      throw new Error(`${exp} is invalid MAGPIE_EXP `)
    exp.keys.push(key.ID);
    await exp.set()
    return key
  } catch(e) {
    MAGPIE_SYSTEM.error(ePrefix + e.message, e)
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
// #region > Getters
//------------------------------------------------------------------------
/**
 *
 * @param {Number} keyID
 * @returns {MAGPIE_KEY}
 */
MAGPIE_ENTITY._get_key = function getKey(keyID) {
  return MAGPIE_ENTITY.__hiveSync("_get_key", [keyID]);
};
// #endregion
//------------------------------------------------------------------------
/**
 * @name
 * @desc
 *
 */
//------------------------------------------------------------------------
// #region > Marker
//------------------------------------------------------------------------
/**
 *
 * @returns {coords[]}
 */
MAGPIE_ENTITY.prototype._marker_get_queue = function _marker_get_queue() {
  const K = MAGPIE.KEY.INDEX;
  return this._get_exps()
    .map((exp) => exp.getKeys())
    .flat(Infinity)
    .flatMap((key) => {
      if (key.type === K.MARKER)
        return [key._marker_getLabel()];
      return [];
    });
};
/**
 * @typedef {{
 * leg: Number,
 * coords: coords,
 * course: heading,
 * distance: distance
 * }} marker_route
 * @returns {marker_route}
 */
MAGPIE_ENTITY.prototype._marker_queue_geodetic = function () {
  const queue = this._marker_get_queue();
  const route = new Map();
  for (let i = 0; i < queue.length; i++) {
    const r = this._get_celestial()._get_radius();
    const P0 = MAGPIE_PHYSICS.geodeticToCartesian(queue[i]);
    const P1 = MAGPIE_PHYSICS.geodeticToCartesian(queue[i + 1]);
    const course = P1 ? MAGPIE_PHYSICS._geod_getCourse(P0, P1) : undefined;
    const distance = P1
      ? MAGPIE_PHYSICS._geod_distanceTo(P0, P1, r)
      : undefined;
    route.set(i + 1, {
      leg: i + 1,
      coords: queue[i],
      course: Math.floow(course),
      distance: Math.floow(distance),
    });
  }
};
/**
 *
 * @param {coords} coords
 * @returns {database_result}
 */
MAGPIE_ENTITY.prototype._marker_setTarget = function _marker_setTarget(coords) {
  const ePrefix = `[ENTITY-${this.ID}].markerSetTarget: `;
  try {
    if (!MAGPIE_PHYSICS.isValidCoords(coords))
      throw new Error(`${coords} is invalid coords`);
    const target = this._get_target();
    if (!(target instanceof MAGPIE_ENTITY))
      throw new Error(`${target} is invalid target`);
    target._set_C1(coords);
    return target.setSync();
  } catch (e) {
    MAGPIE_SYSTEM.error(ePrefix + e.message, e);
  }
};
/**
 *
 * @param {coords} coords
 * @param {keyID}
 */
MAGPIE_ENTITY.prototype._marker_add = async function entityAddMarker(coords) {
  const ePrefix = `[ENTITY-${this.ID}]._marker_add: `;
  try {
    if (!MAGPIE_PHYSICS.isValidCoords(coords))
      throw new Error(`${coords} is invalid coords. `);
    const exp = this._get_exps()[0];
    if (!(exp instanceof MAGPIE_EXP))
      throw new Error(`${exp} is invalid exp. `);
    const key = new MAGPIE_KEY({
      type: MAGPIE.KEY.INDEX.MARKER,
      label: String(coords),
    });
    await key.set();
    exp.keys.push(key.ID);
    await exp.set();
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
 * @typedef {staminaIndex}
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
// #region > Handling
//------------------------------------------------------------------------
/**
 * @returns {stateID}
 */
MAGPIE_ENTITY.prototype._get_Rstate = function getRstate() {
  const states = this._get_states();
  const Rstates = MAGPIE_STATE.TYPE.get(STATE.TYPE.FSM_POSTURE);
  Rstates.forEach((n) => {
    if (states.includes(n)) return n;
  });
};
/**
 *
 * @param {stamina_index} stamina_index
 * @returns {Boolean}
 */
MAGPIE_ENTITY.prototype.addState = function addState(stamina_index) {
  const ePrefix = `[ENTITY-${this.ID}].addState: `;
  try {
    if (!this.isValidStamina(stamina_index))
      throw new Error(`${stamina_index} is invalid STA index (0-9)`);
    const stateID = this._trait_getStateID(this._get_stamina(stamina_index));
    const slot = this.fitness[index];
    if (slot)
      throw new Error(`fitness[${index}] is occupied by [STATE-${slot}]`);
    this.fitness[index] = stateID;
    return true;
  } catch (e) {
    MAGPIE_SYSTEM.error(ePrefix + e.message, e);
  }
};
/**
 *
 * @param {stamina_index} stamina_index
 * @returns {Boolean}
 */
MAGPIE_ENTITY.prototype.removeState = function removeState(stamina_index) {
  const ePrefix = `[ENTITY-${this.ID}].removeState: `;
  try {
    if (!this.isValidStamina(stamina_index))
      throw new Error(`${stamina_index} is invalid STA index`);
    const slot = this.fitness[index];
    if (isNaN(slot)) throw new Error(`fitness[${index}] is already empty`);
    this.fitness[index] = NaN;
    return true;
  } catch (e) {
    MAGPIE_SYSTEM.error(ePrefix + e.message, e);
  }
};
/**
 *
 * @param {fitness_index} fitness_index
 * @param {stateID} stateID
 * @returns {Boolean}
 */
MAGPIE_ENTITY.prototype.switchState = function switchState(
  fitness_index,
  stateID,
) {
  const ePrefix = `[ENTITY-${this.ID}].switchState: `;
  try {
    const state = MAGPIE_STATE.INDEX.get(stateID);
    if (!(state instanceof MAGPIE_STATE))
      throw new Error(`[STATE-${stateID}] is invalid MAGPIE_STATE`);
    if (
      isNaN(fitness_index) ||
      fitness_index < 0 ||
      fitness_index >= this.fitness.length
    )
      throw new Error(`${fitness_index} is invalid fitness_index`);
    const current = this.fitness[fitness_index];
    if (!(MAGPIE_STATE.INDEX.get(current) instanceof MAGPIE_STATE))
      throw new Error(`this.fitness[${current}] is invalid state`);
    if (current === stateID) return current;
    this.fitness[fitness_index] = stateID;
    MAGPIE_SYSTEM.logging.log_exp(`${ePrefix}to [STATE-${stateID}]. `);
    return stateID;
  } catch (e) {
    MAGPIE_SYSTEM.error(ePrefix + e.message, e);
  }
};
/**
 *
 * @param {symbolID} traitID
 * @returns {stateID}
 */
MAGPIE_ENTITY.prototype._trait_getStateID = function getStateIDfromTrait(
  traitID,
) {
  const trait = this._trait_get(traitID);
  if (!trait) return;
  const stateID = trait._get_keyID(MAGPIE.KEY.TYPE.STATE);
  if (isNaN(stateID)) throw new Error(`${stateID} is invalid state.ID`);
  return stateID;
};
/**
 *
 * @param {symbolID} traitID
 * @returns {MAGPIE_SYMBOL}
 */
MAGPIE_ENTITY.prototype._trait_get = function getTraitByID(traitID) {
  const ePrefix = `[ENTITY-${this.ID}].getTraitByID: `;
  try {
    const traits = this._get_traits();
    if (!traits) return;
    const trait = traits.find((trait) => trait.ID === traitID);
    if (!(trait instanceof MAGPIE_SYMBOL))
      throw new Error(`has not [TRAIT-${traitID}]`);
    return trait;
  } catch (e) {
    MAGPIE_SYSTEM.error(ePrefix + e.message, e);
    return null;
  }
};
/**
 *
 * @param {index} index
 * @returns {symbolID}
 */
MAGPIE_ENTITY.prototype._get_stamina = function _get_stamina(index) {
  const K = MAGPIE.KEY.FITNESS;
  const offset = K.TRAITS + K.DECKSIZE * K.STAMINA;
  const traitID = this.fitness[offset + index];
  if (isNaN(traitID))
    throw new Error(
      `${traitID} at [FITNESS-${offset + index}] is invalid traitID`,
    );
  return traitID;
};

/**
 *
 * @param {stamina_index} index
 * @returns {Boolean}
 */
MAGPIE_ENTITY.prototype.isValidStamina = function isValidStamina(index) {
  !isNaN(index) && index > 0 && index < 10;
};
// #endregion
//------------------------------------------------------------------------
/**
 * @name
 * @desc
 *
 */
//------------------------------------------------------------------------
// #region > Injury
//------------------------------------------------------------------------
/**
 *
 * @param {stateID} injuryID
 * @returns {fitness_index}
 */
MAGPIE_ENTITY.prototype.addInjury = function addInjury(injuryID) {
  const ePrefix = `[ENTITY-${this.ID}].addInjury: `;
  try {
    const injury = MAGPIE_STATE.INDEX.get(injuryID);
    if (!injury || injury.type !== STATE.TYPE.ACCUMULATOR_INJURY)
      throw new Error(`${injuryID} is invalid injury state`);
    const fitness_index = this._fitness_draw();
    const injury_index = this._fitness_offset(
      fitness_index,
      MAGPIE.KEY.FITNESS.INJURY,
    );
    this.fitness[injury_index] = injuryID;
    const output = injury.onApply(exp, this, fitness_index);
    if (!output) {
      this.selfKick("state apply error");
      throw new Error(
        `${output} is invalid [INJURY-${injuryID}].onApply output`,
      );
    }
    return fitness_index;
  } catch (e) {
    MAGPIE_SYSTEM.error(ePrefix + e.message, e);
  }
};
/**
 *
 * @param {stateID} injuryID
 * @returns {fitness_index}
 */
MAGPIE_ENTITY.prototype.healInjury = function healInjury(injuryID) {
  const ePrefix = `[ENTITY-${this.ID}].healInjury: `;
  try {
    const injury = MAGPIE_STATE.INDEX.get(injuryID);
    if (!injury || injury.type !== STATE.TYPE.ACCUMULATOR_INJURY)
      throw new Error(`${injuryID} is invalid injury state`);
    const K = MAGPIE.KEY.FITNESS;
    const index = this.fitness.indexOf((ID) => ID === injuryID);
    const fitness_index = this._trait_offset(index, K.INJURY);
    if (!fitness_index)
      throw new Error(`${fitness_index} is invalid fitness_index`);
    this.fitness[index] = 0;
    const output = injury.onRemove(exp, this, fitness_index);
    if (!output)
      throw new Error(
        `${output} is invalid [INJURY-${injuryID}].onRemove output`,
      );
    return fitness_index;
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
// #region - EXP
//========================================================================
MAGPIE_ENTITY.exp = {};
/**
 * @name
 * @desc
 *
 */
//------------------------------------------------------------------------
// #region > getters
//------------------------------------------------------------------------
/**
 *
 * @returns {MAGPIE_EXP[]}
 */
MAGPIE_ENTITY.prototype._get_exps = function _get_exps() {
  // const exps = this._get_array_expID();
  // if(exps.length < 1) return []
  // let list = [];
  // for(const expID of exps)
  // {
  // 	const exp = MAGPIE_ENTITY._hive_getExp(expID);
  // 	if(exp instanceof MAGPIE_EXP)
  // 		list.push(exp)
  // }
  // return list
  return this._get_array_expID().reduce((list, expID) => {
    const exp = MAGPIE_ENTITY._hive_getExp(expID);
    if (exp instanceof MAGPIE_EXP) list.push(exp);
    return list;
  }, []);
};
/**
 *
 * @param {Number} expID
 * @returns {MAGPIE_ENTITY}
 */
MAGPIE_ENTITY.prototype._get_exp_target = function _get_exp_target(expID) {
  const exp = MAGPIE_ENTITY._hive_getExp(expID);
  const targetID =
    typeof exp.targetID === "number"
      ? exp.targetID
      : exp.targetID[MAGPIE.KEY.POVART.E_ID];
  return MAGPIE_ENTITY.__hiveSync("_get_entitySync", [targetID]);
};
/**
 *
 * @returns {MAGPIE_ENTITY}
 */
MAGPIE_ENTITY.prototype._get_target = function _get_target() {
  if (this.exps.length < 1) return null;
  return MAGPIE_ENTITY.__hiveSync("_get_entity", [
    this._get_exps()[0]?.targetID,
  ]);
};
/**
 * @returns {new MAGPIE_ENTITY}
 */
MAGPIE_ENTITY.prototype._new_target = function entityNewTarget() {
  const ePrefix = `[ENTITY-${this.ID}] `;
  try {
    const spareType = MAGPIE.KEY.TYPE.SPAREKEY;
    const sparekey = this._get_exps()[0].getKeys()
      .find(key => key.type === spareType && key._get_entity_label());
    const spareTarget = sparekey ? sparekey._get_entity_label() : null;
    const target = spareTarget || new MAGPIE_ENTITY()
    if(!(target instanceof MAGPIE_ENTITY))
      throw new Error(`${target} is invalid MAGPIE_ENTITY. `);
    target.name = `${ePrefix}[TARGET]`;
    target.type = MAGPIE.KEY.SYMBOL.TYPE.MARKER;
    const S = MAGPIE.KEY.STATS;
    const P = MAGPIE.KEY.POVART;
    target.STATS = new Float64Array(S.ARRAY);
    target.STATS[P.P_C] = this.STATS[P.P_C];
    target.STATS[P.E_ID] = target.ID;
    target.STATS[S.HOST] = target.STATS[P.P_C];
    target._set_P1(this._get_P0());
    const context = this._get_contexts()[0];
    const standardLayer = 3
    MAGPIE_ENTITY.__hiveSync("host", [target, standardLayer, standardLayer, context.ID])
    context._set_entity(target.ID)
    target.setSync()
    this._get_exps()[0].targetID = target.ID;
    MAGPIE_SYSTEM._logging_debug(`new target: ${target.ID}`)
    return target
  } catch(e) {
    MAGPIE_SYSTEM.error(ePrefix + e.message, e)
  }
}
// #endregion
//------------------------------------------------------------------------
/**
 * @name
 * @desc
 *
 */
//------------------------------------------------------------------------
// #region > setters
//------------------------------------------------------------------------
/**
 *
 * @param {Number} expID
 * @param {Number} targetID
 * @returns {database_result}
 */
MAGPIE_ENTITY.prototype._set_exp_targetID = function _set_exp_targetID(
  expID,
  targetID,
) {
  const exp = MAGPIE_ENTITY._hive_getExp(expID);
  if (typeof exp.targetID === "number") exp.targetID = targetID;
  else exp.targetID[MAGPIE.KEY.POVART.E_ID] = targetID;
  return MAGPIE_ENTITY._hive_setExpSync(exp);
};
/**
 *
 * @param {Number} expID
 * @param {Number} value
 * @returns {database_result}
 */
MAGPIE_ENTITY.prototype._set_exp_value = function _set_exp_value(expID, value) {
  const exp = MAGPIE_ENTITY._hive_getExp(expID);
  exp.value = Number(value);
  return MAGPIE_ENTITY._hive_setExpSync(exp);
};
// #endregion
//------------------------------------------------------------------------
/**
 *
 * @desc back to {@link MAGPIE_ENTITY.exp}
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
// #region - PHYSICS
//========================================================================
/**
 *
 * @param {distance} meters
 * @returns {coords}
 */
MAGPIE_ENTITY.prototype._set_ASL = function setASL(meters) {
  if (!meters || isNaN(meters)) return;
  const [lat, lon, ASL] = this._get_C0();
  const P1 = this._set_C1([lat, lon, meters]);
  if (P1) return [lat, lon, ASL];
};
/**
 * 
 * @param {duration} seconds 
 * @returns {vector3}
 */
MAGPIE_ENTITY.prototype._U_advanceTime = function(seconds) {
  const ePrefix = `[ENTITY-${this.ID}].advanceTime: `;
  try {
    const V1 = MAGPIE_PHYSICS.scaleVector(this._get_V0(), seconds);
    return this._set_P1(MAGPIE_PHYSICS.addVectors(this._get_P0(), V1))
  } catch(e) {
    MAGPIE_SYSTEM.error(ePrefix + e.message, e)
  }
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
 *
 */
//========================================================================
// #region - CELESTIAL
//========================================================================
/**
 * @name
 * @desc
 *
 */
//------------------------------------------------------------------------
// #region > Set
//------------------------------------------------------------------------
/**
 *
 * @param {entityID} celestialID
 * @returns {entityID}
 */
MAGPIE_ENTITY.prototype._set_celestial = function (celestialID) {
  if (!Number(celestialID)) return;
  return (this.STATS[MAGPIE.KEY.POVART.P_C] = celestialID);
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
// #region - TARGET
//========================================================================
/**
 * @name
 * @desc
 *
 */
//------------------------------------------------------------------------
// #region > Get
//------------------------------------------------------------------------
/**
 *
 * @param {vector3} P0
 * @param {vector3} Pt
 * @returns {distance}
 */
MAGPIE_ENTITY.prototype._target_getDistance = function getDistanceToTarget(
  P0,
  Pt,
) {
  return MAGPIE_PHYSICS.distanceTo(P0, Pt);
};
/**
 *
 * @returns {entityID}
 */
MAGPIE_ENTITY.prototype._target_get_queue = function getTargetQueue() {
  const K = MAGPIE.KEY.INDEX;
  return this._get_exps()
    .map((exp) => exp.getKeys())
    .flat(Infinity)
    .flatMap((key) => {
      if (key.type === K.TARGET) return [key._target_getLabel()];
      return [];
    });
};
/**
 *
 * @returns {Promise<MAGPIE_ENTITY[]>}
 */
MAGPIE_ENTITY.prototype._target_fetch_queue = async function () {
  return await this._target_get_queue().map((targetID) =>
    MAGPIE_ENTITY.__hiveSync("_get_entity", [targetID]),
  );
};
/**
 * @todo fix order of properties
 * (wp dist/eta should be TO, not FROM, or, include current target)
 * @typedef {{
 * leg: Number,
 * ID: entityID,
 * name: String,
 * coords: coords
 * course: heading,
 * distance: distance,
 * }} target_route
 * @param {{
 * ETE: Boolean,
 * Vcruise: velocity
 * }} options
 * @returns {target_route}
 */
MAGPIE_ENTITY.prototype._target_queue_geodetic = async function (options) {
  const ePrefix = `[ENTITY-${this.ID}].targetQueue: `;
  try {
    const queue = await this._target_fetch_queue();
    const route = new Map();
    let totDist = 0;
    for (let i = 0; i < queue.length; i++) {
      const P0 = queue[i]._get_P0();
      const P1 = queue[i + 1]?._get_P0();
      const r = queue[i]._get_celestial()._get_radius();
      const course = P1 ? MAGPIE_PHYSICS._geod_getCourse(P0, P1) : undefined;
      const distance = P1
        ? MAGPIE_PHYSICS._geod_distanceTo(P0, P1, r)
        : undefined;
      const contents = {};
      contents.leg = i + 1;
      contents.ID = queue[i]?.ID;
      contents.name = queue[i]?.name;
      contents.coords = queue[i]?._get_C0();
      contents.course = Math.floor(course);
      contents.distance = MAGPIE_PHYSICS._U_printDistance(distance);
      if (options?.Vcruise) contents.Vcruise = options.Vcruise;
      if (options?.ETE && options?.Vcruise)
        contents.ETE = MAGPIE_PHYSICS._U_ETE(distance, options.Vcruise);
      route.set(i + 1, contents);
      totDist += distance ? distance : 0;
    }
    const final = {};
    final.Tdist = MAGPIE_PHYSICS._U_printDistance(totDist);
    if (options?.Vcruise)
      final.TTE = MAGPIE_PHYSICS._U_ETE(totDist, options.Vcruise);
    route.set(queue.length + 1, final);
    return route;
  } catch (e) {
    MAGPIE_SYSTEM.error(ePrefix + e.message, e);
  }
};
/**
 * @desc [key routes](https://github.com/Hastral-org/MAGPIE_Server/issues/210)
 * @param {{}} options 
 * @returns {String[]}
 */
MAGPIE_ENTITY.prototype._target_route = function(options) {
  const ePrefix = "[ENTITY]._target_route: ";
  try {
    const target = this._get_target();
    const exp = this._get_exps()[0];
    const key = exp.getKeys().find(key => key.type === MAGPIE.KEY.INDEX.ROUTE);
    const route = key ? MAGPIE_SYSTEM.Parsing.json(key.label)[1] : [];
    const plan = [];
    const P0 = this._get_P0();
    const r = this._get_celestial()._get_radius();
    const getDistCourse = (C1, C0) => {
      if(!C0) C0 = this._get_C0();
      const DP0 = MAGPIE_PHYSICS.geodeticToCartesian(C0);
      const DP1 = MAGPIE_PHYSICS.geodeticToCartesian(C1);
      const dist = Math.floor(MAGPIE_PHYSICS._geod_distanceTo(DP0, DP1, r));
      const course = MAGPIE_PHYSICS._geod_getCourse(DP0, DP1, r)
      return { dist, course }
    }
    let totDist = 0;
    let totTime = 0;
    const push = (raw, prevCoords) => {
      if(!prevCoords) prevCoords = this._get_C0();
      const coords = [raw[0], raw[1], raw[2]];
      const speed = Number(raw[3]) || MAGPIE_PHYSICS.mag(this._get_V0());
      const { dist, course } = getDistCourse(coords, prevCoords)
      const distance = coords && prevCoords ? dist : 0;
      totDist += distance;
      totTime += (distance / speed);
      const epoch = this.updated + totTime * 1000;
      const date = new MAGPIE_DATE({epoch: epoch})
      const wp = {
        coords: coords,
        distance: distance,
        course: course,
        speed: speed.toFixed(2) + " m/s",
        ETE: MAGPIE_PHYSICS._U_ETE(distance, speed),
        ETA: date.printDate()
      }
      plan.push(wp);
      return coords
    };
    route.unshift(target._get_C0());
    for(let i = 0; i < route.length; i++) {
      push(route[i], route[i - 1])
    }
    const P1 = MAGPIE_PHYSICS.geodeticToCartesian(route.at(-1)?.slice(0,3))
    const epoch = this.updated + totTime * 1000;
    const date = new MAGPIE_DATE({epoch: epoch});
    plan.push({
      legs: plan.length,
      GCdistance: P0 && P1 ? MAGPIE_PHYSICS._geod_distanceTo(P0, P1, r) : 0,
      DTG: MAGPIE_PHYSICS._U_printDistance(totDist),
      ETR: MAGPIE_SYSTEM.Utility.printETA(totTime),
      ETA: date.printDate(),
    })
    return plan
  } catch(e) {
    MAGPIE_SYSTEM.error(ePrefix + e.message, e)
  }
}
// #endregion
//------------------------------------------------------------------------
/**
 * @name
 * @desc
 *
 */
//------------------------------------------------------------------------
// #region > Check
//------------------------------------------------------------------------
/**
 * @todo entity.targetIsSensed
 * @param {MAGPIE_ENTITY} target
 * @param {distance} dist
 * @returns {Boolean}
 */
MAGPIE_ENTITY.prototype._target_isSensed = function (target,dist) {
  return true;
};
// #endregion
//------------------------------------------------------------------------
/**
 * @name
 * @desc
 *
 */
//------------------------------------------------------------------------
// #region > Set
//------------------------------------------------------------------------
/**
 *
 * @param {MAGPIE_ENTITY} target
 * @param {MAGPIE_EXP} exp
 * @returns {entityID}
 */
MAGPIE_ENTITY.prototype._set_target = async function _set_target(target, exp) {
  const ePrefix = `[ENTITY-${this.ID}].setTarget: `;
  try {
  } catch (e) {
    MAGPIE_SYSTEM.error(ePrefix + e.message, e);
  }
};
/**
 *
 * @returns {entityID}
 */
MAGPIE_ENTITY.prototype._target_next = function nextTarget() {
  const ePrefix = `[ENTITY-${this.ID}].nextTarget: `;
  try {
    /** @type {MAGPIE_EXP} */
    const exp = this._get_exps()[0];
    if (!this.isValidExp(exp)) return false; 
    const next = exp._target_next(this);
    if (!next) return false;
    const target = this._get_target();
    if (!target) throw new Error(`unable to set [TARGET-${next}]`);
    const oldOptions = exp._key_findWPoptions();
    if (oldOptions) oldOptions.type = MAGPIE.KEY.TYPE.SPAREKEY;
    const log = `[ENTITY-${next}]`;
    MAGPIE_SYSTEM.logging.log_exp(ePrefix + log);
    return next;
  } catch (e) {
    MAGPIE_SYSTEM.error(ePrefix + e.message, e);
    this.selfKick("failed update");
  }
};
/**
 *
 * @param {MAGPIE_EXP} exp
 * @returns {index}
 */
MAGPIE_ENTITY.prototype._get_expIndex = function _get_expIndex(exp) {
  return this.exps.findIndex((expID) => expID === exp.ID);
};
/**
 *
 * @param {MAGPIE_EXP} exp
 * @returns {Boolean}
 */
MAGPIE_ENTITY.prototype.isValidExp = function isValidExp(exp) {
  return exp instanceof MAGPIE_EXP;
};
/**
 *
 * @param {MAGPIE_EXP} exp
 * @returns {Boolean}
 */
MAGPIE_ENTITY.prototype._exp_swapWith = function _exp_swapWith(index, exp) {
  const ePrefix = `[ENTITY-${this.ID}].expSwapWith: `;
  try {
    if (index === 0) return true;
    const entry = this.exps[index];
    if (isNaN(entry))
      throw new Error(
        `unable to swap [EXP-${exp.ID}] with [EXP-${this.exps[0]}]`,
      );
    this.exps[index] = this.exps[0];
    this.exps[0] = exp.ID;
    return true;
  } catch (e) {
    MAGPIE_SYSTEM.error(ePrefix + e.message, e);
    return false;
  }
};
MAGPIE_ENTITY.prototype._target_setWp = function (keyIndex, wpName, coords) {
  const ePrefix = `[ENTITY-${this.ID}].targetSetWp: `;
  try {
    if (
      !keyIndex ||
      typeof wpName !== "string" ||
      !MAGPIE_PHYSICS.isValidCoords(coords)
    )
      return;
    const exp = this._get_exps()[0];
    const key = exp.getKeys()[keyIndex];
    if (!key) return;
    const WP = key._get_entity_label();
    WP.name = wpName;
    WP._set_C1(coords);
    key.type = MAGPIE.KEY.INDEX.WAYPOINT;
    MAGPIE_SYSTEM.logging.log_exp(
      ePrefix +
        `setting [KEY-#${keyIndex}][WP-${WP.ID} | ${WP.name}] ` +
        `to [COORDS-${coords[0]}, ${coords[1]}]}`,
    );
  } catch (e) {
    MAGPIE_SYSTEM.error(ePrefix + e.message, e);
  }
};
MAGPIE_ENTITY.prototype._coords_clearQueue = function() {
  const ePrefix = `[ENTITY-${this.ID}].coordsClearQueue: `
  try {
    const exp = this._get_exps()[0];
    const keys = exp.getKeys().filter(key => key.type === MAGPIE.KEY.TYPE.WAYPOINT)
    for(const key of keys) 
      key.type = MAGPIE.KEY.TYPE.SPAREKEY;
  } catch(e) {
    MAGPIE_SYSTEM.error(ePrefix + e.message, e)
  }
}
/**
 * 
 * @param {String} filename 
 */
MAGPIE_ENTITY.prototype._import_route = async function(filename) {
  const ePrefix = `[ENTITY-${this.ID}] `;
  try {
    const source = MAGPIE_SYSTEM.Utility._import_route(filename);
    if(!source) return false
    const exp = this._get_exps()[0];
    const type = MAGPIE.KEY.INDEX.WAYPOINT;
    const keys = exp.getKeys().filter(key => key.type === type);
    const coords = source.coords;
    for(let i = 0; i < coords.length; i++) {
      const key = keys[i] || await this._add_new_key({
        type: type, 
        label: JSON.stringify(coords[i])
      })
    }
    const metakeyType = MAGPIE.KEY.INDEX.ROUTE;
    const metakey = await this._add_new_key({
      type: metakeyType,
      label: JSON.stringify(source)
    })
    return true
  } catch(e) {
    MAGPIE_SYSTEM.error(ePrefix + e.message, e)
  }
}
// #endregion
//------------------------------------------------------------------------
/**
 * @name
 * @desc
 *
 */
//------------------------------------------------------------------------
// #region > Helpers
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
 * @typedef {Number} fertility
 */
//========================================================================
// #region - SPECIES
//========================================================================
/**
 * 
 * @returns {fertility}
 */
MAGPIE_ENTITY.prototype._get_fertility = function() {
  return this.STATS[MAGPIE.KEY.STATS.MASSKG]
}
/**
 * 
 * @param {Number} amount
 * @returns {fertility} 
 */
MAGPIE_ENTITY.prototype._set_fertility = function(amount) {
  return this.STATS[MAGPIE.KEY.STATS.MASSKG] = amount
}
/**
 * 
 * @param {symbolID} symbolID 
 * @returns {MAGPIE_SYMBOL}
 */
MAGPIE_ENTITY.prototype._get_symbol = function(symbolID) {
  return MAGPIE_ENTITY.__hiveSync("_get_symbol", [symbolID])
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
 *
 */
//========================================================================
// #region - BIO
//========================================================================
/**
 * @name
 * @desc
 *
 */
//------------------------------------------------------------------------
// #region > NewDay
//------------------------------------------------------------------------
/**
 *
 * @param {MAGPIE_EXP} exp
 * @param {fitness_index} fitness_index
 */
MAGPIE_ENTITY.prototype._switch_newDay = function newDay(exp, fitness_index) {
  this.addInjury(STATE.INDEX.HUNGER);
};
// #endregion
//------------------------------------------------------------------------
/**
 * @name
 * @desc
 *
 */
//------------------------------------------------------------------------
// #region > Metabolism
//------------------------------------------------------------------------
/**
 *
 * @returns
 */
MAGPIE_ENTITY.prototype._bio_metabolism = function metabolism() {
  const ePrefix = `[ENTITY-${this.ID}].metabolism: `;
  try {
    const fat = this._get_fatLevel();
    if (!fat) return;
    this._bio_recover();
  } catch (e) {
    MAGPIE_SYSTEM.error(ePrefix + e.message, e);
  }
};
/**
 *
 *
 */
MAGPIE_ENTITY.prototype._bio_recover = function recover() {
  if (!this._consume_FAT(1)) return;
  this.healInjury(STATE.INDEX.HUNGER);
};
/**
 * @param {Number} amount
 */
MAGPIE_ENTITY.prototype._consume_FAT = function _consume_FAT(amount) {
  const index = this.fitness.indexOf((ID) => ID === STATE.INDEX.FAT);
  if (!this.fitness[index]) return false;
  this.fitness[index] = 0;
  return true;
};
/**
 * @typedef {Number} NRG standardized energy coefficient
 * @returns {NRG}
 */
MAGPIE_ENTITY.prototype._get_NRG = function getNRG() {
  //@todo get NRG
};
/**
 *
 * @returns {NRG}
 */
MAGPIE_ENTITY.prototype._get_diet = function getDiet() {
  const mass = this._get_MASS();
  const pwr = this._get_PWR();
  const dex = this._get_DEX();
  const sen = this._get_SEN();
  const endurance = this._get_END();
  const diet = (mass + pwr + dex + sen) * endurance;
  return diet;
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
// #region - AGENCY
//========================================================================
/**
 * @name INSTINCT
 * @desc
 *
 */
//------------------------------------------------------------------------
// #region > S1
//------------------------------------------------------------------------
/**
 *
 * @param {Number} switchID
 * @param {duration} dt
 * @param {MAGPIE_EXP} exp
 * @param {MAGPIE_KEY[]} keys
 * @returns {MAGPIE_EXP}
 */
MAGPIE_ENTITY.prototype.processS1 = function processS1(
  switchID,
  dt,
  exp,
  keys,
) {
  const ePrefix = `[ENTITY-${this.ID}].processS1: `;
  try {
    return exp;
  } catch (e) {
    MAGPIE_SYSTEM.error(ePrefix + e.message, e);
  }
};
// #endregion
//------------------------------------------------------------------------
/**
 * @name IMPULSE
 * @desc
 *
 */
//------------------------------------------------------------------------
// #region > S2
//------------------------------------------------------------------------
/**
 *
 * @param {Number} switchID
 * @param {MAGPIE_EXP} exp
 * @param {MAGPIE_KEY[]} keys
 * @returns {MAGPIE_EXP}
 */
MAGPIE_ENTITY.prototype.processS2 = function processS2(switchID, exp, keys) {
  const ePrefix = `[ENTITY-${this.ID}].processS2: `;
  try {
    return exp;
  } catch (e) {
    MAGPIE_SYSTEM.error(ePrefix + e.message, e);
  }
};
// #endregion
//------------------------------------------------------------------------
/**
 * @name CONSCIENCE
 * @desc
 *
 */
//------------------------------------------------------------------------
// #region > S3
//------------------------------------------------------------------------
/**
 *
 * @param {Number} switchID
 * @param {MAGPIE_EXP} exp1
 * @param {MAGPIE_EXP} exp2
 * @param {MAGPIE_KEY[]} keys
 */
MAGPIE_ENTITY.prototype.processS3 = function processS3(
  switchID,
  exp1,
  exp2,
  keys,
) {
  const ePrefix = `[ENTITY-${this.ID}].processS3: `;
  try {
    //
  } catch (e) {
    MAGPIE_SYSTEM.error(ePrefix + e.message, e);
  }
};
// #endregion
//------------------------------------------------------------------------
/**
 * @name AFFINITY
 * @desc
 *
 */
//------------------------------------------------------------------------
// #region > S4
//------------------------------------------------------------------------

// #endregion
//------------------------------------------------------------------------
/**
 * @name HARMONY
 * @desc
 *
 */
//------------------------------------------------------------------------
// #region > S5
//------------------------------------------------------------------------

// #endregion
//------------------------------------------------------------------------
/**
 * @name TELEPATHY
 * @desc
 *
 */
//------------------------------------------------------------------------
// #region > S6
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
// #region - TERRITORY
//========================================================================
/**
 *
 * @returns {entityID}
 */
MAGPIE_ENTITY.prototype._territory_explore = function exploreTerritory() {
  const guests = this._get_guestsSync();
  const index = Math.floor(Math.random() * guests.length);
  const ID = guests[index]?.ID;
  if (ID) return ID;
  return this.ID;
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
// #region - GROUP
//========================================================================
/**
 * @name 
 * @desc 
 * @typedef {{
 * ID: entityID,
 * name: String,
 * members: entityID[]
 * }} group_data
 */
//------------------------------------------------------------------------
// #region > creation
//------------------------------------------------------------------------
/**
 * 
 * @param {group_data} data 
 */
MAGPIE_ENTITY._group_form = async function(data) {
  const ePrefix = "[ENTITY] [group_form] "
  try {
    if(!data) data = {};
    if(!data?.members || !Array.isArray(data.members)) data.members = []
    const group = new MAGPIE_ENTITY({
      ID: Number(data?.ID),
      name: String(data?.name),
      fitness: data.members
    });
    const firstSave = await group.set();
    if(!firstSave) throw new Error("unable to create group entity. "); 
    //@todo group.addMember db transaction
    for(const memberID of data.members) {
      try {
        const result = await group._group_addMember(memberID)
        if(!result) throw new Error(`unable to set member relation with [ENTITY-${memberID}] `)
      } catch(e) {
        MAGPIE_SYSTEM.sysLog(ePrefix + e.message, "error", e)
      }
    }
  } catch(e) {
    MAGPIE_SYSTEM.error(ePrefix + e.message, e)
  }
}
/**
 * 
 * @param {entityID} entityID 
 * @returns {Promise<fitness_index>}
 */
MAGPIE_ENTITY.prototype._group_addMember = async function(entityID) {
  // const arr = Array.from(this.fitness);
  if(!entityID) return false
  const payload = [
    "entity_equips",
    {
      entityID: this.ID,
      equipID: entityID,
    },
  ];
  const result = await MAGPIE_ENTITY._set_relation(payload)
  if(!result) return false
  const deckSize = this._trait_add(entityID);
  if(!deckSize) return false
  return deckSize + MAGPIE.KEY.FITNESS.TRAITS;
}
/**
 * 
 * @param {index} index 
 * @returns {entityID}
 */
MAGPIE_ENTITY.prototype._group_removeMember = async function(index) {
  const ePrefix = `[GROUP-${this.ID}].removeMember: `;
  try {
    const entityID = this._get_traits()[index];
    if(!Number(entityID)) throw new Error(`${entityID} is invalid memberID. `)
    const payload = [
    "entity_equips",
    {
      entityID: this.ID,
      equipID: entityID,
    },
  ];
    const result = await MAGPIE_ENTITY._unset_relation(payload);
    if(!result) throw new Error(`unable to unset member relation with [MEMBER-${entityID}]. `)
  } catch(e) {
    MAGPIE_SYSTEM.error(ePrefix + e.message, e)
  }
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
module.exports = { MAGPIE_ENTITY };
/**
 *
 * @desc back to {@link }
 *
 */
//========================================================================
// END OF FILE
//========================================================================
