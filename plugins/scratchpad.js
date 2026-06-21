/**
 * @namespace scratchpad
 * @author Matheraptor
 * @version 0.39.0
 *
 *
 *
 * @description stuff below here is wiped after save
 */
const { MAGPIE } = require("../index");
const { MAGPIE_PHYSICS } = require("../physics");
const {
  MAGPIE_SYSTEM,
  MAGPIE_HIVE,
  MAGPIE_CALENDAR,
  MAGPIE_DATE,
  MAGPIE_IO,
  MAGPIE_LOG,
  MAGPIE_RUNTIME,
  MAGPIE_METASTATE,
} = require("../system");
const {
  MAGPIE_COMPONENT,
  MAGPIE_SYMBOL,
  MAGPIE_EXP,
  MAGPIE_KEY,
  MAGPIE_EMOTE,
  MAGPIE_CONTEXT,
  MAGPIE_STATE,
  MAGPIE_TICKET,
} = require("../component");
const { MAGPIE_ENTITY } = require("../entity");
const PHYSICS = MAGPIE_PHYSICS;
const diego = new MAGPIE_ENTITY();
//========================================================================
// #region - Scratchpad

// #endregion
//========================================================================
r.context.diego = r.context.HIVE._get_entity(1773811141134);
r.context.HIVE._host_context(r.context.HIVE._get_context(1779288098611));
r.context.HIVE._kick_context(1779288098611)[
  ([101, "universe"],
  [1780067307221, "Milky Way context"],
  [1780065722808, "Sol context"],
  [1773811061892, "Terra"],
  [1780232437463, "TERRA context"],
  [1773811141134, "HTP A9805 'Diego Marea'"],
  [1779288098611, "DIEGO context"],
  [1780224844436, "test ecosystem"],
  [1780230954989, "nature archetypes"],
  [1779733399799, "test territory"],
  [1779732886641, "WP-249-27"],
  [1779734993195, "WP-249-28"],
  [1780036463811, "WP-249-29"],
  [1779732886642, "WP-249-30"],
  [1778365115809, "WP-249-31"],
  [1779734993194, "WP-249-32"],
  [1778493972858, "WP-249-33"],
  [1779732928567, "WP-249-34"],
  [1779733071469, "WP-249-35"],
  [1779733071470, "WP-249-36"],
  [1779732928566, "WP-249-37"],
  [1779733399798, "WP-249-38"],
  [1779735513215, "test creature 1"],
  [1779735513216, "test creature 2"],
  [1779747270776, "test creature 3"],
  [1780235663887, "test creature 4"],
  [1780060918485, "test creature 5"],
  [1780061063318, "test species 1"],
  [1779026345447, "Milky Way"],
  [1779026102091, "Sol"][(1780237604510, "free key")])
];
diego = HIVE._get_entity(1773811141134);
exp = diego._get_exps()[0];
diego._set_O1(PHYSICS._rotor_fromEulerAbs(86, 50, 170, diego._get_P0()));
diego._set_R1([0, 0, 0]);
diego._set_P1(
  PHYSICS.addVectors(
    diego._get_P0(),
    PHYSICS.scaleVector(diego._get_V0(), 60 * 60),
  ),
);
V1 = PHYSICS.targetVelocity(
  diego._get_P0(),
  PHYSICS.geodeticToCartesian([40.552886, 141.501683, 0], 0.5),
);
PHYSICS._get_V0_heading(diego._get_P0(), V1);
METASTATE.date.megaTICK();
