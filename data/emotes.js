const { MAGPIE } = require("../src/index")
const { INDEX } = require("./states")
/**
 * @typedef {import("../src/entity.js").MAGPIE_ENTITY} MAGPIE_ENTITY
 * @typedef {import("../src/component.js").MAGPIE_EXP} MAGPIE_EXP
 * @typedef {import("../src/index").vector3} vector3
 * @typedef {import("../SERVER.js").bivector} bivector
 * @typedef {import("../src/entity.js").fitness_index} fitness_index
 * @typedef {import("../src/index.js").stamina_index} stamina_index
 */
/** @type {import("../SERVER.js").exp_output} */
const defaults = { exp: null, At: [0,0,0], Tt: [0,0,0], keys: [], persist: null };
/** 
 * 
 * @typedef {{
 * ID: Number,
 * name: String,
 * type: Enumerator<Number>,
 * description: String,
 * condition: (...args) => Boolean,
 * onAction: Function,
 * onPassive: Function
 * }} emote_data
 * @type {emote_data[]} 
 * 
 * */
const data = [];
const SEEK_TARGET = {
	ID: MAGPIE.KEY.EMOTE.INDEX.SEEK_TARGET,
	name: "SEEK_TARGET",
	type: MAGPIE.KEY.EMOTE.TYPE.FSM,
	description: "pushes a target exp in queue and applies a 'seeking' "
		+ "perma state that queries the target exp for a target POVART to move to. "
		+ "This ensures that the entity can still process other exps, and that the "
		+ "target to seek can be updated with fresh info",
	condition: function(...args)
	{
		return true
	},
	/**
	 * 
	 * @param {MAGPIE_EXP} exp 
	 * @param {MAGPIE_ENTITY} entity 
	 * @param {stamina_index} stamina_index
	 * @returns {{At: vector3, Tt: bivector}} results
	 */
	onAction: function seekTarget(exp, entity, stamina_index) 
	{
		if(!exp || !entity || !stamina_index)
			return
		return entity.addState(stamina_index);
	},
	onPassive: function()
	{
		//
	}
}
data.push(SEEK_TARGET);
/** @type {emote_data} */
const SCHEDULE = {
	ID: MAGPIE.KEY.EMOTE.INDEX.SCHEDULE,
	name: "SCHEDULE",
	type: MAGPIE.KEY.EMOTE.TYPE.TRIGGER,
	description: "",
	condition: () => {return true},
	/**
	 * 
	 * @param {MAGPIE_EXP} exp 
	 * @param {MAGPIE_ENTITY} entity
	 * @param {stamina_index} stamina_index
	 * @returns {{At: vector3, Tt: bivector}}
	 */
	onAction: function schedule(exp, entity, stamina_index) 
	{
		return entity._emote_schedule(exp, stamina_index)
	},
	onPassive: () => {}
}
module.exports = data; 