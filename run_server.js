const { spawn } = require("child_process");
function startServer() {
  // 1. Capture any debug arguments passed by VS Code (e.g., --inspect)
  const execArgv = process.execArgv;
  // 2. Combine the env flag with the debug flags
  const nodeArgs = ["--env-file=.env", ...execArgv, "SERVER.js"];
  // 3. Spawn the server
  const child = spawn("node", nodeArgs, { stdio: "inherit" });
  child.on("close", (code) => {
    if (code === 2) {
      console.log(
        "\x1b[36m%s\x1b[0m",
        "--- Restart signal received CODE[2]: rebooting MAGPIE... ---",
      );
      startServer();
    } else if (code === 0) {
      console.log(
        "\x1b[32m%s\x1b[0m",
        "--- Server shut down normally CODE[0]. Exiting loop. ---",
      );
      process.exit(0);
    } else {
      console.log(
        "\x1b[31m%s\x1b[0m",
        `--- Server crashed or stopped CODE[${code}]. ---`,
      );
      process.exit(code);
    }
  });
}
startServer();
