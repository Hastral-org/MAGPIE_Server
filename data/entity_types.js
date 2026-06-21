/**
 * @namespace MAGPIE.KEY.ENTITY.TYPE
 * @description centralized lookup table for entity types
 * @author Matheraptor
 * @license GNUGPLv3
 *
 * @version 0.19.1
 *
 * @changelog 20260419 {@link MAGPIE.meta.version}
 *
 * @typedef {import("../core/system").day} day
 * @typedef {import("../core/entity").entityID} entityID
 * @typedef {import("../core").orbit_data} orbit_data
 * @typedef {import("../core/physics").POVART} POVART
 * @typedef {Number} expID
 * @typedef {Number} stateID
 * @typedef {Number} traitID
 *
 * @typedef {{
 * name: String,
 * type: Enumerator<Number>,
 * birth: day,
 * parents: entityID[],
 * children: entityID[],
 * orbit: orbit_data,
 * POVART: POVART,
 * STATS: {},
 * traits: traitID[],
 * states: stateID[],
 * exps: expID[],
 * sensors: entityID[],
 * emitters: entityID[],
 * host: entityID,
 * inventory: entityID[],
 * equip: entityID[],
 * deck: traitID[],
 * vault: expID[]
 * }} entity_type_data
 * @type {Map<String, entity_type_data>}
 */
const ENTITY_TYPES = new Map();
const ENTITY_GENERIC = {
  name: "ENTITY_GENERIC",
  type: 1,
  birth: 0,
  parents: [],
  children: [],
  orbit: {},
  POVART: [],
  STATS: {},
  traits: [],
  states: [],
  exps: [],
  sensors: [],
  emitters: [],
  host: 0,
  inventory: [],
  equip: [],
  deck: [],
  vault: [],
};
ENTITY_TYPES.set("ENTITY_GENERIC", ENTITY_GENERIC);
const MARKER = structuredClone(ENTITY_GENERIC);
MARKER.type = ENTITY_GENERIC.type + 1;
ENTITY_TYPES.set("MARKER", MARKER);
const ASTROMARKER = structuredClone(MARKER);
ASTROMARKER.type = MARKER.type + 1;
ENTITY_TYPES.set("ASTROMARKER", ASTROMARKER);
const GEOMARKER = structuredClone(MARKER);
GEOMARKER.type = ASTROMARKER.type + 1;
ENTITY_TYPES.set("GEOMARKER", GEOMARKER);
const TILE_MARKER = structuredClone(MARKER);
TILE_MARKER.type = GEOMARKER.type + 1;
ENTITY_TYPES.set("TILE_MARKER", TILE_MARKER);
const CONTACT = structuredClone(MARKER);
CONTACT.type = 20;
ENTITY_TYPES.set("CONTACT", CONTACT);
const BEARING = structuredClone(MARKER);
BEARING.type = CONTACT.type + 1;
ENTITY_TYPES.set("BEARING", BEARING);
const META = structuredClone(MARKER);
META.type = BEARING.type + 1;
ENTITY_TYPES.set("META", META);
const LORE = structuredClone(MARKER);
LORE.type = META.type + 1;
ENTITY_TYPES.set("LORE", LORE);
const GROUP = structuredClone(MARKER);
ENTITY_TYPES.set("GROUP", GROUP);
GROUP.type = LORE.type + 1;
const CELESTIAL = structuredClone(ENTITY_GENERIC);
CELESTIAL.type = 200;
ENTITY_TYPES.set("CELESTIAL", CELESTIAL);
const STAR = structuredClone(CELESTIAL);
STAR.type = CELESTIAL.type + 1;
ENTITY_TYPES.set("STAR", STAR);
const PLANET = structuredClone(CELESTIAL);
PLANET.type = STAR.type + 1;
ENTITY_TYPES.set("PLANET", PLANET);
const MOON = structuredClone(CELESTIAL);
MOON.type = PLANET.type + 1;
ENTITY_TYPES.set("MOON", MOON);
const ASTEROID = structuredClone(CELESTIAL);
ASTEROID.type = MOON.type + 1;
ENTITY_TYPES.set("ASTEROID", ASTEROID);
const PLANET_GENERIC = structuredClone(PLANET);
PLANET_GENERIC.type = 220;
ENTITY_TYPES.set("PLANET_GENERIC", PLANET_GENERIC);
const PLANET_TERRESTRIAL = structuredClone(PLANET_GENERIC);
PLANET_TERRESTRIAL.type = PLANET_GENERIC.type + 1;
ENTITY_TYPES.set("PLANET_TERRESTRIAL", PLANET_TERRESTRIAL);
//
const MATERIA = structuredClone(ENTITY_GENERIC);
MATERIA.type = 400;
ENTITY_TYPES.set("MATERIA", MATERIA);
const CREATURE = structuredClone(MATERIA);
// CREATURE.type = 401;
// ENTITY_TYPES.set("CREATURE", CREATURE);
// const ITEM = structuredClone(MATERIA);
// ITEM.type = 411;
// ENTITY_TYPES.set("ITEM", ITEM);
//
module.exports = ENTITY_TYPES;
