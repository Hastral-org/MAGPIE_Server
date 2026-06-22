/**
 * @name INDEX
 * @desc
 * @version 0.39.95
 */
//========================================================================
// #region - INDEX
//========================================================================
const { MAGPIE } = require("./index");
const { MAGPIE_SYSTEM, MAGPIE_DATE } = require("./system");
function MAGPIE_COMPONENT(data) {
  this.initialize(data);
}
function MAGPIE_STATE(data) {
  this.initialize(data);
}
/**
 * @class
 * @param {{
 * subject: entityID,
 * target: entityID,
 * emoteID: emoteID,
 * keys: keyID[]
 * }} data exp_data
 * @returns {new MAGPIE_EXP}
 */
function MAGPIE_EXP(data = {}) {
  this.initialize(data);
}
/**
 *
 * @param {{
 * ID: Number,
 * name: String,
 * type: Enumerator<Number>,
 * description,
 * condition: (...args) => Boolean,
 * onAction: Function,
 * onPassive: Function
 * }} data
 * @returns {new MAGPIE_EMOTE}
 */
function MAGPIE_EMOTE(data) {
  this.initialize(data);
}
/**
 *
 * @param {{
 * ID: contextID,
 * type: context_type,
 * updated: epoch_real,
 * entities: MAGPIE_ENTITY,
 * exps: MAGPIE_EXP[],
 * keys: MAGPIE_KEY[],
 * symbols: MAGPIE_SYMBOL[],
 * date: MAGPIE_DATE
 * }} data
 * @returns {new MAGPIE_CONTEXT}
 */
function MAGPIE_CONTEXT(data) {
  this.initialize(data);
}
/**
 * @desc Stores ticket_data data while in [SERVER.INBOX](../SERVER.js)
 * @param {ticket_data} ticket_data
 * @returns {new MAGPIE_TICKET}
 */
function MAGPIE_TICKET(ticket_data) {
  this.initialize(ticket_data);
}
/**
 *
 * @param {{
 * ID: keyID,
 * type: key_type,
 * label: key_label,
 * originID: keyID,
 * compoundID: keyID,
 * symbolID: symbolID
 * }} data
 * @returns {new MAGPIE_KEY}
 */
function MAGPIE_KEY(data) {
  this.initialize(data);
}
/**
 *
 * @param {{
 * ID: symbolID,
 * type: symbol_type,
 * name: String,
 * desc: String,
 * requirementID: symbolID,
 * compoundID: symbolID,
 * STATS: Float64Array
 * }} data
 * @returns {new MAGPIE_SYMBOL}
 */
function MAGPIE_SYMBOL(data) {
  this.initialize(data);
}
/**
 *
 */
