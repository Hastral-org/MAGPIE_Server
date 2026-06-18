/**
 * @name
 * @desc
 * @version 0.39.94
 *
 */
//========================================================================
// #region - INDEX
//========================================================================
const { MAGPIE } = require("./index");
const { MAGPIE_SYSTEM } = require("./system");
const STATE_INDEX = require("../data/states").INDEX;
function MAGPIE_PHYSICS() {
  this.initialize(...arguments);
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
 * @desc {@link MAGPIE_SYSTEM} of {@link MAGPIE}
 * @typedef {import("./entity").MAGPIE_ENTITY} MAGPIE_ENTITY
 * @typedef {import("./index").orbit} orbit [a,e,i,raan,aop,nu,T0,M0]
 * @typedef {import("./index").duration} duration in s
 * @typedef {import("./index").distance} distance in m
 * @typedef {Number} radius distance from center point
 * @typedef {Number} volume in L
 * @typedef {Number} mass in kg
 * @typedef {Number} velocity in m/s
 * @typedef {Number} acceleration m/s²
 * @typedef {Number} index
 * @typedef {Number} magnitude
 * @typedef {angle_deg} heading hdg 0/360°
 * @typedef {angle_euler} pitch pitch -180/180°
 * @typedef {angle_euler} roll roll -180/180°
 * @typedef {[Number, Number, Number]} vector3 3D vector [x,y,z]
 * @typedef {[Number, Number, Number]} bivector 3D bivector [yz, xz, xy]
 * @typedef {[Number, Number, Number, Number]} rotor [yz, xz, xy, w]
 * @typedef {Number} theta (θ) angular displacement in rad
 * @typedef {Number} omega (ω) angular velocity in rad/s
 * @typedef {Number} alpha (α) angular acceleration in rad/s²
 * @typedef {Number} torque (𝜏) in N*m
 * @typedef {Number} MoI moment of inertia (I) in kg*m²
 * @typedef {Number} electric_current in Ampere (A)
 * @typedef {Number} temperature in Kelvin (K)
 * @typedef {Number} substance Mole (mol)
 * @typedef {Number} luminosity Candela (cd)
 * @typedef {Number} force in Newton (N) = kg * m/s²
 * @typedef {Number} energy in Joule (J) = N * m / kg * m²/s²
 * @typedef {Number} power in Watt (W) = J/s / kg * m²/s³
 * @typedef {Number} pressure in Pascal (Pa) = N/m² or kg/(m*s²)
 * @typedef {Number} frequency in Hertz (Hz) = 1/s
 * @typedef {Number} voltage in Volt (V) = kg * m²/(s³ * A)
 * @typedef {Number} angle_rad in radians (rad) 0 to PI
 * @typedef {Number} angle_deg in degrees (°) 0 to 360
 * @typedef {Number} angle_euler in degress (°) -180 to 180
 * @typedef {Number} ratio variable * ratio<0 to 1>
 * @typedef {Number} coefficient variable * coefficient
 * @typedef {Number} percentage %
 * @typedef {Number} density kg/L
 * @typedef {Number} atmo_density atmospheric density = kg/m³
 * @typedef {Number} epoch_real_s time in s since epoch J2000
 * @typedef {Number} flow L/s
 *
 * @typedef {vector3} POVART_P POVART position vector | 3D cartesian from parent celestialBody center
 * @typedef {distance} P_mag POVART position magnitude is m from celestial body center
 * @typedef {rotor} POVART_O POVART orientation rotor
 * @typedef {Number} O_mag POVART orientation rotor magnitude must always be 1 (use {@link MAGPIE_PHYSICS.rotorNormalize})
 * @typedef {vector3} POVART_V POVART velocity vector
 * @typedef {velocity} V_mag POVART velocity magnitude is velocity in m/s
 * @typedef {vector3} POVART_A POVART acceleration vector
 * @typedef {acceleration} A_mag POVART acceleration magnitude is acceleration in m/s²
 * @typedef {bivector} POVART_R POVART rotation bivector a.k.a. angular velocity
 * @typedef {omega} R_mag POVART rotation magnitude is angular velocity (ω) in rad/s
 * @typedef {bivector} POVART_T POVART torque bivector a.k.a. angular acceleration
 * @typedef {alpha} T_mag POVART torque magnitude is angular acceleration (α) in rad/s²
 *
 * @typedef {import("./entity").entity_stats} entity_stats
 * @typedef {import("./entity").STATS} STATS
 * @typedef {import("./index").keyID} keyID
 * @typedef {import("./index").stateID} stateID
 * @typedef {import("./entity").fitness_output} fitness_output
 *
 */
//========================================================================
//#region - PHYSICS
//========================================================================
MAGPIE_PHYSICS.meta = {};
MAGPIE_PHYSICS.prototype.constructor = MAGPIE_PHYSICS;
/**
 * @desc back to {@link MAGPIE_PHYSICS.meta}
 *
 */
//========================================================================
//#endregion --- Physics
//========================================================================
/**
 * @name
 * @desc
 *
 */
//========================================================================
// #region - GANJA
//========================================================================
MAGPIE_PHYSICS.ganja = {};
MAGPIE_PHYSICS.ganja.meta = "";
/**
 * @name
 * @desc
 * @typedef {Object} gRotor
 */
//------------------------------------------------------------------------
// #region > Rotor
//------------------------------------------------------------------------
const { e0, e1, e2, e3 } = require("ganja.js")(3, 0, 1);
const planetCenter = 1e123;
const PGA = require("ganja.js")(3, 0, 1);
// Remove or fix the direct call to PGA that causes the 'new' error
// PGA(() => { ... }) is invalid if PGA is a class. Ganja supports Algebra(3,0,1, () => {...})
require("ganja.js")(3, 0, 1, () => {
  const planetCenter = 1e123;
  let motor = Math.exp(1000 * 0.5 * 1e3);
  let linearVelocity = 10.0;
  function physicsTick(pitchInput, yawInput, rollInput) {
    const pitch = Math.exp(pitchInput * 0.5 * 1e23);
    const yaw = Math.exp(yawInput * 0.5 * 1e31);
    const roll = Math.exp(rollInput * 0.5 * 1e12);
    const localTurn = yaw * pitch * roll;
    const localMove = Math.exp(linearVelocity * 0.5 * 1e3);
    motor = motor * localTurn * localMove;
    motor = motor / Math.sqrt(motor * ~motor);
  }
  physicsTick(0.01, 0.005, 0.0);
});

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
// #region - LOW
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
 * @typedef {[Number, Number, Number]} coords [lat, lon, ASL]
 * @desc {@link MAGPIE_PHYSICS.aero}
 *
 *
 */
//========================================================================
//#region - GEODETIC
//========================================================================
MAGPIE_PHYSICS.geodetic = {};
/**
 * @name
 * @desc
 *
 */
//------------------------------------------------------------------------
// #region > validation
//------------------------------------------------------------------------
/**
 *
 * @param {coords} coords
 * @returns {Boolean}
 */
MAGPIE_PHYSICS.isValidCoords = function isValidCoords(coords) {
  if (
    Array.isArray(coords) ||
    coords.length < 3 ||
    coords.some((n) => isNaN(n))
  )
    return false;
  return true;
};
// #endregion
//------------------------------------------------------------------------
/**
 *
 * @param {Number} lat1 latitude of origin, in DD°
 * @param {Number} lon1 longitude of origin, in DD°
 * @param {Number} lat2 latitude of destination, in DD°
 * @param {Number} lon2 longitude of destination, in DD°
 * @param {Number} R radius from the center of the celestial body, in meters
 * @returns {Number} distance in meters
 */
MAGPIE_PHYSICS.haversine = function haversine(
  lat1,
  lon1,
  lat2,
  lon2,
  R = null,
) {
  if (isNaN(R)) R = MAGPIE.KEY.PHYSICS.EARTH.RADIUS;
  const PI = Math.PI / 180;
  const A = { lat: lat1 * PI, lon: lon1 * PI };
  const B = { lat: lat2 * PI, lon: lon2 * PI };
  const a =
    Math.cos(A.lat) * Math.cos(B.lat) * Math.cos(A.lon) * Math.cos(B.lon);
  const b =
    Math.cos(A.lat) * Math.sin(A.lon) * Math.cos(B.lat) * Math.sin(B.lon);
  const c = Math.sin(A.lat) * Math.sin(B.lat);
  const d = Math.acos(a + b + c) * R;
  return d;
};
MAGPIE_PHYSICS.geodeticDMStoDD = function geodeticDMStoDD(deg, dir, min, sec) {
  if (!deg || !dir) return;
  let dd = deg + min / 60 + sec / 3600;
  if (dir === "S" || dir === "W") dd *= -1;
  return dd;
};
/**
 *
 * @param {Number} lat DD latitude Float° || ""
 * @param {Number} lon DD longitude Float° (optional)
 * @returns
 */
MAGPIE_PHYSICS.geodeticDDtoDMS = function geodeticDDtoDMS(lat = "", lon = "") {
  if (!lat && !lon) return;
  const DMS = (coord, cardinals) => {
    const deg = Math.floor(Math.abs(coord));
    const min = (Math.abs(coord) % deg) * 60;
    const minutes = Math.floor(min);
    const seconds = Math.floor((min % minutes) * 60);
    let cardinal = coord >= 0 ? cardinals[0] : cardinals[1];
    return { deg, minutes, seconds, cardinal };
  };
  if (lat) {
    const coord = DMS(lat, ["N", "S"]);
    lat = `${coord.deg}°${coord.minutes}'${coord.seconds}''${coord.cardinal}`;
  }
  if (lon) {
    const coord = DMS(lon, ["E", "W"]);
    lon = `${coord.deg}°${coord.minutes}'${coord.seconds}''${coord.cardinal}`;
  }
  return `${lat}${lon}`;
};
/**
 * {@link MAGPIE_PHYSICS.targetDistanceSph}
 * @param {coords} C0
 * @param {distance} r
 * @returns {vector3} Position vector [x, y, z]
 */
MAGPIE_PHYSICS.geodeticToCartesian = function geodeticToCartesian(C0, r) {
  if (isNaN(r)) r = MAGPIE.KEY.PHYSICS.EARTH.RADIUS;
  const [lat, lon, ASL] = C0;
  const R = r + ASL;
  const phi = lat * (Math.PI / 180);
  const lambda = lon * (Math.PI / 180);
  const x = R * Math.cos(phi) * Math.cos(lambda);
  const y = R * Math.cos(phi) * Math.sin(lambda);
  const z = R * Math.sin(phi);
  return [x, y, z];
};
/**
 * @sister of {@link MAGPIE_PHYSICS.geodeticToCartesian}
 * @param {vector3} P0
 * @param {Number} R radius of the celestial body in meters
 * @returns {coords} [lat°, lon°, ASL(m)]
 */
MAGPIE_PHYSICS.cartesianToGeodetic = function cartesianToGeodetic(P0, R) {
  if (!this.isValidVector(P0)) return;
  if (isNaN(R)) R = MAGPIE.KEY.PHYSICS.EARTH.RADIUS;
  const [x, y, z] = P0;
  const totR = Math.sqrt(x ** 2 + y ** 2 + z ** 2);
  const lat = Math.asin(z / totR) * (180 / Math.PI);
  const lon = Math.atan2(y, x) * (180 / Math.PI);
  const ASL = Number((totR - R).toFixed(10));
  return [lat, lon, ASL];
};

/**
 * @todo replace with proper collisions
 * @param {distance} r celestial radius
 * @param {coords} C0
 * @param {POVART} POVART0
 * @param {duration} dt
 * @returns {{clamped: Boolean, Pg: vector3, Og: rotor, Vg: vector3 }}
 */
MAGPIE_PHYSICS._geod_clampToGround = function _geod_clampToGround(
  r,
  C0,
  POVART0,
  dt,
) {
  const ePrefix = `[PHYSICS].clampToGround: `;
  try {
    const [lat, lon, ASL] = C0;
    // return { clamped: false }
    if (ASL >= 1) return { clamped: false };
    const { P0, O0, V0 } = this.decomp_POVART(POVART0);
    const up = this.normalizeVector(P0);
    const Pg = this.scaleVector(up, r);
    const Vvertical = this.dotProduct(V0, up);
    const Vg =
      Vvertical < 0 ? this.subVectors(V0, this.scaleVector(up, Vvertical)) : V0;
    const currentHdg = this._rotor_toHeadingAbs(O0, Pg);
    const globalUp = MAGPIE.KEY.POVART.UP;
    const dotN = this.dotProduct(globalUp, up);
    const localNorth = this.normalizeVector(
      this.subVectors(globalUp, this.scaleVector(up, dotN)),
    );
    const localEast = this.crossProduct(localNorth, up);
    const hdgRad = this._U_deg_to_rad(currentHdg);
    const Tfwd = this.addVectors(
      this.scaleVector(localNorth, Math.cos(hdgRad)),
      this.scaleVector(localEast, Math.sin(hdgRad)),
    );
    // const Og = this.rotorFromFrame(Tfwd, up);
    const hdg = this._rotor_toHeadingAbs(O0, Pg);
    const Og = this._rotor_fromEulerAbs(hdg, 0, 0, Pg);
    const dir = this.rotorApply(Og, MAGPIE.KEY.POVART.FWD);
    const Vv = this.scaleVector(dir, this.mag(Vg));
    // const Og = O0
    // MAGPIE_SYSTEM._logging_debug(`Og: ${this._rotor_toHeadingAbs(Og, Pg)}`)
    return { clamped: true, Pg, Vg: Vv, Og: Og };
  } catch (e) {
    MAGPIE_SYSTEM.error(ePrefix + e.message, e);
  }
};

/**
 *
 * @param {mass} Cmass
 * @param {vector3} P0
 * @return {vector3} Ag
 */
MAGPIE_PHYSICS._forces_calculate2BodyGravityVector =
  function _forces_calculate2BodyGravityVector(P0, Cmass) {
    const ePrefix = `[PHYSICS].2BodyGvector: `;
    try {
      const r = this.mag(P0);
      if (r < 1) return [0, 0, 0];
      const gMag = (MAGPIE.KEY.PHYSICS.G * Cmass) / r ** 2;
      const down = this.scaleVector(this.normalizeVector(P0), -1);
      return this.scaleVector(down, gMag);
    } catch (e) {
      MAGPIE_SYSTEM.error(ePrefix + e.message, e);
    }
  };
/**
 * @todo calculateForces
 * @param {MAGPIE_ENTITY} P_C
 * @param {vector3} P0
 * @param {coords} C0
 * @param {Number} Cf
 * @param {Number} Cl
 * @param {Number} Cd
 * @param {Number} CoM
 * @param {Number} CoL
 * @param {angle} AoA
 * @param {vector3} At
 * @returns {physics_forces}
 */
MAGPIE_PHYSICS._geod_calculateForces = function _geod_calculateForces(
  P_C,
  P0,
  C0,
  Cf,
  Cl,
  Cd,
  CoM,
  CoL,
  AoA,
  At,
) {
  const ePrefix = `[PHYSICS].geodForces: `;
  const K = MAGPIE.KEY.PHYSICS.FORCES;
  const offset = K.ARRAY;
  try {
    // const { Ff, eFf } =
    // forces[K.FF] = Ff;
    // forces[K.FF + offset] = eFf;
    // const { Fl, eFl } = this._geod_liftAtCoords(C1, Cl, AoA, CoM, CoL);
    // forces[K.FL] = Fl;
    // forces[K.FL + offset] = eFl;
    // const { Fd, eFd } = this._geod_dragAtCoords(C1, Cd, Fl, AoA);
    // forces[K.FD] = Fd;
    // forces[K.FD + offset] = eFd;
    // const A0 = At;
    // At = this.scaleVector(A0, -eFd);
    const FG = this._scale_gravity(P_C, P0);
    const FF = this._geod_frictionAtCoords(C, C0, Cf);
    const FD = this._geod_applyDrag(P_C, C0, Cd);
    const FL = NaN;
    const AOA = NaN;
    const Atm = NaN;
    const OAT = NaN;
    const Dew = NaN;
    const Breeze = NaN;
    const Lit = NaN;
    const Rad = NaN;
    const forces = new Float64Array([
      FG,
      FF,
      FD,
      FL,
      AOA,
      Atm,
      OAT,
      Dew,
      Breeze,
      Lit,
      Rad,
    ]);
  } catch (e) {
    MAGPIE_SYSTEM.error(ePrefix + e.message, e);
    return [];
  }
};
/**
 *
 * @param {MAGPIE_ENTITY} C
 * @param {coords} C1
 * @param {coefficient} Cf
 * @returns {force}
 */
MAGPIE_PHYSICS._geod_frictionAtCoords = function (C, C1, Cf) {
  return NaN;
};
/**
 * @param {{
 * C: MAGPIE_ENTITY,
 * C0: coords,
 * C1: coords,
 * CB: vector3
 * }} data
 * @returns {{Ac: vector3, Tc: bivector}}
 * @todo checkCollisions
 */
MAGPIE_PHYSICS._geod_checkCollisions = function _geod_checkCollisions(data) {
  //
};
/**
 *
 * back to {@link MAGPIE_PHYSICS.geodetic}
 */
//========================================================================
//#endregion --- Geodetic
//========================================================================
/**
 * @name target
 * @desc section of {@link MAGPIE_PHYSICS.meta}
 *
 */
//========================================================================
//#region - TARGET
//========================================================================
MAGPIE_PHYSICS.target = {};
/**
 *
 * @param {vector3} P0 current position (P₀)
 * @param {vector3} P1 target position (P₁)
 * @param {Number} cruiseSpeed Vspeed (m/s)
 * @returns {vector3} target velocity (V₁)
 */
MAGPIE_PHYSICS.targetVelocity = function targetVelocity(
  P0,
  P1,
  cruiseSpeed = 1,
) {
  const ePrefix = `[MAGPIE_PHYSICS].targetVelocity: `;
  try {
    const diff = this.subVectors(P1, P0);
    const dir = this.normalizeVector(diff);
    return this.scaleVector(dir, cruiseSpeed);
  } catch (e) {
    MAGPIE_SYSTEM.error(ePrefix + e.message, e);
    return [0, 0, 0];
  }
};
/**
 *
 * @param {vector3} At
 * @param {acceleration} Amax
 * @returns {vector3}
 */
MAGPIE_PHYSICS._POVART_applyTargetA = function _POVART_applyTargetA(At, Amax) {
  const ePrefix = `[PHYSICS].applyTargetA: `;
  try {
    const dA = this.vector_clamp_mag(At, Amax);
    if (!this.isValidVector(dA)) throw new Error(`${dA} is invalid vector dA`);
    return dA;
  } catch (e) {
    MAGPIE_SYSTEM.error(ePrefix + e.message, e);
  }
};
/**
 *
 * @param {rotor} O0
 * @param {bivector} Tt
 * @param {[x<Number>, y<Number>, z<Number>]} Tmax
 * @param {[x<Number>, y<Number>, z<Number>]} inertia
 * @returns {bivector} dT
 */
MAGPIE_PHYSICS._POVART_applyTargetT = function _POVART_applyTargetT(
  O0,
  Tt,
  Tmax,
  inertia,
) {
  const ePrefix = `[PHYSICS].applyTargetT: `;
  try {
    const Oinv = this.rotorReverse(O0);
    const Tlocal = this.rotorApply(Oinv, Tt);
    const netCapX = Math.max(0, Tmax[0] - inertia[0]) || 1;
    const netCapY = Math.max(0, Tmax[1] - inertia[1]) || 1;
    const netCapZ = Math.max(0, Tmax[2] - inertia[2]) || 1;
    const TclampX = this._U_clampRange(Tlocal[0], -netCapX, netCapX);
    const TclampY = this._U_clampRange(Tlocal[1], -netCapY, netCapY);
    const TclampZ = this._U_clampRange(Tlocal[2], -netCapZ, netCapZ);
    const Tclamped = this.rotorApply(O0, [TclampX, TclampY, TclampZ]);
    const dT = Tclamped;
    if (!this.isValidVector(dT)) throw new Error(`${dT} is invalid vector dT`);
    return dT;
  } catch (e) {
    MAGPIE_SYSTEM.error(ePrefix + e.message, e);
  }
};
/**
 *
 * back to {@link MAGPIE_PHYSICS.target}
 */
//========================================================================
//#endregion
//========================================================================
/**
 *
 *
 */
//========================================================================
//#region - APPLY
//========================================================================
MAGPIE_PHYSICS.apply = {};
/**
 * @name
 * @desc
 *
 */
//------------------------------------------------------------------------
// #region > target
//------------------------------------------------------------------------

/**
 *
 * @param {POVART} POVART0
 * @param {vector3} dA delta acceleration vector
 * @param {bivector} dT delta torque bivector
 * @param {Number} dt delta time in seconds
 * @returns {POVART} POVART₁
 */
MAGPIE_PHYSICS.applyDeltaAT = function applyDeltaAT(POVART0, dA, dT, dt) {
  const message = `[PHYSICS].applyDeltaAT: `;
  try {
    const POVART1 = MAGPIE_PHYSICS.applyAcceleration(POVART0, dA, dt);
    return MAGPIE_PHYSICS.applyTorque(POVART1, dT, dt);
  } catch (e) {
    MAGPIE_SYSTEM.error(message + e.message, e);
    return POVART0;
  }
};
MAGPIE_PHYSICS._POVART_getTargetAT = function (POVART0, A1, T1, dt) {
  if (isNaN(dt)) throw new Error(`(${dt}) is invalid dt`);
  if (!dt) return defaults;
  if (!MAGPIE_PHYSICS.isValidVector(A1)) A1 = [0, 0, 0];
  if (!MAGPIE_PHYSICS.isValidVector(T1)) T1 = [0, 0, 0];
  //
  const P_C = this.celestialSync();
  if (!MAGPIE_ENTITY.isValidCelestial(P_C))
    throw new Error(`(${P_C}) is invalid celestial`);
  const r = P_C.radius();
  let POVART_A = MAGPIE_PHYSICS.setAcceleration(this.POVART, A1);
  let POVART_AT = MAGPIE_PHYSICS.setTorque(POVART_A, T1);
  //
  const R0 = MAGPIE_PHYSICS.getRotation(POVART_AT);
  const dR = MAGPIE_PHYSICS.scaleVector(T1, dt);
  const R1 = MAGPIE_PHYSICS.addVectors(R0, dR);
  //
  const O0 = MAGPIE_PHYSICS.getOrientation(POVART_AT);
  const dO = MAGPIE_PHYSICS.rotorFromBivector(R1, dt);
  const cO = MAGPIE_PHYSICS.rotorCompose(O0, dO);
  const O1 = MAGPIE_PHYSICS.rotorNormalize(cO);
  //
  const V0 = MAGPIE_PHYSICS.getVelocity(POVART_AT);
  const dV = MAGPIE_PHYSICS.scaleVector(A1, dt);
  const V1 = MAGPIE_PHYSICS.addVectors(V0, dV);
  const dP = MAGPIE_PHYSICS.scaleVector(V1, dt);
  const P0 = this._POVART_getPosition();
  const P1 = MAGPIE_PHYSICS.addVectors(P0, dP);
};
/**
 *
 * @param {MAGPIE_ENTITY} entity
 * @param {duration} dt
 * @param {vector3} At
 * @param {bivector} Tt
 * @param {rotor} O0
 * @returns {{At: vector3, Tt: bivector}}
 */
MAGPIE_PHYSICS._POVART_applyTargetAT = function applyTargetAT(
  entity,
  dt,
  At,
  Tt,
  O0,
) {
  const ePrefix = "[PHYSICS].applyTargetAT: ";
  try {
    const K = MAGPIE.KEY.STATS;
    const PAR = entity.STATS;
    const Amax = PAR[K.AMAX];
    //@todo verify inertia
    // if(!options?.Tmax)
    // {
    // 	const a = this._calculateAgilityAlpha(options?.STATS);
    // 	const a1 = this._get_agilityModifier(options.agility, a);
    // 	const Tmax = this._getTmax(options?.STATS, a1);
    // 	options.Tmax = Tmax;
    // }
    const inertia = [PAR[K.INERT_X], PAR[K.INERT_Y], PAR[K.INERT_Z]];
    const Tmax = [PAR[K.TMAX_X], PAR[K.TMAX_Y], PAR[K.TMAX_Z]];
    const At2 = this._POVART_applyTargetA(At, Amax);
    const Tt2 = this._POVART_applyTargetT(O0, Tt, Tmax, inertia);
    if (At2) At = At2;
    if (Tt2) Tt = Tt2;
    return { At: At, Tt: Tt };
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
// #region > emotes
//------------------------------------------------------------------------
/**
 * @name
 * @desc
 *
 */
//------------------------------------------------------------------------
// #region move
//------------------------------------------------------------------------

/**
 *
 * @param {vector3} P0 current position (P₀)
 * @param {vector3} P1 target position (P₁)
 * @param {vector3} V0 current velocity vector (V₀)
 * @param {Number} Vmax max speed
 * @param {Number} Amax max acceleratio
 * @param {Number} Bmax max braking
 * @param {Number} tolerance tolerance (m)
 * @returns {vector3} A₁
 */
MAGPIE_PHYSICS._move_linearTo = function _move_linearTo(
  P0,
  P1,
  V0,
  Vmax,
  Amax,
  Bmax,
  tolerance = 0.5,
) {
  const ePrefix = `[PHYSICS].moveLinear: `;
  try {
    const D0 = this.distanceTo(P0, P1);
    const S0 = this.mag(V0);
    // 1. arrival check
    if (D0 <= tolerance) {
      const stopDistance = 0;
      const finalBrake = this.getBrakingA(P0, P1, V0, stopDistance);
      return this.vector_clamp_mag(finalBrake, Bmax);
    }
    // 2. Braking start check
    const Bdist = S0 ** 2 / (2 * Bmax);
    if (D0 <= Bdist + tolerance) {
      const brakeA = this.getBrakingA(P0, P1, V0, tolerance);
      return this.vector_clamp_mag(brakeA, Bmax);
    }
    // 3. transit / acceleration phase
    const Vcruise = this.targetVelocity(P0, P1, Vmax);
    const dV = this.subVectors(Vcruise, V0);
    //clamp to maximum power
    return this.vector_clamp_mag(dV, Amax);
  } catch (e) {
    MAGPIE_SYSTEM.error(ePrefix + e.message, e);
    return [NaN, NaN, NaN];
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
// #region seek
//------------------------------------------------------------------------
/**
 * 
 * @param {POVART} POVART0 
 * @param {*} options 
 * @returns {{ At: vector3, Tt: bivector, raw: {}, stopped: Boolean }}
 */
MAGPIE_PHYSICS._emote_stop = function(POVART0, options) {
  const ePrefix = "[PHYSICS].emoteStop: ";
  try {
    const { P0, V0, R0 } = this.decomp_POVART(POVART0);
    const S0 = this.mag(V0);
    const unitV0 = this.normalizeVector(V0);
    const Bmax = Number(options?.Bmax) || Number(options?.Amax) || 0.001;
    const Bsafe = Math.min(Bmax, Number(options?.Bsafe) || Bmax);
    const Bmag = S0 > Bsafe ? Bsafe : S0;
    const Abrake = this.scaleVector(unitV0, -Bmag);
    const Vstopped = S0 < 1e-6;
    const At = Vstopped ? [0,0,0] : Abrake;
    const Rmag = this.mag(R0);
    const unitR0 = this.normalizeVector(R0);
    const Tmax = Number(options?.Tmax) || 0.001;
    const Tsafe = Math.min(Tmax, Number(options?.Tsafe) || Tmax);
    const Tmag = Rmag > Tsafe ? Tsafe : Rmag
    const Tbrake = this.scaleVector(unitR0, -Tmag);
    const Rstopped = Rmag < 1e-6;
    const Tt = Rstopped ? [0,0,0] : Tbrake;
    const raw = {};
    const stopped = Vstopped && Rstopped;
    // MAGPIE_SYSTEM._logging_debug(`Rstopped: ${Rstopped}, Rmag: ${Rmag}`)
    // MAGPIE_SYSTEM._logging_debug(ePrefix + `At: ${this.mag(At)}, Tt: ${this.mag(Tt)}`)
    return { At: At, Tt: Tt, raw: raw, stopped }
  } catch(e) {
    MAGPIE_SYSTEM.error(ePrefix + e.message, e)
  }
}
/**
 *
 * @param {vector3} P0
 * @param {vector3} P1
 * @param {STATS} STATS
 * @param {{
 * 	tolerance: coefficient,
 * 	intensity: ratio,
 * 	fwd: vector3,
 * 	agility: STAT,
 * 	pR: ratio
 * }} options
 * @returns {{At: vector3, Tt: bivector,
 * state: stateID,
 * raw: { 
 * Rstate: stateID[],
 * dRmag: magnitude,
 * dR: bivector,
 * Bdist: bivector,
 * pR: ratio
 * }}}
 */
MAGPIE_PHYSICS._emote_seekTarget = function _emote_seekTarget(
  POVART0,
  P1,
  options,
) {
  const K = MAGPIE.KEY.STATS;
  const STATS = options?.STATS || [];
  if (!options?.agility) options.agility = STATS[K.DEX];
  if (!options?.fwd) options.fwd = MAGPIE.KEY.POVART.FWD;
  const { P0, O0, V0, A0, R0, T0 } = this.decomp_POVART(POVART0);
  const raw = {};
  const getAt = this._getAt(P0, V0, P1, STATS, options);
  const At = this.scaleVector(getAt.At_raw, options.intensity);
  // MAGPIE_SYSTEM._logging_debug(`At: ${this.mag(At)}`)
  const Vmax = STATS[MAGPIE.KEY.STATS.VMAX];
  const Vcreep = Math.min(Vmax, options?.Vcreep || Vmax);
  const Ot_abs = this._getOtToP1(P0, P1);
  const Ot_hdg = this._rotor_toHeadingAbs(Ot_abs, P0);
  const Ot = options?.surface
    ? this._rotor_fromEulerAbs(Ot_hdg, 0, 0, P0)
    : Ot_abs;
  const fwd = this.rotorApply(O0, MAGPIE.KEY.POVART.FWD);
  const targetDir = this.normalizeVector(this.subVectors(P1, P0));
  const alignment = this.dotProduct(fwd, targetDir);
  const steerIntensity = 1.0 - alignment;
  const dO = this._getDeltaO(O0, Ot);
  const dR_global = this._getDeltaR(dO);
  const O0_inv = this.rotorReverse(O0);
  const dR = this.rotorApply(O0_inv, dR_global);
  // const dR = this._getDeltaR_euler(O0, Ot, P0)	const dR = this._getDeltaR(dO);
  const dRmag = this.mag(dR);
  const pR = this._getATpR(dRmag, V0, R0, getAt.Vstate, options);
  options.pR = pR;
  const getTt = this._getTt(dR, R0, O0, options);
  options.state = pR > 0.5 ? getAt.Vstate : getTt.Rstate;
  const Tt = getTt.Tt;
  const Rstate = getTt.Rstate;
  raw.Tt = Tt;
  raw.Rstate = Rstate;
  raw.Bdist = getTt?.Bdist;
  raw.pR = pR;
  raw.dR = dR;
  raw.dRmag = dRmag;
  // MAGPIE_SYSTEM._logging_debug(`pR: ${pR}`);
  if (!this.isValidVector(Tt)) throw new Error(`${Tt} is invalid Tₜ bivector`);
  const Asafe = () => {
    if (pR >= 0.5) return At;
    const S0 = this.mag(V0);
    if (S0 <= Vcreep) return [0, 0, 0];
    const unitV0 = this.scaleVector(V0, 1 / (S0 || 1));
    return this.scaleVector(unitV0, -this.mag(At));
  };
  // MAGPIE_SYSTEM._logging_debug(Vcreep)
  const slow = this.mag(V0) < Vcreep;
  const newTt = this.scaleVector(
    Tt ? Tt : [0, 0, 0],
    slow ? 1 - pR : Math.max(1 - pR, 0.75),
  );
  const As = Asafe();
  return {
    At: this.scaleVector(As, pR),
    Tt: newTt,
    state: options.state,
    raw,
  };
};
/**
 *
 * @param {POVART_O} O0
 * @param {rotor} Ot
 * @param {POVART_P} P0
 * @returns {bivector}
 */
MAGPIE_PHYSICS._getDeltaR_euler = function _getDeltaR_euler(O0, Ot, P0) {
  const O0_euler = this._rotor_toEulerAbs(O0, P0);
  const Ot_euler = this._rotor_toEulerAbs(Ot, P0);
  // @audit is roll really rotor[0]?
  const dRoll_rad = this._U_deg_to_rad(Ot_euler[0] - O0_euler[0]);
  // @audit is pitch really rotor[1]?
  const dPitch_rad = this._U_deg_to_rad(Ot_euler[1] - O0_euler[1]);
  const dHeading_rad = this._U_deg_to_rad(Ot_euler[2] - O0_euler[2]);
  // @audit is the order and sign of these elements in the bivector correct?
  return [-dPitch_rad, dRoll_rad, -dHeading_rad];
};
// #endregion
//------------------------------------------------------------------------
/**
 * @name
 * @desc
 *
 */
//------------------------------------------------------------------------
// #region smartSeek
//------------------------------------------------------------------------

/**
 *
 * @param {POVART} POVART0
 * @param {entity_stats} params
 * @param {vector3} P1
 * @param {{
 * 	tolerance: coefficient,
 * 	intensity: ratio,
 * 	fwd: vector3,
 * 	agility: PARAM,
 * 	pR: ratio
 * }} options
 * @returns {{At: vector3, Tt: bivector}}
 */
MAGPIE_PHYSICS._smartSeek = function smartSeek(POVART0, params, P1, options) {
  let { At, Tt } = MAGPIE_PHYSICS._seekTarget(POVART0, P1, params, options);
  const targetDir = MAGPIE_PHYSICS.subVectors(P1, P0);
  const fwd = options?.fwd || MAGPIE.KEY.POVART.FWD;
  const alignment = MAGPIE_PHYSICS._getAlignment(fwd, targetDir);
  if (alignment) At = MAGPIE_PHYSICS.scaleVector(At, alignment);
  return { At, Tt };
};
// #endregion
//------------------------------------------------------------------------
// #endregion
//------------------------------------------------------------------------
/**
 * @name
 * @desc
 *
 */
//------------------------------------------------------------------------
// #region > helpers
//------------------------------------------------------------------------
/**
 *
 * @param {magnitude} dRmag
 * @param {vector3} V0
 * @param {bivector} R0
 * @param {stateID} Vstate
 * @param {{
 * Vcreep: velocity
 * }} options
 * @audit changing it to a new simpler implementation
 * @returns {ratio} pR
 */
MAGPIE_PHYSICS._getATpR = function getATpR(dRmag, V0, R0, Vstate, options) {
  // const Ae_abs = this._rotor_angle(dO, P0, O0);
  // // MAGPIE_SYSTEM._logging_debug(`Ae_abs: ${Ae_abs}`)
  // const Ae = Ae_abs > Math.PI - 0.1 ? 0 : Ae_abs
  // const alignRatio = this._U_clampRange(1.0 - (Ae / threshold), 0, 1);
  // if(isNaN(alignRatio)) throw new Error(`${alignRatio} is invalid pR`);
  // return alignRatio
  const lock = 1;
  const refine = 0.75;
  const split = 0.5;
  const align = 0.25;
  const rotate = 0;
  const S0 = this.mag(V0);
  const R0mag = this.mag(R0);
  if (Vstate === STATE_INDEX.ON_TARGET) return R0mag < 1e-6 ? lock : split;
  if (Vstate === STATE_INDEX.REACHING_TARGET) return refine;
  const dRpR = Math.min(dRmag, 1);
  // MAGPIE_SYSTEM._logging_debug(`dRpR: ${dRpR}`)
  if (Vstate === STATE_INDEX.APPROACHING_TARGET) return 1 - dRpR * split;
  if (Vstate === STATE_INDEX.SEEKING_TARGET) {
    if (S0 < options?.Vcreep) return 1 - dRpR;
    return Math.max(1 - dRpR, align);
  }
  return split;

};
/**
 *
 * @param {vector3} fwd forward vector
 * @param {vector3} Dt target direction (Dₜ)
 * @returns {ratio} alignment ratio (Dₐ)
 */
MAGPIE_PHYSICS._getAlignment = function getAlignmentPower(fwd, Dt) {
  const ePrefix = "[PHYSICS].getAlignment: ";
  try {
    // 1. ensure vectors are normalized
    if (!fwd) fwd = MAGPIE.KEY.POVART.FWD;
    if (!this.isValidVector(Dt)) throw new Error(`${Dt} is invalid Dₜ`);
    const f = this.normalizeVector(fwd);
    const t = this.normalizeVector(Dt);
    // 2. calculate dot product
    const dot = MAGPIE_PHYSICS.dotProduct(f, t);
    // 3. clamp to 0.0 - 1.0 (we don't want negative thrust)
    const Da = Math.max(0, dot);
    if (!this.isValidVector(Da)) throw new Error(`${Da} is invalid Dₐ`);
  } catch (e) {
    MAGPIE_SYSTEM.error(ePrefix + e.message, e);
  }
};
/**
 *
 * @param {vector3} P0
 * @param {vector3} V0
 * @param {vector3} P1
 * @param {entity_stats} params
 * @param {{
 * tolerance: coefficient,
 * intensity: coefficient,
 * enableBraking: Boolean,
 * dumb: Boolean,
 * brakingThreshold: Number,
 * brakingMode: String
 * }} options
 * @returns {{ At_raw: vector3, Vstate: stateID }} Aₜ (target acceleration)
 */
MAGPIE_PHYSICS._getAt = function _getAt(P0, V0, P1, params, options) {
  const ePrefix = "[PHYSICS].getAt: ";
  try {
    if (!this.isValidVector(P0)) throw new Error(`${P0} is invalid P₀`);
    if (!this.isValidVector(P1)) throw new Error(`${P1} is invalid P₁`);
    const D0 = this.distanceTo(P0, P1);
    if (!this.isValidVector(V0)) throw new Error(`${V0} is invalid V₀`);
    if (!this.isValidParams(params))
      throw new Error(`${params} is invalid PARAMS`);
    if (!options?.tolerance) options.tolerance = options?.dumb ? 0 : 1;
    const K = MAGPIE.KEY.STATS;
    const LENGTH = params[K.LENGTH];
    const tolerance = options.tolerance * LENGTH * 1.1;
    const Vmax = params[K.VMAX];
    const Vsafe = Math.min(Vmax, options?.Vsafe || Vmax);
    const Amax = params[K.AMAX];
    const Asafe = Math.min(Amax, options?.Asafe || Amax);
    const Bmax = params[K.BMAX];
    const Bsafe = Math.min(Bmax, options?.Bsafe || Bmax);
    const Vcruise = Math.min(Vmax, options?.Vcruise || Vmax);
    // MAGPIE_SYSTEM._logging_debug(options?.Vcruise)
    const Vcreep = Math.min(Vmax, options?.Vcreep || Vmax);
    const S0 = this.mag(V0);
    if (options?.dumb) {
      const Vt = this.targetVelocity(P0, P1, Vmax);
      const dV = this.subVectors(Vt, V0);
      const At = this.vector_clamp_mag(dV, Amax);
      return {
        At_raw,
        Vstate: STATE_INDEX.SEEKING_TARGET,
      };
    }
    const Bdist = S0 ** 2 / (2 * Bmax); //@audit-ok Bdist verified
    // MAGPIE_SYSTEM._logging_debug(`Bdist: ${Bdist}`)
    const reach = D0 <= tolerance;
    const approach = D0 <= Bdist + tolerance;
    const state = {};
    state.onTarget = D0 <= tolerance;
    state.reachingTarget = state.onTarget ? false : reach;
    state.approachingTarget = state.reachingTarget
      ? false
      : state.onTarget
        ? false
        : approach;
    state.seekingTarget = state.reachingTarget
      ? false
      : state.approachingTarget
        ? false
        : state.onTarget
          ? false
          : true;
    // MAGPIE_SYSTEM._logging_debug(Object.entries(state))
    const unitV0 = this.normalizeVector(V0);
    const brake = this.scaleVector(unitV0, -Bsafe);
    const stopped = S0 < 1e-6;
    if (state.onTarget) {
      const S0_threshold = S0 > 0.001;
      const Bmin = 0.001;
      const Bstop = this._U_clampRange(Bsafe, Bmin, S0);
      const At = S0_threshold ? brake : [0, 0, 0];
      const Vstate = S0_threshold
        ? STATE_INDEX.REACHING_TARGET
        : STATE_INDEX.ON_TARGET;
      // MAGPIE_SYSTEM._logging_debug(S0)
      return { At_raw: At, Vstate: Vstate };
    } else if (state.reachingTarget) {
      const stopDistance = K.LENGTH;
      const Bt = this.getBrakingA(P0, P1, V0, Bmax, stopDistance);
      const A_clamped = this.vector_clamp_mag(Bt, Bsafe);
      return {
        At_raw: A_clamped,
        Vstate: STATE_INDEX.REACHING_TARGET,
      };
    } else if (state.approachingTarget) {
      const Bt = this.getBrakingA(P0, P1, V0, options.tolerance);
      const A_clamped = this.vector_clamp_mag(Bt, Bsafe);
      return {
        At_raw: A_clamped,
        Vstate: STATE_INDEX.APPROACHING_TARGET,
      };
    } else if (state.seekingTarget) {
      const Vt = this.targetVelocity(P0, P1, Vcruise);
      const dV = this.subVectors(Vt, V0);
      const Verror = Math.abs(S0 - this.mag(Vt));
      const cruising = Verror < options.tolerance * Amax * 2;
      const A_transit = cruising ? [0, 0, 0] : this.vector_clamp_mag(dV, Asafe);
      // MAGPIE_SYSTEM._logging_debug(`cruising: ${cruising}`)
      return {
        At_raw: A_transit,
        Vstate: STATE_INDEX.SEEKING_TARGET,
      };
    } else {
      const Vstate = stopped ? STATE_INDEX.IDLING : STATE_INDEX.STOPPING;
      const At_stop = stopped ? [0, 0, 0] : brake;
      return { At_raw: At_stop, Vstate };
    }
  } catch (e) {
    MAGPIE_SYSTEM.error(ePrefix + e.message, e);
    return { At_raw: [0,0,0], Vstate: STATE_INDEX.SPOOFED };
  }
};
/**
 *
 * @param {POVART_P} P0
 * @returns {vector3}
 */
MAGPIE_PHYSICS._get_localUp = function getLocalUp(P0) {
  return this.normalizeVector(P0);
};
/**
 *
 * @param {POVART_P} P0
 * @returns {vector3}
 */
MAGPIE_PHYSICS._get_localDown = function getLocalDown(P0) {
  return this.normalizeVector(P0);
};
/**
 *
 * @param {vector3} up
 * @returns {vector3}
 */
MAGPIE_PHYSICS._get_localNorth = function getLocalNorth(up) {
  const North = MAGPIE.KEY.POVART.UP;
  const dotN = this.dotProduct(North, up);
  return this.normalizeVector(
    this.subVectors(North, this.scaleVector(up, dotN)),
  );
};
/**
 *
 * @param {vector3} localNorth
 * @param {vector3} up
 * @returns {vector3}
 */
MAGPIE_PHYSICS._get_localEast = function getLocalEast(localNorth, up) {
  return this.crossProduct(localNorth, up);
};
/**
 *
 * @param {vector3} P0
 * @param {vector3} P1
 * @returns {vector3}
 */
MAGPIE_PHYSICS._get_absoluteDir = function getAbsoluteDir(P0, P1) {
  return this.normalizeVector(this.subVectors(P1, P0));
};
/**
 *
 * @param {vector3} localNorth
 * @param {vector3} localEast
 * @param {vector3} up
 * @param {vector3} absoluteDir
 * @param {bivector}
 */
MAGPIE_PHYSICS._get_localDir = function getLocalDir(
  localNorth,
  localEast,
  up,
  absoluteDir,
) {
  const dir = absoluteDir;
  return [
    this.dotProduct(dir, localEast),
    this.dotProduct(dir, localNorth),
    this.dotProduct(dir, up),
  ];
};
/**
 *
 * @param {vector3} fwd
 * @param {vector3} localDir
 * @returns {rotor}
 */
MAGPIE_PHYSICS._get_localRotor = function getLocalRotor(localDir, fwd) {
  if (!fwd) fwd = MAGPIE.KEY.POVART.FWD;
  return this.rotorFromVectors(fwd, localDir);
};
/**
 *
 * @param {vector3} P0
 * @param {vector3} P1
 * @returns {bivector}
 */
MAGPIE_PHYSICS._calculate_localDir = function calculateLocalDIr(P0, P1) {
  const ePrefix = "[PHYSICS].calculateLocalDir: ";
  try {
    if (!this.isValidVector(P0)) throw new Error(`${P0} is invalid P₀`);
    if (!this.isValidVector(P1)) throw new Error(`${P1} is invalid P₁`);
    const up = this._get_localUp(P0);
    const localNorth = this._get_localNorth(up);
    const localEast = this._get_localEast(localNorth, up);
    const absoluteDir = this._get_absoluteDir(P0, P1);
    const localDir = this._get_localDir(localNorth, localEast, up, absoluteDir);
    if (!this.isValidVector(localDir))
      throw new Error(`${localDir} is invalid vector`);
    return this.normalizeVector(localDir);
  } catch (e) {
    MAGPIE_SYSTEM.error(ePrefix + e.message, e);
  }
};
/**
 *
 * @param {vector3} P0
 * @param {vector3} P1
 * @param {vector3} fwd
 * @returns {rotor} (Oₜ) absolute target orientation
 */
MAGPIE_PHYSICS._getOtToP1 = function _getOtToP1(P0, P1) {
  const up = this._get_localUp(P0);
  const localNorth = this._get_localNorth(up);
  const localDir = this._calculate_localDir(P0, P1);
  const localRotor = this._get_localRotor(localDir);
  const Ot_abs = this.rotorCompose(
    this.rotorFromFrame(localNorth, up),
    localRotor,
  );
  // MAGPIE_SYSTEM._logging_debug(`Ot_abs: ${this._rotor_toHeadingAbs(Ot_abs, P0)}`)
  //@audit-ok returns plausible 105°
  return Ot_abs;
};
/**
 * @desc refinement layer: flattens a 3D orientation into a local surface tangent plane
 *
 * @param {rotor} Ot absolute target orientation (Oₜ)
 * @param {vector3} P0 POVART current Position (P₀)
 * @returns {rotor} desired orientation (O₁)
 */
MAGPIE_PHYSICS._rotor_clampToSurface = function _rotor_clampToSurface(Ot, P0) {
  const ePrefix = "[PHYSICS]._rotor_clampToSurface: ";
  try {
    const up = this._get_localUp(P0);
    const North = MAGPIE.KEY.POVART.UP;
    const Right = MAGPIE.KEY.POVART.RIGHT;
    const localOt = this.rotorCompose(
      this.rotorReverse(this.rotorFromFrame(North, up)),
      Ot,
    );
    return this.rotorFromFrame(this.rotorApply(localOt, Right), up);
  } catch (e) {
    MAGPIE_SYSTEM.error(ePrefix + e.message, e);
    return Ot;
  }
};
/**
 *
 * @param {POVART_P} P0
 * @param {POVART_V} V0
 * @returns {heading}
 */
MAGPIE_PHYSICS._get_V0_heading = function _get_V0_heading(P0, V0) {
  if (!this.isValidVector(P0)) return "invalid P₀";
  if (!this.isValidVector(V0)) return "invalid V₀";
  const up = this.normalizeVector(P0);
  const North = MAGPIE.KEY.POVART.UP;
  const dotN = this.dotProduct(North, up);
  const subN = this.subVectors(North, this.scaleVector(up, dotN));
  const localNorth = this.normalizeVector(subN);
  const localEast = this.crossProduct(localNorth, up);
  const vNorth = this.dotProduct(V0, localNorth);
  const vEast = this.dotProduct(V0, localEast);
  const vHdgRad = Math.atan2(vEast, vNorth);
  const vHdgDeg = (this._U_rad_to_deg(vHdgRad) + 360) % 360;
  return vHdgDeg;
};
/**
 *
 * @param {STATS} stats
 * @param {coefficient} a
 * @returns {alpha}
 */
MAGPIE_PHYSICS._getTmax = function _getTmax(stats, a) {
  const ePrefix = "[PHYSICS].getTmax: ";
  try {
    // 1. calculate the inertia tensor
    const I = this._calculateInertiaTensor(stats);
    // 2. use maximum inertia component as baseline
    // ensures the entity has enough 'muscle' to rotate
    const alpha_max = this.scaleVector(I, a);
    // MAGPIE_SYSTEM._logging_debug(`alpha_max: ${alpha_max}`)
    // const alpha_max = a;
    // if(isNaN(alpha_max) || alpha_max <= 0)
    // 	throw new Error(`${alpha_max} is invalid alpha`)
    return alpha_max;
  } catch (e) {
    MAGPIE_SYSTEM.error(ePrefix + e.message, e);
  }
};
/**
 *
 * @param {bivector} dR delta rotation (ΔR)
 * @param {bivector} R0 current rotation (R₀)
 * @param {rotor} O0 current orientation (O₀)
 * @param {bivector} Rt target rotation (Rₜ)
 * @param {{
 * Tmax: alpha,
 * Treserve: percentage,
 * pR: ratio,
 * Rsafe: omega,
 * Vstate: stateID
 * }} options
 * @returns {{Tt: bivector, Rstate: stateID[], Bdist: bivector }} Tₜ target torque
 */
MAGPIE_PHYSICS._getTt = function _getTt(dR, R0, O0, options) {
  const ePrefix = "[PHYSICS].getTt: ";
  try {
    if (!this.isValidRotor(O0)) throw new Error(`${O0} is invalid O₀ rotor`);
    if (!this.isValidVector(R0))
      throw new Error(`${R0} is invalid R₀ bivector`);
    const Tmax = Number(options.Tmax);
    if (isNaN(options?.pR))
      throw new Error(`${options?.pR} is invalid priority ratio`);
    const priorityRatio = Number(options.pR);
    const TorqueRatio = 1.0 - priorityRatio;
    if (TorqueRatio <= 0.001)
      return { Tt: [0, 0, 0], Rstate: STATE_INDEX.IDLING };
    const raw = this._getTt_local(dR, R0, O0, options);
    const { Tt: Tt_local } = raw;
    if (!this.isValidVector(Tt_local))
      throw new Error(`${Tt_local} is invalid Tt_local bivector`);
    // const Tt = this.rotorApply(O0, Tt_local);
    if (isNaN(TorqueRatio)) throw new Error(`${TorqueRatio} is invalid Tr`);
    const Tt_scaled = this.scaleVector(Tt_local, TorqueRatio);
    const Tt = this.vector_clamp_mag(Tt_scaled, Tmax);
    // MAGPIE_SYSTEM._logging_debug(`Tt: ${this.mag(Tt_local)}`)
    if (!this.isValidVector(Tt))
      throw new Error(`${Tt} is invalid Tₜ bivector`);
    return raw;
  } catch (e) {
    MAGPIE_SYSTEM.error(ePrefix + e.message, e);
    return { Tt: [0, 0, 0] };
  }
};
/**
 * Per-axis torque calculation for independent roll/pitch/heading control
 * @param {number} dR_component - single scalar component of delta rotation bivector
 * @param {number} R0_component - single scalar component of current angular velocity
 * @param {{
 *   seek_threshold?: number,
 *   hold_threshold?: number,
 *   Rsafe?: number,
 *   Tsafe?: number,
 *   Vstate?: stateID,
 * 	 Rstate: stateID
 * }} options
 * @returns {{ Tt: Number, state: stateID, Bdist: Number }} scalar torque command for this axis
 */
MAGPIE_PHYSICS._getTt_axis = function getTtAxis(
  dR_comp,
  R0_comp,
  options,
  axis,
) {
  const ePrefix = "[PHYSICS].getTt_axis: ";
  const output = { Tt: 0, state: STATE_INDEX.SPOOFED, Bdist: 0 };
  try {
    const Tmax_axis = `Tmax_${MAGPIE.KEY.POVART.AXES[axis]}`;
    const Rmax_axis = `Rmax_${MAGPIE.KEY.POVART.AXES[axis]}`;
    const Tmax = options.hasOwnProperty(Tmax_axis)
      ? Number(options[Tmax_axis])
      : Number(options?.Tmax);
    // MAGPIE_SYSTEM._logging_debug(`Tmax: ${Tmax}`)
    if (isNaN(Tmax)) return;
    const reserve =
      1 - this._U_clampRange(Number(options?.reserve) || 20, 0, 99.9) / 100;
    const Tsafe = Tmax * reserve;
    const last_state = options?.Rstate;
    const Rmax = options.hasOwnProperty(Rmax_axis)
      ? Number(options[Rmax_axis])
      : Number(options?.Rmax);
    if (isNaN(Rmax)) return;
    const hold_threshold = options?.hold_threshold ?? this._U_deg_to_rad(10);
    const R0_abs = Math.abs(R0_comp);
    const Rsafe = Array.isArray(options?.Rsafe)
      ? options.Rsafe[axis]
      : Rmax * reserve;
    const Bdist = R0_abs ** 2 / (2 * Tsafe) || 0;
    const dR_error = Math.abs(dR_comp);
    const Rcruise_margin = Math.abs(R0_abs - Rsafe);
    const Rt_error = Math.abs(dR_error - R0_abs);
    const seek_threshold = options?.seek_threshold ?? 0.0005;
    const seek_deadzone = Math.abs(Rsafe - R0_abs);
    const R0_isStable = seek_deadzone < Rsafe * 0.05;
    const brake_deadzone = Rsafe * 0.25;
    const aligned_deadzone = 0.0001;
    const brake_threshold = Bdist * 1.5;
    const decel_threshold = brake_threshold * 3;
    const Rhold = R0_abs < brake_deadzone;
    const Rcrawl = 0.001;
    const sticky_align = dR_error < brake_threshold;
    const align_trigger = dR_error < decel_threshold ? true : sticky_align;
    const HOLD = R0_abs > Rcrawl ? false : dR_error < hold_threshold;
    const FACE = HOLD || align_trigger ? false : R0_abs < Rsafe;
    const DRIFT = HOLD || FACE || decel_threshold ? false : true;
    // MAGPIE_SYSTEM._logging_debug(options)
    const R_stop = R0_abs < 1e-6 ? 0 : R0_abs * -Tsafe;
    const Tt_brake = R0_abs < 1e-5 ? 0 : Math.sign(R0_comp) * -Tsafe;
    const decel =
      dR_error < 0.001 || R0_abs > Rsafe * 0.01
        ? Tt_brake * 0.25
        : Math.sign(dR_comp) * Tsafe * 0.25;
    const accel = Math.sign(dR_comp) * Tsafe; //R0_isStable ? 0 : Math.sign(dR_comp) * Tsafe
    const transit = options?.transit || 0.0001;
    const Tt_seek = Rcruise_margin > transit ? accel : decel;
    const adjust = R0_abs < Rcrawl ? accel * 0.25 : Tt_brake * 0.25;
    const Tt_align = dR_error > aligned_deadzone ? adjust : R_stop;
    const distanceFactor = Math.min(dR_error / (Bdist * 2.0), 1.0);
    // if(axis === 1)
    // 	MAGPIE_SYSTEM._logging_debug(`D_decel: ${decel_threshold.toFixed(5)} | `
    // 	+ `D_brake: ${brake_threshold.toFixed(5)} | `
    // 	+ `Rsafe: ${Rsafe.toFixed(5)} | `
    // 	+ `Rt_err: ${Rt_error.toFixed(5)} | `
    // 	+ `dR_err: ${dR_error.toFixed(5)} | `
    // 	+ `HOLD: ${HOLD} | `
    // 	+ `DRIFT: ${DRIFT} | `
    // 	+ `FACE: ${FACE} | `
    // 	+ `decel_thres: ${decel_threshold.toFixed(5)} | `
    // 	+ `Tt_seek: ${Tt_seek} | `
    // )
    let Tt = 0;
    let state = STATE_INDEX.SPOOFED;
    if (HOLD) {
      Tt = Tt_align;
      state = STATE_INDEX.LOCKING_TARGET;
    } else if (FACE && last_state !== STATE_INDEX.ALIGNING_TARGET) {
      Tt = Tt_seek;
      state = STATE_INDEX.FACING_TARGET;
    } else if (DRIFT) {
      Tt = 0;
      state = STATE_INDEX.DRIFTING;
    } else {
      Tt = Tt_brake;
      state = STATE_INDEX.ALIGNING_TARGET;
    }
    // if(state === STATE_INDEX.ALIGNING_TARGET) Tt = Tt_brake
    // if(state === STATE_INDEX.LOCKING_TARGET) Tt = Tt_align;
    // if(state === STATE_INDEX.FACING_TARGET) Tt = Tt_seek;
    // MAGPIE_SYSTEM._logging_debug(`Rt_err: ${Rt_error.toFixed(5)} | dR: ${dR_comp.toFixed(5)} | R0: ${R0_comp.toFixed(5)} | Tt: ${Tt.toFixed(5)} | Bdist: ${Bdist.toFixed(5)} | state: ${state}`)
    // MAGPIE_SYSTEM._logging_debug(`state: ${state}`)
    if (isNaN(Tt))
      throw new Error(
        `${Tt} is invalid Tₜ[${Array.from(MAGPIE.KEY.POVART.R_AXES.keys())[axis]}]`,
      );
    output.Tt = Tt;
    output.state = state;
    output.Bdist = Bdist;
  } catch (e) {
    MAGPIE_SYSTEM.error(ePrefix + e.message, e);
  } finally {
    return output;
  }
};

/**
 *
 * @param {bivector} dR delta rotation (ΔR)
 * @param {POVART_R} R0 current rotation (R₀)
 * @param {POVART_O} O0 current orientation (O₀)
 * @param {{
 * Tsafe: alpha
 * Rsafe: omega,
 * Vstate: stateID,
 * Rstate: stateID
 * }} options
 * @returns {{ Tt: bivector, Rstate: stateID[], Bdist: bivector }}
 */
MAGPIE_PHYSICS._getTt_local = function getLocalTt(dR, R0, O0, options) {
  const ePrefix = "[PHYSICS].getTt_local: ";
  try {
    const [dR_pitch, dR_roll, dR_heading] = dR;
    const [R0_pitch, R0_roll, R0_heading] = R0;
    const AXES = MAGPIE.KEY.POVART.R_AXES;
    // MAGPIE_SYSTEM._logging_debug(`Tmax: ${options.Tmax}`)
    const pitch = this._getTt_axis(
      dR_pitch,
      R0_pitch,
      options,
      AXES.get("pitch"),
    );
    const roll = this._getTt_axis(dR_roll, R0_roll, options, AXES.get("roll"));
    const heading = this._getTt_axis(
      dR_heading,
      R0_heading,
      options,
      AXES.get("heading"),
    );
    const raw = {};
    /** @type {bivector} */
    // raw.Tt = [pitch.Tt, roll.Tt, heading.Tt];
    raw.Tt = [pitch.Tt, roll.Tt, heading.Tt];
    /** @type {stateID[]} */
    raw.Bdist = [pitch.Bdist, roll.Bdist, heading.Bdist];
    const Rstate = [pitch?.state || 0, roll?.state || 0, heading?.state || 0];
    /** @type {stateID} */
    raw.Rstate = Math.max(...Rstate);
    //@audit inverted pitch/roll [r,p,h] => [p,r,h]
    //@audit inverted roll [p, r, h] => [p, -r, h]
    //@audit-ok [0,0,Tt_heading]
    // if(options?.Rstate)
    // MAGPIE_SYSTEM._logging_debug(`state: ${Rstate}`)
    return raw;
  } catch (e) {
    MAGPIE_SYSTEM.error(ePrefix + e.message, e);
    return { Tt: [0, 0, 0], Rstate: STATE_INDEX.SPOOFED };
  }
};
/**
 *
 * @param {magnitude} magnitude
 * @returns {theta}
 */
MAGPIE_PHYSICS._low_geoAlg_theta = function getTheta(magnitude) {
  return 2 * Math.asin(Math.min(magnitude, 1.0));
};
/**
 *
 * @param {rotor} O0 O₀
 * @param {rotor} O1 O₁
 * @returns {rotor} ΔO
 */
MAGPIE_PHYSICS._getDeltaO = function _getDeltaO(O0, O1) {
  const O0_inv = this.rotorReverse(O0);
  const deltaO = this._rotor_multiply(O1, O0_inv);
  if (deltaO[3] < 0) return this.rotorInvert(deltaO);
  return deltaO;
};
/**
 * @param {rotor} dO
 * @returns {bivector}
 */
MAGPIE_PHYSICS._getDeltaR = function _getDeltaR(dO) {
  let [yz, xz, xy, w] = dO;
  // return [yz,xz,xy]
  const sinHalfTheta = this.mag([yz, xz, xy]);
  if (sinHalfTheta < 1e-6) return [0, 0, 0];
  const halfTheta = Math.atan2(sinHalfTheta, w);
  const theta = halfTheta * 2;
  const multiplier = theta / sinHalfTheta;
  return [yz * multiplier, xz * multiplier, xy * multiplier];
};
/**
 *
 * @param {vector3} P0 current position (P₀)
 * @param {vector3} P1 target position (P₁)
 * @returns {Number} distance (m)
 */
MAGPIE_PHYSICS.distanceTo = function distanceTo(P0, P1) {
  const ePrefix = `[PHYSICS].distanceTo: `;
  try {
    const diff = this.subVectors(P1, P0);
    if (!this.isValidVector(diff)) throw new Error(`${diff} is invalid vector`);
    return this.mag(diff);
  } catch (e) {
    MAGPIE_SYSTEM.error(ePrefix + e.message, e);
    return NaN;
  }
};
/**
 *
 * @param {vector3} P0 current position (P₀)
 * @param {vector3} P1 target position (P₁)
 * @param {vector3} V0 current velocity (V₀)
 * @param {Number} Bmax maximum braking (Bₘₐₓ)
 * @param {Number} stopDistance distance (m)
 * @returns {vector3} Braking acceleration (Abrake or Aₖ)
 */
MAGPIE_PHYSICS.getBrakingA = function getBrakingA(
  P0,
  P1,
  V0,
  Bmax,
  stopDistance = 0,
) {
  const ePrefix = `[PHYSICS].getBrakingA: `;
  let Abrake = [0, 0, 0];
  try {
    const currentDist = this.distanceTo(P0, P1);
    if (isNaN(currentDist))
      throw new Error(`${currentDist} is invalid current distance`);
    const brakingDist = currentDist - stopDistance;
    if (isNaN(brakingDist))
      throw new Error(`${brakingDist} is invalid braking distance`);
    const currentSpeed = this.mag(V0);
    // if you are already inside the safe zone, kill acceleration
    if (brakingDist <= 0 || currentSpeed === 0) return Abrake;
    // calculate required deceleration magnitude: A = V^2 / (2D)
    const decelMag = currentSpeed ** 2 / (2 * brakingDist);
    const brakeMag = decelMag > 1e-6 ? -decelMag : -Bmax;
    const travelDir = this.normalizeVector(V0);
    // apply acceleration exactly opposite to the current direction of travel
    Abrake = this.scaleVector(travelDir, brakeMag);
    if (!this.isValidVector(Abrake)) throw new Error(`${Abrake} is invalid Ab`);

    return Abrake;
  } catch (e) {
    MAGPIE_SYSTEM.error(ePrefix + e.message, e);
    Abrake = [0, 0, 0];
  }
};
/**
 *
 * @param {[Number, Number, Number]} vector
 * @returns {Boolean}
 */
MAGPIE_PHYSICS.isVectorZero = function isVectorZero(vector) {
  const ePrefix = `[PHYSICS].isVectorZero: `;
  try {
    if (!this.isValidVector(vector)) throw new Error(`${vector} is invalid`);
    if (vector.some((n) => n > 0)) return false;
    return true;
  } catch (e) {
    MAGPIE_SYSTEM.error(ePrefix + e.message, e);
    return true;
  }
};
/**
 *
 * @param {POVART} POVART0
 * @param {Number} dt
 * @param {vector3} dA
 * @param {bivector} dT
 * @returns {{P1: vector3, O1: rotor, V1: vector3}}
 */
MAGPIE_PHYSICS._POVART_POV1fromDeltaAT = function _POVART_POV1fromDeltaAT(
  POVART0,
  dt,
  dA,
  dT,
) {
  const ePrefix = `[PHYSICS].POV1: `;
  try {
    if (!this.isValidVector(dA)) throw new Error(`${dA} is invalid vector dA`);
    if (!this.isValidVector(dT))
      throw new Error(`${dT} is invalid bivector dT`);
    const { P0, O0, V0, A0, R0, T0 } = MAGPIE_PHYSICS.decomp_POVART(POVART0);
    const T1 = MAGPIE_PHYSICS.addVectors(T0, dT);
    const dR = MAGPIE_PHYSICS.scaleVector(T1, dT);
    const R1 = MAGPIE_PHYSICS.addVectors(R0, dR);
    const dO = MAGPIE_PHYSICS.rotorFromBivector(R1, dt);
    const cO = MAGPIE_PHYSICS.rotorCompose(O0, dO);
    const O1 = MAGPIE_PHYSICS.rotorNormalize(cO);
    const A1 = MAGPIE_PHYSICS.addVectors(A0, dA);
    const dV = MAGPIE_PHYSICS.scaleVector(A1, dt);
    const V1 = MAGPIE_PHYSICS.addVectors(V0, dV);
    const dP = MAGPIE_PHYSICS.scaleVector(V1, dt);
    const P1 = MAGPIE_PHYSICS.addVectors(P0, dP);
    return { P1, O1, V1, A1, R1, T1 };
  } catch (e) {
    MAGPIE_SYSTEM.error(ePrefix + e.message, e);
  }
};
/**
 *
 * @param {POVART} POVART0
 * @param {POVART} POVART1
 * @returns {{Da: distance, Dg: distance}} Da: absolute distance, Dg: geodetic distance
 */
MAGPIE_PHYSICS._POVART_distanceTravelled = function _POVART_distanceTravelled(
  POVART0,
  POVART1,
) {
  const ePrefix = `[PHYSICS].distanceTravelled: `;
  try {
    const P0 = this.getPosition(POVART0);
    const P1 = this.getPosition(POVART1);
    const P_C = this.getCelestialID(POVART0);
    const celestial = MAGPIE_HIVE.getEntity(P_C);
    if (!celestial) throw new Error(`unable to fetch celestial body`);
    const r = celestial.radius();
    const Da = this.distanceTo(P0, P1);
    const Dg = this._geod_distanceTo(P0, P1, r);
    return { Da, Dg };
  } catch (e) {
    MAGPIE_SYSTEM.error(ePrefix + e.message, e);
  }
};
/**
 *
 * @param {vector3} P0
 * @param {vector3} P1
 * @param {distance} r
 * @returns {distance}
 */
MAGPIE_PHYSICS._geod_distanceTo = function _geod_distanceTo(P0, P1, r) {
  const ePrefix = `[PHYSICS].geodDistanceTo: `;
  try {
    if (!this.isValidVector(P0)) throw new Error(`${P0} is invalid vector P₀`);
    if (!this.isValidVector(P1)) throw new Error(`${P1} is invalid vector P₁`);
    const celestial_radius = this._geod_verifyRadius(r);
    const u0 = MAGPIE_PHYSICS.normalizeVector(P0);
    const u1 = MAGPIE_PHYSICS.normalizeVector(P1);
    const angle = Math.acos(MAGPIE_PHYSICS.dotProduct(u0, u1));
    return Number(celestial_radius * angle);
  } catch (e) {
    MAGPIE_SYSTEM.error(ePrefix + e.message, e);
  }
};
/**
 *
 * @param {distance} r
 * @returns {radius} distance from celestial body center
 */
MAGPIE_PHYSICS._geod_verifyRadius = function (r) {
  if (!r || isNaN(r)) return MAGPIE.KEY.PHYSICS.EARTH.R;
  return r;
};
/**
 *
 * @param {POVART_P} P0
 * @param {POVART_P} P1
 * @param {radius} r
 */
MAGPIE_PHYSICS._geod_getCourse = function getCourse(P0, P1) {
  const ePrefix = "[PHYSICS].getCourse: ";
  try {
    if (!this.isValidVector(P0)) throw new Error(`${P0} is invalid P₀`);
    if (!this.isValidVector(P1)) throw new Error(`${P1} is invalid P₁`);
    const unitVt = this.normalizeVector(this.targetVelocity(P0, P1, 1));
    return this._get_V0_heading(P0, unitVt);
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
// #region > forces
//------------------------------------------------------------------------
/**
 *
 * @param {MAGPIE_ENTITY} entity
 * @param {MAGPIE_ENTITY} celestial
 * @param {vector3} P0
 * @param {duration} dt
 */
MAGPIE_PHYSICS._apply_gravity = function _apply_gravity(
  entity,
  celestial,
  P0,
  dt,
) {
  const ePrefix = "[PHYSICS].applyGravity: ";
  try {
    const K = MAGPIE.KEY.STATS;
    const Cmass = celestial.STATS[K.MASSKG];
    const G = this._forces_calculate2BodyGravityVector(P0, Cmass);
    const dA = this.scaleVector(G, dt);
    if (!this.isValidVector(dA)) throw new Error(`${dA} is invalid dA`);
    return dA;
  } catch (e) {
    MAGPIE_SYSTEM.error(ePrefix + e.message, e);
  }
};
/**
 * @typedef {import("./index").physics_forces} physics_forces 11x [FG, FF, FD, FL, AOA, Atm, OAT, Dew, Breeze, Lit, Rad]
 * @todo ApplyForces to At/Tt
 * @param {{
 * dt: duration,
 * r: distance,
 * P_C: MAGPIE_ENTITY,
 * P0: vector3,
 * O0: rotor,
 * V0: vector3,
 * R0: bivector,
 * locomotion: fitness_output,
 * C0: coords,
 * CB: vector3,
 * STATS: Float64Array,
 * switchID: Number
 * }} data
 * @returns {{Af: vector3, Tf: bivector, forces: physics_forces}}
 */
MAGPIE_PHYSICS._apply_forces = function _apply_forces(data) {
  const ePrefix = "[PHYSICS].applyForces: ";
  try {
    //@todo include inertia
    // const AT = this._POVART_applyTargetAT()
    // const I = this._calculateInertiaTensor()
    const { r, P_C, P0, C0, O0, V0, R0, dt, STATS } = data;
    const K = MAGPIE.KEY.STATS;
    const S = data.STATS;
    const Cf = S[K.CF];
    const Cl = S[K.CL];
    const Cd = S[K.CD];
    const CoM = [S[K.COM_X], S[K.COM_Y], S[K.COM_Z]];
    const CoL = [S[K.COL_X], S[K.COL_Y], S[K.COL_Z]];
    const dV = this.scaleVector(V0, dt);
    const P1 = this.addVectors(P0, dV);
    const C1 = this.cartesianToGeodetic(P1, r);
    // data.C1 = C1;
    const { Ac, Tc } = this._geod_checkCollisions(data);
    const fwd = MAGPIE.KEY.POVART.FWD;
    const AoA = this._aero_calculateAoArad(O0, V0, fwd);
    // const forces = this._geod_calculateForces(P_C, P0, C0, V0, R0, Cf, Cl, Cd, CoM, CoL, AoA)
    const FG_mag = P_C.STATS[MAGPIE.KEY.CELESTIAL.G];
    const Cmass = P_C.STATS[MAGPIE.KEY.CELESTIAL.MASS];
    const [lat, lon, ASL] = C0;
    const Afg =
      ASL < 0.5
        ? [0, 0, 0]
        : this._forces_calculate2BodyGravityVector(P0, Cmass);
    const forces = [FG_mag];
    const Af = Afg;
    const Tf = [0, 0, 0];
    return { Af, Tf, forces };
  } catch (e) {
    MAGPIE_SYSTEM.error(ePrefix + e.message, e);
  }
};
// #endregion
//------------------------------------------------------------------------
/**
 *
 * back to {@link MAGPIE_PHYSICS.}
 */
//========================================================================
//#endregion
//========================================================================
/**
 * @typedef {Float64Array<Number>} POVART
 *
 */
//========================================================================
//#region - POVART
//========================================================================
MAGPIE_PHYSICS.POVART = {};
/**
 * @name
 * @desc
 *
 */
//------------------------------------------------------------------------
// #region > validate
//------------------------------------------------------------------------
/**
 *
 * @param {POVART} POVART
 * @returns {Boolean}
 *
 * @version 0.17.17
 * - FIXED: "!!isNan(n)" must be "!isNaN(n)"
 * - FIXED: "!this.isValidPOVART(POVART)" leads to recursive calling; must
 * 		be "!this.validate(POVART)"
 * - FIXED: if statements without {} causing false Booleans
 * - FIXED "if(!this.validate(POVART) return true" checking for the wrong
 * 		Boolean. Must be "if(this.validate...)"
 */
MAGPIE_PHYSICS.isValidPOVART = function isValidPOVART(POVART) {
  const E_ID = MAGPIE.KEY.POVART.E_ID;
  const ePrefix = `[PHYSICS].validatePOVART: [ENTITY-${POVART[E_ID]}] `;
  try {
    if (Object.prototype.toString.call(POVART) !== "[object Float64Array]")
      throw new Error(`${POVART} is invalid Float64Array`);
    if (POVART.length !== MAGPIE.KEY.POVART.ARRAY)
      throw new Error(
        `${POVART} is invalid array length of ${MAGPIE.KEY.POVART.ARRAY}`,
      );
    const P = this.decomp_POVART(POVART);
    const P0 = P?.P0;
    const P_C = P?.P_C;
    const orbit = P?.orbit;
    const O0 = P?.O0;
    const V0 = P?.V0;
    const A0 = P?.A0;
    const R0 = P?.R0;
    const T0 = P?.T0;
    if (!this.isValidVector(P0))
      throw new Error(`${P0} is invalid Position vector`);
    if (!Number(P_C)) throw new Error(`${P_C} is invalid celestialID`);
    // if(!this.isValidOrbit(orbit))
    // 	throw new Error(`${orbit} is invalid orbit data`)
    if (!this.isValidRotor(O0)) throw new Error(`${O0} is invalid Rotor`);
    if (!this.isValidVector(V0))
      throw new Error(`${V0} is invalid Velocity vector`);
    if (!this.isValidVector(A0))
      throw new Error(`${A0} is invalid Acceleration vector`);
    if (!this.isValidVector(R0))
      throw new Error(`${R0} is invalid Rotation bivector`);
    if (!this.isValidVector(T0))
      throw new Error(`${T0} is invalid Torque bivector`);
    return true;
  } catch (e) {
    MAGPIE_SYSTEM.error(ePrefix + e.message, e);
    return false;
  }
};
/**
 *
 * @param {import("./entity").orbit} orbit
 */
MAGPIE_PHYSICS.isValidOrbit = function isValidOrbit(orbit) {
  const K = MAGPIE.KEY.ORBIT;
  if (!orbit || (orbit.length !== K.ARRAY) | orbit.some((n) => isNaN(n)))
    return false;
  const [a, e, i, raan, aop, nu, T0, M0] = orbit;
  const valid = [
    e >= 0 || e <= 1 ? true : false,
    this.isValidAngleRad(i),
    this.isValidAngleRad(raan),
    this.isValidAngleRad(aop),
    this.isValidAngleRad(nu),
    T0 <= Date.now(),
    this.isValidAngleRad(M0),
  ];
  if (valid.some((n) => !n)) return false;
  return true;
};
/**
 * @param {Number} entityID
 * @param {Number} celestialID
 * @returns {Float64Array} formatted POVART
 */
MAGPIE_PHYSICS.initPOVART = function initPOVART(
  entityID = -1,
  celestialID = -1,
) {
  const P = MAGPIE.KEY.POVART;
  const POVART = new Float64Array(P.ARRAY).fill(0);
  POVART[P.P_C] = celestialID;
  POVART[P.O_W] = 1;
  POVART[P.E_ID] = entityID;
  return POVART;
};
/**
 *
 * @param {POVART} POVART
 * @returns {Boolean}
 */
MAGPIE_PHYSICS.validate = function validate(POVART) {};
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
 * @param {POVART} POVART
 * @returns {vector3} Position₀ vector [x,y,z]
 */
MAGPIE_PHYSICS.getPosition = function getPosition(POVART) {
  try {
    if (!this.isValidPOVART(POVART))
      throw new Error(`(${POVART}) is invalid POVART₀`);
    const K = MAGPIE.KEY.POVART;
    return [POVART[K.P_X], POVART[K.P_Y], POVART[K.P_Z]];
  } catch (e) {
    MAGPIE_SYSTEM.error(`[PHYSICS].getPosition: ` + e.message, e);
    return [NaN, NaN, NaN];
  }
};
/**
 *
 * @param {Float64Array<Number>} POVART
 * @returns {Number} Celestial ID
 */
MAGPIE_PHYSICS.getCelestialID = function getCelestialID(POVART) {
  const ePrefix = `[PHYSICS].getCelestialID: `;
  try {
    if (!this.isValidPOVART(POVART))
      throw new Error(`(${POVART}) is invalid POVART`);
    const K = MAGPIE.KEY.POVART;
    return POVART[K.P_C];
  } catch (e) {
    MAGPIE_SYSTEM.error(ePrefix + e.message, e);
    return NaN;
  }
};
/**
 *
 * @param {POVART} POVART
 * @returns {import("./entity").orbit}
 */
MAGPIE_PHYSICS.getOrbit = function getOrbit(POVART) {
  const ePrefix = "[PHYSICS].getOrbit: ";
  try {
    if (!this.isValidPOVART(POVART))
      throw new Error(`[${POVART}] is invalid POVART`);
    const K = MAGPIE.KEY.POVART;
    const offset = K.P_C + 1;
    const end = offset + MAGPIE.KEY.ORBIT.ARRAY;
    return POVART.slice(offset, end);
  } catch (e) {
    MAGPIE_SYSTEM.error(ePrefix + e.message, e);
  }
};
/**
 *
 * @param {Float64Array} POVART
 * @returns {bivector} Orientation₀ rotor [yz,xz,xy,scalar]
 */
MAGPIE_PHYSICS.getOrientation = function getOrientation(POVART) {
  const message = `[PHYSICS].getOrientation: `;
  try {
    if (!this.isValidPOVART(POVART))
      throw new Error(`(${POVART}) is invalid POVART₀`);
    const K = MAGPIE.KEY.POVART;
    return [POVART[K.O_YZ], POVART[K.O_XZ], POVART[K.O_XY], POVART[K.O_W]];
  } catch (e) {
    MAGPIE_SYSTEM.error(message + e.message, e);
    return [NaN, NaN, NaN, NaN];
  }
};
/**
 *
 * @param {POVART} POVART
 * @returns {vector3} Velocity₀ vector [x,y,z]
 */
MAGPIE_PHYSICS.getVelocity = function getVelocity(POVART) {
  try {
    if (!this.isValidPOVART(POVART))
      throw new Error(`(${POVART}) is invalid POVART₀`);
    const K = MAGPIE.KEY.POVART;
    return [POVART[K.V_X], POVART[K.V_Y], POVART[K.V_Z]];
  } catch (e) {
    MAGPIE_SYSTEM.error("[PHYSICS].getVelocity: " + e.message, e);
    return [NaN, NaN, NaN];
  }
};
/**
 *
 * @param {POVART} POVART
 * @returns {vector3} Acceleration₀ vector [x,y,z]
 */
MAGPIE_PHYSICS.getAcceleration = function getAcceleration(POVART) {
  try {
    if (!this.isValidPOVART(POVART))
      throw new Error(`(${POVART}) is invalid POVART₀`);
    const K = MAGPIE.KEY.POVART;
    return [POVART[K.A_X], POVART[K.A_Y], POVART[K.A_Z]];
  } catch (e) {
    MAGPIE_SYSTEM.error("[PHYSICS].getAcceleration: " + e.message, e);
    return [NaN, NaN, NaN];
  }
};
/**
 *
 * @param {POVART} POVART
 * @returns {bivector} Rotation₀ bivector [yz,xz,xy]
 */
MAGPIE_PHYSICS.getRotation = function getRotation(POVART) {
  const message = "[PHYSICS].getRotation: ";
  try {
    if (!this.isValidPOVART(POVART))
      throw new Error(`(${POVART}) is invalid POVART₀`);
    const K = MAGPIE.KEY.POVART;
    return [POVART[K.R_YZ], POVART[K.R_XZ], POVART[K.R_XY]];
  } catch (e) {
    MAGPIE_SYSTEM.error(message + e.message, e);
    return [NaN, NaN, NaN];
  }
};
/**
 *
 * @param {POVART} POVART
 * @returns {bivector} Torque₀ bivector [yz,xz,xy]
 */
MAGPIE_PHYSICS.getTorque = function getTorque(POVART) {
  const message = "[PHYSICS].getTorque: ";
  try {
    if (!this.isValidPOVART(POVART))
      throw new Error(`(${POVART}) is invalid POVART₀`);
    const K = MAGPIE.KEY.POVART;
    return [POVART[K.T_YZ], POVART[K.T_XZ], POVART[K.T_XY]];
  } catch (e) {
    MAGPIE_SYSTEM.error(message + e.message, e);
    return [NaN, NaN, NaN];
  }
};
/**
 *
 * @param {POVART} POVART
 * @returns {Number} Entity ID
 */
MAGPIE_PHYSICS.getEntityID = function getEntityID(POVART) {
  const message = `[PHYSICS].getEntityID: `;
  try {
    if (!this.isValidPOVART(POVART))
      throw new Error(`(${POVART}) is invalid POVART₀`);
    const K = MAGPIE.KEY.POVART;
    return POVART[K.E_ID];
  } catch (e) {
    MAGPIE_SYSTEM.error(message + e.message, e);
    return NaN;
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
// #region > Setters
//------------------------------------------------------------------------
/**
 *
 * @param {POVART} POVART0 POVART₀
 * @param {vector3} vector [x,y,z]
 * @param {String} vectorName eg. "V1"
 * @returns {POVART} POVART₁
 */
MAGPIE_PHYSICS._POVART_setVector = function _POVART_setVector(
  POVART0,
  vector,
  vectorName,
) {
  const ePrefix = `[PHYSICS].set${vectorName}: `;
  const POVART1 = new Float64Array(POVART0);
  const V = vectorName.charAt(0);
  try {
    if (!this.isValidPOVART(POVART0))
      throw new Error(`${POVART0} is invalid POVART₀`);
    if (!this.isValidVector(vector))
      throw new Error(`${vector} is invalid ${V}₁`);
    const K = MAGPIE.KEY.POVART;
    POVART1[K[`${V}_X`]] = vector[0];
    POVART1[K[`${V}_Y`]] = vector[1];
    POVART1[K[`${V}_Z`]] = vector[2];
    if (!this.isValidPOVART(POVART1))
      throw new Error(`${POVART1} is invalid POVART₁`);
    POVART0 = POVART1;
  } catch (e) {
    MAGPIE_SYSTEM.error(ePrefix + e.message, e);
  } finally {
    return POVART0;
  }
};
/**
 *
 * @param {POVART} POVART0 POVART₀
 * @param {bivector} bivector [yz,xz,xy]
 * @param {String} bivectorName eg. "T1"
 * @returns {POVART} POVART₁
 */
MAGPIE_PHYSICS._POVART_setBivector = function _POVART_setBivector(
  POVART0,
  bivector,
  bivectorName,
) {
  const ePrefix = `[PHYSICS].set${bivectorName}: `;
  const POVART1 = new Float64Array(POVART0);
  const B = bivectorName.charAt(0);
  try {
    if (!this.isValidPOVART(POVART0))
      throw new Error(`${POVART0} is invalid POVART₀`);
    if (!this.isValidVector(bivector))
      throw new Error(`${bivector} is invalid ${B}₁`);
    const K = MAGPIE.KEY.POVART;
    POVART1[K[`${B}_YZ`]] = bivector[0];
    POVART1[K[`${B}_XZ`]] = bivector[1];
    POVART1[K[`${B}_XY`]] = bivector[2];
    if (!this.isValidPOVART(POVART1))
      throw new Error(`${POVART1} is invalid POVART₁`);
    POVART0 = POVART1;
  } catch (e) {
    MAGPIE_SYSTEM.error(ePrefix + e.message, e);
  } finally {
    return POVART0;
  }
};
/**
 *
 * @param {POVART} POVART0
 * @param {vector3} P1 Position₁ vector [x,y,z]
 * @returns {POVART} POVART₁
 */
MAGPIE_PHYSICS.setPosition = function setPosition(POVART0, P1) {
  const ePrefix = `[PHYSICS].setPosition: `;
  const POVART1 = new Float64Array(POVART0);
  try {
    if (!this.isValidPOVART(POVART0))
      throw new Error(`(${POVART0}) is invalid POVART₀`);
    if (!this.isValidVector(P1)) throw new Error(`(${P1}) is invalid P₁`);
    const K = MAGPIE.KEY.POVART;
    POVART1[K.P_X] = P1[0];
    POVART1[K.P_Y] = P1[1];
    POVART1[K.P_Z] = P1[2];
    if (this.isValidPOVART(POVART1)) POVART0 = POVART1;
  } catch (e) {
    MAGPIE_SYSTEM.error(ePrefix + e.message, e);
  } finally {
    return POVART0;
  }
};
/**
 *
 * @param {POVART} POVART
 * @param {Number} celestialID
 * @returns {POVART} POVART₁
 */
MAGPIE_PHYSICS.setCelestialID = function setCelestialID(POVART0, celestialID) {
  const ePrefix = `[PHYSICS].setCelestialID: `;
  try {
    if (!this.isValidPOVART(POVART0))
      throw new Error(`(${POVART0}) is invalid POVART₀`);
    if (!MAGPIE_SYSTEM.Utility.isValidID(celestialID))
      throw new Error(`(${celestialID}) is invalid ID`);
    const K = MAGPIE.KEY.POVART;
    POVART0[K.P_C] = celestialID;
  } catch (e) {
    MAGPIE_SYSTEM.error(ePrefix + e.message, e);
  } finally {
    return POVART0;
  }
};
MAGPIE_PHYSICS.setOrbit = function setOrbit(POVART0, orbit) {
  const ePrefix = "[PHYSICS].setOrbit: ";
  try {
    if (!this.isValidPOVART(POVART0))
      throw new Error(`${POVART0} is invalid POVART₀`);
    if (!this.isValidOrbit(orbit)) throw new Error(`${orbit} is invalid Pₖ`);
    const K = MAGPIE.KEY.POVART;
    const offset = K.P_C + 1;
    orbit.forEach((value, index) => {
      POVART0[offset + index] = value;
    });
  } catch (e) {
    MAGPIE_SYSTEM.error(ePrefix + e.message, e);
  } finally {
    return POVART0;
  }
};
/**
 *
 * @param {Float64Array} POVART
 * @param {bivector} O1 Orientation₁ rotor [yz,xz,xy,scalar]
 * @returns {Float64Array} POVART₁
 *
 * @version 0.17.17
 * - FIXED: passing full O1 to wrapper that only accepts bivectors
 */
MAGPIE_PHYSICS.setOrientation = function setOrientation(POVART0, O1) {
  const ePrefix = `[PHYSICS].setOrientation: `;
  try {
    const O = [O1[0], O1[1], O1[2]];
    const POVART1 = this._POVART_setBivector(POVART0, O, "O1");
    POVART1[MAGPIE.KEY.POVART.O_W] = O1[3];
    POVART0 = POVART1;
  } catch (e) {
    MAGPIE_SYSTEM.error(ePrefix + e.message, e);
  } finally {
    return POVART0;
  }
};
/**
 *
 * @param {POVART} POVART0
 * @param {vector3} V1 Velocity₁ vector [x,y,z]
 * @returns {POVART} POVART₁
 */
MAGPIE_PHYSICS.setVelocity = function setVelocity(POVART0, V1) {
  const ePrefix = `[PHYSICS].setVelocity: `;
  const POVART1 = new Float64Array(POVART0);
  try {
    if (!this.isValidPOVART(POVART0))
      throw new Error(`(${POVART0}) is invalid POVART₀`);
    if (!this.isValidVector(V1)) throw new Error(`(${V1}) is invalid V₁`);
    const K = MAGPIE.KEY.POVART;
    POVART1[K.V_X] = V1[0];
    POVART1[K.V_Y] = V1[1];
    POVART1[K.V_Z] = V1[2];
    if (this.isValidPOVART(POVART1)) POVART0 = POVART1;
  } catch (e) {
    MAGPIE_SYSTEM.error(ePrefix + e.message, e);
  } finally {
    return POVART0;
  }
};
/**
 *
 * @param {POVART} POVART0
 * @param {vector3} A1 Acceleration₁ vector [x,y,z]
 * @returns {POVART} POVART₁
 */
MAGPIE_PHYSICS.setAcceleration = function setAcceleration(POVART0, A1) {
  const ePrefix = `[PHYSICS].setAcceleration: `;
  const POVART1 = new Float64Array(POVART0);
  try {
    if (!this.isValidPOVART(POVART0))
      throw new Error(`(${POVART0}) is invalid POVART₀`);
    if (!this.isValidVector(A1)) throw new Error(`(${A1}) is invalid A₁`);
    const K = MAGPIE.KEY.POVART;
    POVART1[K.A_X] = A1[0];
    POVART1[K.A_Y] = A1[1];
    POVART1[K.A_Z] = A1[2];
    if (this.isValidPOVART(POVART1)) POVART0 = POVART1;
  } catch (e) {
    MAGPIE_SYSTEM.error(ePrefix + e.message, e);
  } finally {
    return POVART0;
  }
};
/**
 *
 * @param {POVART} POVART
 * @param {Number} entityID
 * @returns {POVART} POVART₁
 */
MAGPIE_PHYSICS.setEntityID = function setEntityID(POVART0, entityID) {
  const ePrefix = `[PHYSICS].setEntityID: `;
  try {
    if (!this.isValidPOVART(POVART0))
      throw new Error(`(${POVART0}) is invalid POVART₀`);
    if (!MAGPIE_SYSTEM.Utility.isValidID(entityID))
      throw new Error(`(${entityID}) is invalid ID`);
    const K = MAGPIE.KEY.POVART;
    POVART0[K.E_ID] = entityID;
    return POVART0;
  } catch (e) {
    MAGPIE_SYSTEM.error(ePrefix + e.message, e);
    return NaN;
  }
};
/**
 *
 * @param {POVART} POVART
 * @param {bivector} R1 Rotation₁ bivector [yz,xz,xy]
 * @returns {POVART} POVART₁
 */
MAGPIE_PHYSICS.setRotation = function setRotation(POVART0, R1) {
  return this._POVART_setBivector(POVART0, R1, "R1");
};
/**
 *
 * @param {POVART} POVART
 * @param {bivector} T1 Torque₁ bivector [yz,xz,xy]
 * @returns {POVART} POVART₁
 */
MAGPIE_PHYSICS.setTorque = function setTorque(POVART0, T1) {
  return this._POVART_setBivector(POVART0, T1, "T1");
};
// #endregion
//------------------------------------------------------------------------
/**
 * @name
 * @desc
 *
 */
//------------------------------------------------------------------------
// #region > Appliers
//------------------------------------------------------------------------

/**
 *
 * @param {Float64Array} POVART0
 * @param {vector3} dA delta Acceleration
 * @param {Number} dt delta time in seconds
 * @returns {Float64Array} modified POVART
 */
MAGPIE_PHYSICS.applyAcceleration = function applyAcceleration(POVART0, dA, dt) {
  const message = `[PHYSICS].applyAcceleration: `;
  try {
    if (!this.isValidPOVART(POVART0))
      throw new Error(`(${POVART0}) is invalid POVART`);
    if (dA.some((n) => isNaN(n)))
      throw new Error(`(${dA}) is invalid acceleration`);
    if (isNaN(dt)) throw new Error(`(${dt}) is invalid dt`);
    const { A0, V0, P0 } = this.decomp_POVART(POVART0);
    const A1 = this.addVectors(A0, dA);
    const dV = this.scaleVector(A1, dt);
    const V1 = this.addVectors(V0, dV);
    const P1 = this.addVectors(P0, this.scaleVector(V1, dt));
    let POVART1 = this.setAcceleration(POVART0, A1);
    POVART1 = this.setVelocity(POVART1, V1);
    POVART1 = this.setPosition(POVART1, P1);
    return POVART1;
  } catch (e) {
    MAGPIE_SYSTEM.error(message + e.message, e);
    return [NaN, NaN, NaN];
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
// #region > composers
//------------------------------------------------------------------------

/**
 *
 * @param {POVART} POVART0
 * @returns {{
 * P0: vector3,
 * P_C: Number,
 * orbit: orbit
 * O0: rotor,
 * V0: vector3,
 * A0: vector3,
 * R0: bivector,
 * T0: bivector,
 * E_ID: Number
 * }}
 */
MAGPIE_PHYSICS.decomp_POVART = function decomp_POVART(POVART0) {
  const message = `[PHYSICS].decomp_POVART: `;
  try {
    const POVART = POVART0;
    const K = MAGPIE.KEY.POVART;
    const P0 = [POVART[K.P_X], POVART[K.P_Y], POVART[K.P_Z]];
    const P_C = POVART[K.P_C];
    const orbit = [
      POVART[K.P_O_A],
      POVART[K.P_O_E],
      POVART[K.P_O_I],
      POVART[K.P_O_RAAN],
      POVART[K.P_O_AOP],
      POVART[K.P_O_NU],
      POVART[K.P_O_T0],
      POVART[K.P_O_M0],
    ];
    const O0 = [POVART[K.O_YZ], POVART[K.O_XZ], POVART[K.O_XY], POVART[K.O_W]];
    const V0 = [POVART[K.V_X], POVART[K.V_Y], POVART[K.V_Z]];
    const A0 = [POVART[K.A_X], POVART[K.A_Y], POVART[K.A_Z]];
    const R0 = [POVART[K.R_YZ], POVART[K.R_XZ], POVART[K.R_XY]];
    const T0 = [POVART[K.T_YZ], POVART[K.T_XZ], POVART[K.T_XY]];
    const E_ID = POVART[K.E_ID];
    return { P0, P_C, orbit, O0, V0, A0, R0, T0, E_ID };
  } catch (e) {
    MAGPIE_SYSTEM.error(message + e.message, e);
  }
};
/**
 *
 * @param {vect} P1
 * @param {Number} P_C
 * @param {rotor} O1
 * @param {vector3} V1
 * @param {vector3} A1
 * @param {bivector} R1
 * @param {bivector} T1
 * @param {Number} E_ID
 * @returns {POVART}
 */
MAGPIE_PHYSICS._POVART_recompose = function _POVART_recompose(
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
  const ePrefix = `[PHYSICS].POVART_recompose: `;
  const K = MAGPIE.KEY.POVART;
  const POVART = new Float64Array(K.ARRAY).fill(0);
  try {
    if (!E_ID || isNaN(E_ID)) throw new Error(`${E_ID} is invalid entityID`);
    POVART[K.E_ID] = E_ID;
    if (!this.isValidVector(T1))
      throw new Error(`${T1} is invalid bivector T₁`);
    POVART[K.T_YZ] = T1[0];
    POVART[K.T_XZ] = T1[1];
    POVART[K.T_XY] = T1[2];
    if (!this.isValidVector(R1))
      throw new Error(`${R1} is invalid bivector R₁`);
    POVART[K.R_YZ] = R1[0];
    POVART[K.R_XZ] = R1[1];
    POVART[K.R_XY] = R1[2];
    if (!this.isValidVector(A1)) throw new Error(`${A1} is invalid vector A₁`);
    POVART[K.A_X] = A1[0];
    POVART[K.A_Y] = A1[1];
    POVART[K.A_Z] = A1[2];
    if (!this.isValidVector(V1)) throw new Error(`${V1} is invalid vector V₁`);
    POVART[K.V_X] = V1[0];
    POVART[K.V_Y] = V1[1];
    POVART[K.V_Z] = V1[2];
    if (!this.isValidRotor(O1)) throw new Error(`${O1} is invalid rotor O₁`);
    POVART[K.O_YZ] = O1[0];
    POVART[K.O_XZ] = O1[1];
    POVART[K.O_XY] = O1[2];
    POVART[K.O_W] = O1[3];
    if (!this.isValidOrbit(orbit)) throw new Error(`${orbit} is invalid Pₖ`);
    POVART[K.P_O_A] = orbit[0];
    POVART[K.P_O_E] = orbit[1];
    POVART[K.P_O_I] = orbit[2];
    POVART[K.P_O_RAAN] = orbit[3];
    POVART[K.P_O_AOP] = orbit[4];
    POVART[K.P_O_NU] = orbit[5];
    POVART[K.P_O_T0] = orbit[6];
    POVART[K.P_O_M0] = orbit[7];
    if (!P_C || isNaN(P_C)) throw new Error(`${P_C} is invalid celestialID`);
    POVART[K.P_C] = P_C;
    if (!this.isValidVector(P1)) throw new Error(`${P1} is invalid P₁`);
    POVART[K.P_X] = P1[0];
    POVART[K.P_Y] = P1[1];
    POVART[K.P_Z] = P1[2];
    return POVART;
  } catch (e) {
    MAGPIE_SYSTEM.error(ePrefix + e.message, e);
  }
};
/**
 *
 * @param {vector3} P0 current Position₀
 * @param {ID} P_C parent Celestial body ID
 * @param {ID} E_ID entity ID
 * @returns {POVART}
 */
MAGPIE_PHYSICS._POVART_initfromP0 = function _POVART_initfromP0(P0, P_C, E_ID) {
  const K = MAGPIE.KEY.POVART;
  /** @type {Float64Array<Number>} */
  let POVART1 = new Float64Array(K.ARRAY).fill(0);
  const ePrefix = `[PHYSICS].POVARTfromP0: `;
  try {
    POVART1[K.O_W] = 1;
    if (MAGPIE_SYSTEM.Utility.isValidID(P_C)) POVART1[K.P_C] = P_C;
    if (MAGPIE_SYSTEM.Utility.isValidID(E_ID)) POVART1[K.E_ID] = E_ID;
    if (!MAGPIE_PHYSICS.isValidVector(P0))
      throw new Error(`${P0} is invalid vector P₀`);
    POVART1[K.P_X] = P0[0];
    POVART1[K.P_Y] = P0[1];
    POVART1[K.P_Z] = P0[2];
  } catch (e) {
    MAGPIE_SYSTEM.error(ePrefix + e.message, e);
  }
  return POVART1;
};
// #endregion
//------------------------------------------------------------------------
/**
 * @name
 * @desc
 *
 */
//------------------------------------------------------------------------
// #region > helpers
//------------------------------------------------------------------------

/**
 * @desc
 * @param {POVART} POVART0 POVART₀
 * @param {distance} L length (L) in m
 * @param {duration} Tr reaction Time (Tᵣ) in s
 * @returns {distance} proximity tolerance (Dₜ)
 */
MAGPIE_PHYSICS._POVART_proximity = function POVARTproximity(POVART0, L, Tr) {
  const ePrefix = "[PHYSICS].calculateProximity: ";
  try {
    // 1. get current speed mag
    const V0 = this.getVelocity(POVART0);
    const Vmag = this.mag(V0);
    // 2. define static base (e.g. half the ship's length)
    const tolerBase = L * MAGPIE.KEY.STATS.TOLERANCE_BASE;
    // 3. calculate dynamic buffer
    // (speed * time = distance)
    const buffer = Vmag * Tr;
    // 4. return total tolerance
    return tolerBase + buffer;
  } catch (e) {
    MAGPIE_SYSTEM.error(ePrefix + e.message, e);
    return L * 0.5;
  }
};
// #endregion
//------------------------------------------------------------------------
/**
 *
 * back to {@link MAGPIE_PHYSICS.POVART}
 */
//========================================================================
//#endregion
//========================================================================
/**
 *
 * @typedef {[Number, Number, Number]} vector3 [x,y,z]
 * @typedef {[Number, Number, Number]} bivector [yz,xz,xy]
 */
//========================================================================
//#region - VECTORS
//========================================================================
MAGPIE_PHYSICS.vectors = {};
/**
 * @desc {@link MAGPIE_ENTITY.exp}
 * @param {vector3} vector
 * @returns {Boolean}
 *
 *
 */
MAGPIE_PHYSICS.isValidVector = function isValidVector(vector) {
  if (vector && vector.length === 3 && vector.every((n) => !isNaN(n)))
    return true;
};
/**
 *
 * @param {Number} x
 * @param {Number} y
 * @param {Number} z
 * @returns {Number} magnitude
 *
 * @version 0.17.18
 * - FIXED: used .vector_mag(vector) instead of .mag(vector) as a wrapper;
 * 		.vector_mag only accepts (x, y, z)
 */
MAGPIE_PHYSICS.vector_mag = function vector_mag(x = 0, y = 0, z = 0) {
  return Math.sqrt(x ** 2 + y ** 2 + z ** 2);
};
/**
 *
 * @param {vector3} vector [x,y,z]
 * @returns {Number} magnitude of vector
 */
MAGPIE_PHYSICS.mag = function mag(vector) {
  const message = `[PHYSICS].mag: `;
  try {
    if (vector.some((n) => isNaN(n))) throw new Error(`(${vector}) is invalid`);
    const x = vector[0];
    const y = vector[1];
    const z = vector[2];
    return this.vector_mag(x, y, z);
  } catch (e) {
    MAGPIE_SYSTEM.error(message + e.message, e);
    return [NaN, NaN, NaN];
  }
};
/**
 *
 * @param {Number} x1
 * @param {Number} y1
 * @param {Number} z1
 * @param {Number} x2
 * @param {Number} y2
 * @param {Number} z2
 * @returns {Number} the dot product of vectors A and B
 */
MAGPIE_PHYSICS.vector_dot = function vector_dot(x1, y1, z1, x2, y2, z2) {
  return x1 * x2 + y1 * y2 + z1 * z2;
};
/**
 *
 * @param {vector3} vectorA
 * @param {vector3} vectorB
 * @returns {Number} the dot product of vectors A and B
 *
 * @version 0.17.17
 * - FIXED: "this.dot" not a function; must be "this.vector_dot"
 */
MAGPIE_PHYSICS.dotProduct = function dotProduct(vectorA, vectorB) {
  const message = `[PHYSICS].dotProduct: `;
  try {
    if (!this.isValidVector(vectorA))
      throw new Error(`(${vectorA}) is invalid vector`);
    if (!this.isValidVector(vectorB))
      throw new Error(`(${vectorB}) is invalid vector`);
    const A = vectorA;
    const B = vectorB;
    return this.vector_dot(A[0], A[1], A[2], B[0], B[1], B[2]);
  } catch (e) {
    MAGPIE_SYSTEM.error(message + e.message, e);
    return [NaN, NaN, NaN];
  }
};
/**
 *
 * @param {vector3} vector
 * @param {Number} scalar
 * @returns {vector3}
 */
MAGPIE_PHYSICS.vector_addScalar = function vector_addScalar(vector, scalar) {
  const { x, y, z } = vector;
  return [x + scalar, y + scalar, z + scalar];
};
/**
 *
 * @param {Number} x
 * @param {Number} y
 * @param {Number} z
 * @param {Number} s
 * @returns {vector3} vector[x,y,z] multiplied by scalar
 */
MAGPIE_PHYSICS.vector_multiplyScalar = function vector_multiplyScalar(
  x,
  y,
  z,
  s,
) {
  return [x * s, y * s, z * s];
};
/**
 *
 * @param {vector3} vector
 * @param {Number} scalar
 * @returns {vector3} vector[x,y,z] multiplied by scalar
 */
MAGPIE_PHYSICS.scaleVector = function scaleVector(vector, scalar) {
  const message = `[PHYSICS].scaleVector: `;
  try {
    if (!this.isValidVector(vector))
      throw new Error(`(${vector}) is invalid vector`);
    if (isNaN(scalar)) throw new Error(`(${scalar}) is invalid scalar`);
    const v = vector;
    const s = scalar;
    return this.vector_multiplyScalar(v[0], v[1], v[2], s);
  } catch (e) {
    MAGPIE_SYSTEM.error(message + e.message, e);
    return [NaN, NaN, NaN];
  }
};
/**
 *
 * @param {Number} x
 * @param {Number} y
 * @param {Number} z
 * @param {Number} s - scalar
 * @returns {Array} vector[x,y,z] divided by scalar
 */
MAGPIE_PHYSICS.divideScalar = function divideScalar(x, y, z, s) {
  return [x / s, y / s, z / s];
};
/**
 *
 * @param {Number} x1
 * @param {Number} y1
 * @param {Number} z1
 * @param {Number} x2
 * @param {Number} y2
 * @param {Number} z2
 * @returns {vector3} cross vector[x,y,z]
 */
MAGPIE_PHYSICS.vector_cross = function vector_cross(x1, y1, z1, x2, y2, z2) {
  const x3 = y1 * z2 - z1 * y2;
  const y3 = z1 * x2 - x1 * z2;
  const z3 = x1 * y2 - y1 * x2;
  return [x3, y3, z3];
};
/**
 *
 * @param {vector3} vectorA
 * @param {vector3} vectorB
 * @returns {vector3} cross vector [x,y,z]
 */
MAGPIE_PHYSICS.crossProduct = function crossProduct(vectorA, vectorB) {
  const message = `[PHYSICS].crossProduct: `;
  try {
    if (vectorA.some((n) => isNaN(n)))
      throw new Error(`(${vectorA}) is invalid vector`);
    if (vectorB.some((n) => isNaN(n)))
      throw new Error(`(${vectorB}) is invalid vector`);
    const A = vectorA;
    const B = vectorB;
    return this.vector_cross(A[0], A[1], A[2], B[0], B[1], B[2]);
  } catch (e) {
    MAGPIE_SYSTEM.error(message + e.message, e);
    return [NaN, NaN, NaN];
  }
};
/**
 *
 * @param {Number} x1
 * @param {Number} y1
 * @param {Number} z1
 * @param {Number} x2
 * @param {Number} y2
 * @param {Number} z2
 * @returns {vector3} vector[x,y,z]
 */
MAGPIE_PHYSICS.vector_add = function vector_add(x1, y1, z1, x2, y2, z2) {
  return [x1 + x2, y1 + y2, z1 + z2];
};
/**
 *
 * @param {Number} x1
 * @param {Number} y1
 * @param {Number} z1
 * @param {Number} x2
 * @param {Number} y2
 * @param {Number} z2
 * @returns {vector3} vector[x,y,z]
 */
MAGPIE_PHYSICS.vector_sub = function vector_sub(x1, y1, z1, x2, y2, z2) {
  return [x1 - x2, y1 - y2, z1 - z2];
};
/**
 *
 * @param {vector3} vectorA
 * @param {vector3} vectorB
 * @returns {vector3} vector [x,y,z]
 */
MAGPIE_PHYSICS.addVectors = function addVectors(vectorA, vectorB) {
  const message = `[PHYSICS].addVectors: `;
  try {
    if (!this.isValidVector(vectorA))
      throw new Error(`(${vectorA}) is invalid vector`);
    if (!this.isValidVector(vectorB))
      throw new Error(`(${vectorB}) is invalid vector`);
    const A = vectorA;
    const B = vectorB;
    return this.vector_add(A[0], A[1], A[2], B[0], B[1], B[2]);
  } catch (e) {
    MAGPIE_SYSTEM.error(message + e.message, e);
    return [NaN, NaN, NaN];
  }
};
/**
 *
 * @param {vector3} vectorA
 * @param {vector3} vectorB
 * @returns {vector3} vector [x,y,z]
 */
MAGPIE_PHYSICS.subVectors = function subVectors(vectorA, vectorB) {
  const message = `[PHYSICS].subVectors: `;
  try {
    if (!this.isValidVector(vectorA))
      throw new Error(`(${vectorA}) is invalid vector`);
    if (!this.isValidVector(vectorB))
      throw new Error(`(${vectorB}) is invalid vector`);
    const A = vectorA;
    const B = vectorB;
    return this.vector_sub(A[0], A[1], A[2], B[0], B[1], B[2]);
  } catch (e) {
    MAGPIE_SYSTEM.error(message + e.message, e);
    return [NaN, NaN, NaN];
  }
};
/**
 *
 * @param {Number} x
 * @param {Number} y
 * @param {Number} z
 * @returns {vector3} normalized vector [x,y,z]
 */
MAGPIE_PHYSICS.vector_normalize = function vector_normalize(x, y, z) {
  const mag = this.vector_mag(x, y, z);
  if (mag > 1e-12) {
    const invMag = 1 / mag;
    x *= invMag;
    y *= invMag;
    z *= invMag;
  } else {
    x = 0;
    y = 0;
    z = 0;
  }
  return [x, y, z];
};
/**
 *
 * @param {vector3} vector
 * @returns {vector3} normalized vector [x,y,z]
 */
MAGPIE_PHYSICS.normalizeVector = function normalizeVector(vector) {
  const message = `[PHYSICS].normalizeVector: `;
  try {
    if (!this.isValidVector(vector)) throw new Error(`(${vector}) is invalid`);
    const v = vector;
    return this.vector_normalize(v[0], v[1], v[2]);
  } catch (e) {
    MAGPIE_SYSTEM.error(message + e.message, e);
    return [NaN, NaN, NaN];
  }
};
/**
 *
 * @param {Number} x
 * @param {Number} y
 * @param {Number} z
 * @param {Number} angle radians
 * @returns {vector3} rotated vector [x,y,z]
 */
MAGPIE_PHYSICS.vector_rotate = function vector_rotate(x, y, z, angle) {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  const x2 = x;
  const y2 = y * cos - z * sin;
  const z2 = z * sin + z * cos;
  return [x2, y2, z2];
};
/**
 *
 * @param {vector3} vector
 * @param {Number} angleRad angle in radians
 * @returns {vector3} rotated vector [x,y,z]
 */
MAGPIE_PHYSICS.rotateVector = function rotateVector(vector, angleRad) {
  const message = `[PHYSICS].rotateVector: `;
  try {
    if (!this.isValidVector(vector))
      throw new Error(`(${vector}) is invalid vector`);
    if (!this.isValidAngleRad(angleRad))
      throw new Error(`(${angleRad}) is invalid angle`);
    const v = vector;
    return this.vector_rotate(v[0], v[1], v[2], angleRad);
  } catch (e) {
    MAGPIE_SYSTEM.error(message + e.message, e);
    return [NaN, NaN, NaN];
  }
};
/**
 * @param {angle_rad} angleRad
 * @returns {Boolean}
 */
MAGPIE_PHYSICS.isValidAngleRad = function isValidAngleRad(angleRad) {
  if (isNaN(angleRad) || angleRad > Math.PI || angleRad < 0) return true;
  return false;
};
/**
 *
 * @param {angleDeg} angleDeg
 * @returns {Boolean}
 */
MAGPIE_PHYSICS.isValidAngleDeg = function isValidAngleDeg(angleDeg) {
  if (isNaN(angleDeg || angleDeg < 0 || angleDeg > 360)) return false;
  return true;
};
/**
 *
 * @param {angle_euler} angleEuler
 * @returns {Boolean}
 */
MAGPIE_PHYSICS.isValidAngleEuler = function isValidAngleEuler(angleEuler) {
  if (isNaN(angleEuler) || angleEuler < -180 || angleEuler > 180) return false;
  return true;
};
/**
 *
 * @param {vector3} vector
 * @param {Number} maxMag
 * @returns {vector3} vector with clamped magnitude
 */
MAGPIE_PHYSICS.vector_clamp_mag = function vector_clamp_mag(vector, maxMag) {
  const ePrefix = `[PHYSICS].VectorClampMag: `;
  try {
    if (!this.isValidVector(vector))
      throw new Error(`${vector} is invalid vector`);
    const m = this.mag(vector);
    if (m > maxMag) {
      const factor = maxMag / m;
      return this.scaleVector(vector, factor);
    }
    return vector;
  } catch (e) {
    MAGPIE_SYSTEM.error(ePrefix + e.message, e);
  }
};
/**
 * @desc back to {@link MAGPIE_PHYSICS.vectors}
 *
 */
//========================================================================
//#endregion
//========================================================================
/**
 *
 * @typedef {[yz<Number>, xz<Number>, xy<Number>, scalar<Number>]} rotor
 * [yz,xz,xy,scalar]
 *
 */
//========================================================================
//#region - ROTOR
//========================================================================
MAGPIE_PHYSICS.rotor = {};
/**
 * @name
 * @desc
 *
 */
//------------------------------------------------------------------------
// #region > validate
//------------------------------------------------------------------------
/**
 *
 * @param {rotor} rotor
 * @returns {Boolean}
 *
 * @version 0.17.18
 * - FIXED: "!this.rotorMagnitude(rotor) !== 1" incorrect syntax; must be
 * 		"if(this.rotorMagnitude(rotor) !== 1)"
 */
MAGPIE_PHYSICS.isValidRotor = function isValidRotor(rotor) {
  const mag = this.rotorMagnitude(rotor);
  return Math.abs(mag - 1) < 1e-9;
};
/**
 *
 * @returns {rotor} identity rotor (Oᵢ)
 */
MAGPIE_PHYSICS._rotor_identity = function rotorIdentity() {
  return [0, 0, 0, 1];
};
// #endregion
//------------------------------------------------------------------------
/**
 * @name
 * @desc
 *
 */
//------------------------------------------------------------------------
// #region > low
//------------------------------------------------------------------------
/**
 * @desc complete inversion, including identity (w)
 * @param {rotor} rotor
 * @returns {rotor}
 */
MAGPIE_PHYSICS.rotorInvert = function rotorInvert(rotor) {
  return [-rotor[0], -rotor[1], -rotor[2], -rotor[3]];
};
/**
 * @desc Math: Reverse of a rotor = negate the bivector part,
 * keep the scalar. This is R~ used in the sandwich product,
 * and equivalent to the quaternion conjugate.
 * @param {rotor} R rotor[yz,xz,xy,w]
 * @returns {rotor} rotor[yz,xz,xy,w]
 * @desc Sanity check:
 * rotorReverse([0, 0, 0, 1]) → [0, 0, 0, 1] (identity unchanged)
 */
MAGPIE_PHYSICS.rotorReverse = function rotorReverse(R) {
  return [-R[0], -R[1], -R[2], R[3]];
};
/**
 * @desc Math: Magnitude of a 4-component rotor = sqrt(yz² + xz² + xy² + s²).
 * Divide all by it. Prevents numeric drift over thousands of multiplications.
 * @param {rotor} R rotor[yz,xz,xy,w]
 * @returns {rotor} rotor[yz,xz,xy,w]
 * @desc Sanity check: rotorNormalize([0, 0, 0, 2]) → [0, 0, 0, 1]
 */
MAGPIE_PHYSICS.rotorNormalize = function rotorNormalize(R) {
  const message = `[PHYSICS].rotorNormalize: `;
  try {
    const mag = this.rotorMagnitude(R);
    if (mag < 1e-10) return [0, 0, 0, 1]; //degenerate — return identity
    const inv = 1 / mag;
    const rotor = [R[0] * inv, R[1] * inv, R[2] * inv, R[3] * inv];
    if (rotor.some((n) => isNaN(n))) throw new Error(`(${rotor}) is invalid`);
    return rotor;
  } catch (e) {
    MAGPIE_SYSTEM.error(message + e.message, e);
  }
};
/**
 *
 * @param {rotor} R
 * @returns {Number} magnitude should be 1
 */
MAGPIE_PHYSICS.rotorMagnitude = function rotorMagnitude(R) {
  const ePrefix = `[PHYSICS].rotorMagnitude: `;
  try {
    if (!R || R.length !== 4 || R.some((n) => isNaN(n)))
      throw new Error(`${R} is invalid rotor`);
    return Math.sqrt(R[0] ** 2 + R[1] ** 2 + R[2] ** 2 + R[3] ** 2);
  } catch (e) {
    MAGPIE_SYSTEM.error(ePrefix + e.message, e);
  }
};
/**
 *
 * @param {rotor} r0
 * @param {rotor} r1
 * @returns {Number}
 */
MAGPIE_PHYSICS.rotorDotProduct = function rotorDotProduct(r0, r1) {
  return r0[0] * r1[0] + r0[1] * r1[1] + r0[2] * r1[2] + r0[3] * r1[3];
};
/**
 * @desc multiplies two rotors (A * B)
 * @param {rotor} A rotor₁
 * @param {rotor} B rotor₂
 * @returns {rotor} resulting orientation (O₁)
 */
MAGPIE_PHYSICS._rotor_multiply = function _rotor_multiply(A, B) {
  const ePrefix = "[PHYSICS].rotorMultiply: ";
  try {
    if (!this.isValidRotor(A)) throw new Error(`${A} is invalid rotor₁`);
    if (!this.isValidRotor(B)) throw new Error(`${B} is invalid rotor₂`);
    const [a1, a2, a3, a0] = A;
    const [b1, b2, b3, b0] = B;
    const O1 = [
      a0 * b1 + a1 * b0 + a2 * b3 - a3 * b2, //yz
      a0 * b2 - a1 * b3 + a2 * b0 + a3 * b1, // xz
      a0 * b3 + a1 * b2 - a2 * b1 + a3 * b0, // xy
      a0 * b0 - a1 * b1 - a2 * b2 - a3 * b3, // w (scalar)
    ];
    // HASTAL Doctrine: Enforce normalization to prevent numerical drift
    return this.rotorNormalize(O1);
  } catch (e) {
    MAGPIE_SYSTEM.error(ePrefix + e.message, e);
  }
};

/**
 * @method rotorApply (R, v) — rotate a vector
 * @Math Sandwich product `R~ v R` applied to a pure vector.
 * Optimised form (no full multivector expansion needed for unit R + pure vector):
 * @param {rotor} R rotor[yz,xz,xy,w]
 * @param {vector3} v vector[x,y,z]
 * @returns {vector3} vector[x,y,z]
 *
 * @sanityCheck (identity): `rotorApply([0,0,0,1], [1,0,0]) → [1, 0, 0]`
 * (no rotation)
 * @sanityCheck (90° in xy-plane): Build a rotor rotating 90° in the xy-plane
 * (about z-axis):
 * `R_xy_90 = [0, 0, sin(45°), cos(45°)]` = `[0, 0, ~0.707, ~0.707]` `rotorApply(R_xy_90, [1,0,0])`
 * should give approximately `[0, 1, 0]`
 */
MAGPIE_PHYSICS.rotorApply = function rotorApply(R, v) {
  const [b_yz, b_xz, b_xy, s] = R;
  const [vx, vy, vz] = v;
  // t = 2 * (bivector × bivector) using GA vector-bivector product
  const tx = 2 * (b_xz * vz - b_xy * vy);
  const ty = 2 * (b_xy * vx - b_yz * vz);
  const tz = 2 * (b_yz * vy - b_xz * vx);
  return [
    vx + s * tx + b_xz * tz - b_xy * ty,
    vy + s * ty + b_xy * tx - b_yz * tz,
    vz + s * tz + b_yz * ty - b_xz * tx,
  ];
};
/**
 *
 * @param {rotor} r0 starting rotor
 * @param {rotor} r1 target rotor
 * @param {ratio} t interpolation ratio
 * @returns {rotor}
 */
MAGPIE_PHYSICS.rotorSlerp = function rotorSlerp(r0, r1, t) {
  let dot = this._U_clampRange(this.rotorDotProduct(r0, r1), -1.0, 1.0);
  let target = r1;
  if (dot < 0.0) {
    dot = -dot;
    target = this.rotorInvert(r1);
  }
  if (dot > 0.9995) {
    const result = [
      r0[0] + t * (target[0] - r0[0]),
      r0[1] + t * (target[1] - r0[1]),
      r0[2] + t * (target[2] - r0[2]),
      r0[3] + t * (target[3] - r0[3]),
    ];
    const mag = this.rotorMagnitude(result);
    return [result[0] / mag, result[1] / mag, result[2] / mag, result[3] / mag];
  }
  const theta_0 = Math.acos(dot);
  const theta = theta_0 * t;
  const sin_theta_0 = Math.sin(theta_0);
  const sin_theta = Math.sin(theta);
  const s0 = Math.sin((1 - t) * theta_0) / sin_theta_0;
  const s1 = Math.sin(t * theta_0) / sin_theta_0;
  return [
    s0 * r0[0] + s1 * target[0],
    s0 * r0[1] + s1 * target[1],
    s0 * r0[2] + s1 * target[2],
    s0 * r0[3] + s1 * target[3],
  ];
};
// #endregion
//------------------------------------------------------------------------
/**
 * @name
 * @desc
 *
 */
//------------------------------------------------------------------------
// #region > compose
//------------------------------------------------------------------------

/**
 * @method rotorFromBivector (B, dt) — step-rotor from angular velocity
 * @Math Given angular velocity bivector B (rad/s) and timestep dt (s):speed = |B| = total angular speed in rad/s
 * `speed = |B|` = total angular speed in rad/s
 * `angle = speed * dt` = rotation angle this tick
 * Step-rotor = `cos(angle/2) + sin(angle/2) * B_normalised`
 * Half-angle because sandwich product doubles the angle (two reflections)
 * @param {bivector} B bivector[yz,xz,xy]
 * @param {Number} dt delta time
 * @returns {rotor} rotor[yz,xz,xy,w]
 * @desc Sanity check: `rotorFromBivector([0,0,0], 0.016) → [0, 0, 0, 1]`
 * (zero speed = identity)
 */
MAGPIE_PHYSICS.rotorFromBivector = function rotorFromBivector(B, dt) {
  const speed = Math.sqrt(B[0] ** 2 + B[1] ** 2 + B[2] ** 2);
  if (speed < 1e-10) return [0, 0, 0, 1]; //no rotation
  const angle = speed * dt;
  const half = angle / 2;
  const s = Math.sin(half) / speed;
  return [
    B[0] * s, //yz
    B[1] * s, //xz
    B[2] * s, //xy
    Math.cos(half), //scalar
  ];
};
/**
 * @method rotorFromVectors (a, b) — from-to rotation
 * @Math Rotor that rotates unit vector (a) to unit vector (b).
 * `R = a·b + a∧b` = `dot(a,b) + wedge(a,b)`
 * Half-angle trick: normalise by `1 + dot(a,b)` to get the half-angle version.
 * @param {vector3} a
 * @param {vector3} b
 * @returns {rotor} rotor[yz,xz,xy,w]
 * @sanityCheck `rotorFromVectors([1,0,0], [1,0,0])` → `[0,0,0,1]`
 * (identity — same vector)
 * `rotorFromVectors([1,0,0], [0,1,0])` → 90° rotation in xy-plane
 */
MAGPIE_PHYSICS.rotorFromVectors = function rotorFromVectors(a, b) {
  const message = `[PHYSICS].rotorFromVectors: `;
  try {
    //a and b must be unit vectors
    const mag_a = this.mag(a);
    const mag_b = this.mag(b);
    let check = [];
    if (Math.abs(mag_a - 1) > 1e-9)
      check.push(`a[${a}].mag(${mag_a}) must be 1`);
    if (Math.abs(mag_b - 1) > 1e-9)
      check.push(`b[${b}].mag(${mag_b}) must be 1`);
    if (check.length > 0) throw new Error(`${check[0]} | ${check[1]}`);
    const dot = this.dotProduct(a, b);
    //wedge product a∧b — the three bivector components
    const yz = a[1] * b[2] - a[2] * b[1];
    const xz = a[2] * b[0] - a[0] * b[2];
    const xy = a[0] * b[1] - a[1] * b[0];
    //half-angle form: use (1 + dot) as scalar, then normalise
    const R = [yz, xz, xy, 1 + dot];
    //special case: a and b are antiparallel (dot ≈ -1) — 180° rotation
    //pick any perpendicular axis
    if (1 + dot < 1e-10) {
      //rotate 180° in the plane most perpendicular to a
      if (Math.abs(a[0]) < 0.9) return this.rotorNormalize([0, -a[2], a[1], 0]);
      else return this.rotorNormalize([a[2], 0, -a[0], 0]);
    }
    return this.rotorNormalize(R);
  } catch (e) {
    MAGPIE_SYSTEM.error(message + e.message, e);
    return [NaN, NaN, NaN, NaN];
  }
};
/**
 *
 * @param {vector3} up [x,y,z]
 * @param {angle_rad} angleRad in radians
 * @returns {rotor} [yz,xz,xy,w]
 */
MAGPIE_PHYSICS.rotorFromAxisAngle = function rotorFromAxisAngle(up, angleRad) {
  const halfAngle = angleRad / 2.0;
  const s = Math.sin(halfAngle);
  const ax = up[0];
  const ay = up[1];
  const az = up[2];
  const yz = -ax * s;
  const xz = -ay * s;
  const xy = -az * s;
  const w = Math.cos(halfAngle);
  const rotor = [yz, xz, xy, w];
  if (!this.isValidRotor(rotor)) throw new Error(`${rotor} is invalid rotor`);
  return rotor;
};
/**
 *
 * @param {vector3} Tfwd target forward
 * @param {vector3} Tup target up
 * @returns {rotor}
 */
MAGPIE_PHYSICS.rotorFromFrame = function rotorFromFrame(Tfwd, Tup) {
  const fwd = MAGPIE.KEY.POVART.FWD;
  const up = MAGPIE.KEY.POVART.UP;
  const rFwd = this.rotorFromVectors(fwd, Tfwd);
  const transformedUp = this.rotorApply(rFwd, up);
  const rTwist = this.rotorFromVectors(transformedUp, Tup);
  return this.rotorCompose(rTwist, rFwd);
};
/**
 * @desc Math: Rotor product (same rule as quaternion multiplication,
 * rewritten for [yz,xz,xy,s]). Written as R1·R2, meaning R1 is applied first.
 * @param {rotor} R1 rotor[yz,xz,xy,w]
 * @param {rotor} R2 rotor[yz,xz,xy,w]
 * @returns {rotor} rotor[yz,xz,xy,w]
 * @desc
 * ```js
 * Let p = R1, q = R2;
 * result.s  =  p.s*q.s  − p.yz*q.yz − p.xz*q.xz − p.xy*q.xy
 * result.yz =  p.s*q.yz + p.yz*q.s  + p.xz*q.xy − p.xy*q.xz
 * result.xz =  p.s*q.xz − p.yz*q.xy + p.xz*q.s  + p.xy*q.yz
 * result.xy =  p.s*q.xy + p.yz*q.xz − p.xz*q.yz + p.xy*q.s
 * ```
 * Sanity check: compose identity with identity → identity:
 * rotorCompose([0,0,0,1], [0,0,0,1]) → [0, 0, 0, 1]
 */
MAGPIE_PHYSICS.rotorCompose = function rotorCompose(R1, R2) {
  return this._rotor_multiply(R1, R2);
};
// #endregion
//------------------------------------------------------------------------
/**
 * @name
 * @desc
 *
 */
//------------------------------------------------------------------------
// #region > convert
//------------------------------------------------------------------------
/**
 *
 * @param {rotor} rotor
 * @param {vector3} localUp
 * @returns {angle_deg}
 */
MAGPIE_PHYSICS._rotor_toHeadingAbs = function _rotor_toHeadingAbs(rotor, P0) {
  const ePrefix = `[PHYSICS].rotorToHdg: `;
  try {
    const up = this.normalizeVector(P0);
    const North = MAGPIE.KEY.POVART.UP;
    const dotN = this.dotProduct(North, up);
    const localNorth = this.normalizeVector(
      this.subVectors(North, this.scaleVector(up, dotN)),
    );
    const localEast = this.crossProduct(localNorth, up);
    const dir = this.rotorApply(rotor, MAGPIE.KEY.POVART.FWD);
    const eastComponent = this.dotProduct(dir, localEast);
    const northComponent = this.dotProduct(dir, localNorth);
    const headingRad = Math.atan2(eastComponent, northComponent);
    const hdg = this._U_rad_to_deg(headingRad);
    return (hdg + 360) % 360;
  } catch (e) {
    MAGPIE_SYSTEM.error(ePrefix + e.message, e);
  }
};
MAGPIE_PHYSICS._rotor_toPitchAbs = function _rotor_toPitchAbs(rotor, P0) {
  const ePrefix = `[PHYSICS].rotorToPitch: `;
  try {
    const up = this.normalizeVector(P0);
    const dir = this.rotorApply(rotor, MAGPIE.KEY.POVART.FWD);
    const dotUp = this.dotProduct(dir, up);
    const clampedDot = Math.max(-1.0, Math.min(1.0, dotUp));
    const pitchRad = Math.asin(clampedDot);
    return this._U_rad_to_deg(pitchRad);
  } catch (e) {
    MAGPIE_SYSTEM.error(ePrefix + e.message, e);
    return NaN;
  }
};
MAGPIE_PHYSICS._rotor_toRollAbs = function _rotor_toRollAbs(rotor, P0) {
  const ePrefix = `[PHYSICS].rotorToRoll: `;
  try {
    const up = this.normalizeVector(P0);
    const dir = this.rotorApply(rotor, MAGPIE.KEY.POVART.FWD);
    const rightVector = MAGPIE.KEY.POVART.RIGHT || [1, 0, 0];
    const right = this.rotorApply(rotor, rightVector);
    const dotUp = this.dotProduct(dir, up);
    if (Math.abs(dotUp) > 0.9999) return 0.0;
    const localRight = this.normalizeVector(this.crossProduct(dir, up));
    const localUp = this.crossProduct(localRight, dir);
    const rightHorizontal = this.dotProduct(right, localRight);
    const rightVertical = this.dotProduct(right, localUp);
    const rollRad = Math.atan2(rightVertical, rightHorizontal);
    return this._U_rad_to_deg(rollRad);
  } catch (e) {
    MAGPIE_SYSTEM.error(ePrefix + e.message, e);
    return NaN;
  }
};

/**
 * Get all three Euler angles from a rotor in one call
 * @param {rotor} rotor [yz,xz,xy,w]
 * @param {vector3} P0 Entity position
 * @returns {[number, number, number]} [roll_deg, pitch_deg, heading_deg]
 */
MAGPIE_PHYSICS._rotor_toEulerAbs = function _rotor_toEulerAbs(rotor, P0) {
  const ePrefix = `[PHYSICS].rotorToEulerAbs: `;
  try {
    // MAGPIE_SYSTEM._logging_debug(`unitP0: ${P0}`)
    if (!this.isValidVector(P0)) return [NaN, NaN, NaN];
    const localUp = MAGPIE.KEY.POVART.UP;
    const R_local = this._rotor_toLocal(rotor, P0);
    const roll = this._rotor_toRollAbs(R_local, localUp);
    const pitch = this._rotor_toPitchAbs(R_local, localUp);
    const heading = this._rotor_toHeadingAbs(rotor, P0);
    return [roll, pitch, heading];
  } catch (e) {
    MAGPIE_SYSTEM.error(ePrefix + e.message, e);
    return [NaN, NaN, NaN];
  }
};

/**
 *
 * @param {rotor} Ot [yz,xz,xy,w]
 * @param {vector3} P0 Position₀ [x,y,z]
 * @param {rotor} O0 Orientation₀ [yz,xz,xy,w]
 * @returns {angle_rad} 0 to PI
 */
/**
 * Creates an absolute orientation rotor from geodetic heading, pitch, and roll
 * @param {angle_deg} heading - Heading in degrees (0 = North, 90 = East)
 * @param {angle_deg} pitch - Pitch in degrees (positive = nose up)
 * @param {angle_deg} roll - Roll in degrees (positive = right wing down)
 * @param {vector3} P0 - Entity's geodetic position [x,y,z]
 * @returns {rotor} [yz,xz,xy,w]
 */
MAGPIE_PHYSICS._rotor_fromEulerAbs = function _rotor_fromEulerAbs(
  heading,
  pitch,
  roll,
  P0,
) {
  const ePrefix = `[PHYSICS].rotorFromEulerAbs: `;
  try {
    // 1. Convert to radians
    const hdgRad = heading * (Math.PI / 180);
    const pitRad = pitch * (Math.PI / 180);
    const rolRad = roll * (Math.PI / 180);

    // 2. Create intrinsic local rotors
    // Heading: rotates North to East -> Positive rotation around Z [0,0,1]
    const rYaw = this.rotorFromAxisAngle([0, 0, 1], hdgRad);
    // Pitch: Nose up -> Negative rotation around X [1,0,0]
    const rPitch = this.rotorFromAxisAngle([1, 0, 0], -pitRad);
    // Roll: Right wing down -> Positive rotation around Y [0,1,0]
    const rRoll = this.rotorFromAxisAngle([0, 1, 0], rolRad);

    // 3. Compose local intrinsic rotations: Yaw -> Pitch -> Roll
    // HASTAL Right-Side rule applies here too for sequential local rotations
    const R_local = this.rotorCompose(this.rotorCompose(rYaw, rPitch), rRoll);

    // 4. Find the base unrotated frame at P0
    const up = this.normalizeVector(P0);
    const North = MAGPIE.KEY.POVART.UP; // [0,0,1]
    const dotN = this.dotProduct(North, up);

    let localNorth;
    if (Math.abs(dotN) > 0.9999) {
      // Geodetic singularity at poles
      localNorth = [0, 1, 0];
    } else {
      localNorth = this.normalizeVector(
        this.subVectors(North, this.scaleVector(up, dotN)),
      );
    }

    // 5. Construct base rotor that aligns absolute [0,1,0] to localNorth and [0,0,1] to up
    const R_base = this.rotorFromFrame(localNorth, up);

    // 6. Apply local Euler rotations to the base frame
    const finalRotor = this.rotorCompose(R_base, R_local);

    return this.rotorNormalize(finalRotor);
  } catch (e) {
    MAGPIE_SYSTEM.error(ePrefix + e.message, e);
    return [0, 0, 0, 1];
  }
};
/**
 *
 * @param {POVART_O} O0
 * @param {POVART_P} P0
 * @returns {rotor}
 */
MAGPIE_PHYSICS._rotor_toLocal = function _rotor_toLocal(O0, P0) {
  const ePrefix = "[PHYSICS].rotorToLocal: ";
  try {
    if (!this.isValidVector(P0)) throw new Error(`${P0} is invalid P₀ vector`);
    if (!this.isValidRotor(O0)) throw new Error(`${O0} is invalid R₀ rotor`);
    const up = this._get_localUp(P0);
    if (!this.isValidVector(up)) throw new Error(`${up} is invalid up vector`);
    // MAGPIE_SYSTEM._logging_debug(`upMag: ${this.mag(up)}`)
    const localNorth = this._get_localNorth(up);
    if (!this.isValidVector(localNorth))
      throw new Error(`${localNorth} is invalid localNorth vector`);
    const R_base = this.rotorFromFrame(localNorth, up);
    if (!this.isValidRotor(R_base))
      throw new Error(`${R_base} is invalid R_base rotor`);
    return this.rotorCompose(this.rotorReverse(R_base), O0);
  } catch (e) {
    MAGPIE_SYSTEM.error(ePrefix + e.message, e);
    return O0;
  }
};
MAGPIE_PHYSICS._rotor_angle = function getRotorAngle(Ot, P0, O0) {
  const ePrefix = "[PHYSICS].getRotorAngle: ";
  try {
    const h1 = this._rotor_toHeadingAbs(O0, P0);
    const h2 = this._rotor_toHeadingAbs(Ot, P0);
    let diff = Math.abs(h2 - h1);
    if (diff > 180) diff = 360 - diff;
    return diff * (Math.PI / 180);
    if (isNaN(Aerror)) throw new Error(`${Aerror} is invalid angle Aᵣ`);
    // MAGPIE_SYSTEM._logging_debug(`Aerror: ${Aerror}`)
    return Aerror;
  } catch (e) {
    MAGPIE_SYSTEM.error(ePrefix + e.message, e);
  }
};
// #endregion
//------------------------------------------------------------------------
/**
 *
 * back to {@link MAGPIE_PHYSICS.rotor}
 */
//========================================================================
//#endregion
//========================================================================
/**
 *
 *
 */
//========================================================================
//#region - CELESTIAL
//========================================================================
MAGPIE_PHYSICS.celestial = {};
/**
 *
 * @param {mass} mass
 * @param {Number} CMF
 * @returns
 */
MAGPIE_PHYSICS.celestialDensity = function celestialDensity(mass, CMF) {
  const C10 = mass;
  const C11 = CMF;
  const exp1 = 5.51 * C10 ** (0.189 / (1.07 - 0.21 * (C11 / 100)) ** 3);
  const exp2 = 3.5 + 4.37 * (C11 / 100);
  if (C10 > 0.6 || exp1 > exp2) return exp1;
  return exp2;
};
/**
 *
 * back to {@link MAGPIE_PHYSICS.celestial}
 */
//========================================================================
//#endregion
//========================================================================
/**
 * @name
 * @desc
 *
 */
//========================================================================
// #region - MATERIA
//========================================================================
MAGPIE_PHYSICS.materia = {};
/**
 * @name
 * @desc
 *
 */
//------------------------------------------------------------------------
// #region > Collision
//------------------------------------------------------------------------
/**
 *
 * @param {MAGPIE_ENTITY} entity
 * @return {vector3}
 */
MAGPIE_PHYSICS._calculate_collisionBox = function _calculate_collisionBox(
  entity,
) {
  const ePrefix = "[PHYSICS].calculateCollisionBox: ";
  const K = MAGPIE.KEY.STATS;
  let LENGTH = entity.STATS[K.LENGTH];
  let HEIGHT = entity.STATS[K.HEIGHT];
  let WIDTH = entity.STATS[K.WIDTH];
  try {
    if ([LENGTH, HEIGHT, WIDTH].some((n) => isNaN(n))) {
      const MASSKG = entity.STATS[K.MASSKG];
      const DEX = entity.STATS[K.DEX];
      const DensKgL = entity.STATS[K.DENSITY] || 1;
      const VolL = entity.STATS[K.VOLUME] || MASSKG / DensKgL;
      const stretch = K.STRETCH;
      const r = Math.pow((3 * VolL) / (4 * Math.PI), 1 / 3);
      const E = (1 + (DEX / 100) * stretch) * 0.1;
      if (!LENGTH || isNaN(LENGTH)) {
        const length = 2 * r * E;
        if (isNaN(length)) throw new Error(`${length} is invalid length`);
        entity.STATS[K.LENGTH] = length;
        LENGTH = entity.STATS[K.LENGTH];
      }
      const mod = 1 / Math.sqrt(E);
      if (!HEIGHT || isNaN(HEIGHT)) {
        const height = 2 * r * mod;
        if (isNaN(height)) throw new Error(`${height} is invalid height`);
        entity.STATS[K.HEIGHT] = height;
        HEIGHT = entity.STATS[K.HEIGHT];
      }
      if (!WIDTH || isNaN(WIDTH)) {
        const width = 2 * r * mod;
        if (isNaN(width)) throw new Error(`${width} is invalid width`);
        entity.STATS[K.WIDTH] = width;
        WIDTH = entity.STATS[K.WIDTH];
      }
    }
  } catch (e) {
    MAGPIE_SYSTEM.error(ePrefix + e.message, e);
  } finally {
    const CB = [LENGTH, HEIGHT, WIDTH];
    if (this.isValidVector(CB)) return CB;
    return [0, 0, 0];
  }
};
/**
 *
 * @param {MAGPIE_ENTITY} entity
 * @returns {mass}
 */
MAGPIE_PHYSICS._calculate_growthMassKg = function _calculate_growthMassKg(
  entity,
) {
  const ePrefix = "[PHYSICS].calculateGrowthMassKg: ";
  try {
    const K = MAGPIE.KEY.STATS;
    const e = MAGPIE.KEY.PHYSICS.EULER;
    const MASS = entity.STATS[K.MASS];
    const gRate = entity.STATS[K.G_R];
    const gInflect = entity.STATS[K.G_I];
    const gLVL = entity._get_growthLevel();
    const FAT = entity._get_fatLevel();
    const expon = 1 / (1 + e * Math.pow(-gRate * (gLVL - gInflect)));
    return MASS * 10 * expon * (1 + FAT / 100);
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
// #region - WRAPPERS
//========================================================================
/**
 * @name
 * @desc
 *
 */
//------------------------------------------------------------------------
// #region > Apply
//------------------------------------------------------------------------
/**
 *
 * @param {POVART} POVART0 entity's POVART₀
 * @param {bivector} dT entity's delta Torque
 * @param {Number} dt delta time in seconds
 * @returns {POVART} entity's POVART₁
 */
MAGPIE_PHYSICS.applyTorque = function applyTorque(POVART0, dT, dt) {
  const message = `[PHYSICS].applyTorque: `;
  let POVART1 = new Float64Array(POVART0);
  try {
    if (!this.isValidPOVART(POVART0))
      throw new Error(`(${POVART0}) is invalid POVART₀`);
    if (!this.isValidVector(dT)) throw new Error(`(${dT}) is invalid dT`);
    if (isNaN(dt) || !dt) throw new Error(`(${dt}) is invalid dt`);
    const { T0, R0, O0 } = this.decomp_POVART(POVART0);
    const T1 = this.addVectors(T0, dT);
    const dR = this.scaleVector(T1, dt);
    const R1 = this.addVectors(R0, dR);
    const dO = this.rotorFromBivector(R1, dt);
    const cO = this.rotorCompose(dO, O0);
    const O1 = this.rotorNormalize(cO);
    POVART1 = this.setTorque(POVART1, T1);
    POVART1 = this.setRotation(POVART1, R1);
    POVART1 = this.setOrientation(POVART1, O1);
    if (!this.isValidPOVART(POVART1))
      throw new Error(`${POVART1} is invalid POVART₁`);
    POVART0 = POVART1;
  } catch (e) {
    MAGPIE_SYSTEM.error(message + e.message, e);
  } finally {
    return POVART0;
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
 * @section of {@link MAGPIE_PHYSICS}
 * @child of {@link MAGPIE_PHYSICS.geodetic}
 * @reference {@link MAGPIE.KEY.PHYSICS.AERO} {@link MAGPIE.KEY.STATS.meta}
 *
 */
//========================================================================
// #region - AERO
//========================================================================
MAGPIE_PHYSICS.aero = {};
/**
 *
 * @param {MAGPIE_ENTITY} celestial body
 * @param {Array<Number>} coords lat°, lon°, ASL (m)
 * @param {Array<Number>} POVART1 latest worldstate of the entity
 * @param {Number} Cf Coefficient of Friction (μ)
 * @param {Number} Cl Coefficient of Lift
 * @param {Number} Cd Coefficient of Drag
 * @param {Number} CoM Center of Mass
 * @param {Number} CoL Center of Lift
 * @returns {{Fg: acceleration, Fd: force, Ff: force, Fl: force, AoA: angle}}
 *
 */
MAGPIE_PHYSICS.currentAeroForces = function currentAeroForces(
  celestial,
  coords,
  POVART1,
  Cf,
  Cl,
  Cd,
  CoM,
  CoL,
) {
  const { ASL } = coords;
  const { P0 } = this.getPosition(POVART1);
  const Fg = this._celestial_LocalG(celestial, P0);
  const Fd = this._aero_calculateFd(C, coords, Cl, Cd, CoM, CoL, AoA);
  const Fl = this._aero_calculateFl(C, coords, Cl, Cd, CoM, CoL, AoA);
  const AoA = this._aero_calculateAoA(POVART1);
  return { Fg, Fd, Fl, AoA };
};
/**
 * @todo local Gravity
 * @param {MAGPIE_CELESTIAL} celestial
 * @param {vector3} P0
 */
MAGPIE_PHYSICS._celestial_LocalG = function _celestial_LocalG(celestial, P0) {
  const mass = celestial.traits[MAGPIE.KEY.CELESTIAL.MASS];
  const G = this._forces_calculate2BodyGravityVector(P0, mass);
  return this.mag(G);
};
/**
 * @todo Ff friction force
 * @param {MAGPIE_CELESTIAL} C
 * @param {coords} coords lat, lon, ASL
 * @param {Number} Cf entity's coefficient of friction
 * @param {vector3} V0 entity's Velocity vector
 * @returns {force} Friction force (N)
 */
MAGPIE_PHYSICS._geod_calculateFf = function _geod_calculateFf(
  C,
  coords,
  Cf,
  V0,
) {
  return 0.1;
};
/**
 * @todo Fd drag
 * @param {MAGPIE_CELESTIAL} C
 * @param {coords} coords
 * @param {Number} Cl
 * @param {Number} Cd
 * @param {Number} CoM
 * @param {Number} CoL
 * @param {angle} AoA
 * @returns {force} (Fd) drag force in Newtons (N)
 */
MAGPIE_PHYSICS._aero_calculateFd = function _aero_calculateFd(
  C,
  coords,
  Cl,
  Cd,
  CoM,
  CoL,
  AoA,
) {
  return 0.1;
};
/**
 * @todo Fl lift
 * @param {MAGPIE_CELESTIAL} C
 * @param {coords} coords
 * @param {Number} Cl
 * @param {Number} Cd
 * @param {Number} CoM
 * @param {Number} CoL
 * @param {angle} AoA
 * @returns {force} (Fl) lift force in Newtons (N)
 */
MAGPIE_PHYSICS._aero_calculateFl = function _aero_calculateFl(
  C,
  coords,
  Cl,
  Cd,
  CoM,
  CoL,
  AoA,
) {
  return 0.1;
};
/**
 *
 * @param {rotor} O0
 * @param {vector3} V0
 * @param {vector3} fwd default forward vector {@link MAGPIE.KEY.POVART.FWD}
 * @returns {angle_rad} angle of attack in radians
 */
MAGPIE_PHYSICS._aero_calculateAoArad = function _aero_calculateAoArad(
  O0,
  V0,
  fwd,
) {
  const message = `[PHYSICS].calculateAoArad: `;
  try {
    const speed = this.mag(V0);
    if (isNaN(V0) || speed < 0.1) return NaN;
    //
    if (!fwd || fwd.some((n) => !n)) fwd = MAGPIE.KEY.POVART.FWD;
    const fwd_world = this.rotorApply(O0, fwd);
    const V_dir = this.normalizeVector(V0);
    //
    const dot = this.dotProduct(fwd_world, V_dir);
    const angle = Math.acos(this._U_clampRange(dot, -1, 1));
    if (isNaN(angle)) throw new Error(`(${angle}) is invalid`);
    //
    // determine sign: project velocity onto local "up" axis
    //assuming [0,0,1] is local up (Z-axis in many coordinate systems)
    const up = this.rotorApply(O0, MAGPIE.KEY.POVART.UP);
    const AoA = this.dotProduct(V_dir, up) < 0 ? angle : -angle;
    return AoA;
  } catch (e) {
    MAGPIE_SYSTEM.error(message + e.message, e);
  }
};
/**
 *
 * back to {@link MAGPIE_PHYSICS.aero}
 */
//========================================================================
//#endregion --- Aero
//========================================================================
/**
 *
 *
 */
//========================================================================
//#region - UTILITY
//========================================================================
MAGPIE_PHYSICS.Utility = {};
/**
 *
 * @param {entity_stats} params
 * @returns {Boolean}
 */
MAGPIE_PHYSICS.isValidParams = function isValidParams(params) {
  const ePrefix = "[PHYSICS].isValidParams: ";
  try {
    if (!params) throw new Error(`${params} is invalid params`);
    if (params.length < MAGPIE.KEY.STATS.ARRAY)
      throw new Error(`${params} is invalid STATS format`);
    if (params.some((n) => isNaN(n)))
      throw new Error(`${params} has invalid numbers`);
    return true;
  } catch (e) {
    MAGPIE_SYSTEM.error(ePrefix + e.message, e);
  }
};
/**
 *
 * @param {Number} number
 * @param {Number} min
 * @param {Number} max
 * @returns {Number} clamped
 */
MAGPIE_PHYSICS._U_clampRange = function clampRange(number, min, max) {
  return MAGPIE_SYSTEM.Math.clampRange(number, min, max);
};
/**
 *
 * @param {Number} knots
 * @returns {velocity} Vspeed in m/s
 */
MAGPIE_PHYSICS._U_knotsToMPS = function _U_knotsToMPS(knots) {
  return Number(((knots * MAGPIE.KEY.PHYSICS.NM) / 3600).toFixed(5));
};
/**
 *
 * @param {velocity} MPS
 * @returns {Number} kts
 */
MAGPIE_PHYSICS._U_MPStoKnots = function _U_MPStoKnots(MPS) {
  return Number(((MPS / MAGPIE.KEY.PHYSICS.NM) * 3600).toFixed(5));
};
MAGPIE_PHYSICS._aero_calculateAoA = function _aero_calculateAoA(POVART0, fwd) {
  const rad = this._aero_calculateAoArad(POVART0, fwd);
  return this._U_rad_to_deg(rad);
};
MAGPIE_PHYSICS._U_rad_to_deg = function _U_rad_to_deg(radians) {
  return MAGPIE_SYSTEM.Math.convertRadToDeg(radians);
};
MAGPIE_PHYSICS._U_deg_to_rad = function _U_deg_to_rad(degrees) {
  return MAGPIE_SYSTEM.Math.convertDegToRad(degrees);
};
MAGPIE_PHYSICS._aero_calculateCf = function () {
  //@todo calculate Cf
};
MAGPIE_PHYSICS._aero_calculateCl = function () {
  //@todo calculate Cl
};
MAGPIE_PHYSICS._aero_calculateCd = function () {
  //@todo calculate Cd
};
MAGPIE_PHYSICS._aero_calculateCoM = function () {
  //@todo calculate CoM
};
MAGPIE_PHYSICS._aero_calculateCoL = function () {
  //@todo calculate CoL
};
/**
 * @desc {@link MAGPIE.KEY.STATS.meta}
 * @param {entity_stats} stats
 * @returns {vector3} inertia tensor [Ix, Iy, Iz]
 */
MAGPIE_PHYSICS._calculateInertiaTensor = function calculateInertia(stats) {
  const ePrefix = "[PHYSICS].calculateInertia: ";
  try {
    if (!this.isValidParams(stats))
      throw new Error(`${stats} is invalid STATS`);
    const K = MAGPIE.KEY.STATS;
    const L = stats[K.LENGTH];
    const H = stats[K.HEIGHT];
    const W = stats[K.WIDTH];
    const m = stats[K.MASSKG];
    const factor = (1 / 12) * m;
    const I = [
      factor * (L ** 2 + H ** 2), //x-axis (Pitch)
      factor * (H ** 2 + W ** 2), //y-axis(Roll)
      factor * (L ** 2 + W ** 2), //z-axis (Yaw)
    ];
    if (!this.isValidVector(I)) throw new Error(`${I} is invalid I vector`);
    return I;
  } catch (e) {
    MAGPIE_SYSTEM.error(ePrefix + e.message, e);
  }
};
/**
 *
 * @param {entity_stats} stats
 * @returns {alpha} (α) in rad/s^2
 */
MAGPIE_PHYSICS._calculateAgilityAlpha = function calculateAgilityAlpha(stats) {
  const ePrefix = "[PHYSICS].calculateAgilityAlpha: ";
  try {
    if (!this.isValidParams(stats))
      throw new Error(`${stats} is invalid STATS`);
    const K = MAGPIE.KEY.STATS;
    const L = stats[K.LENGTH];
    const H = stats[K.HEIGHT];
    const W = stats[K.WIDTH];
    const GMAX = stats[K.GMAX];
    // 1. find the distance from center to further corner (pythagoras)
    // this is true radius 'r' of the entity
    const r = Math.sqrt((L / 2) ** 2 + (H / 2) ** 2 + (W / 2) ** 2);
    // 2. alpha = max_linear_acceleration / radius
    // this ensures no point on the ship exceeds GMAX
    const a = GMAX / r;
    if (isNaN(a)) throw new Error(`${a} is invalid alpha`);
    return a;
  } catch (e) {
    MAGPIE_SYSTEM.error(ePrefix + e.message, e);
  }
};
/**
 *
 * @param {STAT} dex Dexterity parameter (DEX₁)
 * @param {spin} a initial agility alpha (a₀) in rad/s
 * @returns {coefficient} final agility alpha (a₁)
 */
MAGPIE_PHYSICS._get_agilityModifier = function agilityModifier(dex, a) {
  const MOD = MAGPIE.KEY.STATS.AGILITY_MOD_MIN;
  const MAX = MAGPIE.KEY.STATS.AGILITY_MOD_MAX;
  const multiplier = MOD + dex / MAX;
  return a * multiplier;
};
/**
 * @typedef {import("./system").interval_text} interval_text
 * @param {distance} distance
 * @param {velocity} cruiseSpeed
 * @returns {interval_text}
 */
MAGPIE_PHYSICS._U_ETE = function EstimatedTimeEnroute(distance, cruiseSpeed) {
  // const interval = MAGPIE_SYSTEM.Utility._makeInterval(distance / cruiseSpeed)
  return MAGPIE_SYSTEM.Utility.printETA(distance / cruiseSpeed);
};
/**
 *
 * @param {distance} distance
 * @returns {String}
 */
MAGPIE_PHYSICS._U_printDistance = function printDistance(distance) {
  return distance < 1000
    ? `${Math.floor(distance)} m`
    : `${(distance / 1000).toFixed(3)} km`;
};
/**
 *
 * back to {@link MAGPIE_PHYSICS.Utility}
 */
//========================================================================
//#endregion
//========================================================================
module.exports = { MAGPIE_PHYSICS };
/**
 *
 * @desc back to {@link }
 *
 */
//========================================================================
// END OF FILE
//========================================================================
