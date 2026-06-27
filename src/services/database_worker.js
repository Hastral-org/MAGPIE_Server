/**
 * @namespace database_worker
 * @author Matheraptor
 * @version 0.39.965
 *
 * @typedef {import("better-sqlite3").RunResult} database_result
 *
 */
const worker = {};
worker.meta = {};
/**
 * @name thread
 * @desc
 *
 */
//========================================================================
// #region - THREAD
//========================================================================
const { MAGPIE } = require("../index");
const { MAGPIE_DATE, MAGPIE_METASTATE, MAGPIE_LOG } = require("../system");
const { MAGPIE_ENTITY } = require("../entity");
const { MAGPIE_PLAYER } = require("../player");
const {
  MAGPIE_KEY,
  MAGPIE_CONTEXT,
  MAGPIE_EXP,
  MAGPIE_SYMBOL,
  MAGPIE_TICKET,
  MAGPIE_STATE,
  MAGPIE_COMPONENT,
  MAGPIE_EMOTE,
} = require("../component");
worker.REGISTRY = {
  MAGPIE_LOG,
  MAGPIE_METASTATE,
  MAGPIE_DATE,
  MAGPIE_ENTITY,
  MAGPIE_PLAYER,
  MAGPIE_KEY,
  MAGPIE_CONTEXT,
  MAGPIE_EXP,
  MAGPIE_TICKET,
  MAGPIE_STATE,
  MAGPIE_SYMBOL,
  MAGPIE_EMOTE,
};
/**
 * @typedef {import("better-sqlite3").Database} Database
 */
const Database = require("better-sqlite3");
const path = require("path");
const worldPath = `${process.cwd()}/db/world.db`;
const serverPath = `${process.cwd()}/db/server.db`;
worker.world = new Database(worldPath);
/**
 * @desc Why this is a "must" for your VM:
 * - Default Mode (DELETE): Every time you write data, SQLite locks
 * the file, waits for the disk, and deletes a journal file. This is
 * slow and can make your Socket.io connection "stutter."
 * - WAL Mode: Writes are appended to a separate -wal file.
 * This allows your app to read and write at the same time, which
 * is much lighter on the CPU and keeps your 150ms latency stable
 * even during heavy database activity.
 */
worker.world.pragma("journal_mode = WAL");
worker.world.pragma("foreign_keys = ON");
worker.world.pragma("cache_size = -64000");
worker.server = new Database(serverPath);
worker.server.pragma("journal_mode = WAL");
worker.server.pragma("foreign_keys = ON");
worker.server.pragma("cache_size = -64000");
//
/**
 * @typedef {import("better-sqlite3").Statement} worker_statement
 * @type {Map<worker_statement, worker_statement>}
 */
worker.statementCache = new Map();
worker.ping = function ping() {
  console.log("[DATABASE WORKER]: 'ping'");
  return "pong";
};

