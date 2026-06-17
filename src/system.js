/**
 * @name system
 * @desc systems repository
 * @author Matheraptor
 * @version 0.39.92 {@link MAGPIE_SYSTEM.meta.version}
 */
//========================================================================
// #region - INDEX
//========================================================================
function MAGPIE_SYSTEM() {
  this.initialize(...arguments);
}
const { MAGPIE } = require("./index");
const fs = require("fs");
const path = require("path");
const { Worker } = require("worker_threads");
const { performance } = require("node:perf_hooks");
const { exec } = require("child_process");
/**
 * @static
 * @desc Input/Output and Filesystem
 */
class MAGPIE_IO {
  //
}
/**
 * @typedef {Enumerator<Number>} layerID
 */
function MAGPIE_RUNTIME() {
  this.initialize(...arguments);
}

/**
 * @static
 * @desc entities host
 */
class MAGPIE_HIVE {
  //
}
/**
 * @name MAGPIE_LOG
 *
 * @param {log_data} data
 * @returns {new MAGPIE_LOG}
 */
function MAGPIE_LOG(data = {}) {
  this.initialize(data);
}
/**
 * @name MAGPIE_METASTATE
 *
 * @param {metastate_data} data
 * @returns {new MAGPIE_METASTATE}
 */
function MAGPIE_METASTATE(data = {}) {
  this.initialize(data);
}
/**
 *
 * @param {calendar_data} data
 * @returns {new MAGPIE_CALENDAR}
 */
function MAGPIE_CALENDAR(data) {
  this.initialize(data);
}
/**
 *
 * @param {date_data} data
 */
function MAGPIE_DATE(data) {
  this.initialize(data);
}
/**
 *
 * @param {loadbar_data} data
 * @returns {new MAGPIE_LOADBAR}
 */
function MAGPIE_LOADBAR(data) {
  this.initialize(data);
}
/**
 * @static
 *
 */
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
// #region - I/O
//========================================================================
MAGPIE_IO.meta = {
  name: MAGPIE.meta.name + "I.O.",
  desc: "Input/Output and filesystem",
  firmwareName: "MAGPIE_IO",
};
MAGPIE_IO.WORKER = new Worker("./src/services/fsio.js", {
  name: "fsio",
  workerData: {},
});
/**
 *
 * @param {String} filename
 * @returns {*}
 */
MAGPIE_IO.read = function systemRead(filename) {
  try {
    return fs.readFileSync(filename, "utf-8");
  } catch (e) {
    console.error(e);
  }
};
/**
 *
 * @param {String} filename
 * @param {*} content
 */
MAGPIE_IO.write = function systemWrite(filename, content) {
  try {
    fs.writeFileSync(filename, content);
  } catch (e) {
    console.error(e);
  }
};
/**
 *
 * @param {String} filename
 * @param {*} content
 */
MAGPIE_IO.append = function systemAppend(filename, content) {
  try {
    fs.appendFileSync(filename, content);
  } catch (e) {
    console.error(e);
  }
};
/**
 *
 * @param {String} filename
 * @param {String} timestamp
 * @param {String} level
 * @param {String} message
 */
MAGPIE_IO.workerAppend = function workerAppend(
  filename,
  timestamp,
  level = "INFO",
  message = "",
) {
  try {
    const requestID = Date.now();
    const payload = {
      method: "appendLog",
      requestID,
      args: {
        timestamp: timestamp,
        level: level,
        message: message,
        filename: filename,
      },
    };
    MAGPIE_IO.WORKER.postMessage(payload);
    return true;
  } catch (e) {
    console.error(e);
    return e;
  }
};
/**
 *
 * @desc back to {@link }
 *
 */
//========================================================================
// #endregion -
//========================================================================
/**
 * @name LOG
 * @desc
 * @typedef {import("./index").urgency} urgency
 * @typedef {import("./index").gravity} gravity
 * @typedef {{
 * contents: String,
 * urgency: urgency,
 * gravity: gravity
 * }} log_data
 */
//========================================================================
// #region - LOG
//========================================================================
MAGPIE_LOG.meta = {
  name: MAGPIE.meta.name + " Log",
  firmwareName: "MAGPIE_LOG",
};
MAGPIE_LOG.errors = [];
MAGPIE_LOG.console = [];
/**
 * @param {Error} error
 * @param {urgency} urgency
 * @param {gravity} gravity
 * @returns {new MAGPIE_LOG}
 */
MAGPIE_LOG.pushError = function pushErrorLog(
  error,
  urgency = -1,
  gravity = -1,
) {
  /** @type {log_data} */
  const data = { contents: error, urgency: urgency, gravity: gravity };
  const log = new MAGPIE_LOG(data);
  MAGPIE_LOG.errors.push(log);
  return log;
};

/**
 * @param {String} message
 * @param {urgency} urgency
 * @param {gravity} gravity
 * @returns {new MAGPIE_LOG}
 */
MAGPIE_LOG.pushConsole = function pushConsoleLog(
  message,
  urgency = -1,
  gravity = -1,
) {
  /** @type {log_data} */
  const data = { contents: message, urgency: urgency, gravity: gravity };
  const log = new MAGPIE_LOG(data);
  MAGPIE_LOG.console.push(log);
  return log;
};
/**
 *
 * @param {log_data} data
 * @returns {new MAGPIE_LOG}
 */
MAGPIE_LOG.prototype.initialize = function initializeLog(data) {
  this.ID = Date.now();
  this.contents = String(data?.contents);
  this.urgency = Number(data?.urgency);
  this.gravity = Number(data?.gravity);
};
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
// #region - SYSTEM
//========================================================================
MAGPIE_SYSTEM.meta = {
  name: MAGPIE.meta.name + " system",
  desc: "",
  version: [0, 39, 0],
  firmwareName: "MAGPIE_SYSTEM",
  firmwareDate: MAGPIE.meta.firmwareDate,
};
/**
 * @name prototype
 * @desc
 * @typedef {import("./index").index} index
 */
//------------------------------------------------------------------------
// #region > proto
//------------------------------------------------------------------------
/**
 *
 */
