/**
 * @name C.L.I.E.N.T.
 * @desc client terminal
 * @desc connects to:
 * - [account](../../handlers/account.js)
 */
//========================================================================
// #region - INDEX
//========================================================================
const client = {};
/**
 * @namespace MAGPIE_CLI
 * @author Matheraptor
 * @version 0.32.0
 *
 */
const MAGPIE_CLI = {};
/**
 *
 * @desc back to {@link }
 *
 */
//========================================================================
// #endregion -
//========================================================================

MAGPIE_CLI.meta = {
  name: "M.A.G.P.I.E. C.L.I.E.N.T",
  desc: "",
  version: "0.32.0",
};
const MAGPIE = {};
/**
 * @name
 * @desc
 *
 */
//========================================================================
// #region - TUI
//========================================================================
/**
 * @name
 * @desc
 *
 */
//------------------------------------------------------------------------
// #region > Basic
//------------------------------------------------------------------------
const cliInput = document.getElementById("cli-input");
/**
 *
 * @param {String} text
 * @param {String} type
 * @param {Number} delay
 * @returns
 */
async function printLine(text, type = "info", delay = 50) {
  const output = document.getElementById("terminal-output");
  const line = document.createElement("div");
  line.className = `line ${type}`;
  line.innerText = text;
  output.appendChild(line);
  output.scrollTop = output.scrollHeight;
  return new Promise((res) => setTimeout(res, delay));
}
function clearTerminal() {
  const output = document.getElementById("terminal-output");
  output.innerHTML = "";
}

function displayPrompt() {
  const user = MAGPIE_CLI?.activeUser ? MAGPIE_CLI?.activeUser : "unknown-user";
  const moduleName =
    MAGPIE_CLI.activeModule && MAGPIE_CLI.activeModule.name !== "root"
      ? MAGPIE_CLI.activeModule.name.toUpperCase()
      : "ROOT";
  const mode =
    MAGPIE_CLI.activeModule && MAGPIE_CLI.activeModule.mode === "input"
      ? "[INPUT]"
      : "";
  return `${user}@${moduleName}:${mode}>`;
}

function updatePromptUI() {
  const promptEl = document.querySelector(".prompt");
  if (promptEl) promptEl.innerText = displayPrompt();
}
// #endregion
//------------------------------------------------------------------------
/**
 * @name
 * @desc
 *
 */
