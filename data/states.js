/**
 * @name states
 * @version 0.39.962
 *
 */
const { MAGPIE } = require("../src/index");
/**
 * @typedef {import("../src/entity").MAGPIE_ENTITY} MAGPIE_ENTITY
 * @typedef {import("../src/component").MAGPIE_EXP} MAGPIE_EXP
 * @typedef {import("../src/index").state_index} state_index
 * @typedef {import("../src/entity").fitness_index} fitness_index
 * @typedef {import("../src/physics").vector3} vector3
 * @typedef {import("../src/physics").bivector} bivector
 * @typedef {import("../src/entity").action_output} action_output
 * @typedef {{
 * At: vector3,
 * Tt: bivector,
 * exp: MAGPIE_EXP,
 * raw: action_output
 * }} state_output
 * @typedef {{
 * ID: Number,
 * type: state_type,
 * name: String,
 * description: String,
 * stack: Number,
 * onUpdate: (...args) => {},
 * onApply: (...args) => {},
 * onRemove: (...args) => {},
 * onExpire: (...args) => {}
 * }} state_data
 */
const INDEX = {};
/**
 * @typedef {Enumerator<Number>} state_type
 *
 * */
const TYPE = {};
//PERMANENT STATES
/** @type {state_type} @desc permanent state type */
TYPE.PERMANENT = 0;
/** @type {state_type} @desc growth level state type */
TYPE.G_LVL = 10;
/** @type {state_type} @desc accumulator state type */
TYPE.ACCUMULATOR = 20;
/** @type {state_type} */
TYPE.ACCUMULATOR_STATE = 21;
/** @type {state_type} */
TYPE.ACCUMULATOR_EQUIP = 22;
/** @type {state_type} */
TYPE.ACCUMULATOR_WASTE = 23;
/** @type {state_type} */
TYPE.ACCUMULATOR_INJURY = 24;
/** @type {state_type} */
TYPE.ACCUMULATOR_TRIBUTE = 25;
/** @type {state_type} @desc Finite-State-Machine type */
TYPE.FSM = 100;
/** @type {state_type} @desc Finite-State-Machine type */
TYPE.FSM_STATUS = 110;
/** @type {state_type} @desc Finite-State-Machine type */
TYPE.FSM_POSTURE = 120;
/** @type {state_type} @desc Finite-State-Machine type */
TYPE.FSM_MOVEMENT = 130;
/** @type {state_type} @desc Finite-State-Machine type */
TYPE.FSM_MOOD = 140;
/** @type {state_type} @desc Finite-State-Machine type */
TYPE.FSM_ENERGY = 150;
//TEMPORARY STATES (1 turn)
/** @type {state_type} @desc temporary state type */
TYPE.TEMP = 1000;
// INDEX
const effect = {
  expire: true,
  purge: true,
  stats: [],
  pushStates: [],
  popStates: [],
};
/** @type {state_data[]}  */
const states = [];

/**
 * @name
 * @desc
 *
 */
//========================================================================
// #region - 0 to 100
//========================================================================
/**
 * @name Permanents
 * @desc
 *
 */
//------------------------------------------------------------------------
// #region > Template
//------------------------------------------------------------------------
const TEMPLATE = {
  ID: 0,
  type: 0,
  name: "TEMPLATE",
  description: "",
  stack: 0,
  onApply: () => {},
  onUpdate: () => {},
  onRemove: () => {},
  onExpire: () => {},
};
states.push(TEMPLATE);
/** @type {Enumerator<Number>}  */
INDEX.TEMPLATE = TEMPLATE.ID;
// #endregion
//------------------------------------------------------------------------
/**
 * @name
 * @desc
 *
 */
