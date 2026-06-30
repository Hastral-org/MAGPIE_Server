/**
 *
 * @name ecosystem
 * @author Matheraptor
 * @version 0.39.968
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
function error(server, level, e) {
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
    return server.HIVE._new_entity(creature_data, dummy);
  } catch (e) {
    error(server, level, e);
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
    error(server, level, e);
    return [];
  }
};
/**
 *
 * @param {MAGPIE_SERVER} server
 * @param {MAGPIE_ENTITY} species
 * @returns {MAGPIE_ENTITY[]}
 */
MAGPIE_ECOSYSTEM._get_adoptionList = async function (server, species) {
  const level = "[get_adoptionList] ";
  try {
    const activeEmbryos = MAGPIE_ECOSYSTEM._get_activeEmbryos(
      server,
      species.ID,
    );
    //@todo adoptionList
    const generatedEmbryos = [];
    return [...activeEmbryos, ...generatedEmbryos];
  } catch (e) {
    error(server, level, e);
  }
};
/**
 *
 * @param {MAGPIE_SERVER} server
 * @param {entityID} speciesID
 * @returns {MAGPIE_ENTITY}
 */
MAGPIE_ECOSYSTEM.adoptCreature = async function (server, speciesID) {
  const level = "[adoptCreature] ";
  try {
    /** @type {MAGPIE_ENTITY} */
    const species = server.HIVE._get_entity(speciesID);
    const list = MAGPIE_ECOSYSTEM._get_adoptionList(server, species);
    if (!list) throw new Error();
    const fertility = species._get_fertility();
    const embryoRatio = MAGPIE.KEY.ECOSYSTEM.EMBRYO_RATIO;
    for (let i = 0; i < fertility * embryoRatio; i++) {
      const embryo = await MAGPIE_ECOSYSTEM.generateSpeciesOffspring(
        server,
        species,
      );
      list.push(embryo);
    }
    const randomIndex = Math.floor(Math.random() * list.length);
    return list[randomIndex];
  } catch (e) {
    error(server, level, e);
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
    error(server, level, e);
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
    error(server, level, e);
  }
};
MAGPIE_ECOSYSTEM.decompressSpecies = function (server, speciesID) {
  const level = "[decompressSpecies] ";
  try {
    //
  } catch (e) {
    error(server, level, e);
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
    traits.push(MAGPIE.KEY.SYMBOL.EMBRYO);
    const creature_data = { type: species.type, fitness: traits };
    const offspring = newCreature(server, creature_data);
    if (!offspring?._firmware)
      throw new Error(`${offspring} is invalid MAGPIE_CREATURE`);
    offspring.name = species.name + "[OFFSPRING]";
    offspring.STATS = new Float64Array(species.STATS);
    offspring.STATS[MAGPIE.KEY.POVART.E_ID] = offspring.ID;
    const index = offspring._get_traits().indexOf(MAGPIE.KEY.SYMBOL.EMBRYO);
    offspring._get_states()[index] = MAGPIE.KEY.SYMBOL.EMBRYO;
    return offspring;
  } catch (e) {
    error(server, level, e);
  }
};
/**
 * @todo traitRoulette
 * @param {MAGPIE_SERVER} server
 * @param {MAGPIE_ENTITY} species
 */
MAGPIE_ECOSYSTEM.traitRoulette = function (server, species) {
  const level = "[traitRoulette] ";
  try {
    const speciesTraits = species._get_traits();
    return [...speciesTraits];
  } catch (e) {
    error(server, level, e);
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