const { parentPort } = require("worker_threads");
parentPort?.on("message", async ({ method, args = [], requestID }) => {
  if (!parentPort) return;
  try {
    if (!worker[method])
      throw new Error(`[DATABASE WORKER].${method} is invalid method`);
    const result = await worker[method](...args);
    parentPort.postMessage({ requestID, result });
  } catch (e) {
    console.error("[DATABASE WORKER ERROR]: ", e);
    parentPort.postMessage({ requestID, error: e.message });
  }
});
worker.close = function close() {
  // console.log("[DATABASE WORKER]: closing database connections...");
  try {
    worker.world.close();
    worker.server.close();
    process.exit(0);
  } catch (e) {
    process.stderr.write(e.message);
    process.exit(1);
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
 * @name low-level
 * @desc
 *
 */
//========================================================================
// #region - LOW
//========================================================================
/**
 *
 * @param {worker_statement} cacheKey
 * @param {worker_statement} sql
 * @param {Database} db
 * @returns {worker_statement}
 */
worker.getStatement = function getStatement(cacheKey, sql, db) {
  let statement = worker.statementCache.get(cacheKey);
  if (!statement) {
    statement = db.prepare(sql);
    worker.statementCache.set(cacheKey, statement);
  }
  return statement;
};
/**
 * @typedef {{}} statement_criteria
 * @param {Array} columns
 * @param {statement_criteria} criteria
 * @returns {worker_statement}
 */
worker.buildWhereClause = function buildWhereClause(columns, criteria) {
  if (!columns || columns.length === 0) return "";
  const clauses = columns.map((col) => {
    const entry = criteria[col];
    const operator =
      entry && typeof entry === "object" && entry.op ? entry.op : "=";
    return `${col} ${operator} ?`;
  });
  return ` WHERE ${clauses.join(" AND ")}`;
};
/**
 *
 * @param {Object} data
 * @returns {{values: String, columns: String[]}}
 */
worker.rowSetter = function rowSetter(data) {
  const columns = Object.keys(data);
  const values = worker._serializeValues(columns, data);
  return { values, columns };
};
worker._serializeValues = function _serializeValues(columns, data) {
  return columns.map((col) => {
    const val = data[col];
    return val && typeof val === "object"
      ? JSON.stringify(val, this.replacer)
      : val;
  });
};
/**
 *
 * @param {*} key
 * @param {*} value
 * @returns {*}
 */
worker.replacer = function replacer(key, value) {
  const type = Object.prototype.toString.call(value);
  if (type === "[object Float64Array]")
    return { _firmware: "Float64Array", data: Array.from(value) };
  if (type === "[object Map]")
    return { _firmware: "Map", data: Array.from(value.entries()) };
  return value;
};
/**
 *
 * @param {*} key JSON.parse reviver key
 * @param {*} value JSON.parse reviver value
 * @returns {*} processed value
 */
worker.reviver = function reviver(key, value) {
  if (value === null || typeof value !== "object") return value;
  const typeTag = value["_firmware"];
  if (!typeTag) return value;
  if (typeTag === "Float64Array") return new Float64Array(value.data);
  if (typeTag === "Map") return new Map(value.data);
  const ctor = worker.REGISTRY[typeTag];
  if (ctor) Object.setPrototypeOf(value, ctor.prototype);
  return value;
};
/**
 *
 * @desc back to {@link }
 *
 */
//========================================================================
// #endregion - LOW
//========================================================================
/**
 * @name I/O
 * @desc
 *
 */
//========================================================================
// #region - I/O
//========================================================================
/**
 * @name Get
 * @desc
 *
 */
//------------------------------------------------------------------------
// #region > Get
//------------------------------------------------------------------------
/**
 * @desc you can pass either a Direct Value (for strict equality)
 * or an Operator Object.
 * Operators Supported:
 * - `=` (Default)
 * - `>` (Greater than)
 * - `<` (Less than)
 * - `>=` / `<=` (Greater/Less or equal)
 * - `!=` (Not equal)
 * - `LIKE` (Pattern matching, use `%` in value)
 * @example using `%` in criteria:
 * |Criteria Object|What it finds|
 * |---|---|
 * |`{ name: { op: 'LIKE', val: 'Mag%' } }`|*Names starting with "Mag" (e.g., Magpie, Magnet)*|
 * |`{ name: { op: 'LIKE', val: '%pie' } }`|*Names ending with "pie" (e.g., Magpie, Applepie)*|
 * |`{ name: { op: 'LIKE', val: '%gpi%' } }`|*Names containing "gpi" anywhere*|
 * ```js
 *
 * ```
 * Usage Examples
 *
 * |Intent|criteria Object|Generated SQL Snippet|
 * |---|---|---|
 * |*Find by ID*|`{ ID: 101 }`|`WHERE ID = 101`|
 * |*Filter by Type*|`{ type: 'GUEST' }`|`WHERE type = 'GUEST'`|
 * |*Multiple Filters*|`{ type: 'GUEST', mapId: 5 }`|`WHERE type = 'GUEST' AND mapId = 5`|
 * |*Get Everything*|`{}` *(Empty Object)*|*(No `WHERE` clause)*|
 * |*operators*|`{key : {op: OP, val: VALUE}}`|`WHERE key op val`|
 * ```js
 *
 * ```
 * @tip When using LIKE,
 * remember that SQLite is case-insensitive for ASCII characters by default
 * (e.g., 'mag%' will find "Magpie").
 *
 * @param {String} tableName
 * @param {Object} criteria
 * @param {Database} db
 * @returns {database_result}
 */
worker.getRow = function getRow(tableName, criteria = {}, db) {
  const columns = Object.keys(criteria).sort();
  const whereClause = this.buildWhereClause(columns, criteria);
  const sql = `SELECT * from ${tableName} ${whereClause}`;
  const statement = this.getStatement(
    `GET:${tableName}:${whereClause}`,
    sql,
    db,
  );
  const values = columns.map((col) => {
    const entry = criteria[col];
    const rawValue = entry && entry.op !== undefined ? entry.val : entry;
    if (typeof rawValue === "number" && Number.isInteger(rawValue))
      return Math.floor(rawValue);
    return rawValue;
  });
  const result = statement.all(...values);
  return result;
};
// #endregion
//------------------------------------------------------------------------
/**
 * @name delete
 * @desc
 *
 */
//------------------------------------------------------------------------
// #region > Delete
//------------------------------------------------------------------------
/**
 *
 * @param {String} tableName
 * @param {statement_criteria} criteria
 * @param {Database} db
 * @returns {database_result}
 */
worker.deleteRow = function deleteRow(tableName, criteria, db) {
  const columns = Object.keys(criteria);
  const cacheKey = `DELETE:${tableName}:${columns.join(",")}`;
  const cache = worker.statementCache;
  /** @type {worker_statement} */
  let statement = cache.get(cacheKey);
  if (!statement) {
    const whereClause = columns.map((col) => `${col} = ?`).join(" AND ");
    const sql = `DELETE FROM ${tableName} WHERE ${whereClause}`;
    statement = db.prepare(sql);
    cache.set(cacheKey, statement);
  }
  const values = Object.values(criteria);
  const info = statement.run(...values);
  return info;
};
// #endregion
//------------------------------------------------------------------------
/**
 * @name Set
 * @desc
 *
 */
//------------------------------------------------------------------------
// #region > Set
//------------------------------------------------------------------------
/**
 *
 * @param {String} tableName
 * @param {Object[]} values
 * @param {String[]} columns
 * @param {Database} db
 * @returns {database_result}
 */
worker.setRow = function setRow(tableName, values, columns, db) {
  const columnNames = columns.join(", ");
  const placeholders = columns.map(() => "?").join(", ");
  const sql =
    `INSERT OR REPLACE INTO ${tableName} (${columnNames})` +
    ` VALUES (${placeholders})`;
  const cacheKey = `SAVE:${tableName}:${columns.join(",")}`;
  const statement = worker.getStatement(cacheKey, sql, db);
  const result = statement.run(...values);
  if (!result)
    throw new Error(`${tableName}, ${values}, ${columns}, ${db.name}`);
  return result;
};
// #endregion
//------------------------------------------------------------------------
/**
 * @name Table
 * @desc
 *
 */
//------------------------------------------------------------------------
// #region > Table
//------------------------------------------------------------------------
/**
 *
 * @param {String} tableName
 * @param {Object} schema
 * @param {Database} db
 * @returns {database_result}
 *
 * @version 0.20.7
 * - ADDED: "PRIMARY KEY" check to add " WITHOUT ROWID" as per
 * [sqlite3_architecture](../../\HASTRAL\03_MEMORY\wiki\topics\operations\memory\sqlite3_architecture.md)
 */
worker.createTable = function createTable(tableName, schema, db) {
  try {
    const noRowID = schema["PRIMARY KEY"] ? " WITHOUT ROWID" : "";
    const columnDefinitions = Object.entries(schema).map(([name, type]) => {
      return `${name.includes("fk") ? "" : name} ${type}`;
    });
    const query = `CREATE TABLE IF NOT EXISTS ${tableName} (
			${columnDefinitions.join(", ")}
		)${noRowID}`;
    const result = db.prepare(query).run();
    if (!result) throw new Error(`${result} is invalid result`);
    return result;
  } catch (e) {
    console.error(e);
    throw e;
  }
};
/**
 *
 * @param {String} tableName
 * @param {Database} db
 * @returns {database_result}
 */
worker.dropTable = function dropTable(tableName, db) {
  return db.prepare(`DROP TABLE IF EXISTS ${tableName}`).run();
};
/**
 *
 * @param {String} tableName
 * @param {String} columnName
 * @param {String} type
 * @param {Database} db
 * @returns {database_result}
 */
worker.addColumnToTable = function addColumnToTable(
  tableName,
  columnName,
  type,
  db,
) {
  return db
    .prepare(`ALTER TABLE ${tableName} ADD COLUMN ${columnName} ${type}`)
    .run();
};
/**
 *
 * @param {String} tableName
 * @param {String} columnName
 * @param {Database} db
 */
worker.dropColumnTable = function dropColumnTable(tableName, columnName, db) {
  return db.prepare(`ALTER TABLE ${tableName} DROP COLUMN ${columnName}`).run();
};
// #endregion
//------------------------------------------------------------------------
/**
 * @name transaction
 * @desc
 *
 */
//------------------------------------------------------------------------
// #region > Trans.
//------------------------------------------------------------------------
/**
 *
 * @param {Database} db
 * @param {Function} callback
 * @returns {import("better-sqlite3").Transaction}
 */
worker.makeTransaction = function makeTransaction(db, callback) {
  const transaction = db.transaction((...args) => {
    return callback(...args);
  });
  return transaction();
};
/**
 *
 * @param {String} tableName
 * @param {Array[]} rows
 * @param {String[]} columns
 * @param {Database} db
 * @returns {import("better-sqlite3").Transaction}
 */
worker.setRowTransaction = function setRowTransaction(
  tableName,
  rows,
  columns,
  db,
) {
  return this.makeTransaction(db, () => {
    const columnNames = columns.join(", ");
    const placeholders = columns.map(() => "?").join(", ");
    const sql =
      `INSERT OR REPLACE INTO ${tableName} (${columnNames})` +
      ` VALUES (${placeholders})`;
    const cacheKey = `SAVE:${tableName}:${columns.join(",")}`;
    const statement = worker.getStatement(cacheKey, sql, db);
    for (const values of rows) {
      statement.run(...values);
    }
  });
};
worker.saveEntities = function saveEntities(payloads) {
  return this.makeTransaction(this.world, () => {
    for (const payload of payloads) {
      const { values, columns } = this.rowSetter(payload);
      this.setRow("MAGPIE_ENTITY", values, columns, this.world);
    }
    return true;
  });
};
/**
 *
 * @param {String} tableName
 * @param {Array[]} rows
 * @param {String[]} columns
 */
worker.setWorldRowTransaction = function setWorldRowTransaction(
  tableName,
  rows,
  columns,
) {
  return this.setRowTransaction(tableName, rows, columns, this.world);
};
worker.setServerRowTransaction = function setServerRowTransaction(
  tableName,
  rows,
  columns,
) {
  return this.setRowTransaction(tableName, rows, columns, this.server);
};
worker.saveBuffers = function saveBuffers(buffers) {
  try {
    return worker.makeTransaction(worker.world, () => {
      const results = [];
      buffers.forEach((buffer) => {
        const payloads = buffer[1];
        const table = buffer[0];
        // console.log(table)
        payloads.forEach((payload) => {
          const result = worker.saveWorldRow(table, payload);
          results.push(result);
          // console.log(result)
        });
      });
      return results;
    });
  } catch (e) {
    console.error(e);
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
 * @name Wrappers
 * @desc
 *
 */
//========================================================================
// #region - Wrappers
//========================================================================
/**
 * @desc helper function for "inserting" data.
 * we’ll build an Auto-Inserter.
 * The tricky part with SQL is that the number of ? placeholders
 * must exactly match the number of columns you are sending.
 * This function will automatically generate the INSERT INTO...
 * string based on whatever object you pass it.
 * @sister of {@link MAGPIE_DATABASE.loadRow} and {@link MAGPIE_DATABASE.getRow}
 * @param {String} tableName - The table to save into.
 * @param {object} data - The object containing the row data.
 * @param {Database} db
 * @returns {Promise<database_result>}
 */
worker.saveRow = function saveRow(tableName, data, db) {
  return this.saveRowSync(tableName, data, db);
};
/**
 *
 * @param {String} tableName
 * @param {Object} data
 * @param {Database} db
 * @returns {database_result}
 */
worker.saveRowSync = function saveRowSync(tableName, data, db) {
  const ePrefix = "[DATABASE WORKER] ";
  try {
    const { values, columns } = this.rowSetter(data);
    const save = this.setRow(tableName, values, columns, db);
    if (!save) throw new Error("unable to save row. ");
    return save;
  } catch (e) {
    console.error(ePrefix + e.message, e);
  }
};
/**
 *
 * @param {String} tableName
 * @param {Object} criteria
 * @param {Database} db
 * @returns {database_payload}
 */
worker.loadRow = function loadRow(tableName, criteria, db) {
  const results = worker.getRow(tableName, criteria, db);
  return this.resultsLoader(results);
};
/**
 * @typedef {Object[]} database_payload
 * @param {database_result} results
 * @returns {database_payload}
 */
worker.resultsLoader = function resultsLoader(results) {
  if (!results || results.length < 1) return [];
  return results.map((row) => JSON.parse(row.data, this.reviver));
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
 * @name Seams
 * @desc
 *
 */
//========================================================================
// #region - Seams
//========================================================================
/**
 *
 * @param {String} tableName
 * @param {database_payload} payload
 * @returns {database_result}
 */
worker.saveWorldRow = function saveWorldRow(tableName, payload) {
  return this.saveRowSync(tableName, payload, worker.world);
};
/**
 *
 * @param {String} tableName
 * @param {database_payload} payload
 * @returns {database_result}
 */
worker.saveServerRow = function saveServerRow(tableName, payload) {
  return this.saveRowSync(tableName, payload, worker.server);
};
/**
 *
 * @param {String} tableName
 * @param {statement_criteria} criteria
 * @returns {Object}
 */
worker.loadWorldRow = function loadWorldRow(tableName, criteria) {
  return this.loadRow(tableName, criteria, worker.world)[0];
};
/**
 *
 * @param {String} tableName
 * @param {statement_criteria} criteria
 * @returns {Object}
 */
worker.loadServerRow = function loadServerRow(tableName, criteria) {
  return this.loadRow(tableName, criteria, worker.server)[0];
};
/**
 *
 * @param {String} tableName
 * @param {statement_criteria} criteria
 * @returns {database_result}
 */
worker.deleteWorldRow = function deleteWorldRow(tableName, criteria) {
  return this.deleteRow(tableName, criteria, this.world);
};
/**
 *
 * @param {String} tableName
 * @param {statement_criteria} criteria
 * @returns {database_result}
 */
worker.deleteServerRow = function deleteServerRow(tableName, criteria) {
  return this.deleteRow(tableName, criteria, this.server);
};
/**
 *
 * @param {String} tableName
 * @param {Object} schema
 * @returns {database_result}
 */
worker.createWorldTable = function createWorldTable(tableName, schema) {
  return this.createTable(tableName, schema, this.world);
};
/**
 *
 * @param {String} tableName
 * @param {Object} schema
 * @returns {database_result}
 */
worker.createServerTable = function createServerTable(tableName, schema) {
  return this.createTable(tableName, schema, this.server);
};
/**
 *
 * @param {Number} primaryKeyValue
 * @param {String} primaryKeyName
 * @param {String} foreignKeyName
 * @param {String} relationTable
 * @param {String} targetTable
 *
 * @returns {database_payload}
 */
worker.getWorldRelatedRows = function getWorldRelatedRows(
  primaryKeyValue,
  primaryKeyName,
  foreignKeyName,
  relationTable,
  targetTable,
) {
  const sql = `SELECT target.* FROM ${targetTable} target
		JOIN ${relationTable} rel ON target.ID = rel.${foreignKeyName}
		WHERE rel.${primaryKeyName} = ?`;
  const results = worker.world.prepare(sql).all(primaryKeyValue);
  if (results.length > 0) return this.resultsLoader(results);
};
/**
 *
 * @desc back to {@link }
 *
 */
//========================================================================
// #endregion -
//========================================================================
module.exports = worker;
/**
 *
 * @desc back to {@link }
 *
 */
//========================================================================
// END OF FILE
//========================================================================
