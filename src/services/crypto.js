const { MAGPIE } = require("../index");
const crypto = require("crypto");
const EMAIL_KEY = MAGPIE.KEY.SERVER.EMAIL_MASTER_KEY;
const HASH_SALT = MAGPIE.KEY.SERVER.HASH_SALT;
/**
 * @typedef {String} email
 * @typedef {String} encryptedBlob iv:authTag:encryptedData
 * @typedef {encryptedBlob} email_encrypted
 * @typedef {String} hmacDigest HMAC-SHA256 digest
 * @typedef {hmacDigest} email_hashed
 */
const EmailSecurity = {
  /**
   * @audit-ok [EmailSecuriry] Keep them synchronous. They are high-performance,
   * low-latency operations that do not risk blocking your server.
   * @desc Creates a deterministic hash for database lookups.
   * Use this for: SELECT * FROM users WHERE email_hash = ?
   * @param {email} email
   * @returns {email_hashed}
   */
  hashEmail: (email) => {
    console.log(`[DEBUG] using HASH_SALT: ${HASH_SALT}`);
    const result = crypto
      .createHmac("sha256", HASH_SALT)
      .update(email.toLowerCase().trim())
      .digest("hex");
    console.log(
      `[DEBUG] [CRYPTO] [hashEmail] input: '${email} => result: ${result}`,
    );
    return result;
  },
  /**
   * @desc Encrypts email for storage.
   * @param {email} email
   * @returns {email_encrypted}
   */
  encryptEmail: (email) => {
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv("aes-256-gcm", EMAIL_KEY, iv);
    let encrypted = cipher.update(email, "utf-8", "hex");
    encrypted += cipher.final("hex");
    const authTag = cipher.getAuthTag().toString("hex");
    return `${iv.toString("hex")}:${authTag}:${encrypted}`;
  },
  /**
   *
   * @param {email_encrypted} encryptedBlob
   * @returns {email}
   */
  decryptEmail: (encryptedBlob) => {
    const [ivHex, authTagHex, encryptedData] = encryptedBlob.split(":");
    const iv = Buffer.from(ivHex, "hex");
    const authTag = Buffer.from(authTagHex, "hex");
    const decipher = crypto.createDecipheriv("aes-256-gcm", EMAIL_KEY, iv);
    decipher.setAuthTag(authTag);
    let decrypted = decipher.update(encryptedData, "hex", "utf-8");
    decrypted += decipher.final("utf-8");
    return decrypted;
  },
};
/**
 *
 * @param {Number} bytes
 * @param {String} base ["hex", "base64"]
 * @returns {String}
 */
function hashKey(bytes = 32, base = "hex") {
  return crypto.randomBytes(bytes).toString(base);
}
/**
 * @audit-ok [crypto.hashPassword] hashPassword uses crypto.scrypt,
 * which is a computationally expensive "slow" hash designed
 * to thwart brute-force attacks. Because it is CPU-intensive,
 * Node.js provides an asynchronous version to avoid blocking the Event Loop.
 * @desc Utility to hash passwords using native Node.js scrypt.
 * @param {string} password - The password to hash.
 * @returns {Promise<string>} - The hashed password with salt (format: salt:hash).
 */
async function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = await new Promise((resolve, reject) => {
    crypto.scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) reject(err);
      resolve(derivedKey.toString("hex"));
    });
  });
  return `${salt}:${hash}`;
}

/**
 * Utility to verify a password against a stored hash.
 * @param {string} password - The password to verify.
 * @param {string} storedHash - The stored salt:hash string.
 * @returns {Promise<boolean>} - True if match, false otherwise.
 */
async function verifyPassword(password, storedHash) {
  const [salt, hash] = storedHash.split(":");
  const derivedKey = await new Promise((resolve, reject) => {
    crypto.scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) reject(err);
      resolve(derivedKey);
    });
  });
  const storedKey = Buffer.from(hash, "hex");
  if (derivedKey.length !== storedKey.length) return false;
  return crypto.timingSafeEqual(derivedKey, storedKey);
}

module.exports = {
  hashPassword,
  verifyPassword,
  EmailSecurity,
};
