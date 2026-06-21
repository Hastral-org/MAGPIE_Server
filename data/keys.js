/**
 * @name keys
 * @version 0.39.94
 *
 * @typedef {import("../src/component").keyID} keyID
 * @typedef {import("../src/component").key_type} key_type
 * @typedef {import("../src/component").key_label} key_label
 *
 * @type {Map<key_label, {
 * ID: keyID,
 * name: key_label,
 * desc: String,
 * use_case: String,
 * type: key_type,
 * originID: keyID,
 * compoundID: keyID,
 * }>}
 */
const keys = new Map();