class MAGPIE_ENGINE {
  //
}
class MAGPIE_PROPULSOR {
  //
}
class MAGPIE_POWERTRAIN {
  //
}
class MAGPIE_CONTAINER {
  //
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
 * @typedef {import("./system").database_result} database_result
 * @typedef {import("./index").index} index
 * @typedef {Number} array_size
 * @typedef {import("./index").stamina_index} stamina_index
 * @typedef {import("./index").vector3} vector3
 * @typedef {import("./index").bivector} bivector
 * @typedef {import("./physics").coords} coords
 * @typedef {import("./entity").action_output} action_output
 * @typedef {import("./physics").percentage} percentage
 *
 * @name COMPONENT
 * @desc
 *
 */
//========================================================================
// #region - COMPON.
//========================================================================
MAGPIE_COMPONENT.meta = {};
MAGPIE_COMPONENT.setup = function () {
  //
};
/**
 * @typedef {import("../data/components").component} component
 * @type {Map<String, component>}
 * */
MAGPIE_COMPONENT.INDEX = new Map();
/**
 * @name
 * @desc
 *
 */
//------------------------------------------------------------------------
// #region > proto
//------------------------------------------------------------------------
MAGPIE_COMPONENT.prototype.initialize = function initialize(data) {
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
 * @param {String} method
 * @param {*} value
 * @returns {MAGPIE_COMPONENT}
 */
MAGPIE_COMPONENT.__get = function get(method, value) {
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
// #region > Setters
//------------------------------------------------------------------------
/**
 *
 * @param {String} method
 * @param {*} value
 * @returns {Promise<database_result>}
 */
MAGPIE_COMPONENT.__set = async function set(method, value) {
  //
};
/**
 *
 * @param {String} method
 * @param {*} value
 * @returns {database_result}
 */
MAGPIE_COMPONENT.__setSync = function setSync(method, value) {
  //
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
// #region - SYMBOL
//========================================================================
MAGPIE_SYMBOL.meta = "";
/**
 * @name
 * @desc
 *
 */
//------------------------------------------------------------------------
// #region > Proto
//------------------------------------------------------------------------
/**
 * @typedef {Number} symbolID
 * @typedef {Number} symbol_type {@link MAGPIE.KEY.SYMBOL.TYPE.meta}
 * @typedef {import("./index").STAT} STAT aka static parameter
 * @typedef {import("./entity").STATS} STATS
 * @typedef {{ID: symbolID,
 * type: symbol_type,
 * name: String,
 * desc: String,
 * requirementID: symbolID,
 * compoundID: symbolID,
 * STATS: Float64Array
 * }} symbol_data
 * @param {symbol_data} data
 */
MAGPIE_SYMBOL.prototype.initialize = function initialize(data) {
  this._firmware = "MAGPIE_SYMBOL";
  this.ID = Number(data?.ID) || Date.now();
  this.type = Number(data?.type) || 0;
  this.name = String(data?.name) || "";
  this.desc = String(data?.desc) || "";
  const K = MAGPIE.KEY.INDEX;
  const reqs = K.REQUIREMENTS;
  const comps = K.COMPOUNDS;
  const stats = K.STATS;
  this.STATS = new Float64Array(data?.STATS || [reqs, comps, stats]);
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
 * @returns {String}
 */
MAGPIE_SYMBOL.prototype.getTypeName = function getTypeName() {
  return Object.keys(MAGPIE.KEY.SYMBOL.TYPE).find((key) => {
    key === MAGPIE.KEY.SYMBOL.TYPE[key];
  });
};
/**
 *
 * @param {keyID} keyID
 * @returns {MAGPIE_KEY}
 */
MAGPIE_SYMBOL.prototype.getKey = function getKey(keyID) {
  return MAGPIE_COMPONENT.__get("_get_key", [keyID]);
};
/**
 *
 * @returns {symbolID[]}
 */
MAGPIE_SYMBOL.prototype._get_requirementIDs = function () {
  const K = MAGPIE.KEY.INDEX;
  const array = Array.from(this.STATS);
  const start = array.indexOf(K.REQUIREMENTS);
  const end = array.indexOf(K.COMPOUNDS);
  return array.slice(start + 1, end) || [];
};
/**
 *
 * @returns {MAGPIE_SYMBOL[]}
 */
MAGPIE_SYMBOL.prototype._get_all_requirements = function () {
  const requirementIDs = this._get_requirementIDs();
  if (requirementIDs.length < 1) return [];
  return requirementIDs.map((ID) =>
    MAGPIE_COMPONENT.__get("_get_symbol", [ID]),
  );
};
/**
 *
 * @returns {symbolID[]}
 */
MAGPIE_SYMBOL.prototype._get_compoundIDs = function () {
  const K = MAGPIE.KEY.INDEX;
  const array = Array.from(this.STATS);
  const start = array.indexOf(K.COMPOUNDS);
  const end = array.indexOf(K.STATS);
  return array.slice(start + 1, end);
};
/**
 *
 * @returns {MAGPIE_SYMBOL[]}
 */
MAGPIE_SYMBOL.prototype._get_all_compounds = function () {
  const compoundIDs = this._get_compoundIDs();
  if (compoundIDs.length < 1) return [];
  return compoundIDs.map((ID) => MAGPIE_COMPONENT.__get("_get_symbol", [ID]));
};
/**
 *
 * @returns {STAT[]}
 */
MAGPIE_SYMBOL.prototype._get_STATS = function getSTATS() {
  const K = MAGPIE.KEY.INDEX;
  const array = Array.from(this.STATS);
  const start = array.indexOf(K.STATS);
  return array.slice(start + 1);
};
/**
 *
 * @returns {{key: value}}
 */
MAGPIE_SYMBOL.prototype.mapStats = function mapStats() {
  const ePrefix = `[SYMBOL-${this.ID}].mapStats: `;
  try {
    const map = Array.from(this.STATS);
    const K = MAGPIE.KEY.INDEX;
    const STATS = {};
    map.forEach((keyID, index) => {
      if (index % 2 === 0) {
        const key = this.getKey(keyID)?.label;
        if (!key) throw new Error(`unable to find [KEY-${keyID}]`);
        STATS[key] = map[index + 1];
      }
    });
    return STATS;
  } catch (e) {
    MAGPIE_SYSTEM.error(ePrefix + e.message, e);
  }
};
/**
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
 * }} Vspeeds Object{key: value}
 * @returns {Vspeeds}
 */
MAGPIE_SYMBOL.prototype.getVspeeds = function getVspeeds() {
  return this.getCategory("VSPEEDS");
};
/**
 * @typedef {import("./index").TraitForces} TraitForces
 * @returns {TraitForces}
 */
MAGPIE_SYMBOL.prototype.getForces = function getForces() {
  return this.getCategory("FORCES");
};
/**
 *
 * @param {String} category_key
 * @returns {Object}
 */
MAGPIE_SYMBOL.prototype.getCategory = function getCategory(category_key) {
  const ePrefix = `[SYMBOL-${this.ID}].getCategory: `;
  try {
    const K = MAGPIE.KEY.INDEX;
    if (Object.prototype.toString.call(K[category_key]) !== "[object Map]")
      throw new Error(`${category_key} is invalid category_key`);
    const map = this._get_STATS();
    const keys = Array.from(K[category_key].values());
    const values = Array.from(K[category_key].keys());
    const category = {};
    map.forEach((keyID, index) => {
      if (index % 2 === 0 && values.includes(keyID))
        category[K[category_key].get(keyID)] = map[index + 1];
    });
    return category;
  } catch (e) {
    MAGPIE_SYSTEM.error(ePrefix + e.message, e);
    return {};
  }
};
/**
 *
 *
 * @returns {keyID[]}
 */
MAGPIE_SYMBOL.prototype.getKeys = function getKeys() {
  return this.STATS.map((item, index) => {
    if (index % 2 === 0) item;
  });
};
/**
 *
 * @param {keyID} keyID
 * @returns {key_value}
 */
MAGPIE_SYMBOL.prototype._get_keyID = function getKeyID(keyID) {
  const index = this.STATS.indexOf(keyID);
  if (index % 2 !== 0) return;
  return this.STATS[index + 1];
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
 * @returns {Promise<database_result>}
 */
MAGPIE_SYMBOL.prototype.set = async function set() {
  return MAGPIE_COMPONENT.__set("_set_symbolSync", [this]);
};
/**
 *
 * @returns {database_result}
 */
MAGPIE_SYMBOL.prototype.setSync = function setSync() {
  return MAGPIE_COMPONENT.__setSync("_set_symbolSync", [this]);
};
/**
 *
 * @param {String} element
 * @param {symbolID} symbolID
 * @returns {Promise<database_result>}
 */
MAGPIE_SYMBOL.prototype._addElement = async function addElement(
  element,
  symbolID,
) {
  const ePrefix = `[SYMBOL-${this.ID}].addElement: `;
  try {
    if (!symbolID || isNaN(symbolID))
      throw new Error(`${symbolID} is invalid symbolID`);
    const key = MAGPIE.KEY.INDEX[`${element.toUpperCase()}S`];
    if (isNaN(key)) throw new Error(`${key} is invalid element key`);
    const arr = Array.from(this.STATS);
    const index = arr.indexOf(key);
    if (isNaN(index)) throw new Error(`${index} is invalid STATS index`);
    arr.splice(index + 1, 0, symbolID);
    this.STATS = new Float64Array(arr);
    const result = this.set();
    if (!result) throw new Error(`unable to save [REQUIREMENT-${symbolID}]`);
    return await result;
  } catch (e) {
    MAGPIE_SYSTEM.error(ePrefix + e.message, e);
  }
};
/**
 *
 * @param {symbolID} symbolID
 * @returns {Promise<database_result>}
 */
MAGPIE_SYMBOL.prototype._addRequirement = async function addRequirement(
  symbolID,
) {
  return await this._addElement("requirement", symbolID);
};
/**
 *
 * @param {symbolID} symbolID
 * @returns {Promise<database_result>}
 */
MAGPIE_SYMBOL.prototype._addCompound = async function addCompound(symbolID) {
  return await this._addElement("requirement", symbolID);
};
/**
 *
 * @param {symbolID} symbolID
 * @returns {Promise<database_result>}
 */
MAGPIE_SYMBOL.prototype._addRecipe = async function addRecipe(symbolID) {
  const symbol = MAGPIE_SYMBOL.__get("_get_symbol", [symbolID]);
  if (!(symbol instanceof MAGPIE_SYMBOL)) return;
  const result = symbol._addRequirement(this.ID);
  if (!result) return;
  return await result;
};
/**
 *
 * @param {symbolID} symbolID
 * @returns {Promise<database_result>}
 */
MAGPIE_SYMBOL.prototype._addComponent = async function addComponent(symbolID) {
  const symbol = MAGPIE_SYMBOL.__get("_get_symbol", [symbolID]);
  if (!(symbol instanceof MAGPIE_SYMBOL)) return;
  const result = symbol._addCompound(this.ID);
  if (!result) return;
  return await result;
};
// #endregion
//------------------------------------------------------------------------
/**
 * @name
 * @desc
 *
 */
//------------------------------------------------------------------------
// #region > Trait
//------------------------------------------------------------------------
/**
 * @returns {{
 * speeds: Vspeeds,
 * forces: TraitForces
 * }}
 */
MAGPIE_SYMBOL.prototype._get_locomotion = function getLocomotion() {
  const ePrefix = `[SYMBOL-${this.ID}].getLocomotion: `;
  try {
    const K = MAGPIE.KEY.INDEX;
    const speeds = this.getVspeeds();
    const forces = this.getForces();
    return { speeds, forces };
  } catch (e) {
    MAGPIE_SYSTEM.error(ePrefix + e.message, e);
    return { speeds: {}, forces: {} };
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
// #region > Processor
//------------------------------------------------------------------------
/**
 *
 * @typedef {import("./index").Processors} Processors
 * @returns {Processors}
 */
MAGPIE_SYMBOL.prototype._get_processors = function getProcessors() {
  const ePrefix = `[SYMBOL-${this.ID}].getProcessors: `;
  try {
    const K = MAGPIE.KEY.INDEX.PROCESSORS;
    const keys = Object.keys(MAGPIE.KEY.INDEX).slice(
      K.get("start"),
      K.get("end") + 1,
    );
    const obj = {};
    obj.ingredients = [];
    obj.products = [];
    const stats = this._get_STATS();
    stats.forEach((n, index) => {
      if (n === K.get("INGREDIENT")) {
        const ingredient = [stats[index + 1]];
        const hasRate = stats[index + 2] === K.get("PROCESS_RATE");
        ingredient[1] = hasRate ? stats[index + 3] : 1;
      }
      if (n === K.get("PRODUCT")) {
        const product = [stats[index + 1]];
        const hasRate = stats[index + 2 === K.get("PROCESS_RATE")];
        product[1] = hasRate ? stats[index + 3] : 1;
      }
      if (n === K.get("PROCESS_MAX")) obj.Rmax = stats[index + 1];
      if (n === K.get("PROCESS_SAFE")) obj.Rsafe = stats[index + 1];
      if (n === K.get("PROCESS_COMFORT")) obj.Rcomfort = stats[index + 1];
      if (n === K.get("PROCESS_MIN")) obj.Rmin = stats[index + 1];
      if (n === K.get("PROCESS_DEGRAGE")) obj.Rdegrade = stats[index + 1];
      if (n === K.get("PROCESS_DAMAGE")) obj.Rdamage = stats[index + 1];
    });
    return obj;
  } catch (e) {
    MAGPIE_SYSTEM.error(ePrefix + e.message, e);
  }
};
/**
 * @todo decompose and modularize with keys
 * @typedef {Number} return_code
 * @param {MAGPIE_ENTITY} container
 * @param {Number} dt
 * @param {{
 * rate: Number,
 * killswitch: Boolean,
 * }} options
 * @returns {return_code}
 */
MAGPIE_SYMBOL.prototype._apply_processor = function applyProcessor(
  container,
  dt,
  options,
) {
  const ePrefix = `[SYMBOL-${this.ID}].applyProcessor: `;
  try {
    const exhaustedResource = -1;
    const missingResource = -2;
    const fullContainer = -3;
    const noProcessor = -4;
    const noContainer = -5;
    const killswitch = -6;
    const processors = this._get_processors();
    if (!processors) return noProcessor;
    const resources = container?._container_get_resources();
    if (!resources) return noContainer;
    const Rmax = processors?.Rmax || 2;
    const Rsafe = processors?.Rsafe || 1.5;
    const Rcomfort = processors?.Rcomfort || 1;
    const Rmin = processors?.Rmin || 0;
    const Rdegrade = processors?.Rdegrade || 0.9;
    const Rdamage = processors?.Rdamage || 0.5;
    const rate = MAGPIE_SYSTEM.Math.clampRange(
      Number(options?.rate) || 1,
      Rmin,
      Rmax,
    );
    const degrade = rate > Rcomfort ? Rdegrade : 1;
    const damage = rate > Rsafe ? Rdamage : 1;
    options.rate = rate * degrade * damage * dt;
    options.output = structuredClone(options.rate);
    const stats = Array.from(this.STATS);
    if (processors.Ingredients.some((i) => !resources.get(i[0])))
      return missingResource;
    processors.Ingredients.forEach((i) => {
      const ID = i[0];
      const rate = i[1] * options.rate;
      const resource = resources.get(ID);
      const low = resource.amount < rate;
      if (low && options.killswitch) return exhaustedResource;
      resource.amount -= rate;
      if (resource.amount < 0) {
        resource.amount = 0;
        options.output = 0;
      }
    });
    processors.Products.forEach((i) => {
      const ID = i[0];
      const rate = i[1] * options.rate;
      const r = resources.get(ID);
      const resource = r ? r : resources.set(ID);
      const max = resource.maxAmount;
      const topup = resource.amount + rate;
      const full = max && max > topup;
      resource.amount += full ? max - topup : topup;
      if (full) return fullContainer;
    });
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
// #region > Species
//------------------------------------------------------------------------
/**
 *
 * @returns {STAT}
 */
MAGPIE_SYMBOL.prototype.getPopulation = function () {
  const ePrefix = `[SYMBOL-${this.ID}] `;
  try {
    const index = this.STATS.indexOf(MAGPIE.KEY.INDEX.POPULATION);
    return this.STATS[index + 1];
  } catch (e) {
    MAGPIE_SYSTEM.error(ePrefix + e.message, e);
  }
};
/**
 *
 * @returns {STAT}
 */
MAGPIE_SYMBOL.prototype.getHealth = function () {
  return this.STATS[this.STATS.indexOf(MAGPIE.KEY.INDEX.HEALTH) + 1];
};
/**
 * @typedef {import("./index").key_stats} key_stats
 */
MAGPIE_SYMBOL.prototype._get_entity_stats = function () {
  const ePrefix = `[SYMBOL-${this.ID}] `;
  try {
    /** @type {key_stats} */
    const stats = Object.keys(MAGPIE.KEY.STATS).filter(
      (key) =>
        key !== "meta" &&
        key !== "ARRAY" &&
        key !== "TOLERANCE_BASE" &&
        key !== "AGILITY_MOD_MIN" &&
        key !== "AGILITY_MOD_MAX" &&
        key !== "STRETCH",
    );
    const fitness = [];
    stats.forEach((key, index) => {
      fitness[index] = Number(this.STATS[key]);
    });
    return fitness;
  } catch (e) {
    MAGPIE_SYSTEM.error(ePrefix + e.message, e);
  }
};
/**
 *
 * @returns {symbolID[]}
 */
MAGPIE_SYMBOL.prototype._get_entity_fitness = function () {
  const ePrefix = `[SYMBOL-${this.ID}].getEntityFitness: `;
  try {
    return Object.entries(this.mapStats())
      .filter((e) => e[0] === MAGPIE.KEY.TYPE.TRAIT)
      .map((e) => e[1]);
  } catch (e) {
    MAGPIE_SYSTEM.error(ePrefix + e.message, e);
  }
};
/**
 * @typedef {Number} EVP evolution points
 * @returns {EVP}
 */
MAGPIE_SYMBOL.prototype._species_EVP_cost = function () {
  const index = this.STATS.indexOf(MAGPIE.KEY.INDEX.EVP);
  return this.STATS[index + 1];
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
// #region - STATE
//========================================================================
MAGPIE_STATE.meta = {};
/** @type {Map<stateID, MAGPIE_STATE>} */
MAGPIE_STATE.INDEX = new Map();
MAGPIE_STATE.TYPE = new Map();
MAGPIE_STATE.setup = function setup() {
  const data = require("../data/states").states;
  for (const state_data of data) {
    MAGPIE_STATE.INDEX.set(state_data.ID, new MAGPIE_STATE(state_data));
    let type = MAGPIE_STATE.TYPE.get(state_data.type);
    if (!type) type = [];
    type.push(state_data.ID);
    MAGPIE_STATE.TYPE.set(state_data.type, type);
  }
};

/**
 *
 * @param {import("../data/states").state_data} data
 * @returns {new MAGPIE_STATE}
 */
MAGPIE_STATE.prototype.initialize = function initialize(data) {
  this._firmware = "MAGPIE_STATE";
  this.ID = data.ID;
  this.type = data.type;
  this.name = data.name;
  this.description = data.description;
  this.stack = data.stack;
  this.onUpdate = data.onUpdate;
  this.onApply = data.onApply;
  this.onRemove = data.onRemove;
  this.onExpire = data.onExpire;
};
/**
 *
 * @param {stateID} stateID
 */
MAGPIE_STATE.validate = function validate(stateID) {
  if (!stateID || isNaN(stateID))
    throw new Error(`${stateID} is invalid stateID`);
  const state = MAGPIE_STATE.INDEX.get(stateID);
  if (!state) throw new Error(`${stateID} is invalid state`);
  return true;
};
MAGPIE_STATE.validateChange = function validateChange(state) {
  const ePrefix = "[STATE].validateChange: ";
  try {
    if (!state || state?.length !== 2)
      throw new Error(`${state} is invalid state parameters`);
    const [stateID, index] = state;
    const valid = MAGPIE_STATE.validate(stateID);
    if (!isNaN(index)) throw new Error(`${index} is invalid state index`);
    if (!valid) throw new Error(`${stateID} is invalid stateID`);
    return state;
  } catch (e) {
    MAGPIE_SYSTEM.error(ePrefix + e.message, e);
    return null;
  }
};
/**
 *
 * @desc back to {@link }
 *
 */
//========================================================================
// #endregion - STATE
//========================================================================
/**
 * @name
 * @desc
 * @typedef {Number} emoteID
 * @typedef {import("./entity").entityID} entityID
 * @typedef {import("./entity").entity_data} entity_data
 * @typedef {import(".").keyID} keyID
 * @typedef {Number} key_value
 */
//========================================================================
// #region - EXP
//========================================================================
/**
 * @name
 * @desc
 *
 */
//------------------------------------------------------------------------
// #region > Proto
//------------------------------------------------------------------------

/**
 * @typedef {{
 * subject: entityID,
 * target: entityID,
 * emoteID: emoteID,
 * keys: keyID[]
 * }} exp_data
 *
 * @typedef {Number} expID
 *
 * @param {exp_data} data
 * @returns {new MAGPIE_EXP}
 */
MAGPIE_EXP.prototype.initialize = function initialize(data) {
  this._firmware = "MAGPIE_EXP";
  this.ID = Date.now();
  this.subjectID = data?.subject || NaN;
  this.targetID = data?.target || NaN;
  this.emoteID = data?.emoteID || NaN;
  this.value = data?.value || NaN;
  this.keys = data?.keys || [NaN];
};
/**
 *
 * @param {String} method
 * @param {[]} arguments
 * @returns {*}
 */
MAGPIE_EXP.__hiveSync = function __hiveSync(method, arguments) {
  //
};
/**
 *
 * @param {String} method
 * @param {[]} arguments
 * @returns {Promise<*>}
 */
MAGPIE_EXP.__hive = function __hive(method, arguments) {
  //
};
/**
 *
 *
 * @returns {Promise<database_result>}
 */
MAGPIE_EXP.prototype.set = async function save() {
  return await MAGPIE_EXP.__hive("_set_exp", [this]);
};
/**
 *
 *
 * @returns {database_result}
 */
MAGPIE_EXP.prototype.setSync = function saveSync() {
  return MAGPIE_EXP.__hiveSync("_set_expSync", [this]);
};
// #endregion
//------------------------------------------------------------------------
/**
 * @name
 * @desc
 *
 */
//------------------------------------------------------------------------
// #region > Keys
//------------------------------------------------------------------------
/**
 *
 * @returns {MAGPIE_KEY[]}
 */
MAGPIE_EXP.prototype.getKeys = function getKeys() {
  return MAGPIE_EXP.__hiveSync("_get_expKeys", [this]);
};
/**
 *
 * @param {keyID} keyID
 * @returns {keyID}
 */
MAGPIE_EXP.prototype._key_remove = function _key_remove(keyID) {
  const index = this.keys.findIndex((ID) => ID === keyID);
  if (isNaN(index) || index < 0) return;
  this.keys.splice(index, 1);
  this.set();
  return keyID;
};
/**
 *
 * @param {keyID} keyID
 * @returns {keyID}
 */
MAGPIE_EXP.prototype._key_push = function pushKey(keyID) {
  if (isNaN(keyID)) return;
  this.keys.push(keyID);
  this.set();
  return keyID;
};
/**
 *
 * @param {key_data} key_data
 * @returns {Promise<MAGPIE_KEY>}
 */
MAGPIE_EXP.prototype._key_add = async function addKey(key_data) {
  const ePrefix = `[EXP-${this.ID}]addKey: `;
  try {
    const key = new MAGPIE_KEY(key_data);
    const result = key.set();
    if (!result) throw new Error(`unable to save key`);
    this.keys.push(key.ID);
    const saved = await this.set();
    if (!saved) throw new Error("unable to save exp");
    return key;
  } catch (e) {
    MAGPIE_SYSTEM.error(ePrefix + e.message, e);
  }
};
/**
 *
 * @param {keyID} keyID
 * @param {index} index
 * @returns {array_size}
 */
MAGPIE_EXP.prototype._key_splice = function spliceInKey(keyID, index) {
  if (isNaN(keyID)) throw new Error(`${keyID} is invalid keyID`);
  if (isNaN(index) || index < 0) throw new Error(`${index} is invalid index`);
  const lastIndex = this.keys.length - 1;
  if (index > lastIndex) this.keys.push(keyID);
  else this.keys.splice(index, 0, keyID);
  this.set();
  return this.keys.length;
};
/**
 *
 * @param {index} index
 * @returns {keyID}
 */
MAGPIE_EXP.prototype._key_bookend = function _key_bookend(index) {
  const keyID = this.keys[index];
  if (!keyID) return;
  this.keys.splice(index, 1);
  return this.keys.push(keyID);
};
/**
 *
 * @param {keyID} keyID
 * @returns {Boolean}
 */
MAGPIE_EXP.prototype._get_hasKey = function hasKey(keyID) {
  return this.keys.includes(keyID);
};
// #endregion
//------------------------------------------------------------------------
/**
 * @name
 * @desc
 *
 */
//------------------------------------------------------------------------
// #region > Subject
//------------------------------------------------------------------------
/**
 *
 * @returns {STATS}
 */
MAGPIE_EXP.prototype._get_subjectSTATS = function _get_subjectSTATS() {
  return MAGPIE_EXP.__hiveSync("_get_entity", [this.subjectID])?.STATS;
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
 *
 * @returns {STATS}
 */
MAGPIE_EXP.prototype._get_targetSTATS = function _get_targetSTATS() {
  return MAGPIE_EXP.__hiveSync("_get_entity", [this.targetID])?.STATS;
};
/**
 *
 * @returns {MAGPIE_KEY}
 */
MAGPIE_EXP.prototype._get_key_target = function getKeyTarget() {
  const target = MAGPIE.KEY.INDEX.TARGET;
  const wp = MAGPIE.KEY.INDEX.WAYPOINT;
  const route = MAGPIE.KEY.INDEX.ROUTE;
  const list = [target, wp, route];
  return this.getKeys()?.find((key) => list.includes(key.type));
};
/**
 *
 * @returns {MAGPIE_KEY}
 */
MAGPIE_EXP.prototype._get_key_marker = function getKeyMarker() {
  return this.getKeys()?.find((key) => key.type === MAGPIE.KEY.INDEX.MARKER);
};
/**
 * @param {entityID} targetID
 * @param {MAGPIE_ENTITY} entity
 * @returns {Boolean}
 */
MAGPIE_EXP.prototype._set_target = function _set_target(targetID, entity) {
  const ePrefix = `[EXP-${this.ID}].setTarget: `;
  try {
    if (!targetID || isNaN(targetID)) return false;
    this.targetID = targetID;
    const log = `[ENTITY-${entity?.ID}].ExpSetTarget(${targetID}). `;
    MAGPIE_SYSTEM.logging.log_exp(log);
    return true;
  } catch (e) {
    MAGPIE_SYSTEM.error(ePrefix + e.message, e);
  }
};
/**
 *
 * @param {MAGPIE_KEY} key
 * @param {MAGPIE_ENTITY} target
 * @returns {entityID}
 */
MAGPIE_EXP.prototype._key_nextWp = function (key, target) {
  if (!key.label || key.label === "undefined") return false;
  const coords = JSON.parse(key.label);
  if (!Array.isArray(coords)) return false;
  key.type = MAGPIE.KEY.TYPE.SPAREKEY;
  target._set_C1(coords);
  return target.ID;
};
/**
 * @audit-issue must refactor for modularity
 * @param {MAGPIE_ENTITY} entity
 * @returns {entityID} entityID
 */

MAGPIE_EXP.prototype._key_target_next = function keyTargetNext(entity) {
  const ePrefix = `[EXP-${this.ID}].keyTargetNext: `;
  try {
    const key = this._get_key_target();
    if (!key) return false;
    const route = MAGPIE.KEY.INDEX.ROUTE;
    const waypoint = MAGPIE.KEY.INDEX.WAYPOINT;
    if (!key) throw new Error(`${key} is invalid MAGPIE_KEY. `);
    if (!entity) throw new Error(`${entity} is invalid MAGPIE_ENTITY. `);
    const target = entity._get_target();
    if (!target || !target?.ID)
      throw new Error(`${target} is invalid target. `);
    const targetID = target.ID;
    if (this.targetID !== target.ID) this._set_target(target.ID, entity);
    if (key.type === route) return this._key_nextRouteWp(key, target);
    if (key.type === waypoint) return this._key_nextWp(key, target);
    key.type = MAGPIE.KEY.TYPE.SPAREKEY;
    key.setSync();
    return Number(key.label);
  } catch (e) {
    MAGPIE_SYSTEM.error(ePrefix + e.message, e);
    return false;
  }
};
/**
 *
 * @param {MAGPIE_KEY} key
 * @param {MAGPIE_ENTITY} target
 * @returns {entityID} targetID
 */
MAGPIE_EXP.prototype._key_nextRouteWp = function (key, target) {
  const ePrefix = `[EXP-${this.ID}].keyTargetNextRouteWp: `;
  try {
    if (!target || !key) throw new Error("invalid parameters. ");
    const coords = MAGPIE_SYSTEM.Parsing.json(key.label)[1];
    if (!coords || !Array.isArray(coords))
      throw new Error(`${coords} is invalid coords. `);
    if (coords.length < 1) return (key.type = MAGPIE.KEY.TYPE.SPAREKEY);
    target._set_C1(coords.shift());
    key.label = JSON.stringify(coords);
  } catch (e) {
    MAGPIE_SYSTEM.error(ePrefix + e.message, e);
  } finally {
    return target.ID;
  }
};
/**
 * @param {MAGPIE_ENTITY} entity
 * @returns {entityID}
 */
MAGPIE_EXP.prototype._target_next = function _target_next(entity) {
  const ePrefix = `[EXP-${this.ID}].targetNext: `;
  try {
    const targetID = this._key_target_next(entity);
    if (!targetID) return false;
    // MAGPIE_SYSTEM._logging_debug(`targetID: ${targetID}`);
    return targetID;
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
// #region > Waypoint
//------------------------------------------------------------------------
/**
 * @typedef {{
 * Vcruise: velocity,
 * ASL: distance,
 * offset: vector3,
 * posture: stateID,
 * trigger: keyID
 * }} waypoint_options
 * @param {MAGPIE_KEY} key
 * @returns {waypoint_options}
 */
MAGPIE_EXP.prototype._key_mapWPoptions = function (key) {
  if (!key) return;
  const options = JSON.parse(key.label);
  if (Object.keys(optons).length < 1) return;
  return options;
};
/**
 *
 * @returns {MAGPIE_KEY}
 */
MAGPIE_EXP.prototype._key_findWPoptions = function () {
  const K = MAGPIE.KEY.INDEX;
  const keys = this.getKeys();
  if (keys.length < 1) return;
  return keys.find((key) => key.type === MAGPIE.KEY.INDEX.WP_OPTIONS);
};
// #endregion
//------------------------------------------------------------------------
/**
 * @name
 * @desc
 *
 */
//------------------------------------------------------------------------
// #region > Route
//------------------------------------------------------------------------
/**
 *
 * @param {entityID} targetID
 * @returns {index}
 */
MAGPIE_EXP.prototype._route_push = async function _route_push(targetID) {
  const ePrefix = `[EXP-${this.ID}].routePush: `;
  try {
    const K = MAGPIE.KEY;
    const key = await this._key_add({
      type: K.INDEX.WAYPOINT,
      label: String(targetID),
    });
    if (!(key instanceof MAGPIE_KEY)) throw new Error(`${key} is invalid key`);
    return this.keys.length - 1;
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
// #region > Stamina
//------------------------------------------------------------------------
/**
 * @returns {stamina_index}
 */
MAGPIE_EXP.prototype._get_stamina_index = function getStaminaINdex() {
  this.keys.forEach((keyID) => {
    const index = MAGPIE.KEY.INDEX.STAMINA.get(keyID);
    if (index) return index;
  });
};
// #endregion
//------------------------------------------------------------------------
/**
 * @name
 * @desc
 *
 */
//------------------------------------------------------------------------
// #region > Utils
//------------------------------------------------------------------------

/**
 *
 * @returns {import("./entity").entity_speeds}
 */
MAGPIE_EXP.prototype._key_mapVspeeds = function mapVspeeds() {
  const K = MAGPIE.KEY.INDEX;
  const T = MAGPIE.KEY.TYPE;
  const keys = this.getKeys();
  if (keys.length < 1) return;
  const Vspeeds = {};
  const speedsKey = keys.find((key) => key.type === MAGPIE.KEY.INDEX.VSPEED);
  // if (this.ID === 1782093138801)
  //   MAGPIE_SYSTEM._logging_debug(`speedsKey: ${speedsKey}`);
  if (speedsKey) {
    const speeds = MAGPIE_SYSTEM.Parsing.json(speedsKey?.label)[1];
    if (speeds) {
      for (const [key, value] of Object.entries(speeds)) {
        Vspeeds[key.toUpperCase()] = value;
      }
      return Vspeeds;
    }
  }
  for (const key of keys) {
    const isVSPEED = key.type >= K.VMAX && key.type <= K.TDOCK_Z;
    const type = MAGPIE.KEY.INDEX.VSPEEDS.get(key.type);
    const value = MAGPIE_SYSTEM.Parsing.json(key.label)[1];
    if (isVSPEED && type && value) Vspeeds[type] = value;
  }
  return Vspeeds;
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
// #region - EMOTE
//========================================================================
MAGPIE_EMOTE.meta = {};
/** @type {Map<emoteID, MAGPIE_EMOTE>} */
MAGPIE_EMOTE.INDEX = new Map();
MAGPIE_EMOTE.setup = async function () {
  const data = require("../data/emotes");
  if (data?.length < 1) return;
  for (const emote_data of data) {
    MAGPIE_EMOTE.INDEX.set(emote_data.ID, new MAGPIE_EMOTE(emote_data));
  }
};
/**
 *
 * @param {{
 * ID: Number,
 * name: String,
 * type: Enumerator<Number>,
 * description,
 * condition: (...args) => Boolean,
 * onAction: (
 * exp: MAGPIE_EXP,
 * entity: MAGPIE_ENTITY,
 * stamina_index: stamina_index
 * ) => {callback: Function},
 * onPassive: (exp: MAGPIE_EXP, entity: MAGPIE_ENTITY) => {}
 * }} data
 * @returns {new MAGPIE_EMOTE}
 */
MAGPIE_EMOTE.prototype.initialize = function initialize(data) {
  this._firmware = "MAGPIE_EMOTE";
  this.ID = data.ID;
  this.name = data.name;
  this.type = data.type;
  this.description = data.description;
  this.condition = data.condition;
  this.onAction = data.onAction;
  this.onPassive = data.onPassive;
};
MAGPIE_EMOTE.prototype.condition = function condition(...args) {
  return true;
};
MAGPIE_EMOTE.prototype.onAction = function onAction(...args) {
  //
};
MAGPIE_EMOTE.prototype.onPassive = function onPassive(...args) {
  //
};
/**
 *
 * @desc back to {@link }
 *
 */
//========================================================================
// #endregion - EMOTE
//========================================================================
/**
 * @name
 * @desc
 * @typedef {Number} contextID
 * @typedef {Enumerator<Number>} context_type
 * @typedef {import("./system").epoch_real} epoch_real
 * @typedef {import("./entity").MAGPIE_ENTITY} MAGPIE_ENTITY
 * @typedef {import("./index").urgency} urgency
 * @typedef {import("./index").urgency_record} urgency_record
 * @typedef {import("./index").gravity} gravity
 * @typedef {import("./index").gravity_record} gravity_record
 * @typedef {import("./index").ambiguity} ambiguity
 * @typedef {import("./index").ambiguity_record} ambiguity_record
 * @typedef {{
 * ID: contextID,
 * type: context_type,
 * updated: epoch_real,
 * entities: MAGPIE_ENTITY,
 * exps: MAGPIE_EXP[],
 * keys: MAGPIE_KEY[],
 * symbols: MAGPIE_SYMBOL[],
 * date: MAGPIE_DATE,
 * urgency: urgency,
 * graivty: gravity,
 * ambiguity: ambiguity
 * }} context_data
 */
//========================================================================
// #region - CONTEXT
//========================================================================
/**
 * @name
 * @desc
 *
 */
//------------------------------------------------------------------------
// #region > Proto
//------------------------------------------------------------------------

/**
 *
 * @param {context_data} data
 * @returns {new MAGPIE_CONTEXT}
 */
MAGPIE_CONTEXT.prototype.initialize = function initialize(data) {
  this._firmware = "MAGPIE_CONTEXT";
  this.ID = Number(data?.ID) || Date.now();
  this.type = Number(data?.type) || 0;
  this.host = Number(data?.host) || MAGPIE.KEY.ENTITY.UNIVERSE;
  this.name = String(data?.name) || "";
  this.updated = Number(data?.updated) || this.ID;
  this.entities = new Float64Array(data?.entities || 0);
  this.exps = new Float64Array(data?.exps || 0);
  this.keys = new Float64Array(data?.keys || 0);
  this.symbols = new Float64Array(data?.symbols || 0);
  this.metadate = Number(data?.metadate) || 0;
  this.urgency = Number(data?.urgency) || NaN;
  this.gravity = Number(data?.gravity) || NaN;
  this.ambiguity = Number(data?.ambiguity) || NaN;
};
/**
 *
 * @param {String} method
 * @param {[]} arguments
 * @returns {*}
 */
MAGPIE_CONTEXT.__hiveSync = function __hiveSync(method, arguments) {
  //
};
/**
 *
 * @param {String} method
 * @param {[]} arguments
 * @returns {Promise<*>}
 */
MAGPIE_CONTEXT.__hive = async function __hive(method, arguments) {
  //
};
/**
 *
 * @returns {Promise<Boolean>}
 */
MAGPIE_CONTEXT.prototype._awake = async function _awake() {
  return await MAGPIE_CONTEXT.__hive("_host_context", [this]);
};
MAGPIE_CONTEXT.prototype._sleep = async function _sleep() {
  return await MAGPIE_CONTEXT.__hive("_kick_context", [this, "context_sleep"]);
};
/**
 *
 * @returns {Boolean}
 */
MAGPIE_CONTEXT.prototype.isAwake = function isAwake() {
  return MAGPIE_CONTEXT.__hiveSync("_context_isAwake", [this.ID]);
};
/**
 *
 * @returns {Boolean}
 */
MAGPIE_CONTEXT.prototype.isActive = function isActive() {
  const entities = this.entities.length > 0;
  const exps = this.exps.length > 0;
  const keys = this.keys.length > 0;
  const symbols = this.symbols.length > 0;
  if ([entities, exps, keys, symbols].some((n) => !!n)) return true;
  return false;
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
 * @returns {Promise<database_result>}
 */
MAGPIE_CONTEXT.prototype.set = async function set() {
  return await MAGPIE_CONTEXT.__hive("_set_context", [this]);
};
/**
 *
 * @returns {database_result}
 */
MAGPIE_CONTEXT.prototype.setSync = function setSync() {
  return MAGPIE_CONTEXT.__hiveSync("_set_contextSync", [this]);
};
/**
 * @param {String} elementType
 * @param {Number} elementID
 * @returns {Promise<database_result>}
 */
MAGPIE_CONTEXT.prototype._set_element = async function contextSetElement(
  elementType,
  elementID,
) {
  const ePrefix = `[CONTEXT-${this.ID}].set_${elementType}: `;
  try {
    if (isNaN(elementID)) throw new Error(`${elementID} is invalid entityID`);
    const record = Array.from(this[elementType]);
    if (!record) throw new Error(`${elementType} is invalid elementType`);
    const arr = structuredClone(record);
    const index = arr.push(elementID) - 1;
    this[elementType] = new Float64Array(arr);
    const result = await this.set();
    if (!result) throw new Error("unable to save. ");
    return index;
  } catch (e) {
    MAGPIE_SYSTEM.error(ePrefix + e.message, e);
  }
};
/**
 *
 * @param {String} type
 * @param {Number} elementID
 * @returns {Promise<database_result>}
 */
MAGPIE_CONTEXT.prototype._set_remove_element =
  async function contextRemoveElement(type, elementID) {
    const ePrefix = `[CONTEXT-${this.ID}].set${elementType}: `;
    try {
      const record = this[elementType];
      if (!record) throw new Error(`${elementType} is invalid elementType`);
      const arr = new Array(...record);
      const index = arr.indexOf(elementID);
      if (isNaN(index) || index < 0)
        throw new Error(`${elementID} is invalid entityID`);
      arr[index] = arr[arr.length - 1];
      arr.pop();
      this[elementType] = new Float64Array(arr);
      return await this.set();
    } catch (e) {
      MAGPIE_SYSTEM.error(ePrefix + e.message, e);
    }
  };
/**
 *
 * @param {entityID} entityID
 * @returns {Promise<database_result>}
 */
MAGPIE_CONTEXT.prototype._set_entity = async function contextSetEntity(
  entityID,
) {
  return await this._set_element("entities", entityID);
};
/**
 *
 * @param {entityID} entityID
 * @returns {Promise<database_result>}
 */
MAGPIE_CONTEXT.prototype._set_remove_entity =
  async function contextRemoveEntity(entityID) {
    return await this._set_remove_element("entities", entityID);
  };
/**
 *
 * @param {expID} expID
 * @returns {Promise<database_result>}
 */
MAGPIE_CONTEXT.prototype._set_exp = async function contextSetExp(expID) {
  return await this._set_element("exps", expID);
};
/**
 *
 * @param {expID} expID
 * @returns {Promise<database_result>}
 */
MAGPIE_CONTEXT.prototype._set_remove_exp = async function contextRemoveExp(
  expID,
) {
  return await this._set_remove_element("exps", expID);
};
/**
 *
 * @param {keyID} keyID
 * @returns {Promise<database_result>}
 */
MAGPIE_CONTEXT.prototype._set_key = async function contextSetKey(keyID) {
  return await this._set_element("keys", keyID);
};
/**
 *
 * @param {keyID} keyID
 * @returns {Promise<database_result>}
 */
MAGPIE_CONTEXT.prototype._set_remove_key = async function contextRemoveKey(
  keyID,
) {
  return await this._set_remove_element("keys", keyID);
};
/**
 *
 * @param {symbolID} symbolID
 * @returns {Promise<database_result>}
 */
MAGPIE_CONTEXT.prototype._set_symbol = async function contextSetSymbol(
  symbolID,
) {
  return await this._set_element("symbols", symbolID);
};
/**
 *
 * @param {symbolID} symbolID
 * @returns {Promise<database_result>}
 */
MAGPIE_CONTEXT.prototype._set_remove_symbol =
  async function contextRemoveSymbol(symbolID) {
    return await this._set_remove_element("symbols", symbolID);
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
 * @returns {context_record}
 */
MAGPIE_CONTEXT.prototype._get_type = function getType() {
  return MAGPIE.KEY.CONTEXT.TYPE.get(this.type);
};
/**
 *
 * @returns {MAGPIE_ENTITY}
 */
MAGPIE_CONTEXT.prototype._get_host = function getContextHost() {
  return this._get_entity(this.host);
};
/**
 *
 * @returns {MAGPIE_ENTITY[]}
 */
MAGPIE_CONTEXT.prototype._get_all_entities = function getAllEntities() {
  const arr = [];
  for (let i = 0; i < this.entities.length; i++) {
    const entity = this._get_entity(this.entities[i]);
    if (entity?.constructor?.name === "MAGPIE_ENTITY") arr.push(entity);
  }
  return arr;
};
/**
 *
 * @param {entityID} entityID
 * @returns {MAGPIE_ENTITY}
 */
MAGPIE_CONTEXT.prototype._get_entity = function getEntity(entityID) {
  return MAGPIE_CONTEXT.__hiveSync("_get_entity", [entityID]);
};
/**
 * @returns {MAGPIE_EXP[]}
 */
MAGPIE_CONTEXT.prototype._get_all_exps = function getAllExps() {
  const arr = [];
  for (let i = 0; i < this.exps.length; i++) {
    arr.push(this._get_exp(this.exps[i]));
  }
  return arr;
};
/**
 *
 * @param {expID} expID
 * @returns {MAGPIE_EXP}
 */
MAGPIE_CONTEXT.prototype._get_exp = function getExp(expID) {
  return MAGPIE_CONTEXT.__hiveSync("_get_exp", [expID]);
};
/**
 *
 * @param {keyID} keyID
 * @returns {MAGPIE_KEY}
 */
MAGPIE_CONTEXT.prototype._get_key = function getKey(keyID) {
  return MAGPIE_CONTEXT.__hiveSync("_get_key", [keyID]);
};
/**
 *
 * @returns {MAGPIE_KEY[]}
 */
MAGPIE_CONTEXT.prototype._get_all_keys = function getAllKeys() {
  const arr = [];
  for (let i = 0; i < this.keys.length; i++) {
    arr.push(this._get_key(this.keys[i]));
  }
  return arr;
};
/**
 *
 * @param {symbolID} symbolID
 * @returns {MAGPIE_SYMBOL}
 */
MAGPIE_CONTEXT.prototype._get_symbol = function getSymbol(symbolID) {
  return MAGPIE_CONTEXT.__hiveSync("_get_symbol", [symbolID]);
};
/**
 * @returns {MAGPIE_SYMBOL[]}
 */
MAGPIE_CONTEXT.prototype._get_all_symbols = function getAllSymbols() {
  const arr = [];
  for (let i = 0; i < this.symbols.length; i++) {
    arr.push(this._get_symbol(this.symbols[i]));
  }
  return arr;
};
/**
 *
 * @returns {urgency_record}
 */
MAGPIE_CONTEXT.prototype._get_urgency = function getUrgency() {
  return MAGPIE.KEY.INDEX.URGENCY.get(this.urgency);
};
/**
 *
 * @returns {gravity_record}
 */
MAGPIE_CONTEXT.prototype._get_gravity = function getGravity() {
  return MAGPIE.KEY.INDEX.get(this.gravity);
};
/**
 *
 * @returns {ambiguity_record}
 */
MAGPIE_CONTEXT.prototype._get_ambiguity = function getAmbiguity() {
  return MAGPIE.KEY.INDEX.get(this.ambiguity);
};
// #endregion
//------------------------------------------------------------------------
/**
 * @name
 * @desc
 *
 */
//------------------------------------------------------------------------
// #region > Add
//------------------------------------------------------------------------
/**
 *
 * @param {entity_data} entity_data
 */
MAGPIE_CONTEXT.prototype._add_new_entity = async function (entity_data) {
  const ePrefix = `[CONTEXT-${this.ID}].addNewEntity: `;
  try {
    const entity = await MAGPIE_CONTEXT.__hive("_new_entity", [entity_data]);
    if (entity?.constructor?.name !== "MAGPIE_ENTITY")
      throw new Error(`${entity} is invalid entity`);
    entity.STATS[MAGPIE.KEY.POVART.P_C] = this.host;
    await this._set_entity(entity.ID);
  } catch (e) {
    MAGPIE_SYSTEM.error(ePrefix + e.message, e);
  }
};
/**
 *
 * @param {key_data} key_data
 * @returns {Promise<MAGPIE_KEY>}
 */
MAGPIE_CONTEXT.prototype._add_new_key = async function (key_data) {
  const ePrefix = `[CONTEXT-${this.ID}].addNewKey: `;
  try {
    const key = new MAGPIE_KEY(key_data);
    if (!(key instanceof MAGPIE_KEY))
      throw new Error(`${key} is invalid MAGPIE_KEY. `);
    const savedResult = await key.set();
    if (!savedResult) throw new Error(`unable to save [KEY-${key.ID}]. `);
    const result = await this._set_key(key.ID);
    if (!result)
      MAGPIE_SYSTEM.sysLog(`unable to set [KEY-${key.ID}]. `, "error");
    const hostedBufferSize = key.requestHost();
    if (!hostedBufferSize)
      MAGPIE_SYSTEM.sysLog(`unable to host [KEY-${key.ID}]. `, "error");
    return key;
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
// #region > Territory
//------------------------------------------------------------------------
/**
 *
 * @returns {MAGPIE_ENTITY[]}
 */
MAGPIE_CONTEXT.prototype._get_territories = function _get_territories() {
  const territory = MAGPIE.KEY.SYMBOL.TYPE.TERRITORY;
  return this._get_all_entities().filter(
    (e) => e._get_type()?.type === territory,
  );
};
// #endregion
//------------------------------------------------------------------------
/**
 *
 * @desc back to {@link }
 *
 */
//========================================================================
// #endregion - CONTEXT
//========================================================================
/**
 * @name
 * @desc
 * @typedef {import("../SERVER").socketEvent} socketEvent
 * @typedef {{
 * code: Number,
 * event: String,
 * handleID: Number,
 * message: String
 * }} ticket_payload
 * @typedef {{
 * event: String,
 * payload: ticket_payload,
 * arguments: socketEvent
 * urgency: urgency,
 * graivty: gravity,
 * ambiguity: ambiguity,
 * }} ticket_data
 * @typedef {Number} ticketID
 */
//========================================================================
// #region - TICKET
//========================================================================
/**
 *
 * @param {ticket_data} data
 * @returns {new MAGPIE_TICKET}
 */
MAGPIE_TICKET.prototype.initialize = function initialize(data) {
  this._firmware = "MAGPIE_TICKET";
  this.ID = Date.now();
  this.event = String(data?.event) || "log";
  this.payload = data?.payload;
  this.arguments = data?.arguments || [];
  this.urgency = Number(data?.urgency);
  this.gravity = Number(data?.graivty);
  this.ambiguity = Number(data?.ambiguity);
};
/**
 *
 * @desc back to {@link }
 *
 */
//========================================================================
// #endregion - TICKET
//========================================================================
/**
 * @typedef {import("./index").key_type} key_type
 * @typedef {String} key_label
 * @typedef {import("./index").velocity} velocity in m/s
 * @typedef {import("./index").acceleration} acceleration in m/s²
 * @typedef {import("./index").omega} omega (ω) angular velocity in rad/s
 * @typedef {import("./index").alpha} alpha (α) angular acceleration in rad/s²
 * @typedef {import("./index").distance} distance in m
 * @typedef {{
 * type: Number,
 * label: String,
 * originID: keyID,
 * componentID: keyID,
 * compoundID: keyID,
 * legacyID: keyID
 * }} key_data
 * @typedef {import("./index").stateID} stateID
 * @name
 * @desc
 * @param {Object} data
 * @returns {new MAGPIE_KEY}
 */
//========================================================================
// #region - KEY
//========================================================================
/**
 * @name
 * @desc
 *
 */
//------------------------------------------------------------------------
// #region > Proto
//------------------------------------------------------------------------

MAGPIE_KEY.prototype.initialize = function initialize(data) {
  this._firmware = "MAGPIE_KEY";
  this.ID = Number(data?.ID) || Date.now();
  this.type = Number(data?.type) || 0;
  this.label = String(data?.label) || "";
  this.originID = Number(data?.originID) || 0;
  this.compoundID = Number(data?.compoundID) || 0;
  this.symbolID = Number(data?.symbolID) || 0;
};
/**
 * @returns {Promise<Object>}
 */
MAGPIE_KEY.setup = async function setup() {
  //
};
/**
 *
 * @param {String} method
 * @param {[*]} arguments
 * @returns {Promise<*>}
 */
MAGPIE_KEY.__hive = async function __hive(method, arguments) {
  //
};
/**
 *
 * @param {String} method
 * @param {[]} arguments
 * @returns {*}
 */
MAGPIE_KEY.__hiveSync = function __hiveSync(method, arguments) {
  //
};
/**
 *
 * @param {key_data} data
 * @returns {database_result: new MAGPIE_KEY}
 */
MAGPIE_KEY._newKey = function newKey(data) {
  const key = new MAGPIE_KEY(data);
  return key.setSync();
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
 *
 * @returns {Promise<database_result>}
 */
MAGPIE_KEY.prototype.set = async function set() {
  return await MAGPIE_KEY.__hive("_set_key", [this]);
};
/**
 *
 *
 * @returns {database_result}
 */
MAGPIE_KEY.prototype.setSync = function setSync() {
  return MAGPIE_KEY.__hiveSync("_set_databaseSync", ["saveKeySync", [this]]);
};
/**
 *
 * @param {key_type} key_type
 * @returns {Promise<database_result>}
 */
MAGPIE_KEY.prototype._set_type = async function setType(key_type) {
  const ePrefix = `[KEY-${this.ID}].setType: `;
  try {
    if (isNaN(key_type)) throw new Error(`${key_type} is invalid key_type`);
    this.type = key_type;
    return this.set();
  } catch (e) {
    MAGPIE_SYSTEM.error(ePrefix + e.message, e);
  }
};
/**
 *
 * @param {keyID} keyID
 * @returns {Promise<database_result>}
 */
MAGPIE_KEY.prototype.setOrigin = async function setOrigin(keyID) {
  // @todo key.setOrigin
};
/**
 *
 * @returns {database_result}
 */
MAGPIE_KEY.prototype.removeOrigin = function removeOrigin() {
  // @todo key.removeOrigin
};
/**
 * @returns {import("./system").buffer_size}
 */
MAGPIE_KEY.prototype.requestHost = function keyRequestHost() {
  return MAGPIE_KEY.__hiveSync("_host_key", [this]);
};
/**
 *
 * @param {MAGPIE_CONTEXT} context
 * @returns {Promise<keyID>}
 */
MAGPIE_KEY.prototype.requestContext = async function keyRequestContext(
  context,
) {
  if (!(context instanceof MAGPIE_CONTEXT)) return false;
  return await context._set_key(this.ID);
};
// #endregion
//------------------------------------------------------------------------
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
 * @param {keyID} keyID
 * @returns {MAGPIE_KEY}
 */
MAGPIE_KEY.prototype.getKey = function getKey(keyID) {
  return MAGPIE_KEY.__hiveSync(`_get_key`, [keyID]);
};
/**
 *
 * @returns {MAGPIE_KEY}
 */
MAGPIE_KEY.prototype.getOrigin = function getOrigin() {
  //@todo key.getOrigin to use db query
  return this.getKey(this.originID);
};
/**
 *
 * @returns {String}
 */
MAGPIE_KEY.prototype._get_type = function getType() {
  return MAGPIE.KEY.TYPES.get(this.type);
};
/**
 *
 * @returns {MAGPIE_ENTITY}
 */
MAGPIE_KEY.prototype._get_entity_label = function getEntityFromLabel() {
  return MAGPIE_KEY.__hiveSync("_get_entity", [Number(this.label)]);
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
 * @returns {coords}
 */
MAGPIE_KEY.prototype._marker_getLabel = function () {
  return this.label.split(",").map(Number);
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
 *
 * @returns {entityID}
 */
MAGPIE_KEY.prototype._target_getLabel = function () {
  return Number(this.label);
};
// #endregion
//------------------------------------------------------------------------
/**
 * @name
 * @desc
 *
 */
//------------------------------------------------------------------------
// #region > Utility
//------------------------------------------------------------------------
/**
 *
 * @returns {key_data}
 */
MAGPIE_KEY.prototype._get_data = function getData() {
  const data = {};
  Object.keys(this).forEach((key) => {
    if (key !== "_firmware" && key !== "ID") data[key] = this[key];
  });
  return data;
};
/**
 *
 * @returns {new MAGPIE_KEY}
 */
MAGPIE_KEY.prototype._U_clone = async function clone() {
  const key = structuredClone(this);
  Object.setPrototypeOf(key, MAGPIE_KEY.prototype);
  key.ID = Date.now();
  await key.set();
  return key;
};
MAGPIE_KEY.prototype._U_hydrate = function () {
  Object.setPrototypeOf(this, MAGPIE_KEY.prototype);
};
// #endregion
//------------------------------------------------------------------------
/**
 *
 * @desc back to {@link }
 *
 */
//========================================================================
// #endregion - KEY
//========================================================================
/**
 * @name
 * @desc
 * @typedef {import("./entity").fitness_index} fitness_index this.fitness[index]
 * @typedef {import("./physics").power} power
 * @typedef {import("./physics").force} force
 * @typedef {import("./physics").percentage} regime %
 * @typedef {import("./physics").mass} mass in kg
 * @typedef {import("./physics").flow} flow
 * @typedef {import("./physics").coefficient} coefficient
 * @typedef {import("./physics").temperature} temperature in Kelvin (K)
 * @typedef {[]} environment
 */
//========================================================================
// #region - ENGINEER
//========================================================================
/**
 * @name
 * @desc
 *
 */
//------------------------------------------------------------------------
// #region > Engine
//------------------------------------------------------------------------

MAGPIE_ENGINE.meta = {
  name: "M.A.G.P.I.E. engine",
  desc: "power plant",
};
/**
 * @typedef {{
 * symbolID: symbolID,
 * mass: mass,
 * power: power,
 * Rmax: regime,
 * Rsafe: regime,
 * Rcomfort: regime,
 * Rmin: regime,
 * Fmax: coefficient,
 * Fsafe: coefficient,
 * Fcomfort: coefficient,
 * Fmin: coefficient,
 * processor: []
 * }} engine_data
 *
 * @typedef {coefficient} process_rate
 * @typedef {coefficient} efficiency 1 - (degrade + damage)
 * @typedef {[power, process_rate, efficiency]} engine_output
 * @param {MAGPIE_ENTITY} entity
 * @param {engine_data} data
 */
MAGPIE_ENGINE.setup = function (entity, data) {
  //@todo engine.setup
};
/**
 *
 * @param {MAGPIE_ENTITY} entity
 * @param {fitness_index} fitness_index
 * @param {environment} env
 * @returns {engine_output}
 */
MAGPIE_ENGINE.start = function start(entity, fitness_index, env) {
  //@todo engine.start
};
/**
 *
 * @param {MAGPIE_ENTITY} entity
 * @param {fitness_index} fitness_index
 * @param {environment} env
 * @returns {engine_output}
 */
MAGPIE_ENGINE.update = function update(entity, fitness_index, env) {
  //@todo engine.update
};
/**
 *
 * @param {MAGPIE_ENTITY} entity
 * @param {fitness_index} fitness_index
 * @param {environment} env
 * @returns {engine_output}
 */
MAGPIE_ENGINE.stop = function stop(entity, fitness_index, env) {
  //@todo engine.stop
};
/**
 *
 * @param {MAGPIE_ENTITY} entity
 * @param {fitness_index} fitness_index
 * @param {percentage} amount
 * @param {environment} env
 * @returns {engine_data}
 * @returns {engine_data}
 */
MAGPIE_ENGINE.degrade = function degrade(entity, fitness_index, amount, env) {
  //@todo engine.degrade
};
/**
 *
 * @param {MAGPIE_ENTITY} entity
 * @param {fitness_index} fitness_index
 * @param {percentage} amount
 * @param {environment} env
 * @returns {engine_data}
 *
 */
MAGPIE_ENGINE.damage = function damage(entity, fitness_index, amount, env) {
  //@todo engine.damage
};
/**
 *
 * @param {MAGPIE_ENTITY} entity
 * @param {fitness_index} fitness_index
 * @param {percentage} amount
 * @param {environment} env
 * @returns {engine_data}
 */
MAGPIE_ENGINE.spool = function spool(entity, fitness_index, amount, env) {
  //@todo engine.spool
};
// #endregion
//------------------------------------------------------------------------
/**
 * @name
 * @desc
 * @typedef {force} thrust N
 * @typedef {coefficient} TWR thrust-to-weight ratio
 * @typedef {coefficient} propulsor_efficiency 1 - (thrust_losses / thrust)
 * @typedef {temperature} EGT
 * @typedef {[
 * thrust,
 * propulsor_efficiency,
 * EGT
 * ]} propulsor_data
 */
//------------------------------------------------------------------------
// #region > Propulsor
//------------------------------------------------------------------------
MAGPIE_PROPULSOR.meta = {
  name: "M.A.G.P.I.E. propulsor",
  desc: "thrust applier",
};
/**
 * @param {MAGPIE_ENTITY} entity
 * @param {fitness_index} fitness_index
 * @param {percentage} amount
 * @param {environment} env
 * @returns {propulsor_data}
 */
MAGPIE_PROPULSOR.applyThrust = function applyThrust(
  entity,
  fitness_index,
  amount,
  env,
) {
  //@todo propulsor.applyThrust
};
// #endregion
//------------------------------------------------------------------------
/**
 * @name
 * @desc
 *
 */
//------------------------------------------------------------------------
// #region > Powertrain
//------------------------------------------------------------------------
MAGPIE_POWERTRAIN.meta = {
  name: "M.A.G.P.I.E. powertrain",
  desc: "combined engine/propulsor propulsion system",
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
// #region - LOGISTICS
//========================================================================
/**
 * @name
 * @desc
 *
 */
//------------------------------------------------------------------------
// #region > Container
//------------------------------------------------------------------------
MAGPIE_CONTAINER.meta = {
  name: "M.A.G.P.I.E. container",

  // #endregion
  //------------------------------------------------------------------------
};
/**
 *
 * @desc back to {@link }
 *
 */
//========================================================================
// #endregion -
//========================================================================
module.exports = {
  MAGPIE_COMPONENT,
  MAGPIE_STATE,
  MAGPIE_EMOTE,
  MAGPIE_EXP,
  MAGPIE_KEY,
  MAGPIE_CONTEXT,
  MAGPIE_TICKET,
  MAGPIE_SYMBOL,
  MAGPIE_ENGINE,
  MAGPIE_PROPULSOR,
  MAGPIE_POWERTRAIN,
  MAGPIE_CONTAINER,
};
/**
 *
 * @desc back to {@link }
 *
 */
//========================================================================
// END OF FILE
//========================================================================
