/**
 *
 * @name ecosystem
 * @author Matheraptor
 * @version 0.39.962
 *
 */
class MAGPIE_ECOSYSTEM {
  //
}
const { MAGPIE } = require("./index");
const ePrefix = "[ECOSYSTEM] ";
/**
 * @name
 * @desc
 *
 */
//========================================================================
// #region - INDEX
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
 *
 */
//========================================================================
// #region - Manager
//========================================================================
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
 * @param {MAGPIE_SERVER} server
 * @param {Error} error
 */
function error(server, error) {
  server.error(ePrefix + level + e.message, e);
}
/**
 *
 * @param {MAGPIE_SERVER} server
 * @param {creature_data} creature_data
 * @returns {MAGPIE_ENTITY}
 */
function newCreature(server, creature_data) {
  const level = "[newCreature] ";
  try {
    const dummy = false;
    /** @type {MAGPIE_ENTITY} */
    return server.HIVE._new_creature(creature_data, dummy);
  } catch (e) {
    error(server, e);
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
// #region > Pop.
//------------------------------------------------------------------------

// #endregion
//------------------------------------------------------------------------
/**
 * @name
 * @desc
 *
 */
//------------------------------------------------------------------------
// #region > Adopt
//------------------------------------------------------------------------
/**
 *
 * @param {MAGPIE_SERVER} server
 * @param {entityID} speciesID
 * @returns {MAGPIE_ENTITY[]}
 */
MAGPIE_ECOSYSTEM._get_activeEmbryos = function (server, speciesID) {
  const level = "[_get_activeEmbryos] ";
  try {
    const db = server.DATABASE.sync.world;
    const criteria = {
      type: speciesID,
      growth: MAGPIE.KEY.STATE.EMBRYO,
    };
    return server.DATABASE.sync.getRow("MAGPIE_ENTITY", criteria, db);
  } catch (e) {
    error(server, e);
    return [];
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
 * @typedef {import("../SERVER").MAGPIE_SERVER} MAGPIE_SERVER
 * @typedef {import("./entity").MAGPIE_ENTITY} MAGPIE_ENTITY
 * @typedef {import("./component").MAGPIE_SYMBOL} MAGPIE_SYMBOL
 * @typedef {import("./component").symbolID} symbolID
 * @typedef {import("./entity").entityID} entityID
 * @typedef {import("./entity").entity_data} creature_data
 * @typedef {import("./component").symbol_data} archetype_data
 */
//========================================================================
// #region - Generator
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
 *
 * @returns {archetype_data}
 */
MAGPIE_ECOSYSTEM._generateArchetypeData = function () {
  const K = MAGPIE.KEY.INDEX;
  const reqs = K.REQUIREMENTS;
  const comps = K.COMPOUNDS;
  const stats = K.STATS;
  return {
    ID: NaN,
    type: NaN,
    name: "",
    desc: "",
    STATS: [reqs, comps, stats],
  };
};
/**
 *
 * @param {MAGPIE_SERVER} server
 * @param {archetype_data} data
 */
MAGPIE_ECOSYSTEM.generateArchetype = async function (server, data) {
  const level = "[generateArchetype] ";
  try {
    /** @type {MAGPIE_SYMBOL} */
    const archetype = server.HIVE._new_symbol(server.MAGPIE_SYMBOL, data);
    if (!archetype?.ID)
      throw new Error(`${archetype} is invalid MAGPIE_SYMBOL`);
    const result = await archetype.set();
    if (!result) throw new Error(`unable to save [ARCHETYPE-${archetype.ID}. `);
  } catch (e) {
    error(server, e);
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
 * @param {MAGPIE_SERVER} server
 * @param {MAGPIE_SYMBOL} aType
 * @param {symbolID[]} mutations
 */
MAGPIE_ECOSYSTEM.generateSpecies = async function (server, aType, mutations) {
  const level = "[generateSpecies] ";
  try {
    if (!server?.meta.firmwareName) throw new Error(`invalid server callback`);
    if (!aType?._firmware) throw new Error("invalid archetype");
    if (!mutations) mutations = [];
  } catch (e) {
    error(server, e);
  }
};
MAGPIE_ECOSYSTEM.decompressSpecies = function (server, speciesID) {
  const level = "[decompressSpecies] ";
  try {
    //
  } catch (e) {
    error(server, e);
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
// #region > Creature
//------------------------------------------------------------------------
/**
 *
 * @param {MAGPIE_SERVER} server
 * @param {MAGPIE_ENTITY} species
 * @returns {MAGPIE_ENTITY}
 */
MAGPIE_ECOSYSTEM.generateSpeciesOffspring = async function (server, species) {
  const level = "[generateSpeciesOffspring] ";
  try {
    //@todo generateSpeciesOffspring
    const traits = MAGPIE_ECOSYSTEM.traitRoulette(server, species);
    const creature_data = { type: species.type, fitness: traits };
    const offspring = newCreature(server, creature_data);
    if (!(offspring instanceof MAGPIE_ENTITY))
      throw new Error(`${offspring} is invalid MAGPIE_CREATURE`);
    offspring.STATS = species.STATS;
    offspring.STATS[MAGPIE.KEY.POVART.E_ID] = offspring.ID;
    const saved = await creature.set();
    if (!saved) throw new Error(`unable to save [CREATURE-${offspring.ID}] `);
    return offspring;
  } catch (e) {
    error(server, e);
  }
};
/**
 *
 * @param {MAGPIE_SERVER} server
 * @param {MAGPIE_ENTITY} species
 */
MAGPIE_ECOSYSTEM.traitRoulette = function (server, species) {
  const level = "[traitRoulette] ";
  try {
    const speciesTraits = species._get_traits();
  } catch (e) {
    error(server, e);
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
// END OF FILE
//========================================================================
module.exports = { MAGPIE_ECOSYSTEM };
