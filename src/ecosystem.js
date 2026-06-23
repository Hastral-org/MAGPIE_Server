/**
 *
 * @name ecosystem
 * @author Matheraptor
 * @version 0.39.957
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
// #region - MANAGER
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
 * @typedef {import("./entity").entity_data} creature_data
 */
//========================================================================
// #region - GENERATOR
//========================================================================
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
    const creature_data = { fitness: traits };
    const offspring = newCreature(server, creature_data);
    if (!(offspring instanceof MAGPIE_ENTITY))
      throw new Error(`${offspring} is invalid MAGPIE_CREATURE`);
    const saved = await creature.set();
    if (!saved) throw new Error(`unable to save [CREATURE-${offspring.ID}] `);
    await offspring.setup(creature_data);
    return offspring;
  } catch (e) {
    error(server, e);
  }
};
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
