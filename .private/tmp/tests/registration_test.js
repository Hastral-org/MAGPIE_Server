const { MAGPIE } = require("../../../src/index");
const fetch = global.fetch;
const fs = require("fs");
const ePrefix = "[REGISTRATION TEST] ";
const test = {};
test.log = function (message, level = "log") {
  fs.appendFileSync(`./.private/tmp/tests/test.log`, ePrefix + message);
  const consoleLog = console[level];
  consoleLog(ePrefix + message);
};
test.error = function (error) {
  test.log(ePrefix + error.message, "error");
  console.error(ePrefix + error.message, error);
};
module.exports = async function () {
  const payload = {
    email: "hamedahastral@gmail.com",
    username: "admin",
    password: "administrator",
  };
  test.log(
    `initiating request. Payload:\n` +
      `email: ${payload.email}\n` +
      `username: ${payload.username}\n` +
      `password: ${payload.password}\n`,
  );
  const request = `${MAGPIE.KEY.SERVER.DOMAIN}/account/register`;
  test.log(request);
  const response = await fetch(request, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await response.json();
  test.log("response received:\n " + JSON.stringify(data, null, 2));
};
