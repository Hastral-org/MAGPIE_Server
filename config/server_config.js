/**
 * @version 0.39.92
 *
 * @desc [env](../.env)
 */
const env = "";
module.exports = {
  PORT: process.env.PORT,
  jwtSecret: process.env.jwtSecret,
  jwtExpire: "15d",
  domain: process.env.domain,
  project_id: process.env.project_id,
  instance_name: process.env.instance_name,
  instance_ip: process.env.instance_ip,
  instance_zone: process.env.instance_zone,
  devMode: JSON.parse(process.env.devMode),
  production: JSON.parse(process.env.isProduction),
  NODE_ENV: process.env.isProduction ? true : false,
  sendGrid_API: process.env.sendGrid_API,
  core_path: "./src/",
  EMAIL_MASTER_KEY: process.env.EMAIL_MASTER_KEY,
  HASH_SALT: process.env.HASH_SALT,
  /** @desc utility repository path */
  repo: process.env.repo,
  socket_io_admin_pass: process.env.PASS_HASH,
  RUNTIME_DELTA: process.env.RUNTIME_DELTA.split(",").map(Number),
};