//------------------------------------------------------------------------
// #region > Bio
//------------------------------------------------------------------------
const BIO_DEAD = {
  ID: 20,
  type: TYPE.PERMANENT,
  name: "BIO_DEAD",
  description: "",
  stack: 1,
  onApply: () => {
    //death effect
  },
  /**
   *
   * @param {MAGPIE_EXP} exp
   * @param {MAGPIE_ENTITY} entity
   * @param {Boolean} switchID
   * @param {fitness_index} fitness_index
   * @returns {state_output}
   */
  onUpdate: (exp, entity, switchID, fitness_index) => {
    //degrade
  },
  onRemove: () => {},
  onExpire: () => {},
};
states.push(BIO_DEAD);
/** @type {Enumerator<Number>}  */
INDEX.BIO_DEAD = BIO_DEAD.ID;
//------------------------------------------------------------------------
const BIO_ALIVE = {
  ID: 21,
  type: TYPE.PERMANENT,
  name: "BIO_ALIVE",
  description: "",
  stack: 1,
  onApply: () => {
    //death effect
  },
  /**
   *
   * @param {MAGPIE_EXP} exp
   * @param {MAGPIE_ENTITY} entity
   * @param {Boolean} switchID
   * @param {fitness_index} fitness_index
   * @returns {state_output}
   */
  onUpdate: (exp, entity, switchID, fitness_index) => {
    if (switchID === MAGPIE.KEY.RUNTIME.LAYER.get(2).switch)
      return entity._switch_newDay(exp, fitness_index);
  },
  onRemove: () => {},
  onExpire: () => {},
};
states.push(BIO_ALIVE);
/** @type {Enumerator<Number>}  */
INDEX.BIO_ALIVE = BIO_ALIVE.ID;
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
 * @name GrowthLevels
 * @desc
 *
 */
//========================================================================
// #region - 101 to 200
//========================================================================
/**
 * @name
 * @desc
 *
 */
//------------------------------------------------------------------------
// #region > Growth
//------------------------------------------------------------------------
/** @type {state_data} */
const EMBRYO = {
  ID: MAGPIE.KEY.STATE.EMBRYO,
  type: TYPE.G_LVL,
  name: "EMBRYO",
  description: "",
  stack: 1,
  onApply: () => {},
  onUpdate: () => {},
  onRemove: () => {},
  onExpire: () => {},
};
states.push(EMBRYO);
/** @type {state_index}  */
INDEX.EMBRYO = EMBRYO.ID;
//------------------------------------------------------------------------
/** @type {state_data} */
const INFANT = {
  ID: MAGPIE.KEY.STATE.INFANT,
  type: TYPE.G_LVL,
  name: "INFANT",
  description: "",
  stack: 1,
  onApply: () => {},
  onUpdate: () => {},
  onRemove: () => {},
  onExpire: () => {},
};
states.push(INFANT);
/** @type {state_index}  */
INDEX.INFANT = INFANT.ID;
//------------------------------------------------------------------------
/** @type {state_data} */
const JUVENILE = {
  ID: MAGPIE.KEY.STATE.JUVENILE,
  type: TYPE.G_LVL,
  name: "JUVENILE",
  description: "",
  stack: 1,
  onApply: () => {},
  onUpdate: () => {},
  onRemove: () => {},
  onExpire: () => {},
};
states.push(JUVENILE);
/** @type {state_index}  */
INDEX.JUVENILE = JUVENILE.ID;
//------------------------------------------------------------------------
/** @type {state_data} */
const ADOLESCENT = {
  ID: MAGPIE.KEY.STATE.ADOLESCENT,
  type: TYPE.G_LVL,
  name: "ADOLESCENT",
  description: "",
  stack: 1,
  onApply: () => {},
  onUpdate: () => {},
  onRemove: () => {},
  onExpire: () => {},
};
states.push(ADOLESCENT);
/** @type {state_index}  */
INDEX.ADOLESCENT = ADOLESCENT.ID;
//------------------------------------------------------------------------
/** @type {state_data} */
const ADULT = {
  ID: MAGPIE.KEY.STATE.ADULT,
  type: TYPE.G_LVL,
  name: "ADULT",
  description: "",
  stack: 1,
  onApply: () => {},
  onUpdate: () => {},
  onRemove: () => {},
  onExpire: () => {},
};
states.push(ADULT);
/** @type {state_index}  */
INDEX.ADULT = ADULT;
//------------------------------------------------------------------------
/** @type {state_data} */
const ELDER = {
  ID: MAGPIE.KEY.STATE.ELDER,
  type: TYPE.G_LVL,
  name: "ELDER",
  description: "",
  stack: 1,
  onApply: () => {},
  onUpdate: () => {},
  onRemove: () => {},
  onExpire: () => {},
};
states.push(ELDER);
/** @type {state_index}  */
INDEX.ELDER = ELDER.ID;
// #endregion
//------------------------------------------------------------------------
/**
 * @name
 * @desc
 *
 */
