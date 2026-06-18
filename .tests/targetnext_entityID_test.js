module.exports = function (server) {
  const { MAGPIE } = require("../src/index");
  const { MAGPIE_ENTITY } = require("../src/entity");
  // const ePrefix = "[ENTITY.targetnext_entityID_test] ";
  // const entity = new MAGPIE_ENTITY({
  //   type: MAGPIE.KEY.ENTITY.TYPE.get("MATERIA").type,
  //   name: ePrefix,
  //   STATS: new Float64Array(MAGPIE.KEY.STATS.ARRAY),
  // });
  // const EarthID = 1773811061892;
  // entity.STATS[3] = EarthID;
  // entity.STATS[MAGPIE.KEY.POVART.E_ID] = entity.ID;
  // entity.STATS[MAGPIE.KEY.STATS.HOST] = EarthID;
  // const {
  //   MAGPIE_EXP,
  //   MAGPIE_KEY,
  //   MAGPIE_CONTEXT,
  // } = require("../src/component");
  // const target = new MAGPIE_ENTITY({
  //   type: MAGPIE.KEY.SYMBOL.TYPE.MARKER,
  //   name: ePrefix + "[TARGET]",
  // })
  // target.STATS = new Float64Array(entity.STATS);
  // target.STATS[MAGPIE.KEY.POVART.E_ID] = target.ID;
  // entity.exps.push(new MAGPIE_EXP({subject: entity.ID, target: target.ID}))
  // const exp = entity._get_exps()[0];
};