//------------------------------------------------------------------------
// #region > Security
//------------------------------------------------------------------------
function switchInputMode(options) {
  cliInput.value = "";
  cliInput.type = options?.type;
}
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
// #region - KEY
//========================================================================
MAGPIE_CLI.UI = {};
MAGPIE_CLI.UI.SEPARATOR = "--------------------------------------------------";
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
// #region - SOCKET
//========================================================================
function disconnectSocket() {
  if (MAGPIE_CLI.socket) {
    MAGPIE_CLI.socket.disconnect();
    MAGPIE_CLI.socket = null;
    console.log("[SYSTEM] Socket disconnected.");
  }
}
function initSocket() {
  disconnectSocket();
  const token = localStorage.getItem("jwt_token");
  console.log(`[SYSTEM] Initializing socket. Token found: ${!!token}`);
  MAGPIE_CLI.socket = io({
    auth: {
      token: token,
    },
  });
  MAGPIE_CLI.socket.on("boot", async (data) => {
    MAGPIE.KEY = data;
    const message = "[SYSTEM] core initialized.";
    console.log(message);
    await printLine(message);
  });
  MAGPIE_CLI.socket.on("PROBE_USERNAME_ERROR", async (data) => {
    //@todo probe username error
  });
  MAGPIE_CLI.socket.on("REGISTER_SUCCESS", async (data) => {
    await printLine(
      `Registration successful. Welcome, ${data.username}!`,
      "success",
    );
    await printLine("Please, 'login' to continue.", "info");
    await MAGPIE_CLI.switchModule("account");
  });
  MAGPIE_CLI.socket.on("REGISTER_ERROR", async (data) => {
    await printLine(`Registration failed: ${data.message}`, "error");
  });
  MAGPIE_CLI.socket.on("LOGIN_SUCCESS", async (data) => {
    await printLine(
      `Login successful. Welcome back, ${data.username}!`,
      "success",
    );
    localStorage.setItem("jwt_token", data.token);
    MAGPIE_CLI.activeUser = data.username;
    initSocket();
    MAGPIE_CLI.resetModule();
    await MAGPIE_CLI.switchModule("root");
  });
  MAGPIE_CLI.socket.on("LOGIN_ERROR", async (data) => {
    await printLine(`Login failed: ${data.message}`, "error");
    MAGPIE_CLI.resetModule();
    await MAGPIE_CLI.switchModule("account");
  });
  MAGPIE_CLI.socket.on("connect_error", async () => {
    await printLine("Connection error. Server may be offline.", "error");
  });
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
 * @name
 * @desc
 *
 */
//========================================================================
// #region - MODULES
//========================================================================
/**
 * @name
 * @desc
 * @typedef {{
 * name: String,
 * mode: String,
 * step: String,
 * tempData: Object,
 * renderUI: () => {}
 * onEnter: () => {},
 * commands: {},
 * stepHandlers: {},
 * handleInput: (rawInput: String) => {}
 * }} cli_module
 */
//------------------------------------------------------------------------
// #region > Handling
//------------------------------------------------------------------------
MAGPIE_CLI.modules = {};
MAGPIE_CLI.modules.meta = {
  name: `${MAGPIE_CLI.meta.name} modules`,
};
MAGPIE_CLI.activeModule = null;

MAGPIE_CLI.switchModule = async (moduleName) => {
  console.log(`[DEBUG] Switching module to: ${moduleName}`);
  const screen = document.getElementById("crt-screen");
  if (MAGPIE_CLI.activeModule && MAGPIE_CLI.activeModule.onExit)
    await MAGPIE_CLI.activeModule.onExit();

  if (MAGPIE_CLI.modules[moduleName]) {
    MAGPIE_CLI.activeModule = MAGPIE_CLI.modules[moduleName];

    // Update container class for layout changes
    clearTerminal();
    screen.className = `module-${moduleName}`;
    updatePromptUI();

    if (MAGPIE_CLI.activeModule.onEnter)
      await MAGPIE_CLI.activeModule.onEnter();
  } else
    await printLine(
      `[System Error] Module '${moduleName}' not found.`,
      "error",
    );
};
MAGPIE_CLI.modules.handleInput = async function (rawInput) {
  const module = this;
  if (module.mode === "command" || !module.mode) {
    const cmd = rawInput.toLowerCase();
    if (cmd === "") return;
    await printLine(`${displayPrompt()} ${rawInput}`, "user", 0);
    if (module.commands && module.commands[cmd]) await module.commands[cmd]();
    else await printLine(`Command not found: ${cmd}`, "error");
  } else {
    await printLine(`${displayPrompt()} [Input Received]`, "user", 0);
    if (module.stepHandlers && module.stepHandlers[module.step])
      await module.stepHandlers[module.step](rawInput, module);
    else
      await printLine(
        `[System Error] No handler configured for ${module.step}`,
        "error",
      );
  }
};
MAGPIE_CLI.resetModule = function resetModule() {
  MAGPIE_CLI.modules.account.mode = "command";
  MAGPIE_CLI.modules.account.step = null;
};
// #endregion
//------------------------------------------------------------------------
/**
 * @name
 * @desc
 *
 */
//------------------------------------------------------------------------
// #region > Root
//------------------------------------------------------------------------
MAGPIE_CLI.modules.root = {
  name: "root",
  onEnter: async () => {},
  commands: {
    help: async () => {
      await printLine("Available Commands:", "info");
      await printLine("  - help       : Display this menu", "info");
      await printLine("  - clear      : clears the terminal screen", "info");
      await printLine("  - account   	: go to account management", "info");
      await printLine(
        "  - status     : check server connection status",
        "info",
      );
      await printLine("  - exit       : return to main landing page", "info");
    },
    clear: async () => {
      clearTerminal();
      await printLine(`${displayPrompt()}`, "user", 0);
    },
    status: async () => {
      await printLine("Connecting to MAGPIE_Server...", "info");
      // @todo CLI socket check
      await printLine("STATUS: ONLINE", "success");
      await printLine("LATENCY: 24ms", "info");
    },
    /**
     * @desc {@link MAGPIE_CLI.modules.account}
     */
    account: async () => {
      await MAGPIE_CLI.switchModule("account");
    },
    exit: () => {
      window.location.href = "/";
    },
  },
  handleInput: MAGPIE_CLI.modules.handleInput,
};
// #endregion
//------------------------------------------------------------------------
/**
 * @name
 * @desc
 *
 */
//------------------------------------------------------------------------
// #region > Account
//------------------------------------------------------------------------
/** @type {cli_module} */
MAGPIE_CLI.modules.account = {
  name: "account",
  mode: "command",
  step: null,
  tempData: {},
  onEnter: async () => {
    await printLine("--- ACCOUNT MANAGEMENT ---", "info");
    await printLine("Available: register, login, back", "info");
  },
  commands: {
    register: async () => {
      MAGPIE_CLI.modules.account.mode = "input";
      MAGPIE_CLI.modules.account.step = "username";
      updatePromptUI();
      await printLine("Please, enter your desired 'username':", "info");
    },
    login: async () => {
      const module = MAGPIE_CLI.modules.account;
      module.mode = "input";
      module.step = "login_email";
      updatePromptUI();
      await printLine("Please, enter your email:", "info");
      switchInputMode({ type: "email" });
    },
    back: async () => {
      await MAGPIE_CLI.switchModule("root");
    },
  },
  /**
   * @desc Object map defining logic for specific input steps.
   * Easy to expand by simply adding new key-value pairs.
   *
   */
  stepHandlers: {
    /** @param {String} input @param {cli_module} module */
    username: async (input, module) => {
      module.tempData.username = input;
      module.step = "password";
      await printLine("Please, enter your desired 'password':", "info");
      switchInputMode({ type: MAGPIE.KEY.HTML.INPUT.TYPE.PASSWORD });
    },
    /** @param {String} input @param {cli_module} module */
    password: async (input, module) => {
      const hash = await module.hashPassword(input);
      const payload = {
        username: module.tempData.username,
        passwordHash: hash,
      };
      switchInputMode({ type: MAGPIE.KEY.HTML.INPUT.TYPE.TEXT });
      MAGPIE_CLI.socket.emit("REGISTER", payload);
      await printLine("Transmitting credentials (placeholder)...", "info");
      module.mode = "command";
      module.step = null;
      module.tempData = {};
      updatePromptUI();
    },
    login_email: async (input, module) => {
      module.tempData.email = input;
      module.step = "login_password";
      await printLine("Please, enter your password:", "info");
      switchInputMode({ type: "password" });
    },
    login_password: async (input, module) => {
      const payload = {
        email: module.tempData.email,
        password: input,
      };
      switchInputMode({ type: "text" });
      MAGPIE_CLI.socket.emit("LOGIN", payload);
      await printLine("Transmitting credentials...", "info");
    },
  },
  handleInput: MAGPIE_CLI.modules.handleInput,
  // /**
  //  * @desc Routes raw input to either a command or a dynamic step handler.
  //  * @param {String} rawInput
  //  * @returns
  //  */
  // handleInput: async (rawInput) =>
  // {
  // 	const module = this; // using 'this' keeps references tidy
  // 	if(module.mode === 'command')
  // 	{
  // 		const cmd = rawInput.toLowerCase()
  // 		if(cmd === "") return
  // 		await printLine(`${displayPrompt()} ${rawInput}`, "user", 0)
  // 		if(module.commands[cmd])
  // 			await module.commands[cmd]()
  // 		else
  // 			await printLine(`Command not found: ${cmd}`, "error")
  // 	}
  // 	else
  // 	{
  // 		// Registration input logic (Placeholder) //@todo registrationInputPlaceholder
  // 		await printLine(`${displayPrompt()} [Input Received]`, "user", 0)
  // 		// Dynamically route to the correct step handler
  // 		if(module.stepHandlers[module.step])
  // 		{
  // 			MAGPIE_CLI.modules.account.tempData.username = rawInput
  // 			MAGPIE_CLI.modules.account.step = "password"
  // 			await printLine("Please, enter your desired 'password':", "info")
  // 		}
  // 		else
  // 		{
  // 			const hash = await MAGPIE_CLI.modules.account.hashPassword(rawInput)
  // 			const payload = {
  // 				username: MAGPIE_CLI.modules.account.tempData.username,
  // 				passwordHash: hash
  // 			}
  // 			MAGPIE_CLI.socket.emit('REGISTER', payload)
  // 			await printLine("Transmitting credentials (placeholder)...", "info")
  // 			//@todo credentialsTransmission

  // 			MAGPIE_CLI.modules.account.mode = "command"
  // 			MAGPIE_CLI.modules.account.step = null
  // 			MAGPIE_CLI.modules.account.tempData = {}
  // 			updatePromptUI();
  // 		}
  // 	}
  // },
  hashPassword: async (password) => {
    const msgUint8 = new TextEncoder().encode(password);
    const hashBuffer = await crypto.subtle.digest("SHA-256", msgUint8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  },
};
// #endregion
//------------------------------------------------------------------------
/**
 *
 * @desc back to {@link MAGPIE_CLI.modules.meta}
 *
 */
//========================================================================
// #endregion - MODULES
//========================================================================
/**
 * @name
 * @desc
 *
 */
//========================================================================
// #region - EVENTS
//========================================================================
cliInput.focus();
cliInput.addEventListener("keydown", async (e) => {
  if (e.key === "Enter") {
    const rawInput = cliInput.value.trim();
    cliInput.value = "";

    if (MAGPIE_CLI.activeModule) {
      await MAGPIE_CLI.activeModule.handleInput(rawInput);
    } else {
      await printLine(
        `[System Error] No active module to handle input.`,
        "error",
      );
    }
  }
});
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
// #region - BOOT
//========================================================================
async function boot() {
  await printLine(`M.A.G.P.I.E. OS v${MAGPIE_CLI.meta.version}`);
  await printLine("Loading kernel modules...", "info", 500);
  // @todo replace the arbitrary delay with delay due to loading the CLI modules
  await printLine("Establishing secure link to MAGPIE_Server...", "info", 500);
  // @todo add a loading spinner here
  // Initialize socket connection
  initSocket();

  await printLine("Link established. Welcome, 'user'.", "success", 2000);
  await printLine(MAGPIE_CLI.UI.SEPARATOR, "info", 2000);

  // Start root module
  await MAGPIE_CLI.switchModule("root");

  await printLine("Type 'help' to see available commands.", "info", 20);
  await printLine(MAGPIE_CLI.UI.SEPARATOR, "info", 10);
}

boot();
/**
 *
 * @desc back to {@link }
 *
 */
//========================================================================
// #endregion -
//========================================================================