//------------------------------------------------------------------------
// #region > Fertility
//------------------------------------------------------------------------
/** @type {state_data} */
const INHABITING = {
  ID: 111,
  type: TYPE.PERMANENT,
  name: "INHABITING",
  description: "",
  stack: 1,
  onApply: () => {},
  /**
   *
   * @param {MAGPIE_EXP} exp
   * @param {MAGPIE_ENTITY} entity
   * @param {Boolean} switchID
   * @param {fitness_index} fitness_index
   * @returns {state_output}
   */
  onUpdate: (exp, entity, switchID, fitness_index) => {},
  onRemove: () => {},
  onExpire: () => {},
};
states.push(INHABITING);
/** @type {state_index} */
INDEX.INHABITING = INHABITING.ID;
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
 * @name Accumulators
 * @desc
 *
 */
//========================================================================
// #region - 201 to 300
//========================================================================
/**
 * @name
 * @desc
 *
 */
//------------------------------------------------------------------------
// #region > Hunger
//------------------------------------------------------------------------
const HUNGER = {
  ID: 201,
  type: TYPE.ACCUMULATOR_INJURY,
  name: "HUNGER",
  description: "",
  stack: 99,
  onApply: (exp, entity, fitness_index) => {
    exp.keys.push(MAGPIE.KEY.INDEX.HUNGRY);
    return true;
  },
  /**
   *
   * @param {MAGPIE_EXP} exp
   * @param {MAGPIE_ENTITY} entity
   * @param {Boolean} switchID
   * @param {fitness_index} fitness_index
   * @returns {state_output}
   */
  onUpdate: (exp, entity, switchID, fitness_index) => {
    const TICK = 2;
    if (switchID >= TICK && entity._emote_dice(7 - switchID))
      return entity._emote_seekNRG(exp);
  },
  /**
   *
   * @param {MAGPIE_EXP} exp
   * @param {MAGPIE_ENTITY} entity
   * @param {Boolean} switchID
   * @param {fitness_index} fitness_index
   * @returns {state_output}
   */
  onRemove: (exp, entity, fitness_index) => {
    //@todo hunger remove
  },
  onExpire: () => {},
};
states.push(HUNGER);
/** @type {Enumerator<Number>}  */
INDEX.HUNGER = HUNGER.ID;
// #endregion
//------------------------------------------------------------------------
/**
 * @name
 * @desc
 *
 */
//------------------------------------------------------------------------
// #region > Fat
//------------------------------------------------------------------------
const FAT = {
  ID: 219,
  type: TYPE.ACCUMULATOR_INJURY,
  name: "FAT",
  description: "",
  stack: 99,
  onApply: () => {},
  onUpdate: () => {},
  onRemove: () => {},
  onExpire: () => {},
};
states.push(FAT);
/** @type {Enumerator<Number>}  */
INDEX.FAT = FAT.ID;
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
 * @name FSM
 * @desc
 *
 */
//========================================================================
// #region - 301 to 400
//========================================================================
/**
 * @name
 * @desc
 *
 */
//------------------------------------------------------------------------
// #region > seek
//------------------------------------------------------------------------