MAGPIE_SYSTEM.prototype.initialize = function initialize() {
  this.meta = {
    name: "",
    version: MAGPIE.meta.version,
    firmwareName: "",
    firmwareDate: MAGPIE.meta.firmwareDate,
    desc: "",
    isSystem: true,
  };
  this.isInit = true;
  this.isActive = false;
};
MAGPIE_SYSTEM.refresh = function refresh() {
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
// #region > Logging
//------------------------------------------------------------------------
MAGPIE_SYSTEM.logging = {};
/**
 *
 * @param {String} level
 * @param {String} message
 * @param {String} filename
 */
MAGPIE_SYSTEM.logging.logToWorker = function systemLogToWorker(
  level,
  message,
  filename,
) {
  return MAGPIE_IO.workerAppend(filename, timestamp, level, message);
};
/**
 *
 * @param {String} message
 * @param {String} prefix
 * @param {Boolean} logToConsole
 */
MAGPIE_SYSTEM.log = function systemLog(
  message,
  prefix = "console",
  logToConsole = true,
) {
  const date = MAGPIE_SYSTEM.Utility.CTZD();
  const logTime = MAGPIE_SYSTEM.logging.logTime();
  const consoleTime = MAGPIE_SYSTEM.logging.consoleTime();
  const log =
    typeof message === "object" ? JSON.stringify(message, null, 2) : message;
  if (logToConsole) {
    if (global?.SERVER?.CLI?.loadbar?.isActive)
      global.SERVER.CLI.log(consoleTime + log);
    else console.log(consoleTime + log);
    global.r?.displayPrompt(true);
  }
  if (typeof prefix === "string") {
    const filename = `logs/${prefix}${date}.log`;
    const timestamp = logTime;
    const level = prefix.toUpperCase();
    MAGPIE_IO.workerAppend(filename, timestamp, level, log);
  }
};
/**
 *
 * @param {String} message
 * @param {String} prefix
 * @param {Error} error
 */
MAGPIE_SYSTEM.sysLog = function systemLog(message, prefix, error = null) {
  MAGPIE_SYSTEM.log(message, prefix, !error);
  if (error) {
    MAGPIE_SYSTEM.error(message, error);
  }
};
MAGPIE_SYSTEM.silentLog = function systemSilentLog(message, prefix) {
  MAGPIE_LOG.pushConsole(message);
  const logToConsole = false;
  MAGPIE_SYSTEM.log(message, prefix, logToConsole);
};
/**
 *
 * @param {String} errorMessage
 * @param {Error} error
 */
MAGPIE_SYSTEM.error = function error(errorMessage, error) {
  const log = errorMessage;
  const date = MAGPIE_SYSTEM.Utility.CTZD();
  const full = `[${MAGPIE_SYSTEM.Utility.CTZF()}]`;
  // MAGPIE_LOG.errors.push(log);
  const level = "ERROR";
  console.error(`[${level}] ${log} | `, error);
  const timestamp = full;
  const filename = `logs/error${date}.log`;
  const message = log + "\n" + error?.stack + "\n---\n";
  const logged = MAGPIE_IO.workerAppend(filename, timestamp, level, message);
  MAGPIE_LOG.pushError(error);
  // r.displayPrompt();
};
/**
 *
 * @param {String} message
 * @returns
 */
MAGPIE_SYSTEM._logging_debug = function _logging_debug(message) {
  //
};
/**
 *
 * @param {String} message
 * @returns
 */
MAGPIE_SYSTEM.logging.log_exp = function logExpActivity(message) {
  return MAGPIE_SYSTEM.log(message, "exp", false);
};
/**
 *
 * @returns {CTZ} [YYYYMMDDHHMM]
 */
MAGPIE_SYSTEM.logging.consoleTime = function consoleTime() {
  return `[${MAGPIE_SYSTEM.Utility.CTZ()}Z] `;
};
/**
 *
 * @returns {CTZF} [YYYYMMDDHHMMSSmmm]
 */
MAGPIE_SYSTEM.logging.logTime = function logTime() {
  return `[${MAGPIE_SYSTEM.Utility.CTZF()}Z] `;
};
// #endregion
//------------------------------------------------------------------------
/**
 *
 *
 */
//------------------------------------------------------------------------
//#region > Math
//------------------------------------------------------------------------
MAGPIE_SYSTEM.Math = {};
/**
 *
 * @author Matheraptor
 * @param {Number} number
 * @param {Number} min default: 0
 * @param {Number} max default: 1
 * @returns {Number}
 */
MAGPIE_SYSTEM.Math.clampRange = function clampRange(number, min = 0, max = 1) {
  return Math.min(Math.max(number, min), max);
};
/**
 *
 * @author Matheraptor
 * @param {Number} n1
 * @param {Number} n2 modulo (%) divisor
 * @returns {new Number} positive value
 */
MAGPIE_SYSTEM.Math.modAbs = function modAbs(n1, n2 = 0) {
  return Math.abs(n1 % n2);
};
MAGPIE_SYSTEM.Math.pad0 = function pad0(number, length = 0) {
  const n = String(number);
  if (!length) length = n.length;
  return n.padStart(length, 0);
};
MAGPIE_SYSTEM.Math.randomRange = function randomRange(range = 1) {
  return Math.floor(range * Math.random());
};
MAGPIE_SYSTEM.Math.convertRadToDeg = function convertRadToDeg(radians) {
  return radians * (180 / Math.PI);
};
MAGPIE_SYSTEM.Math.convertDegToRad = function convertDegToRad(degrees) {
  return degrees * (Math.PI / 180);
};
//#endregion
//------------------------------------------------------------------------
/**
 *
 *
 *
 */
//------------------------------------------------------------------------
//#region > String
//------------------------------------------------------------------------
MAGPIE_SYSTEM.String = {};
/**
 * @desc addon for {@link MAGPIE_SYSTEM}
 * @param {String} string
 * @author Matheraptor
 * @returns {new String} original string with the first character uppercase
 */
MAGPIE_SYSTEM.String.firstCharUpperCase = function firstCharUpperCase(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
};
MAGPIE_SYSTEM.String.insert = function insert(
  string1,
  index = 0,
  string2 = "",
) {
  return `${string1.slice(0, index + 1)}${string2}${string1.slice(index + 1)}`;
};
//#endregion
//------------------------------------------------------------------------
/**
 *
 *
 */
//------------------------------------------------------------------------
//#region > Array
//------------------------------------------------------------------------
MAGPIE_SYSTEM.Array = {};
/**
 * @addon for {@link MAGPIE_SYSTEM}
 * @author Matheraptor
 * @param {Array} array
 * @param {predicate} predicate to evaluate
 * @returns {Number} the last index by given predicate
 */
MAGPIE_SYSTEM.Array.findIndexLast = function findIndexLast(array, predicate) {
  for (let i = array.length - 1; i > -1; i--) if (predicate(array[i])) return i;
};
/**
 * @addon for {@link MAGPIE_SYSTEM}
 * @author Matheraptor
 * @param {Array} array
 * @param {Number} index to slice in 'item' (default: 0)
 * @param {*} item to push at index (default: null)
 * @returns {new Array} [...sliceToIndex, item, ...sliceFromIndex]
 */
MAGPIE_SYSTEM.Array.insert = function insert(array, index = 0, item = null) {
  let newArray = [
    ...array.valueOf().slice(0, index),
    item,
    ...array.valueOf().slice(index),
  ];
  return newArray;
};
/**
 * @addon for {@link MAGPIE_SYSTEM}
 * @author Matheraptor
 * @param {Array} array
 * @param {Number} chunkSize to split array by (default: 1)
 * @returns {new Array} [...chunks]
 */
MAGPIE_SYSTEM.Array.chunkSplit = function chunkSplit(array, chunkSize = 1) {
  let chunks = [];
  if (isNaN(chunkSize) || chunkSize < 1 || chunkSize > array.length) return;
  const n = Math.ceil(array.length / chunkSize);
  for (let i = 0; i < n; i += chunkSize)
    chunks.push(array.slice(i, i + chunkSize));
  return chunks;
};
MAGPIE_SYSTEM.Array.pluck = function pluck(array, index = 0) {
  if (index < 2) return array;
  array[index] = array[array.length - 1];
  array.pop();
  return array;
};
//#endregion
//------------------------------------------------------------------------
/**
 * @name Powershell
 * @desc
 *
 */
//------------------------------------------------------------------------
// #region > Powershell
//------------------------------------------------------------------------
MAGPIE_SYSTEM.PS = {};
/**
 *
 * @param {String} soundfile
 * @param {{}} options
 * @returns
 */
MAGPIE_SYSTEM.PS.playSound = function playSound(soundfile = "", options = {}) {
  return exec(
    `powershell -c "(New-Object Media.SoundPlayer ${soundfile}).PlaySync()"`,
  );
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
MAGPIE_SYSTEM.Utility = {};
MAGPIE_SYSTEM.Utility.wait = async function (delay) {
  return new Promise((res) => setTimeout(res, delay));
};
/**
 * @typedef {{millisecond: Boolean, second: Boolean, date: Boolean}} date_options {second: boolean, millisecond: boolean, date: boolean}
 * @typedef {String} CTZ YYYYMMDDHHMM
 *
 * @option {second: true} to include seconds
 * @option {millisecond: true} to include both seconds and milliseconds
 * @option {date: true} to only include the date and not the time
 * @param {Date} date
 * @param {date_options} options
 * @returns {String}
 */
MAGPIE_SYSTEM.Utility.CTZ = function CTZ(date, options = {}) {
  if (!(date instanceof Date)) {
    if (Object.prototype.toString.call(date) === "[object Object]") {
      options = date;
    }
    date = new Date();
  }
  const now = date;
  let year = now.getUTCFullYear().toString().padStart(4, 0);
  let month = (now.getUTCMonth() + 1).toString().padStart(2, 0);
  let day = now.getUTCDate().toString().padStart(2, 0);
  let hour = now.getUTCHours().toString().padStart(2, 0);
  let minute = now.getUTCMinutes().toString().padStart(2, 0);
  let second = "";
  let millisecond = "";
  if (options?.millisecond) {
    millisecond = now.getUTCMilliseconds().toString().padStart(3, 0);
    options.second = true;
  }
  if (options?.second) second = now.getUTCSeconds().toString().padStart(2, 0);
  if (options?.date) {
    hour = "";
    ((minute = ""), (second = ""));
    millisecond = "";
  }
  if (options?.time) {
    year = "";
    month = "";
    day = "";
  }
  const stamp = year + month + day + hour + minute + second + millisecond;
  return stamp;
};
/**
 * @typedef {String} CTZD YYYYMMDD
 * @returns {CTZD} YYYYMMDD
 */
MAGPIE_SYSTEM.Utility.CTZD = function CTZD() {
  return this.CTZ({ date: true });
};
/**
 * @typedef {String} CTZT HHMM
 * @returns {CTZT} HHMM
 */
MAGPIE_SYSTEM.Utility._CTZT = function CTZT() {
  return this.CTZ({ time: true });
};
/**
 * @typedef {String} CTZTS HHMMSS
 * @returns {CTZTS} HHMMSS
 */
MAGPIE_SYSTEM.Utility.CTZTS = function CTZTS() {
  return MAGPIE_SYSTEM.Utility.CTZ({ time: true, second: true });
};
/**
 * @typedef {String} CTZF YYYYMMDDHHMMSSmmm
 * @returns {CTZF} YYYYMMDDHHMMSSmmm
 */
MAGPIE_SYSTEM.Utility.CTZF = function CTZF() {
  return this.CTZ({ millisecond: true });
};
/**
 * @typedef {Number} epoch_real Date.now() - ms since true epoch
 *
 * @returns {epoch_real}
 */
MAGPIE_SYSTEM.Utility.epoch = function epoch() {
  return Date.now();
};
/**
 * @typedef {Number} epoch_real_s Date.now() in seconds
 *
 * @returns {epoch_real_s}
 */
MAGPIE_SYSTEM.Utility.now = function now() {
  const now = Math.floor(Date.now() / 1000);
  return now;
};
MAGPIE_SYSTEM.Utility.aggregator = function aggregator(list = []) {
  if (list.length < 1) return [];
  list.sort((a, b) => a - b);
  const stack = Object.entries(
    list.reduce((acc, id) => {
      acc[id] = (acc[id] || 0) + 1;
      return acc;
    }),
  );
  return stack;
};
/**
 * @typedef {{
 * years: Number,
 * months: Number,
 * days: Number,
 * hours: Number,
 * minutes: Number,
 * seconds: Number}} time_interval n year(s), n month(s), n day(s), n hour(s),
 * n minute(s) n second(s)
 *
 * @typedef {String} interval_text time interval printed in En
 *
 * @param {time_interval} interval
 * @returns {interval_text}
 */
MAGPIE_SYSTEM.Utility._printInterval = function _printInterval(interval) {
  const ePrefix = `[SYSTEM].printInterval: `;
  try {
    let message = "";
    const years = interval?.years;
    const months = interval?.months;
    const days = interval?.days;
    const hours = interval?.hours;
    const minutes = interval?.minutes;
    const seconds = interval?.seconds;
    if (years) message += `${years} year${years > 1 ? "s" : ""}, `;
    if (months) message += `${months} month${months > 1 ? "s" : ""}, `;
    if (days) message += `${days} day${days > 1 ? "s" : ""}, `;
    if (hours) message += `${hours} hour${hours > 1 ? "s" : ""}, `;
    if (minutes) message += `${minutes} minute${minutes > 1 ? "s" : ""}, `;
    if (seconds) message += `${seconds} second${seconds > 1 ? "s" : ""}`;
    message = message.trimEnd();
    if (message.endsWith(",", message.length - 1))
      message = message.slice(0, message.at(-1));
    return message;
  } catch (e) {
    MAGPIE_SYSTEM.error(ePrefix + e.message, e);
  }
};
/**
 *
 * @param {duration} seconds
 * @returns {time_interval}
 */
MAGPIE_SYSTEM.Utility._makeInterval = function makeInterval(seconds) {
  const interval = {};
  interval.seconds = Math.round(seconds % 60);
  if (seconds < 60) return interval;
  const minute = 60 ** 2;
  interval.minutes = Math.floor(seconds % minute);
  if (seconds < minute) return interval;
  const hour = 60 ** 2 * 24;
  interval.hours = Math.floor(seconds % hour);
  if (seconds < hour) return interval;
  const month = 60 ** 2 * 24 * 30.25;
  interval.days = Math.floor(seconds % month);
  if (seconds < month) return interval;
  const year = 60 ** 2 * 24 * 30.25 * 365;
  interval.months = Math.floor(seconds % year);
  if (seconds < year) return interval;
  interval.years = Math.floor(seconds / year);
  return interval;
};
MAGPIE_SYSTEM.prototype._printInterval = MAGPIE_SYSTEM.Utility._printInterval;
/**
 *
 * @param {duration} seconds
 * @returns {String} Estimated Time of Arrival, printed in En
 */
MAGPIE_SYSTEM.Utility.printETA = function printETA(seconds) {
  const ePrefix = `[SYSTEM].printETA: `;
  try {
    const ETA_s = seconds;
    let ETA = "";
    const ETA_sec = Math.floor(ETA_s % 60);
    const ETA_min = Math.floor(ETA_s / 60) % 60;
    const ETA_hour = Math.floor(ETA_s / 3600) % 24;
    const ETA_days = Math.floor(ETA_s / (3600 * 24));
    if (ETA_days) ETA += `${ETA_days}d `;
    if (ETA_hour) ETA += `${ETA_hour}h `;
    if (ETA_min) ETA += `${ETA_min}m `;
    ETA += `${ETA_sec}s`;
    return ETA;
  } catch (e) {
    MAGPIE_SYSTEM.error(ePrefix + e.message, e);
  }
};
/**
 *
 * @param {MAGPIE_DATE} now
 * @param {duration} ETA
 * @param {{
 * date: Boolean,
 * seconds: Boolean
 * }} options
 * @param {variableCTZ}
 */
MAGPIE_SYSTEM.Utility._printETZ = function _printETZ(now, ETA = 0, options) {
  if (!(now instanceof MAGPIE_DATE)) return "n/a";
  const targetEpoch = now.epoch + ETA * 1000;
  const targetDate = new MAGPIE_DATE({
    calendar: now.calendar,
    epoch: targetEpoch,
  });
  return targetDate._printSTZ(options);
};
MAGPIE_SYSTEM.prototype.printETA = MAGPIE_SYSTEM.Utility.printETA;
/**
 *
 * @param {Number} ID
 * @returns {Boolean}
 */
MAGPIE_SYSTEM.Utility.isValidID = function isValidID(ID) {
  const ePrefix = `[SYSTEM].isValidID: ${ID} `;
  const now = Date.now();
  try {
    if (!ID || isNaN(ID)) throw new Error(`is not a number`);
    if (ID > now) throw new Error(`is more recent than ${now} (now)`);
    const epoch = MAGPIE.KEY.PHYSICS.EARTH.ORBIT_DATA.epoch;
    if (ID < epoch) throw new Error(`is older than ${epoch} (J2000)`);
    return true;
  } catch (e) {
    MAGPIE_SYSTEM.error(ePrefix + e.message, e);
    return e;
  }
};
/**
 *
 * @param {[MAJOR: Number, MINOR: Number, PATCH: Number]} version
 * @returns {`${MAJOR}.${MINOR}.${PATCH}`}
 */
MAGPIE_SYSTEM.Utility.version = function version(version) {
  if (!version || version.length < 2 || version.some((n) => isNaN(n)))
    version = [0, 1, 0];
  const [MAJOR, MINOR, PATCH] = version;
  return `${MAJOR}.${MINOR}.${PATCH}`;
};
/**
 *
 * @param {Number} num
 * @param {Number} toFixed
 * @param {Boolean} sign
 */
MAGPIE_SYSTEM.Utility._format_num = function formatNumber(num, toFixed, sign) {
  const formatter = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: Number(toFixed) || 0,
    maximumFractionDigits: Number(toFixed) || 0,
    signDisplay: sign ? "always" : "never", // Forces +0.00000, -0.00000, +0.00005
  });
  return formatter.format(num);
};
// #endregion
//------------------------------------------------------------------------
/**
 * @name
 * @desc
 *
 */
//------------------------------------------------------------------------
// #region > Loadbar
//------------------------------------------------------------------------
MAGPIE_LOADBAR.meta = {};
/**
 * @typedef {{
 * name: String,
 * type: Number,
 * symbol_unloaded: String,
 * symbol_loaded: String,
 * width: Number,
 * percentage: Boolean,
 * ETC: Boolean,
 * rate: Boolean
 * }} loadbar_data
 * @param {loadbar_data} data
 * @returns {new MAGPIE_LOADBAR}
 */
MAGPIE_LOADBAR.prototype.initialize = function initializeLoadbar(data) {
  this.name = String(data?.name);
  this.type = Number(data?.type) || 0;
  this.arguments = {
    percentage: Boolean(data?.percentage),
    ETC: Boolean(data?.ETC),
    rate: Boolean(data?.rate),
  };
  this.progress = 0;
  this.contents = "";
  this.symbol_unloaded = data?.symbol_unloaded || "▒";
  this.symbol_loaded = data?.symbol_loaded || "█";
  this.width = Number(data?.width) || 50;
};
/**
 *
 * @param {{
 * ETC: String,
 * rate: String,
 * log: String,
 * style: String
 * }} options
 */
MAGPIE_LOADBAR.prototype.render = function renderLoadbar(options) {
  const percentage = this.arguments.percentage
    ? ` | ${this.progress.toString().padStart(3, " ")}%`
    : "";
  const ETC = this.arguments.ETC ? ` | ${options?.ETC}` : "";
  const rate = this.arguments.rate ? ` | ${options?.rate}` : "";
  const progress = Math.round(this.width * (this.progress / 100));
  const current = this.symbol_loaded.repeat(progress);
  const remaining = this.symbol_unloaded.repeat(this.width - progress);
  const style = options?.style ? options.style : "";
  const ansi = MAGPIE.KEY.ANSI;
  const reset = ansi.STYLE_RESET;
  const log = options?.log || "";
  this.contents = `${style}${current}${remaining}${percentage}${rate}${ETC}${reset}`;
  // void process.stdout.write(`${ansi.MOVE_UP}${ansi.CLEAR_LINE}`.repeat(2))
  void process.stdout.write(
    `${ansi.MOVE_UP}${ansi.CLEAR_LINE}`.repeat(3) +
      `${log}\n${this.contents}\n`,
  );
};
/**
 * @typedef {{
 * amount: Number,
 * ETC: String,
 * rate: String
 * }} loadbar_options
 * @param {loadbar_options} options
 */