const SEEKING_TARGET = {
  ID: 302,
  type: TYPE.FSM_POSTURE,
  name: "SEEKING_TARGET",
  description: `exp.keys.find(keyID => {
			isTypeTARGET(keyID) ? seekTarget(exp) : return
		})`,
  stack: 1,
  onApply: () => {},
  /**
   *
   * @param {MAGPIE_EXP} exp
   * @param {MAGPIE_ENTITY} entity
   * @param {Boolean} switchID
   * @param {fitness_index} fitness_index
   * @returns {state_output}
   */
  onUpdate: (exp, entity, switchID, fitness_index) => {
    const target = exp.keys.includes(MAGPIE.KEY.INDEX.TARGET);
    if (!target || !switchID) return { exp: exp };
    return entity._emote_seekTarget(exp, fitness_index);
  },
  onRemove: () => {},
  onExpire: () => {},
};
states.push(SEEKING_TARGET);
/** @type {Enumerator<Number>}  */
INDEX.SEEKING_TARGET = SEEKING_TARGET.ID;
//------------------------------------------------------------------------
const REACHING_TARGET = {
  ID: 303,
  type: TYPE.FSM_POSTURE,
  name: "REACHING_TARGET",
  description: "",
  stack: 1,
  onApply: () => {},
  /**
   *
   * @param {MAGPIE_EXP} exp
   * @param {MAGPIE_ENTITY} entity
   * @param {Boolean} switchID
   * @param {fitness_index} fitness_index
   * @returns {state_output}
   */
  onUpdate: (exp, entity, switchID, fitness_index) => {
    const target = exp.keys.includes(MAGPIE.KEY.INDEX.TARGET);
    if (!target || !switchID) return { exp: exp };
    return entity._emote_reachTarget(exp, fitness_index);
  },
  onRemove: () => {},
  onExpire: () => {},
};
states.push(REACHING_TARGET);
/** @type {Enumerator<Number>}  */
INDEX.REACHING_TARGET = REACHING_TARGET.ID;
//------------------------------------------------------------------------
const APPROACHING_TARGET = {
  ID: 304,
  type: TYPE.FSM_POSTURE,
  name: "APPROACHING_TARGET",
  description: "",
  stack: 1,
  onApply: () => {},
  /**
   *
   * @param {MAGPIE_EXP} exp
   * @param {MAGPIE_ENTITY} entity
   * @param {Boolean} switchID
   * @param {fitness_index} fitness_index
   * @returns {state_output}
   */
  onUpdate: (exp, entity, switchID, fitness_index) => {
    const target = exp.keys.includes(MAGPIE.KEY.INDEX.TARGET);
    if (!target || !switchID) return { exp: exp };
    return entity._emote_approachTarget(exp, fitness_index);
  },
};
states.push(APPROACHING_TARGET);
/** @type {Enumerator<Number>}  */
INDEX.APPROACHING_TARGET = APPROACHING_TARGET.ID;
//------------------------------------------------------------------------
const ON_TARGET = {
  ID: 305,
  type: TYPE.FSM_POSTURE,
  name: "ON_TARGET",
  description: "",
  stack: 1,
  onApply: () => {},
  /**
   *
   * @param {MAGPIE_EXP} exp
   * @param {MAGPIE_ENTITY} entity
   * @param {Boolean} switchID
   * @param {fitness_index} fitness_index
   * @returns {state_output}
   */
  onUpdate: (exp, entity, switchID, fitness_index) => {
    const target = exp.keys.includes(MAGPIE.KEY.INDEX.TARGET);
    if (!target || !switchID) return { exp: exp };
    return entity._emote_onTarget(exp, fitness_index);
  },
  onRemove: () => {},
  onExpire: () => {},
};
states.push(ON_TARGET);
/** @type {Enumerator<Number>}  */
INDEX.ON_TARGET = ON_TARGET.ID;
//------------------------------------------------------------------------
/** @type {state_data} */
const IDLING = {
  ID: 306,
  type: TYPE.FSM_POSTURE,
  name: "IDLING",
  description: "",
  stack: 1,
  onApply: () => {},
  /**
   *
   * @param {MAGPIE_EXP} exp
   * @param {MAGPIE_ENTITY} entity
   * @param {Boolean} switchID
   * @param {fitness_index} fitness_index
   * @returns {state_output}
   */
  onUpdate: (exp, entity, switchID, fitness_index) => {
    return entity._emote_idling(exp, fitness_index);
  },
  onRemove: () => {},
  onExpire: () => {},
};
states.push(IDLING);
/** @type {Enumerator<Number>} */
INDEX.IDLING = IDLING.ID;
//------------------------------------------------------------------------
/** @type {state_data} */
const STOPPING = {
  ID: 307,
  type: TYPE.FSM_POSTURE,
  name: "STOPPING",
  description: "",
  stack: 1,
  onApply: () => {},
  /**
   *
   * @param {MAGPIE_EXP} exp
   * @param {MAGPIE_ENTITY} entity
   * @param {Boolean} switchID
   * @param {fitness_index} fitness_index
   * @returns {state_output}
   */
  onUpdate: (exp, entity, switchID, fitness_index) => {
    if (!exp.targetID) return { exp: exp };
    return entity._emote_stopping(exp, fitness_index);
  },
  onRemove: () => {},
  onExpire: () => {},
};
states.push(STOPPING);
/** @type {Enumerator<Number>} */
INDEX.STOPPING = STOPPING.ID;
//------------------------------------------------------------------------
/** @type {state_data} */
const ALIGNING_TARGET = {
  ID: 312,
  type: TYPE.FSM_POSTURE,
  name: "ALIGNING_TARGET",
  description: "",
  stack: 1,
  onApply: () => {},
  /**
   *
   * @param {MAGPIE_EXP} exp
   * @param {MAGPIE_ENTITY} entity
   * @param {Boolean} switchID
   * @param {fitness_index} fitness_index
   * @returns {state_output}
   */
  onUpdate: (exp, entity, switchID, fitness_index) => {
    const target = exp.keys.includes(MAGPIE.KEY.INDEX.TARGET);
    if (!target || !switchID) return { exp: exp };
    return entity._emote_aligningTarget(exp, fitness_index);
  },
  onRemove: () => {},
  onExpire: () => {},
};
states.push(ALIGNING_TARGET);
/** @type {Enumerator<Number>} */
INDEX.ALIGNING_TARGET = ALIGNING_TARGET.ID;
//------------------------------------------------------------------------
/** @type {state_data} */
const LOCKING_TARGET = {
  ID: 311,
  type: TYPE.FSM_POSTURE,
  name: "LOCKING_TARGET",
  description: "",
  stack: 1,
  onApply: () => {},
  /**
   *
   * @param {MAGPIE_EXP} exp
   * @param {MAGPIE_ENTITY} entity
   * @param {Boolean} switchID
   * @param {fitness_index} fitness_index
   * @returns {state_output}
   */
  onUpdate: (exp, entity, switchID, fitness_index) => {
    const target = exp.keys.includes(MAGPIE.KEY.INDEX.TARGET);
    if (!target || !switchID) return { exp: exp };
    return entity._emote_lockingTarget(exp, fitness_index);
  },
  onRemove: () => {},
  onExpire: () => {},
};
states.push(LOCKING_TARGET);
/** @type {Enumerator<Number>} */
INDEX.LOCKING_TARGET = LOCKING_TARGET.ID;
//------------------------------------------------------------------------
/** @type {state_data} */
const FACING_TARGET = {
  ID: 313,
  type: TYPE.FSM_POSTURE,
  name: "FACING_TARGET",
  description: "",
  stack: 1,
  onApply: () => {},
  /**
   *
   * @param {MAGPIE_EXP} exp
   * @param {MAGPIE_ENTITY} entity
   * @param {Boolean} switchID
   * @param {fitness_index} fitness_index
   * @returns {state_output}
   */
  onUpdate: (exp, entity, switchID, fitness_index) => {
    const target = exp.keys.includes(MAGPIE.KEY.INDEX.TARGET);
    if (!target || !switchID) return { exp: exp };
    return entity._emote_facingTarget(exp, fitness_index);
  },
  onRemove: () => {},
  onExpire: () => {},
};
states.push(FACING_TARGET);
/** @type {Enumerator<Number>} */
INDEX.FACING_TARGET = FACING_TARGET.ID;
//------------------------------------------------------------------------
/** @type {state_data} */
const DRIFTING = {
  ID: 314,
  type: TYPE.FSM_POSTURE,
  name: "DRIFTING",
  description: "",
  stack: 1,
  onApply: () => {},
  /**
   *
   * @param {MAGPIE_EXP} exp
   * @param {MAGPIE_ENTITY} entity
   * @param {Boolean} switchID
   * @param {fitness_index} fitness_index
   * @returns {state_output}
   */
  onUpdate: (exp, entity, switchID, fitness_index) => {
    const target = exp.keys.includes(MAGPIE.KEY.INDEX.TARGET);
    if (!target || !switchID) return { exp: exp };
    return entity._emote_drifting(exp, fitness_index);
  },
  onRemove: () => {},
  onExpire: () => {},
};
states.push(DRIFTING);
/** @type {Enumerator<Number>} */
INDEX.DRIFTING = DRIFTING.ID;
//------------------------------------------------------------------------
/** @type {state_data} */
const SPOOFED = {
  ID: 315,
  type: TYPE.FSM_POSTURE,
  name: "SPOOFED",
  description: "",
  stack: 1,
  onApply: () => {},
  /**
   *
   * @param {MAGPIE_EXP} exp
   * @param {MAGPIE_ENTITY} entity
   * @param {Boolean} switchID
   * @param {fitness_index} fitness_index
   * @returns {state_output}
   */
  onUpdate: (exp, entity, switchID, fitness_index) => {
    const target = exp.keys.includes(MAGPIE.KEY.INDEX.TARGET);
    if (!target || !switchID) return { exp: exp };
    return entity._emote_spoofed(exp, fitness_index);
  },
  onRemove: () => {},
  onExpire: () => {},
};
states.push(SPOOFED);
/** @type {Enumerator<Number>} */
INDEX.SPOOFED = SPOOFED.ID;
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
module.exports = { states, INDEX, TYPE };