MAGPIE_LOADBAR.prototype.increment = function incrementLoadbar(options) {
  const amount = Number(options?.amount) || 1;
  const percentage = this.progress + amount;
  this.progress = Math.min(percentage, this.width);
  const render = {
    ETC: options?.ETC,
    rate: options?.rate,
    log: options?.log || "",
    style: options?.style,
  };
  this.render(render);
};
/**
 *
 * @param {loadbar_options} options
 */
MAGPIE_LOADBAR.prototype.update = function updateLoadbar(options) {
  if (Number(options?.amount)) this.progress = options.amount;
  const render = {
    ETC: options?.ETC,
    rate: options?.rate,
    log: options?.log || "",
    style: options?.style,
  };
  this.render(render);
};
/**
 *
 */
MAGPIE_LOADBAR.prototype.complete = function completeLoadbar() {
  this.progress = 100;
  const render = {
    percentage: this.progress,
    ETC: options?.ETC,
    rate: options?.rate,
    log: options?.log || "",
    style: MAGPIE.KEY.ANSI.STYLE_GREEN,
  };
  this.render(render);
};
/**
 *
 */
MAGPIE_LOADBAR.prototype.clear = function clearLoadbar() {
  const ansi = MAGPIE.KEY.ANSI;
  void process.stdout.write(ansi.moveUpCustom(2) + ansi.CLEAR_LINE);
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
// #region - RUNTIME
//========================================================================
MAGPIE_RUNTIME.meta = {
  //@todo RUNTIME
};
/**
 * @name proto
 * @desc
 *
 */
//------------------------------------------------------------------------
// #region > proto
//------------------------------------------------------------------------
MAGPIE_RUNTIME.prototype = Object.create(MAGPIE_SYSTEM.prototype);
MAGPIE_RUNTIME.prototype.constructor = MAGPIE_RUNTIME;
MAGPIE_RUNTIME.prototype.initialize = function initialize() {
  MAGPIE_SYSTEM.prototype.initialize.call(this);
  this.meta.name = "M.A.G.P.I.E. Runtime System";
  this.meta.desc =
    "Provides a 'heartbeat' to the process" + " and orchestrates the systems.";
  this.meta.firmwareName = "MAGPIE_RUNTIME";
  this._lag = 0;
  this._base = 0;
  this._baseFrame = 0;
  this._gameFrame = 0;
  this._game = 0;
  this._TICK = 0;
  this._TICKsuper = 0;
  this._TICKmega = 0;
  this._TICKultra = 0;
  this._now = Date.now();
  this._busy = false;
  this._loop = null;
  this._GuestsBase = [];
  this._GuestsGame = [];
  this._GuestsStandard = [];
  this._GuestsSuper = [];
  this._GuestsMega = [];
  this._GuestsUltra = [];
  /** @type {Map<String, {layerID: Number, index: Number}} */
  this._registry = new Map();
  /** @type {MAGPIE_METASTATE} */
  this.metastate = {};
};
/**
 *
 * @returns {time_interval}
 */
MAGPIE_RUNTIME.prototype._uptime = function uptime() {
  const ePrefix = `[RUNTIME].uptime: `;
  try {
    const seconds = this._TICK;
    const minutes = this._TICKsuper;
    const hours = this._TICKmega;
    const days = this._TICKultra;
    const interval = {
      days: days,
      hours: hours,
      minutes: minutes,
      seconds: seconds,
    };
    return this._printInterval(interval);
  } catch (e) {
    MAGPIE_SYSTEM.error(ePrefix + e.message, e);
  }
};
MAGPIE_RUNTIME.prototype.awake = function awake() {
  const ePrefix = "[RUNTIME].awake: ";
  try {
    this._loop = setInterval(() => {
      this.refresh();
    }, 1);
    MAGPIE_SYSTEM.silentLog(
      ePrefix + `awakened with ${this._registry.size} guests`,
    );
    this.isActive = true;
  } catch (e) {
    MAGPIE_SYSTEM.error(ePrefix + e.message, e);
    this.isActive = false;
  }
};
MAGPIE_RUNTIME.prototype.pause = function pause() {
  clearInterval(this._loop);
  return (this.isActive = false);
};
MAGPIE_RUNTIME.prototype._memoryUsage = function memoryUsage(
  logToFile = false,
) {
  const usage = process.memoryUsage();
  const message =
    `\n[Memory Report] Heap Used: ` +
    `${Math.round(usage.heapUsed / 1024 / 1024)}MB / ` +
    `Total: ${Math.round(usage.heapTotal / 1024 / 1024)}MB`;
  return MAGPIE_SYSTEM.log(message, logToFile ? "console" : false, true);
};
// #endregion
//------------------------------------------------------------------------
/**
 * @name
 * @desc
 *
 */
//------------------------------------------------------------------------
// #region > TICK
//------------------------------------------------------------------------
MAGPIE_RUNTIME.tick = {};
MAGPIE_RUNTIME.prototype.refresh = function refresh() {
  MAGPIE_SYSTEM.refresh.call(this);
  if (!this.isActive) return;
  const FIXED_DELTA = MAGPIE.KEY.RUNTIME.LAYER.get(1).delta * 1000;
  const delta = Date.now() - this._now;
  this._now = Date.now();
  this._lag += delta;
  this._base += delta;
  this._game += delta;
  if (this._base >= MAGPIE.KEY.RUNTIME.LAYER.get(2).delta * 1000)
    return this.TICK_standard();
  if (this._game >= FIXED_DELTA || this._lag > FIXED_DELTA)
    this.TICK_game(FIXED_DELTA);
};
MAGPIE_RUNTIME.prototype.TICK_base = function TICK_base(delta) {
  this._lag -= delta;
  const deltaBase = MAGPIE.KEY.RUNTIME.LAYER.get(0).delta * 1000;
  const deltaGame = MAGPIE.KEY.RUNTIME.LAYER.get(1).delta * 1000;
  if (this._lag > deltaGame) {
    this._lag -= deltaGame;
    return this.TICK_game();
  }
  this._game += delta;
  this._baseFrame++;
  if (this._game >= deltaGame) return this.TICK_game();
  const layerBase = 0;
  const switchBase = 0;
  this.tick_layer(layerBase, switchBase, this._baseFrame);
  this._now = Date.now();
};
MAGPIE_RUNTIME.prototype.TICK_game = function TICK_game(delta) {
  if (this._lag > 1000 || this._base > 1000) {
    this._lag -= 1000;
    return this.TICK_standard();
  }
  this._lag -= delta;
  this._game = 0;
  const layerBase = 0;
  const layerGame = 1;
  const switchGame = 1;
  this._gameFrame++;
  this.tick_layer(layerBase, switchGame, this._gameFrame);
  this.tick_layer(layerGame, switchGame, this._gameFrame);
  // MAGPIE_SYSTEM._logging_debug(this._lag)
};
MAGPIE_RUNTIME.prototype.TICK_standard = function TICK_standard() {
  this._base = 0;
  this._baseFrame = 0;
  this._gameFrame = 0;
  const secondsInMinute = 60;
  if (this._TICK >= secondsInMinute - 1) return this.TICK_super();
  this._TICK++;
  const layerStandard = 2;
  const switchStandard = 2;
  const layerBase = 0;
  const layerGame = 1;
  const standardFrame = this._TICK;
  this.tick_layer(layerBase, switchStandard, standardFrame);
  this.tick_layer(layerGame, switchStandard, standardFrame);
  this.tick_layer(layerStandard, switchStandard, standardFrame);
};
MAGPIE_RUNTIME.prototype.TICK_super = function TICK_super() {
  this._TICK = 0;
  const minutesInHour = 60;
  if (this._TICKsuper >= minutesInHour - 1) return this.TICK_mega();
  this._TICKsuper++;
  const layerSuper = 3;
  const switchSuper = 3;
  const layerBase = 0;
  const layerGame = 1;
  const layerStandard = 2;
  const superFrame = this._TICKsuper;
  this.tick_layer(layerBase, switchSuper, superFrame);
  this.tick_layer(layerGame, switchSuper, superFrame);
  this.tick_layer(layerStandard, switchSuper, superFrame);
  this.tick_layer(layerSuper, switchSuper, superFrame);
};
MAGPIE_RUNTIME.prototype.TICK_mega = function TICK_mega() {
  // console.log("TICK_mega");
  this._TICKsuper = 0;
  const hoursInDay = 24;
  if (this._TICKmega >= hoursInDay - 1) return this.TICK_ultra();
  this._TICKmega++;
  const layerMega = 4;
  const switchMega = 4;
  const layerBase = 0;
  const layerGame = 1;
  const layerStandard = 2;
  const layerSuper = 3;
  const megaFrame = this._TICKmega;
  this.tick_layer(layerBase, switchMega, megaFrame);
  this.tick_layer(layerGame, switchMega, megaFrame);
  this.tick_layer(layerStandard, switchMega, megaFrame);
  this.tick_layer(layerSuper, switchMega, megaFrame);
  this.tick_layer(layerMega, switchMega, megaFrame);
};
MAGPIE_RUNTIME.prototype.TICK_ultra = function TICK_ultra() {
  // console.log("TICK_ultra");
  this._TICKmega = 0;
  this._TICKultra++;
  const layerUltra = 5;
  const switchUltra = 5;
  const layerBase = 0;
  const layerGame = 1;
  const layerStandard = 2;
  const layerSuper = 3;
  const layerMega = 4;
  const ultraFrame = this._TICKultra;
  this.tick_layer(layerBase, switchUltra, ultraFrame);
  this.tick_layer(layerGame, switchUltra, ultraFrame);
  this.tick_layer(layerStandard, switchUltra, ultraFrame);
  this.tick_layer(layerSuper, switchUltra, ultraFrame);
  this.tick_layer(layerMega, switchUltra, ultraFrame);
  this.tick_layer(layerUltra, switchUltra, ultraFrame);
};
/**
 *
 * @param {Number} layerID
 * @param {Number} switchID
 * @param {Number} index_frame
 */
MAGPIE_RUNTIME.prototype.tick_layer = function tick_layer(
  layerID,
  switchID,
  index_frame,
) {
  const ePrefix = "[RUNTIME].tick_layer: ";
  try {
    const layerName = MAGPIE.KEY.RUNTIME.LAYER.get(layerID).name;
    /** @type {String[]} */
    const layer = this[layerName];
    if (!Array.isArray(layer))
      throw new Error(`${layerID} is invalid layer index`);
    for (const guest of layer) {
      try {
        this.guestRefresh(guest, layerID, switchID, index_frame);
      } catch (e) {
        MAGPIE_SYSTEM.error(ePrefix + e.message, e);
      }
    }
  } catch (e) {
    MAGPIE_SYSTEM.error(ePrefix + e.message, e);
  }
};
// #endregion
//------------------------------------------------------------------------
/**
 * @name host
 * @desc
 *
 */
//------------------------------------------------------------------------
// #region > Host
//------------------------------------------------------------------------
/**
 *
 * @param {String} guestFirmwareName
 * @param {Number} layerID
 */
MAGPIE_RUNTIME.prototype.host = function host(guestFirmwareName, layerID) {
  const ePrefix = "[RUNTIME].host: ";
  try {
    const layerName = this.getLayer(layerID);
    const layer = this[layerName];
    const index = layer.push(guestFirmwareName) - 1;
    this._registry.set(guestFirmwareName, { layerID: layerID, index: index });
  } catch (e) {
    MAGPIE_SYSTEM.error(ePrefix + e.message, e);
  }
};
/**
 *
 * @param {Number} layerID
 * @returns {String}
 */
MAGPIE_RUNTIME.prototype.getLayer = function getLayer(layerID) {
  return MAGPIE.KEY.RUNTIME.LAYER.get(layerID)?.name;
};
MAGPIE_RUNTIME.prototype.kick = function kick(guestFirmwareName, layerID) {
  const ePrefix = "[RUNTIME].kick: ";
  try {
    const layer = this.getLayer(layerID);
    console.log(guestFirmwareName);
    if (!layer) throw new Error(`${layer} is invalid layer`);
    const index = this._registry.get(guestFirmwareName)?.index;
    this._registry.delete(guestFirmwareName);
    this[layer].splice(index, 1);
  } catch (e) {
    MAGPIE_SYSTEM.error(ePrefix + e.message, e);
  }
};
/**
 *
 * @param {String} guest
 * @param {Number} layerID
 * @param {Number} switchID
 * @param {Number} index_frame
 */
MAGPIE_RUNTIME.prototype.guestRefresh = function guestRefresh(
  guest,
  layerID,
  switchID,
  index_frame,
) {
  //
};
MAGPIE_RUNTIME.__guestRefresh = MAGPIE_RUNTIME.prototype.guestRefresh;
// #endregion
//------------------------------------------------------------------------
/**
 * @name metastate
 * @desc {@link MAGPIE_SERVER.SYS._runtime_loadMetastate}
 *
 */
//------------------------------------------------------------------------
// #region > Metastate
//------------------------------------------------------------------------
MAGPIE_RUNTIME.prototype.loadMetastate = function loadMetastate() {
  //
};
MAGPIE_RUNTIME._loadMetastate = MAGPIE_RUNTIME.prototype.loadMetastate;
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
 * @param {Number} rate
 * @param {Boolean} reset
 * @returns
 */
MAGPIE_RUNTIME.prototype._time_acceleration = function timeAcceleration(
  rate = 1,
  reset = false,
) {
  const K = MAGPIE.KEY.RUNTIME.LAYER;
  const layer = K.get(2);
  const buffer1 = K.get(1);
  if (reset) {
    layer.delta = MAGPIE.KEY.RUNTIME.DELTA[2];
    buffer1.dt = MAGPIE.KEY.RUNTIME.DELTA[1];
    return;
  }
  layer.delta /= rate;
  buffer1.dt *= rate;
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
 * @name HIVE
 * @desc
 * @typedef {import("./entity").MAGPIE_ENTITY} MAGPIE_ENTITY
 */
//========================================================================
// #region - HIVE
//========================================================================
MAGPIE_HIVE.meta = {};
MAGPIE_HIVE.meta.name = "M.A.G.P.I.E. Entities Hive";
MAGPIE_HIVE.meta.desc = "";
/**
 * @name proto
 * @desc
 * @typedef {{
 * layerID: Number,
 * slot: Number,
 * target: Number,
 * retain: Boolean,
 * contexts: contextID[]
 * }} hive_entry
 * @typedef {{
 * name: String
 * nextSlot: Number
 * }} hive_record
 * @typedef {Map<Number, hive_entry>} hive_registry
 * @typedef {import("../SERVER").hive_buffer} hive_buffer
 * @typedef {Number} buffer_size
 * @typedef {Float64Array<entityID>} hive_layer
 * @typedef {import("./entity").entityID} entityID
 * @typedef {import("./player").playerID} playerID
 * @typedef {import("./component").MAGPIE_EXP} MAGPIE_EXP
 * @typedef {import("./component").MAGPIE_KEY} MAGPIE_KEY
 * @typedef {import("./component").MAGPIE_SYMBOL} MAGPIE_SYMBOL
 * @typedef {import("./component").MAGPIE_CONTEXT} MAGPIE_CONTEXT
 * @typedef {import("./entity").expID} expID
 * @typedef {import("./index").keyID} keyID
 * @typedef {import("./component").symbolID} symbolID
 * @typedef {Number} contextID
 * @typedef {import("./core/entity").entity_data} entity_data
 * @typedef {{
 * registry: hive_registry,
 * exps: expID[],
 * keys: keyID[],
 * symbols: symbolID[],
 * contexts: contextID[]
 * }} hive_vault
 */
//------------------------------------------------------------------------
// #region > proto
//------------------------------------------------------------------------
const layers = MAGPIE.KEY.RUNTIME.LAYER;
const layerBase = layers.get(0);
const layerGame = layers.get(1);
const layerStandard = layers.get(2);
const layerSuper = layers.get(3);
const layerMega = layers.get(4);
const layerUltra = layers.get(5);
/** @type {hive_buffer} */
MAGPIE_HIVE[layerBase.name] = [];
/** @type {hive_buffer} */
MAGPIE_HIVE[layerGame.name] = [];
/** @type {hive_layer} default size: 5,000 */
MAGPIE_HIVE[layerStandard.name] = [];
/** @type {hive_layer} default size: 10,000 */
MAGPIE_HIVE[layerSuper.name] = new Float64Array(layerSuper.slots).fill(0);
/** @type {hive_layer} default size: 50,000 */
MAGPIE_HIVE[layerMega.name] = new Float64Array(layerMega.slots).fill(0);
/** @type {hive_layer} default size: 100,000 */
MAGPIE_HIVE[layerUltra.name] = new Float64Array(layerUltra.slots).fill(0);
/** @type {Map<expID, {data: MAGPIE_EXP, owners: contextID[]}>}  */
MAGPIE_HIVE._expBuffer = new Map();
/** @type {Map<keyID, {data: MAGPIE_KEY, owners: contextID[]}>} */
MAGPIE_HIVE._keyBuffer = new Map();
/** @type {Map<symbolID, {data: MAGPIE_SYMBOL, owners: contextID[]}>} */
MAGPIE_HIVE._symbolBuffer = new Map();
/** @type {Map<contextID, MAGPIE_CONTEXT>} */
MAGPIE_HIVE._contextBuffer = new Map();
/**
 * @type {hive_registry}
 * @desc Map<entityID, hive_entry: {
 * layerID: Number,
 * slot: Number,
 * target: Number,
 * retrain: Boolean
 * }>
 * */
MAGPIE_HIVE._registry = new Map();
MAGPIE_HIVE.awake = async function awake() {
  //
};
MAGPIE_HIVE.pause = function pause() {
  const ePrefix = `[HIVE].method: `;
  try {
    this.isActive = false;
  } catch (e) {
    MAGPIE_SYSTEM.error(ePrefix + e.message, e);
  }
};
MAGPIE_HIVE.setup = function setup() {
  const ePrefix = "[HIVE].setup: ";
  try {
    const K = MAGPIE.KEY.RUNTIME.LAYER;
    const layerBase = K.get(0).name;
    const layerGame = K.get(1).name;
    const layerStandard = K.get(2).name;
    const layerSuper = K.get(3).name;
    const layerMega = K.get(4).name;
    const layerUltra = K.get(5).name;
    const dummy = true;
    MAGPIE_HIVE[layerBase] = new Array(K.get(0).slots).fill(
      MAGPIE_HIVE._new_entity({}, dummy),
    );
    MAGPIE_HIVE[layerGame] = new Array(K.get(1).slots).fill(
      MAGPIE_HIVE._new_entity({}, dummy),
    );
    MAGPIE_HIVE[layerStandard] = new Array(K.get(2).slots).fill(
      MAGPIE_HIVE._new_entity({}, dummy),
    );
    MAGPIE_HIVE._registry.set(0, { name: layerBase, nextSlot: 0 });
    MAGPIE_HIVE._registry.set(1, { name: layerGame, nextSlot: 0 });
    MAGPIE_HIVE._registry.set(2, { name: layerStandard, nextSlot: 0 });
    MAGPIE_HIVE._registry.set(3, { name: layerSuper, nextSlot: 0 });
    MAGPIE_HIVE._registry.set(4, { name: layerMega, nextSlot: 0 });
    MAGPIE_HIVE._registry.set(5, { name: layerUltra, nextSlot: 1 });
    const universe = MAGPIE_HIVE._get_databaseSync("loadEntitySync", [
      MAGPIE.KEY.ENTITY.UNIVERSE,
    ]);
    if (!universe) throw new Error("unable to find 'universe'");
    /** @type {hive_entry} */
    const universe_entry = {
      layerID: 5,
      slot: 0,
      target: 5,
      retain: true,
      contexts: [],
    };
    MAGPIE_HIVE[layerUltra][0] = universe?.ID;
    MAGPIE_HIVE._registry.set(universe.ID, universe_entry);
    MAGPIE_HIVE._registry.get(5).nextSlot = 1;
    return true;
  } catch (e) {
    MAGPIE_SYSTEM.error(ePrefix + e.message, e);
  }
};
MAGPIE_HIVE._validate_layers = function validateLayers() {
  const hive_layers = MAGPIE.KEY.HIVE.BUFFER_SIZE + MAGPIE.KEY.HIVE.REMOTE_SIZE;
  for (let i = 0; i < hive_layers; i++) {
    const layer = MAGPIE.KEY.RUNTIME.LAYER.get(i);
    MAGPIE_HIVE[layer.name].forEach((n, index) => {
      try {
        if (i < MAGPIE.KEY.HIVE.BUFFER_SIZE)
          if (n?.constructor?.name !== "MAGPIE_ENTITY") {
            n = new MAGPIE_ENTITY();
            throw new Error(`${layer.name}[${index}] is invalid entity`);
          }
      } catch (e) {
        MAGPIE_SYSTEM.error(ePrefix + e.message, e);
      }
    });
  }
};
/**
 * @desc {@link MAGPIE_SERVER._hive_new_entity}
 * @typedef {import("./entity").entity_data} entity_data
 * @param {entity_data} data
 * @returns {Promise<new MAGPIE_ENTITY>}
 */
MAGPIE_HIVE._set_new_entity = async function newEntity(data) {
  //
};
/**
 * {@link MAGPIE_HIVE.host}
 * @param {entity_data} data
 * @returns {new MAGPIE_ENTITY}
 */
MAGPIE_HIVE._new_entity = function (data, dummy) {
  //
};
/**
 *
 * @param {String} method
 * @param {[]} args
 * @returns {*}
 */
MAGPIE_HIVE.__get_serverSync = function __get_serverSync(method, args) {
  //
};
// #endregion
//------------------------------------------------------------------------
/**
 * @name database
 * @desc
 * @typedef {import("./database_worker").database_result} database_result
 */
//------------------------------------------------------------------------
// #region > Database
//------------------------------------------------------------------------
/**
 *
 * @param {String} method
 * @param {*} arguments
 * @returns {Promise<*>}
 */
MAGPIE_HIVE._get_database = async function _get_database(method, arguments) {
  //
};
/**
 *
 * @param {String} method
 * @param {*} arguments
 * @returns {*}
 */
MAGPIE_HIVE._get_databaseSync = function _get_databaseSync(method, arguments) {
  //
};
/**
 *
 * @param {String} method
 * @param {*} arguments
 * @returns {Promise<database_result>}
 */
MAGPIE_HIVE._set_database = async function _set_database(method, arguments) {
  //
};
/**
 *
 * @param {String} method
 * @param {*} arguments
 * @returns {database_result}
 */
MAGPIE_HIVE._set_databaseSync = function _set_databaseSync(method, arguments) {
  //
};
/**
 *
 * @param {entityID[]} entityIDarray
 * @returns {MAGPIE_ENTITY[]}
 */
MAGPIE_HIVE.loadEntities = function loadEntities(entityIDarray) {
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
// #region > refresh
//------------------------------------------------------------------------
/**
 *
 * @param {Number} layerID
 * @param {Number} switchID
 * @returns {Promise<Boolean>}
 */
MAGPIE_HIVE.refresh = function refresh(layerID, switchID) {
  //
};
/**
 *
 * @param {String} layerName
 * @param {Number} layerID
 * @param {Number} switchID
 * @param {Number} dt
 * @param {Number} layer_frame
 */
MAGPIE_HIVE.tick_buffer = function tick_buffer(
  layerName,
  layerID,
  switchID,
  dt,
  layer_frame,
) {
  //
};
/**
 *
 * @param {String} layerName
 * @param {Number} layerID
 * @param {Number} switchID
 * @param {Number} dt
 * @param {Number} layer_frame
 */
MAGPIE_HIVE.tick_remote = function tick_remote(
  layerName,
  layerID,
  switchID,
  dt,
  layer_frame,
) {
  //
};
/**
 * @audit @desc saveHive
 *
 */
MAGPIE_HIVE.save = async function saveHive() {
  const ePrefix = "[HIVE].save: ";
  try {
    const results = await MAGPIE_HIVE._save_buffers();
    if (!results) throw new Error("unable to save buffers");
    /** @type {MAGPIE_METASTATE} */
    const context_state = MAGPIE_HIVE.__get_serverSync("_get_Metastate", []);
    context_state.hive = {
      registry: MAGPIE_HIVE._registry,
      contexts: Array.from(MAGPIE_HIVE._contextBuffer.keys()),
    };
    const metastate = await context_state.set();
    // const metastate = MAGPIE_HIVE._set_database("call", ["saveMetastate", context_state])
    // const metastate = MAGPIE_DATABASE.saveMetastate(r.context.METASTATE);
    if (!metastate) return;
    const state = context_state;
    const message =
      `${results.length}x buffers saved at ` +
      `[${state.meta.updated}-${state.date.printDate()}]`;
    MAGPIE_SYSTEM.log(ePrefix + message, "console", false);
    return results;
  } catch (e) {
    MAGPIE_SYSTEM.error(ePrefix + e.message, e);
  }
};
/**
 * @audit @desc saveHiveEntities
 *
 * @returns {Promise<Number>}
 */
MAGPIE_HIVE.saveEntities = async function saveHiveEntities() {
  const ePrefix = "[HIVE].saveEntities: ";
  try {
    const layer = MAGPIE.KEY.RUNTIME.LAYER;
    const base = this[layer.get(0).name].filter((entity) => entity?.type > 0);
    const game = this[layer.get(1).name].filter((entity) => entity?.type > 0);
    const TICK = this[layer.get(2).name].filter((entity) => entity?.type > 0);
    const transact = async (buffer) => {
      return await MAGPIE_HIVE._set_database("transactionSaveEntities", [
        buffer,
      ]);
    };
    if (base.length > 0) {
      const base_result = await transact(base);
      // const base_result = await MAGPIE_DATABASE.transactionSaveEntities(base);
      if (!base_result)
        throw new Error(`unable to save ${base.length}x entities in layer0`);
    }
    if (game.length > 0) {
      const game_result = await transact(game);
      // const game_result = await MAGPIE_DATABASE.transactionSaveEntities(game);
      if (!game_result)
        throw new Error(`unable to save ${game.length}x entities in layer1`);
    }
    if (TICK.length > 0) {
      const TICK_result = await transact(TICK);
      // const TICK_result = await MAGPIE_DATABASE.transactionSaveEntities(TICK);
      if (!TICK_result)
        throw new Error(`unable to save ${TICK.length}x entities in layer2`);
    }
    return base.length + game.length + TICK.length;
  } catch (e) {
    MAGPIE_SERVER.error(ePrefix + e.messag, e);
    return 0;
  }
};
/**
 * @audit @desc saveHiveBuffers
 * @returns {Promise<database_result[]>}
 */
MAGPIE_HIVE._save_buffers = async function saveHiveBuffers() {
  const ePrefix = "[HIVE].saveBuffers: ";
  try {
    const entity_buffer = [];
    const entityIDs = Array.from(MAGPIE_HIVE._registry.entries())
      .filter(
        (entry) =>
          entry[0] > 10 && entry[1].layerID < MAGPIE.KEY.HIVE.BUFFER_SIZE,
      )
      .map((entry) => entry[0]);
    for (let i = 0; i < entityIDs.length; i++) {
      try {
        const entityID = entityIDs[i];
        const entity = MAGPIE_HIVE._get_entity(entityID);
        if (entity?.constructor?.name !== "MAGPIE_ENTITY")
          throw new Error(`[ENTITY-${entityID}] @ ${entity} is invalid entity`);
        const payload = MAGPIE_HIVE._get_databaseSync("prepareEntity", [
          entity,
        ]);
        entity_buffer.push(payload);
      } catch (e) {
        MAGPIE_SYSTEM.error(ePrefix + e.message, e);
      }
    }
    // MAGPIE_SERVER._debug(entityIDs)
    const exp_buffer = Array.from(MAGPIE_HIVE._expBuffer.values()).map(
      (value) => MAGPIE_HIVE._get_databaseSync("prepareExp", [value.data]),
    );
    const key_buffer = Array.from(MAGPIE_HIVE._keyBuffer.values()).map(
      (value) => MAGPIE_HIVE._get_databaseSync("prepareKey", [value.data]),
    );
    const symbol_buffer = Array.from(MAGPIE_HIVE._symbolBuffer.values()).map(
      (value) => MAGPIE_HIVE._get_databaseSync("prepareSymbol", [value.data]),
    );
    const context_buffer = Array.from(MAGPIE_HIVE._contextBuffer.values()).map(
      (value) => MAGPIE_HIVE._get_databaseSync("prepareContext", [value]),
    );
    const buffers = [
      ["MAGPIE_ENTITY", entity_buffer],
      ["MAGPIE_EXP", exp_buffer],
      ["MAGPIE_KEY", key_buffer],
      ["MAGPIE_SYMBOL", symbol_buffer],
      ["MAGPIE_CONTEXT", context_buffer],
    ];
    // MAGPIE_SERVER._debug(buffers)
    /**  */
    return await MAGPIE_HIVE._set_database("call", ["saveBuffers", buffers]);
    // return await MAGPIE_DATABASE.call("saveBuffers", buffers)
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
// #region > Host
//------------------------------------------------------------------------
/**
 *
 * @param {MAGPIE_ENTITY} entity
 * @param {layerID} layerID
 * @param {layerID} targetLayerID
 * @returns {{layerID: layerID, targetLayerID: layerID}}
 */
MAGPIE_HIVE.isValidGuest = function isValidGUest(
  entity,
  layerID,
  targetLayerID,
) {
  const ePrefix = "[HIVE].isValidGuest: ";
  try {
    if (entity?.constructor?.name !== "MAGPIE_ENTITY")
      throw new Error(`${entity} is invalid MAGPIE_ENTITY`);
    if (typeof this._registry.get(layerID)?.name !== "string") layerID = 2;
    if (isNaN(targetLayerID) || layerID == null) targetLayerID = layerID;
    const record = MAGPIE_HIVE._registry.get(entity.ID);
    if (record) {
      if (record.layerID === layerID)
        throw new Error(
          `[ENTITY-${entity.ID}] is already at [LAYER-${layerID}][${record.slot}]`,
        );
      return MAGPIE_HIVE.move(entity.ID, layerID, targetLayerID);
    }
    const celestial = entity._get_celestial();
    if (!celestial) throw new Error(`${celestial} is invalid celestial`);
    const host = entity._get_host();
    if (!host) throw new Error(`${host} is invalid host`);
    return { layerID: layerID, targetLayerID: targetLayerID };
  } catch (e) {
    MAGPIE_SYSTEM.error(ePrefix + e.message, e);
    return false;
  }
};
/**
 * @audit somewhat functional
 * {@link MAGPIE_HIVE.kick}
 * {@link MAGPIE_HIVE.setup}
 * @param {MAGPIE_ENTITY} entity
 * @param {Number} layerID
 * @param {Number} targetLayerID
 * @param {contextID} contextID
 * @returns {MAGPIE_ENTITY}
 */
MAGPIE_HIVE.host = function hostOnHive(
  entity,
  layerID,
  targetLayerID = NaN,
  contextID,
) {
  const ePrefix = `[HIVE].host [ENTITY-${entity?.ID}]: `;
  try {
    if (!entity?.ID) throw new Error(`${entity} is invalid MAGPIE_ENTITY`);
    if (!Number(layerID)) throw new Error(`${layerID} is invalid layerID`);
    // MAGPIE_SYSTEM._logging_debug(ePrefix)
    const material = entity.type >= MAGPIE.KEY.ENTITY.TYPE.get("MATERIA").type;
    const buffer = layerID < MAGPIE.KEY.HIVE.BUFFER_SIZE;
    if (!material && buffer) layerID = 2;
    if (isNaN(targetLayerID)) targetLayerID = structuredClone(layerID);
    const exists = MAGPIE_HIVE._registry.get(entity.ID);
    const K = MAGPIE.KEY.RUNTIME.LAYER.get(layerID);
    if (exists) {
      if (exists.contexts) {
        exists.contexts = exists.contexts.filter((n) => !!Number(n));
        if (contextID && !exists.contexts?.includes(contextID))
          exists.contexts.push(contextID);
      }
      if (exists.layerID < layerID)
        return MAGPIE_HIVE.move(entity.ID, layerID, targetLayerID);
      const message_exists = `[ENTITY-${entity.ID}] is already at [LAYER-${exists.layerID}][${exists.slot}]`;
      return MAGPIE_SYSTEM.log(message_exists, "console", false);
      // if(MAGPIE_HIVE[K.name][exists.slot] === entity.ID)
      // {
      // }
    }
    const celestialID = entity.STATS[MAGPIE.KEY.POVART.P_C] || NaN;
    if (entity.ID > 1000) {
      if (isNaN(celestialID))
        throw new Error(`[ENTITY-${entity.ID}] has invalid P_C`);
      const celestial_in_registry = MAGPIE_HIVE._registry.get(celestialID);
      const hostID = entity.STATS[MAGPIE.KEY.STATS.HOST];
      const host = MAGPIE_HIVE._registry.get(hostID);
      if (!celestial_in_registry)
        throw new Error(`missing [CELESTIAL-${celestialID}] in registry`);
      if (!host) throw new Error(`missing [HOST-${hostID}] in registry`);
    }
    const layerName = K?.name;
    let slot = Number(MAGPIE_HIVE.nextSlot(layerID));
    if (isNaN(slot) || slot < 0) {
      MAGPIE_HIVE._registry.get(layerID).nextSlot =
        MAGPIE_HIVE.findNextSlot(layerID);
      throw new Error(`${slot} is invalid slot`);
    }
    if (slot >= K.slots) throw new Error(`[LAYER-${layerID}] is full`);
    const conflict = MAGPIE_HIVE.checkConflict(slot, layerID);
    // console.log(ePrefix + `conflict: ${conflict}`)
    // throw new Error("conflict!")
    if (conflict) {
      slot = MAGPIE_HIVE.findNextSlot(layerID);
      if (MAGPIE_HIVE.checkConflict(slot, layerID))
        throw new Error(`conflict at [LAYER-${layerID}][${slot}]!`);
    }
    MAGPIE_HIVE[layerName][slot] =
      layerID < MAGPIE.KEY.HIVE.BUFFER_SIZE ? entity : entity.ID;
    MAGPIE_HIVE._registry.set(entity.ID, {
      layerID: layerID,
      slot: slot,
      target: targetLayerID,
      retain: true,
      contexts: [contextID],
    });
    const now = Date.now();
    const stale =
      entity.updated > now + MAGPIE.KEY.ENTITY.STALE
        ? ` [STALE-${entity.updated}]`
        : "";
    entity.updated = now;
    const layerRecord = MAGPIE_HIVE._registry.get(layerID);
    layerRecord.nextSlot = MAGPIE_HIVE.findNextSlot(layerID);
    MAGPIE_HIVE._registry.set(layerID, layerRecord);
    if (!MAGPIE_HIVE._registry.get(entity.ID))
      throw new Error(`unable to host [ENTITY-${entity.ID}]`);
    const message = `${ePrefix} on [${layerName}][${slot}] with target [LAYER-${targetLayerID}]`;
    MAGPIE_SYSTEM.log(ePrefix + message + stale, "console", false);
    return entity;
  } catch (e) {
    MAGPIE_SYSTEM.error(ePrefix + e.message, e);
  }
};
MAGPIE_HIVE.checkConflict = function (slot, layerID) {
  const b = MAGPIE.KEY.HIVE.BUFFER_SIZE;
  const K = MAGPIE.KEY.RUNTIME.LAYER.get(layerID);
  const record = MAGPIE_HIVE[K.name][slot];
  const entityID = layerID < b ? record?.ID : record;
  if (entityID) return entityID;
  return false;
};
/**
 *
 * @param {layerID} layerID
 * @returns {index}
 */
MAGPIE_HIVE.findNextSlot = function findNextSlot(layerID) {
  const layerName = MAGPIE.KEY.RUNTIME.LAYER.get(layerID)?.name;
  if (layerID < MAGPIE.KEY.HIVE.BUFFER_SIZE)
    return MAGPIE_HIVE[layerName].findIndex((e) => e.type === 0) || 0;
  return MAGPIE_HIVE[layerName].findIndex((ID) => ID === 0) || 0;
};
/**
 *
 * @param {hive_entry} entry
 * @param {contextID} contextID
 * @returns {Number}
 */
MAGPIE_HIVE._entity_addContext = function _entity_addContext(entry, contextID) {
  if (entry.contexts.find(contextID)) return;
  entry.contexts.push(contextID);
  return entry.contexts.length;
};
/**
 *
 * @param {hive_entry} entry
 * @param {contextID} contextID
 * @returns {Number}
 */
MAGPIE_HIVE._entity_removeContext = function _entity_removeContext(
  entry,
  contextID,
) {
  const index = entry.contexts.indexOf(contextID);
  if (!index) return;
  entry.context[index] = entry.context[entry.context.length - 1];
  entry.context.pop();
  return entry.context.length;
};
/**
 *
 * @param {Number} layerID
 * @returns {Number}
 */
MAGPIE_HIVE.nextSlot = function nextSlot(layerID) {
  // const K = MAGPIE.KEY.RUNTIME.LAYER;
  // const layerName = K.get(layerID)?.name;
  // this[layerName]
  return this._registry.get(layerID)?.nextSlot;
};
/**
 * {@link MAGPIE_HIVE.setup}
 * {@link MAGPIE_HIVE.host}
 * @param {index} slot
 * @param {Number} layerID
 * @returns {MAGPIE_ENTITY}
 */
MAGPIE_HIVE.getSlot = function getSlot(slot, layerID) {
  const ePrefix = "[HIVE].getSlot: ";
  try {
    const layerName = MAGPIE.KEY.RUNTIME.LAYER.get(layerID)?.name;
    if (!layerName) return;
    const b = MAGPIE.KEY.HIVE.BUFFER_SIZE;
    const record = MAGPIE_HIVE[layerName][slot];
    const entityID = layerID < b ? record?.ID : record;
    if (!Number(entityID) || entityID < 1000) return false;
    return record;
    // const entity = this[layerName][slot]
    // const valid = layerID < MAGPIE.KEY.HIVE.BUFFER_SIZE
    // 	? entity?.ID
    // 	: !isNaN(entity);
    // if(!valid)
    // 	return
    // 	// throw new Error(`[LAYER-${layerID}][${slot}] is invalid entity slot`)
    // return entity
  } catch (e) {
    MAGPIE_SYSTEM.error(ePrefix + e.message, e);
  }
};
/**
 *
 * @param {entityID} entityID
 * @returns {MAGPIE_ENTITY}
 */
MAGPIE_HIVE._get_entity = function _get_entity(entityID) {
  //
};
/**
 *
 * @param {MAGPIE_ENTITY} entity
 * @returns {database_result}
 */
MAGPIE_HIVE._set_entitySync = function _set_entitySync(entity) {
  return MAGPIE_HIVE._set_databaseSync("saveEntitySync", [entity]);
};
/**
 *
 * @param {MAGPIE_ENTITY} entity
 * @returns {Promise<database_result>}
 */
MAGPIE_HIVE._set_entity = async function _set_entity(entity) {
  return MAGPIE_HIVE._set_database("saveEntity", [entity]);
};
/**
 *
 * @param {entityID} celestialID
 * @returns {MAGPIE_ENTITY}
 */
MAGPIE_HIVE._get_celestial = function __get_celestial(celestialID) {
  const slot = MAGPIE_HIVE._registry.get(celestialID)?.slot;
  if (!slot)
    return MAGPIE_HIVE._get_databaseSync("loadEntitySync", [celestialID]);
  const layerStandard = 2;
  return MAGPIE_HIVE.getSlot(slot, layerStandard);
};
/**
 *
 * @param {entityID} entityID
 * @param {Number} layerB_ID
 * @param {Number} targetLayerID
 * @returns {entityID}
 */
MAGPIE_HIVE.move = function move(entityID, layerB_ID, targetLayerID = NaN) {
  const ePrefix = "[HIVE].move: ";
  try {
    const entry = MAGPIE_HIVE._registry.get(entityID);
    if (!entry) throw new Error(`[ENTITY-${entityID}] not in registry`);
    const layerID = entry.layerID;
    const slot = entry.slot;
    const layerA = MAGPIE.KEY.RUNTIME.LAYER.get(layerID);
    if (!layerA) throw new Error(`${layerA} is invalid HIVE layer`);
    const record = MAGPIE_HIVE[layerA.name][slot];
    const ID = layerID < MAGPIE.KEY.HIVE.BUFFER_SIZE ? record.ID : record;
    if (ID !== entityID)
      throw new Error(
        `[ENTITY-${entityID}] not at layer${entry.layerID}[${slot}]`,
      );
    const layerB = MAGPIE.KEY.RUNTIME.LAYER.get(layerB_ID);
    if (!layerB) throw new Error(`${layerB} is invalid HIVE layer`);
    const nextSlot = MAGPIE_HIVE.nextSlot(layerB_ID);
    if (isNaN(nextSlot)) throw new Error(`${layerB?.name} is full`);
    const kicked = MAGPIE_HIVE.kick(entityID, "move");
    let entity = null;
    if (kicked?.ID) entity = kicked;
    else entity = MAGPIE_HIVE.loadEntitySync(entityID);
    if (isNaN(targetLayerID)) targetLayerID = layerB_ID;
    return MAGPIE_HIVE.host(entity, layerB_ID, targetLayerID);
  } catch (e) {
    MAGPIE_SYSTEM.error(ePrefix + e.message, e);
  }
};
/**
 * {@link MAGPIE_HIVE.host}
 * @param {entityID} entityID
 * @param {index} indexOverride
 * @param {String} reason
 * @returns {entityID}
 */
MAGPIE_HIVE.kick = function kick(
  entityID,
  reason = "dev",
  indexOverride = NaN,
  layerOverride = NaN,
) {
  const ePrefix = `[HIVE].kick [ENTITY-${entityID}]: `;
  try {
    if (!Number(entityID)) throw new Error(`${entityID} is invalid entityID`);
    const entry = MAGPIE_HIVE._registry.get(entityID);
    const K = MAGPIE.KEY.RUNTIME.LAYER;
    const record = MAGPIE_HIVE._find_entity(
      entityID,
      indexOverride,
      layerOverride,
    );
    console.log(`${ePrefix} record: ${Object.entries(record)}`);
    if (!record)
      throw new Error(`[ENTITY-${entityID}] has stale registry record`);
    const layerID = entry?.layerID ? entry.layerID : record.layerID;
    const b = layerID < MAGPIE.KEY.HIVE.BUFFER_SIZE;
    const layerName = K.get(layerID)?.name;
    if (!layerName) throw new Error(`${layerID} is invalid layerID`);
    const dummy = true;
    MAGPIE_HIVE[layerName][record.index] = b
      ? MAGPIE_HIVE._new_entity({}, dummy)
      : 0;
    setTimeout(
      () =>
        (MAGPIE_HIVE._registry.get(layerID).nextSlot =
          MAGPIE_HIVE.findNextSlot(layerID)),
      1000,
    );
    if (!Number(layerID))
      throw new Error(`unable to find [ENTITY-${entityID}]`);
    const layer = MAGPIE_HIVE._registry.get(layerID);
    layer.nextSlot = record.index;
  } catch (e) {
    MAGPIE_SYSTEM.error(ePrefix + e.message, e);
  } finally {
    MAGPIE_HIVE._registry.delete(entityID);
    return entityID;
  }
};
/**
 *
 * @param {entityID} entityID
 * @param {index} indexOverride
 * @param {layerID} layerOverride
 * @returns {{index: index, layerID: layerID}}
 */
MAGPIE_HIVE._find_entity = function (entityID, indexOverride, layerOverride) {
  const layer = MAGPIE.KEY.RUNTIME.LAYER;
  if (!isNaN(indexOverride) && !isNaN(layerOverride)) {
    const entity = MAGPIE_HIVE.getSlot(indexOverride, layerOverride);
    if (entity?.ID === entityID)
      return { index: indexOverride, layerID: layerOverride };
  }
  const layers = Array.from(MAGPIE.KEY.RUNTIME.LAYER.keys());
  const b = MAGPIE.KEY.HIVE.BUFFER_SIZE;
  for (const layerID of layers) {
    const buffer = (e) => {
      return e.ID === entityID;
    };
    const remote = (e) => {
      return e === entityID;
    };
    const layerName = layer.get(layerID).name;
    const index = MAGPIE_HIVE[layerName].findIndex((e) =>
      layerID < b ? buffer(e) : remote(e),
    );
    if (Number(index) > -1) return { index, layerID };
  }
  return { index: -1, layerID: -1 };
};
/**
 *
 * @param {MAGPIE_EXP} exp
 * @param {contextID} contextID
 * @returns {buffer_size}
 */
MAGPIE_HIVE._host_exp = function hostExp(exp, contextID) {
  const buffer = MAGPIE_HIVE._expBuffer.get(exp.ID) || {
    data: exp,
    owners: [],
  };
  if (!isNaN(contextID)) buffer.owners.push(contextID);
  return MAGPIE_HIVE._expBuffer.set(exp.ID, buffer).size;
};
/**
 *
 * @param {MAGPIE_KEY} key
 * @param {contextID} contextID
 * @returns {buffer_size}
 */
MAGPIE_HIVE._host_key = function hostKey(key, contextID) {
  const buffer = MAGPIE_HIVE._keyBuffer.get(key.ID) || {
    data: key,
    owners: [],
  };
  if (!isNaN(contextID)) buffer.owners.push(contextID);
  return MAGPIE_HIVE._keyBuffer.set(key.ID, buffer).size;
};
/**
 *
 * @param {MAGPIE_SYMBOL} symbol
 * @param {contextID} contextID
 * @returns {buffer_size}
 */
MAGPIE_HIVE._host_symbol = function hostSymbol(symbol, contextID) {
  const buffer = MAGPIE_HIVE._symbolBuffer.get(symbol.ID) || {
    data: symbol,
    owners: [],
  };
  if (!isNaN(contextID)) buffer.owners.push(contextID);
  return MAGPIE_HIVE._symbolBuffer.set(symbol.ID, buffer).size;
};
/**
 * {@link MAGPIE_HIVE.host}
 * @param {MAGPIE_CONTEXT} context
 * @returns {buffer_size}
 */
MAGPIE_HIVE._host_context = function hostContext(context) {
  const ePrefix = `[HIVE].hostContext[${context.ID}]: `;
  try {
    if (context?.constructor?.name !== "MAGPIE_CONTEXT")
      throw new Error(`${context} is invalid MAGPIE_CONTEXT`);
    MAGPIE_HIVE._contextBuffer.set(context.ID, context);
    const entities = Array.from(context.entities);
    const exps = context.exps;
    const keys = context.keys;
    const symbols = context.symbols;
    if (
      entities.length < 1 &&
      exps.length < 1 &&
      keys.length < 1 &&
      symbols.length < 1
    )
      return;
    const urgency = Number(context.urgency) || 0;
    const gravity = Number(context.gravity) || 0;
    const layerID = MAGPIE_HIVE._offset_importance(urgency, gravity);
    entities.forEach((entityID) => {
      try {
        MAGPIE_HIVE.host(
          MAGPIE_HIVE._get_entity(entityID),
          layerID,
          NaN,
          context.ID,
        );
      } catch (e) {
        MAGPIE_SYSTEM.error(ePrefix + e.message, e);
      }
    });
    exps.forEach((expID) => {
      MAGPIE_HIVE._host_exp(MAGPIE_HIVE._get_exp(expID), context.ID);
    });
    keys.forEach((keyID) => {
      MAGPIE_HIVE._host_key(MAGPIE_HIVE._get_key(keyID), context.ID);
    });
    symbols.forEach((symbolID) => {
      MAGPIE_HIVE._host_symbol(MAGPIE_HIVE._get_symbol(symbolID), context.ID);
    });
  } catch (e) {
    MAGPIE_SYSTEM.error(ePrefix + e.message, e);
  }
};
/**
 *
 * @param {urgency} urgency
 * @param {gravity} gravity
 * @returns {layerID}
 */
MAGPIE_HIVE._offset_importance = function _offset_importance(urgency, gravity) {
  const layers = MAGPIE.KEY.RUNTIME.LAYER.size;
  const bottom_layer = 1;
  const game_layer = layers - 1;
  const weight = urgency + gravity;
  return (
    layers - MAGPIE_SYSTEM.Math.clampRange(weight, bottom_layer, game_layer)
  );
};
/**
 *
 * @param {expID} expID
 * @returns {database_result}
 */
MAGPIE_HIVE._kick_exp = function kickExp(expID) {
  const exp = MAGPIE_HIVE._get_exp(expID);
  if (!exp) return;
  const results = exp.setSync();
  if (!results) throw new Error(`unable to save [EXP-${expID}]`);
  MAGPIE_HIVE._expBuffer.delete(expID);
  return results;
};
/**
 *
 * @param {keyID} keyID
 * @returns {database_result}
 */
MAGPIE_HIVE._kick_key = function kickKey(keyID) {
  const key = MAGPIE_HIVE._get_key(keyID);
  if (!key) return;
  const result = key.setSync();
  if (!result) throw new Error(`unable to save [KEY-${keyID}]`);
  MAGPIE_HIVE._keyBuffer.delete(keyID);
  return result;
};
/**
 *
 * @param {symbolID} symbolID
 * @returns {database_result}
 */
MAGPIE_HIVE._kick_symbol = function kickSymbol(symbolID) {
  const symbol = MAGPIE_HIVE._get_symbol(symbolID);
  if (!symbol) return;
  const result = symbol.setSync();
  if (!result) throw new Error(`unable to save [SYMBOL-${symbolID}]`);
  MAGPIE_HIVE._symbolBuffer.delete(symbolID);
  return result;
};
/**
 *
 * @param {contextID} contextID
 * @param {String} reason
 * @returns {database_result}
 */
MAGPIE_HIVE._kick_context = function kickContext(contextID, reason = "dev") {
  const ePrefix = "[HIVE].kickContext: ";
  try {
    const context = MAGPIE_HIVE._get_context(contextID);
    if (!context) throw new Error(`unable to find [CONTEXT-${contextID}]`);
    const entities = Array.from(context.entities);
    entities.forEach((entityID) => {
      MAGPIE_HIVE._registry
        .get(entityID)
        ?.contexts.some((ID) => ID !== contextID)
        ? false
        : MAGPIE_HIVE.kick(entityID, "context_sleep");
    });
    const exps = Array.from(context.exps);
    exps.forEach((expID) => {
      MAGPIE_HIVE._expBuffer.get(expID).owners.some((ID) => ID === contextID)
        ? false
        : MAGPIE_HIVE._kick_exp(expID);
    });
    const keys = Array.from(context.keys);
    keys.forEach((keyID) => {
      MAGPIE_HIVE._keyBuffer.get(keyID).owners.some((ID) => ID === contextID)
        ? false
        : MAGPIE_HIVE._kick_key(keyID);
    });
    const symbols = Array.from(context.symbols);
    symbols.forEach((symbolID) => {
      MAGPIE_HIVE._symbolBuffer
        .get(symbolID)
        .owners.some((ID) => ID === contextID)
        ? false
        : MAGPIE_HIVE._kick_symbol(symbolID);
    });
    const result = context.setSync();
    if (!result) throw new Error(`unable to save [CONTEXT-${contextID}]`);
    MAGPIE_HIVE._contextBuffer.delete(contextID);
    return result;
  } catch (e) {
    MAGPIE_SYSTEM.error(ePrefix + e.message, e);
  }
};
/**
 *
 * @param {entityID} entityID
 * @param {Number} layerID
 * @returns {entityID}
 */
MAGPIE_HIVE._host_parent = function _host_parent(entityID, layerID) {
  const entity = MAGPIE_HIVE._get_databaseSync("loadEntitySync", [entityID]);
  if (!entity?.ID) throw new Error(`${entity} is invalid MAGPIE_ENTITY`);
  if (isNaN(layerID) || layerID > MAGPIE.KEY.RUNTIME.LAYER.size)
    throw new Error(`${layerID} is invalid HIVE layer`);
  const typeStart = MAGPIE.KEY.ENTITY.TYPE.get("CELESTIAL");
  const typeEnd = MAGPIE.KEY.ENTITY.TYPE.get("MATERIA");
  const buffer = MAGPIE.KEY.HIVE.BUFFER_SIZE;
  const isCelestial = entity.type < typeStart || entity.type >= typeEnd;
  const layer = isCelestial
    ? layer < buffer
      ? buffer
      : layerID + 1
    : layerID + 1;
  // MAGPIE_SYSTEM._logging_debug(layer)
  if (!layer) throw new Error(`${layer} is invalid HIVE layer`);
  return MAGPIE_HIVE.host(entity, layer);
};
/**
 *
 * @param {Boolean} inRegistry
 * @param {MAGPIE_ENTITY} entityID
 * @param {Number} layerID
 */
MAGPIE_HIVE._host_hasParent = function (inRegistry, entityID, layerID) {
  return MAGPIE_HIVE._host_parent(entityID, layerID);
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
 * @param {symbolID} symbolID
 * @returns {MAGPIE_SYMBOL}
 */
MAGPIE_HIVE._get_symbol = function _get_symbol(symbolID) {
  const symbol = MAGPIE_HIVE._symbolBuffer.get(symbolID)?.data;
  if (symbol) return symbol;
  return MAGPIE_HIVE._get_databaseSync("loadSymbolSync", [symbolID]);
};
/**
 *
 * @param {expID} expID
 * @returns {MAGPIE_EXP}
 */
MAGPIE_HIVE._get_exp = function _get_exp(expID) {
  const exp = MAGPIE_HIVE._expBuffer.get(expID)?.data;
  if (exp) return exp;
  return MAGPIE_HIVE._get_databaseSync("loadExpSync", [expID]);
};
/**
 *
 * @param {keyID} keyID
 * @returns {MAGPIE_KEY}
 */
MAGPIE_HIVE._get_key = function _get_key(keyID) {
  const key = MAGPIE_HIVE._keyBuffer.get(keyID)?.data;
  if (key) return key;
  return MAGPIE_HIVE._get_databaseSync("loadKeySync", [keyID]);
};
/**
 *
 * @param {contextID} contextID
 * @returns {MAGPIE_CONTEXT}
 */
MAGPIE_HIVE._get_context = function _get_context(contextID) {
  const context = MAGPIE_HIVE._contextBuffer.get(contextID);
  if (context) return context;
  return MAGPIE_HIVE._get_databaseSync("loadContextSync", [contextID]);
};
/**
 * @returns {MAGPIE_CONTEXT[]}
 */
MAGPIE_HIVE._get_all_contexts = function getAllContext() {
  const arr = [];
  MAGPIE_HIVE._contextBuffer.forEach((context) => arr.push(context));
  return arr;
};
/**
 *
 * @param {entityID} entityID
 * @returns {contextID[]}
 */
MAGPIE_HIVE._get_entity_contextIDs = function getEntityContextIDs(entityID) {
  return MAGPIE_HIVE._registry.get(entityID).contexts;
};
/**
 *
 * @param {entityID} entityID
 * @returns {MAGPIE_CONTEXT[]}
 */
MAGPIE_HIVE._get_entity_contexts = function getEntityContexts(entityID) {
  return MAGPIE_HIVE._get_entity_contextIDs(entityID).map((contextID) =>
    MAGPIE_HIVE._get_context(contextID),
  );
};
/**
 * @typedef {import("./player").MAGPIE_PLAYER} MAGPIE_PLAYER
 * @param {playerID} playerID
 * @returns {MAGPIE_PLAYER}
 */
MAGPIE_HIVE._get_player = function _get_player(playerID) {
  return MAGPIE_HIVE._get_databaseSync("loadPlayerSync", [playerID]);
};
// #endregion
//------------------------------------------------------------------------
/**
 * @name
 * @desc
 *
 */
//------------------------------------------------------------------------
// #region > setters
//------------------------------------------------------------------------
/**
 *
 * @param {String} type
 * @param {*} entry
 */
MAGPIE_HIVE._verify_buffer_entry = function verifyBufferEntry(type, entry) {
  const map = MAGPIE_HIVE[`_${type}Buffer`];
  const buffer = map.get(entry.ID);
  if (buffer) {
    buffer.data = entry;
    map.set(entry.ID, buffer);
  }
};
/**
 *
 * @param {MAGPIE_SYMBOL} symbol
 * @returns {Promise<database_result>}
 */
MAGPIE_HIVE._set_symbol = async function setSymbol(symbol) {
  MAGPIE_HIVE._verify_buffer_entry("symbol", symbol);
  return await MAGPIE_HIVE._set_database("saveSymbol", [symbol]);
};
/**
 *
 * @param {MAGPIE_SYMBOL} symbol
 * @returns {database_result}
 */
MAGPIE_HIVE._set_symbolSync = function setSymbolSync(symbol) {
  MAGPIE_HIVE._verify_buffer_entry("symbol", symbol);
  return MAGPIE_HIVE._set_databaseSync("saveSymbolSync", [symbol]);
};
/**
 *
 * @param {MAGPIE_EXP} exp
 * @returns {Promise<database_result>}
 */
MAGPIE_HIVE._set_exp = async function setExp(exp) {
  MAGPIE_HIVE._verify_buffer_entry("exp", exp);
  return await MAGPIE_HIVE._set_database("saveExp", [exp]);
};
/**
 *
 * @param {MAGPIE_EXP} exp
 * @returns {database_result}
 */
MAGPIE_HIVE._set_expSync = function setExpSync(exp) {
  MAGPIE_HIVE._verify_buffer_entry("exp", exp);
  return MAGPIE_HIVE._set_databaseSync("saveExpSync", [exp]);
};
/**
 *
 * @param {MAGPIE_KEY} key
 * @returns {Promise<database_result>}
 */
MAGPIE_HIVE._set_key = async function setKey(key) {
  MAGPIE_HIVE._verify_buffer_entry("key", key);
  return await MAGPIE_HIVE._set_database("saveKey", [key]);
};
/**
 *
 * @param {MAGPIE_KEY} key
 * @returns {database_result}
 */
MAGPIE_HIVE._set_keySync = function setKeySync(key) {
  MAGPIE_HIVE._verify_buffer_entry("key", key);
  return MAGPIE_HIVE._set_databaseSync("saveKeySync", [key]);
};
/**
 *
 * @param {MAGPIE_CONTEXT} context
 * @returns {Promise<database_result>}
 */
MAGPIE_HIVE._set_context = async function setContext(context) {
  let entry = MAGPIE_HIVE._contextBuffer.get(context.ID);
  if (entry) {
    entry = context;
  }
  return await MAGPIE_HIVE._set_database("saveContext", [context]);
};
/**
 *
 * @param {MAGPIE_CONTEXT} context
 * @returns {database_result}
 */
MAGPIE_HIVE._set_contextSync = function setContextSync(context) {
  let entry = MAGPIE_HIVE._contextBuffer.get(context.ID);
  if (entry) {
    entry = context;
  }
  return MAGPIE_HIVE._set_databaseSync("saveContextSync", [context]);
};
/**
 *
 * @param {MAGPIE_PLAYER} player
 * @returns {Promise<database_result>}
 */
MAGPIE_HIVE._set_player = async function hiveSetPlayer(player) {
  const result = await MAGPIE_HIVE._set_database("savePlayer", [player]);
  return result;
};
/**
 *
 * @param {MAGPIE_PLAYER} player
 * @returns {database_result}
 */
MAGPIE_HIVE._set_playerSync = function hiveSetPlayerSync(player) {
  return MAGPIE_HIVE._set_databaseSync("savePlayerSync", [player]);
};
// #endregion
//------------------------------------------------------------------------
/**
 * @name
 * @desc
 *
 */
//------------------------------------------------------------------------
// #region > Context
//------------------------------------------------------------------------
/**
 *
 * @param {contextID} contextID
 * @returns {Boolean}
 */
MAGPIE_HIVE._context_isAwake = function _context_isAwake(contextID) {
  if (MAGPIE_HIVE._contextBuffer.get(contextID)) return true;
  return false;
};
/**
 *
 * @param {entityID} entityID
 * @returns {MAGPIE_CONTEXT[]}
 */
MAGPIE_HIVE._fetch_entity_context = function (entityID) {
  const contextIDs = MAGPIE_HIVE._registry.get(entityID)?.contexts;
  return contextIDs.map((ID) => MAGPIE_HIVE._get_context(ID));
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
MAGPIE_HIVE._time_advance = function timeAdvance(dt) {
  const ePrefix = "[HIVE].timeAdvance: ";
  try {
    const K = MAGPIE.KEY.RUNTIME.LAYER;
    const Game = 1;
    const TICK = 2;
    const Super = 3;
    const Mega = 4;
    const Ultra = 5;
    const layerGame = K.get(Game);
    const layerTICK = K.get(TICK);
    const layerSuper = K.get(Super);
    const layerMega = K.get(Mega);
    const layerUltra = K.get(Ultra);
    const switchID =
      dt < 1 ? 1 : dt < 60 ? 2 : dt < 60 ** 2 ? 3 : dt < 60 ** 2 * 24 ? 4 : 5;
    MAGPIE_HIVE.tick_buffer(layerGame.name, Game, switchID, dt);
    MAGPIE_HIVE.tick_buffer(layerTICK.name, TICK, switchID, dt);
    MAGPIE_HIVE.tick_remote(layerSuper.name, Super, switchID, dt);
    MAGPIE_HIVE.tick_remote(layerMega.name, Mega, switchID, dt);
    MAGPIE_HIVE.tick_remote(layerUltra.name, Ultra, switchID, dt);
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
 * @typedef {import("../data/calendar.js").calendar_data} calendar_data
 */
//========================================================================
// #region - CALENDAR
//========================================================================
MAGPIE_CALENDAR.meta = {};
MAGPIE_CALENDAR.INDEX = require("../data/calendar.js");
/**
 *
 * @param {calendar_data} data
 * @returns {new MAGPIE_CALENDAR}
 */
MAGPIE_CALENDAR.prototype.initialize = function initializeCalendar(data) {
  //@todo MAGPIE_CALENDAR.initialize
};
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
 * @typedef {{
 * 	calendar: calendarID,
 * 	year: year,
 * 	month: month,
 * 	day: day,
 *  weekDay: weekDay,
 * 	hour: hour,
 * 	minute: minute,
 * 	second: second,
 * 	millisecond: millisecond,
 * 	epoch: epoch_game
 * }} date_data
 */
//========================================================================
// #region - DATE
//========================================================================
MAGPIE_DATE.meta = {
  name: MAGPIE.meta.name + " Date",
  desc: "Date/Time system and component template",
  firmwareName: "MAGPIE_DATE",
};
/**
 * @name
 * @desc
 *
 */
//------------------------------------------------------------------------
// #region > proto
//------------------------------------------------------------------------
/**
 *
 * @param {date_data} data
 */
MAGPIE_DATE.prototype.initialize = function initializeDate(data) {
  this._firmware = MAGPIE_DATE.meta.firmwareName;
  this.calendar = Number(data?.calendar) || MAGPIE.KEY.CALENDAR.GREGORIAN.ID;
  this.epoch = Number(date?.epoch);
  this.year = Number(date?.year);
  this.month = Number(date?.month);
  this.day = Number(date?.day);
  this.weekDay = Number(date?.weekDay);
  this.hour = Number(date?.hour);
  this.minute = Number(date?.minute);
  this.second = Number(date?.second);
  this.millisecond = Number(date?.millisecond);
  this.setup();
};
/**
 *
 */
MAGPIE_DATE.prototype.setup = async function setupDate() {
  if (!this.epoch) this.getEpoch();
  if (!this.epoch) this.setReal();
  this.setupFromEpoch();
};
/**
 *
 * @param {epoch_game} epoch
 */
MAGPIE_DATE.prototype.setupFromEpoch = function setupDateFromEpoch(epoch) {
  if (!epoch) epoch = this.epoch;
  if (!this.epoch) return;
  this.epoch = epoch;
  const calendar = MAGPIE_CALENDAR.INDEX.get(this.calendar);
  if (!calendar) return;
  const msPerDay = calendar.dayLength * 60 ** 2 * 1000;
  const msPerYear = calendar.days * msPerDay;
  const yearRaw = epoch / msPerYear;
  this.year = Math.floor(yearRaw) + calendar.epochYear;
  const dayRaw = (epoch % msPerYear) / msPerDay;
  this._yearday = Math.floor(dayRaw) + 1;
  let accumulatedDays = 0;
  let monthIndex = 1;
  for (const [mName, mDays] of Object.entries(calendar.months)) {
    if (dayRaw < accumulatedDays + mDays) {
      this.month = monthIndex;
      this.day = Math.floor(dayRaw - accumulatedDays) + 1;
      break;
    }
    accumulatedDays += mDays;
    monthIndex++;
  }
  const dayRemainderMs = (epoch % msPerYear) % msPerDay;
  this.hour = Math.floor(dayRemainderMs / (60 ** 2 * 1000));
  this.minute = Math.floor((dayRemainderMs % (60 ** 2 * 1000)) / (60 * 1000));
  this.second = Math.floor((dayRemainderMs % (60 * 1000)) / 1000);
  this.millisecond = Math.floor(dayRemainderMs % 1000);
  const totalDaysPassed = Math.floor(epoch / msPerDay);
  const totalWeekDays = Object.keys(calendar.weekDays).length || 7;
  this.weekDay = totalDaysPassed % totalWeekDays;
};
MAGPIE_DATE.prototype.setReal = function () {
  const real = new Date();
  this.year = real.getUTCFullYear();
  this.month = real.getUTCMonth() + 1;
  this.day = real.getUTCDate();
  this.weekDay = real.getUTCDay();
  this.hour = real.getUTCHours();
  this.minute = real.getUTCMinutes();
  this.second = real.getUTCSeconds();
  this.millisecond = real.getUTCMilliseconds();
};
/**
 *
 * @returns {calendar_data}
 */
MAGPIE_DATE.prototype.getCalendar = function getCalendar() {
  return MAGPIE_CALENDAR.INDEX.get(this.calendar);
};
/**
 * @returns {millisecond}
 */
MAGPIE_DATE.prototype.getEpoch = function getEpoch() {
  const ePrefix = "[DATE].getEpoch: ";
  try {
    const values = [
      this.second,
      this.minute,
      this.hour,
      this.millisecond,
      this.year,
      this.calendar,
    ];
    if (values.some((n) => isNaN(n))) return;
    let seconds = 0;
    seconds += this.second;
    seconds += this.minute * 60;
    seconds += this.hour * 60 ** 2;
    const calendar = this.getCalendar();
    const daySeconds = calendar.dayLength * 60 ** 2;
    const epochYear = calendar.epochYear;
    const elapsedYears = this.year - epochYear;
    const days = this.yearday() - 1 + calendar.days * elapsedYears;
    seconds += days * daySeconds;
    return seconds * 1000 + this.millisecond;
  } catch (e) {
    MAGPIE_SYSTEM.error(ePrefix + e.message, e);
  }
};
MAGPIE_DATE.prototype.getWeekDayName = function getWeekDayName() {
  const calendar = this.getCalendar();
  const weekDay = this.weekDay;
  const day = calendar.weekDays[weekDay];
  return day;
};
/**
 *
 * @returns {day}
 */
MAGPIE_DATE.prototype.yearday = function yearday() {
  if (!this.day || !this.month) return;
  let yearday = 0;
  yearday += this.day;
  const monthdays = Object.values(this.getCalendar().months)
    .filter((m, i) => i < this.month - 1)
    .forEach((n) => (yearday += n));
  if (this.isLeapYear() && this.month > this.getCalendar().leapMonth) yearday++;
  return yearday;
};
/**
 *
 * @returns {Boolean}
 */
MAGPIE_DATE.prototype.isLeapYear = function isLeapYear() {
  const leapYear = this.calendar.leapYear || 4;
  const epoch = this.calendar.epochYear || 0;
  const leap = (this.year - epoch) % leapYear;
  return leap >= leapYear;
};
/**
 * @typedef {Number} binaryBoolean 0 (for false) or 1 (for true)
 * @returns {binaryBoolean}
 */
MAGPIE_DATE.prototype.leapDay = function leapDay() {
  const leapMonth = this.calendar.leapMonth || 2;
  if (this.isLeapYear() && this.month === leapMonth) return 1;
  return 0;
};
/**
 * @typedef {CTZ} variableCTZ
 * @param {{
 * date: Boolean,
 * time: Boolean,
 * second: Boolean,
 * millisecond: Boolean
 * }} options
 * @returns {variableCTZ} (YYYYMMDD)(HHMM)(SS)(mmm)
 */
MAGPIE_DATE.prototype.printDate = function printDate(options) {
  let string = "";
  const year = this.pad0(this.year, 4);
  const month = this.pad0(this.month, 2);
  const day = this.pad0(this.day, 2);
  const hour = this.pad0(this.hour, 2);
  const minute = this.pad0(this.minute, 2);
  const second = this.pad0(this.second, 2);
  const millisecond = this.pad0(this.millisecond, 3);
  let date = true;
  let time = true;
  if (options?.date) {
    options.time = false;
    time = false;
  }
  if (options?.time) {
    options.date = false;
    date = false;
  }
  if (date) {
    string += year;
    string += month;
    string += day;
  }
  if (time) {
    string += hour;
    string += minute;
    if (options?.second || options?.millisecond) {
      string += second;
      if (options?.millisecond) string += millisecond;
    }
  }
  return string;
};
/**
 *
 * @param {Number} number
 * @param {Number} length
 * @returns {String}
 */
MAGPIE_DATE.prototype.pad0 = function pad0(number, length = 0) {
  return MAGPIE_SYSTEM.Math.pad0(number, length);
};
// #endregion
//------------------------------------------------------------------------
/**
 * @name TICK
 * @desc
 *
 */
//------------------------------------------------------------------------
// #region > TICK
//------------------------------------------------------------------------

MAGPIE_DATE.prototype.TICK = function TICK() {
  if (this.second >= 59) return this.superTICK();
  this.millisecond = 0;
  // const K = MAGPIE.KEY.SWITCHES.SUPER_TICK;
  // if(this.second > 10) MAGPIE_SYSTEM.switches.setValue(K, false);
  this.second++;
};
MAGPIE_DATE.prototype.superTICK = function superTICK() {
  this.second = 0;
  // const K = MAGPIE.KEY.SWITCHES;
  // MAGPIE_SYSTEM.switches.setValue(K.SUPER_TICK, true);
  if (this.minute >= 59) return this.megaTICK();
  // if(this.minute > 0) MAGPIE_SYSTEM.switches.setValue(K.MEGA_TICK, false);
  this.minute++;
};
MAGPIE_DATE.prototype.megaTICK = function megaTICK() {
  this.minute = 0;
  // const K = MAGPIE.KEY.SWITCHES;
  // MAGPIE_SYSTEM.switches.setValue(K.MEGA_TICK, true);
  const day = this.getCalendar().dayLength || 24;
  if (this.hour >= day - 1) return this.ultraTICK();
  // if(this.hour > 0) MAGPIE_SYSTEM.switches.setValue(K.ULTRA_TICK, false);
  this.hour++;
};
MAGPIE_DATE.prototype.ultraTICK = function ultraTICK() {
  this.hour = 0;
  this.weekDay >= Object.keys(this.getCalendar().weekDays).length - 1
    ? (this.weekDay = 0)
    : this.weekDay++;
  // const K = MAGPIE.KEY.SWITCHES;
  // MAGPIE_SYSTEM.switches.setValue(K.ULTRA_TICK, true);
  const months = this.getCalendar().months;
  const days = Object.values(months)[this.month - 1];
  const leap = this.leapDay();
  if (this.day >= days + leap) return this.newMonth();
  // if(this.day > 1) MAGPIE_SYSTEM.switches.setValue(K.NEW_MONTH, false);
  this.day++;
};
MAGPIE_DATE.prototype.newMonth = function newMonth() {
  this.day = 1;
  const months = Object.keys(this.getCalendar().months).length;
  // const K = MAGPIE.KEY.SWITCHES;
  // MAGPIE_SYSTEM.switches.setValue(K.NEW_MONTH, true);
  if (this.month >= months) return this.newYear();
  // if(this.month > 1) MAGPIE_SYSTEM.switches.setValue(K.NEW_YEAR, false);
  this.month++;
};
MAGPIE_DATE.prototype.newYear = function newYear() {
  this.month = 1;
  // const K = MAGPIE.KEY.SWITCHES;
  // MAGPIE_SYSTEM.switches.setValue(K.NEW_YEAR, true);
  this.year++;
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
 * @typedef {String} STZ YYYY/MM/DD-HH:MM
 * @typedef {STZ} STZD YYYY/MM/DD
 * @typedef {STZ} STZT HH:MM
 * @typedef {STZT} STZTF HH:MM:SS
 * @typedef {STZ} STZF YYYY/MM/DD-HH:MM:SS
 * @typedef {STZ} variableSTZ STZ/STZF/STZD/STZT/STZTF
 */
/**
 * @param {{
 * date: Boolean,
 * seconds: Boolean
 * }} options
 * @returns {variableCTZ}
 */
MAGPIE_DATE.prototype._printSTZ = function _printSTZ(options) {
  const pad = (num) => String(num).padStart(2, "0");
  const dateStr = options?.date
    ? `${this.year}/${pad(this.month)}/${pad(this.day)}-`
    : "";
  const secondStr = options?.seconds ? `:${pad(this.second)}` : "";
  return `${dateStr}${pad(this.hour)}:${pad(this.minute)}${secondStr}Z`;
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
 * @name MAGPIE_METASTATE
 * @desc
 * @typedef {{
 * date: date_data
 * }} metastate_data
 *
 */
//========================================================================
// #region - METASTATE
//========================================================================
MAGPIE_METASTATE.meta = {
  name: MAGPIE.meta.name + " Metastate",
  firmwareName: "MAGPIE_METASTATE",
};
/**
 * @name
 * @desc
 *
 */
//------------------------------------------------------------------------
// #region > proto
//------------------------------------------------------------------------
/**
 *
 * @param {metastate_data} data
 */
MAGPIE_METASTATE.prototype.initialize = function initializeMetastate(data) {
  this._firmware = MAGPIE_METASTATE.meta.firmwareName;
  const stamp = MAGPIE_SYSTEM.Utility.epoch();
  this.meta = {
    isSystem: true,
    isMetastate: true,
    name: MAGPIE_METASTATE.meta.name,
    desc: "Metadata of the 'game-verse' (game universe)",
    version: MAGPIE.meta.version,
    firmwareName: MAGPIE_METASTATE.meta.firmwareName,
    created: stamp,
    updated: stamp,
  };
  this.date = new MAGPIE_DATE(data?.date);
  this.hive = new Map();
  if (!data?.contents) data.contents = {};
  /** @type {metastate_contents} */
  this.contents = data.contents;
  this.setup();
};
MAGPIE_METASTATE.prototype.setup = async function setup() {
  const ePrefix = "[METASTATE].setup: ";
  try {
    const version = MAGPIE_SYSTEM.Utility.version(this.meta.version);
    const firmwareDate = this.meta.firmwareDate;
    const date = this.date.printDate();
    const stamp = `[v${version} ${firmwareDate}] ` + `[metadate: ${date}]`;
    MAGPIE_SYSTEM.log(ePrefix + stamp);
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
// #region > refresh
//------------------------------------------------------------------------
/**
 *
 * @param {Number} layerID
 * @returns {Promise<Boolean>}
 */
MAGPIE_METASTATE.prototype.refresh = function refresh(layerID, switchID) {
  const ePrefix = "[METASTATE].refresh: ";
  try {
    if (switchID === 2) {
      this.date.TICK();
      this._socketEmit();
    }
    this.meta.updated = Date.now();
    return true;
  } catch (e) {
    MAGPIE_SYSTEM.error(ePrefix + e.message, e);
    return false;
  }
};
/**
 * @name
 * @desc
 *
 */
//------------------------------------------------------------------------
// #region > TICK
//------------------------------------------------------------------------
MAGPIE_METASTATE.prototype.TICK_base = async function TICK_base(
  layerID,
  switchID,
) {
  //
};
MAGPIE_METASTATE._TICK_base = MAGPIE_METASTATE.prototype.TICK_base;
MAGPIE_METASTATE.prototype.TICK_game = async function TICK_game() {
  //
};
MAGPIE_METASTATE.prototype.TICK_standard = async function TICK_standard() {
  //
};
MAGPIE_METASTATE.prototype.TICK_super = async function TICK_super() {
  //
};
MAGPIE_METASTATE.prototype.TICK_mega = async function TICK_mega() {
  //
};
MAGPIE_METASTATE.prototype.TICK_ultra = async function TICK_ultra() {
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
// #region > Utility
//------------------------------------------------------------------------
/**
 * @param {String} method
 * @param {[]} arguments
 * @returns {*}
 */
MAGPIE_METASTATE.__get = function (method, arguments) {
  //
};
/**
 * @param {String} method
 * @param {[]} arguments
 * @returns {Promise<*>}
 */
MAGPIE_METASTATE.__set = async function (method, arguments) {
  //
};
/**
 * @param {String} method
 * @param {[]} arguments
 * @returns {*}
 */
MAGPIE_METASTATE.__setSync = async function (method, arguments) {
  //
};
/**
 * @returns {Promise<database_result>}
 */
MAGPIE_METASTATE.prototype.set = async function saveMetastate() {
  const ePrefix = "[METASTATE].save: ";
  try {
    const result = await MAGPIE_METASTATE.__set("saveMetastate", [this]);
    if (!result) throw new Error("unable to save. ");
    return result;
  } catch (e) {
    MAGPIE_SYSTEM.error(ePrefix + e.message, e);
    return false;
  }
};
/**
 * @returns {database_result}
 */
MAGPIE_METASTATE.prototype.setSync = function saveMetastateSync() {
  const ePrefix = "[METASTATE].save: ";
  try {
    const result = MAGPIE_METASTATE.__setSync("saveMetastate", [this]);
    if (!result) throw new Error("unable to save. ");
    return result;
  } catch (e) {
    MAGPIE_SYSTEM.error(ePrefix + e.message, e);
    return false;
  }
};
MAGPIE_METASTATE.prototype.syncDate = function syncDate() {
  const now = new Date();
  const date = this.date;
  date.year = now.getUTCFullYear();
  date.month = now.getUTCMonth() + 1;
  date.day = now.getUTCDate();
  date.hour = now.getUTCHours();
  date.minute = now.getUTCMinutes();
  date.second = now.getUTCSeconds();
  date.weekDay = now.getUTCDay();
  date._yearday = NaN;
  date._yearday = date.yearday();
  return date.printDate();
};
MAGPIE_METASTATE.prototype._socketEmit = function _socketEmit() {
  //
};
MAGPIE_METASTATE._socketEmit = {};
// #endregion
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
module.exports = {
  MAGPIE_SYSTEM,
  MAGPIE_IO,
  MAGPIE_LOG,
  MAGPIE_RUNTIME,
  MAGPIE_HIVE,
  MAGPIE_METASTATE,
  MAGPIE_CALENDAR,
  MAGPIE_DATE,
  MAGPIE_LOADBAR,
};
/**
 *
 * @desc back to {@link }
 *
 */
//========================================================================
// END OF FILE
//========================================================================
