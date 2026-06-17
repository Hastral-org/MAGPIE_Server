//========================================================================
// #region - META
//========================================================================
/**
 * @namespace MAGPIE_Server
 * @name index
 * @desc dictionary and switchboard
 * @author Matheraptor
 * @licence GPL-3.0
 * @desc stack:
 * - Node.js
 * - Express
 * - jsonwebtoken
 * - Socket.io
 * - better-sqlite3
 * - repl
 * - cli-spinner
 * - cli-progress
 * @desc primary files:
 * - [SERVER.js](../SERVER.js)
 * - [index.html](../public/index.html)
 * - [account handler](../handlers/account.js)
 * ------------------------------------------------------------------------
 * {@link MAGPIE.meta.desc}
 *
 * @version 0.39.93 2026 06 17
 * - ADDED: Express.routing
 * - FIXED: account.register
 * - FIXED: handler registration
 *
 * @version 0.39.92 2026 06 16
 * - FIXED: account.js /verify-email embeds sensitive data in token
 * - FIXED: account.js account.register called via socket.emit
 * - FIXED: intent of registration is to minimize db calls at the expense of security
 * - FIXED: main.socket not working due to obsolete code
 * - FIXED: main.monitor not working due to obsolete code
 *
 * @version 0.39.9 2026 06 15
 * - TWEAKED: cli.js
 * - TWEAKED: adopted egyptian style and 2-space indentation
 *
 * @version 0.39.7 2026 06 14
 * - ADDED: full dual-layer email security
 * - TWEAKED: import SERVER.js src mods from 0.38.3 @todo deferred rewrite
 * - TWEAKED: metastate nav-status on homepage
 * - FIXED: Hive and metastate handling improperly imported from 0.38.3
 *
 * @version 0.39.5 2026 06 13
 * - TWEAKED: revised docs
 * - TWEAKED: renamed handlers
 *
 * @version 0.39.3 2026 06 12
 * - TWEAKED: documentation
 * - TWEAKED: removed obsolete folders
 * - TWEAKED: server shutdown sequence
 *
 * @version 0.39.1 2026 06 11
 * - full pre-production prototype rewrite
 * - ADDED: spinner
 * - ADDED: loadbar
 * - ADDED: ANSI escape codes
 * - TWEAKED: boot sequence streamlined
 * - TWEAKED: cleaned up redundant logic
 * - TWEAKED: restructured handlers
 * - TWEAKED: restructured services
 *
 * ------------------------------------------------------------------------
 *
 * @version 0.38.6 2026 06 10
 * - TWEAKED: .logs/ => logs/
 * - TWEAKED: boot scripts location and flow
 * - FIXED: exposed public/*_backup.*
 * - FIXED: missing cleanup login in start.sh
 * - FIXED: run_server.sh obsolete and not updated to new flow
 *
 * @version 0.38.2 2026 06 08
 * - ADDED: css regions
 * - FIXED: legacy ShelderEvo won't load at all
 * - FIXED: css legacy entanglement
 * - FIXED: world.db corruption due to invalid row in entity_children
 *
 * @version 0.37.0 2026 06 07
 * - ADDED: ShelderEvo socket session resume
 * - ADDED: ShelderEvo app localStorage
 * - ADDED: ShelderEvo app handoff
 * - ADDED: /Adoption route
 * - TWEAKED: accountHandler
 * - TWEAKED: cli_handler
 * - TWEAKED: css
 * - FIXED: improper registration flow
 * - FIXED: login not routing to boot
 *
 * @version 0.35.0 2026 06 05
 * - ADDED: ShelderEvo client scaffolding
 * - ADDED: client socket handling
 * - ADDED: mailer service
 * - ADDED: ASCII splash and logo
 * - FIXED: accountHandler incomplete logic
 *
 * @version 0.33.0 2026 06 04
 * - ADDED: new custom domain via Cloudflare
 * - ADDED: 2-step registration with email confirmation
 * - ADDED: password recovery
 * - FIXED: socket unable to process protocol
 *
 * @version 0.32.0 2026 06 03
 * - ADDED: player auth phase 1
 * - ADDED: player account phase 1
 * - ADDED: homepage CLI button
 * - ADDED: CLI socket phase 1
 * - ADDED: CLI account phase 1
 * - FIXED: CLI box sizing
 * - FIXED: entity skipping next target
 *
 * @version 0.31.0 2026 06 01
 * - ADDED: ECG phase 1
 * - ADDED: entity.bio phase 1
 * - ADDED: date._printSTZ
 * - ADDED: physics._U_ETE
 * - ADDED: physics._U_printDistance
 * - TWEAKED: entity._target_queue_geodetic
 * - FIXED: seekTarget not using proper rotor physics
 * - FIXED: rotorToEuler
 *
 * @version 0.30.3 2026 05 31
 * - FIXED: context handling
 *
 * @version 0.30.2 2026 05 30
 * - ADDED: exp.waypoint logic and options based on exp.keys and their order
 * - ADDED: physics 2body gravity
 * - ADDED: physics: velocity fwd clamping
 * - ADDED: hive slot conflict check
 * - FIXED: hive context handling
 * - FIXED: hive host/kick
 * - FIXED: hive host bug actually caused by entity *194.type 0
 * - FIXED: Vspeeds improperly indexed
 * - FIXED: exp.targetNext not awaiting key target next
 * - FIXED: physics.getAt not triggering cruising dampener
 * - FIXED: physics.getTt confused logic
 * - FIXED: public telemetry
 *
 * @version 0.26.1 2026 05 28
 * - ADDED: Component.forces
 * - ADDED: Component.processors phase 1
 * - ADDED: Intent vs Locomotion
 * - TWEAKED: entity.seekTarget
 * - FIXED: physics.getTt_axis unable to capture target
 *
 * @version 0.25.0 2026 05 26
 * - ADDED: dedicated runtime dt
 * - FIXED: HIVE dt tied to runtime layer delta
 *
 * @version 0.24.0 2026 05 26
 * - ADDED: Entity.agency scaffolding
 * - TWEAKED: reverted away from db.fts5 due to corruption
 * - FIXED: hive hiccups
 *
 * @version 0.23.6 2026 05 25
 * - ADDED: context handling methods
 * - FIXED: seekTarget orchestration typos and flickering
 * - FIXED: SERVER.BOOT.shutdown hanging on HIVE.save()
 *
 * @version 0.23.1 2026 05 24
 * - ADDED: STATE.FSM_POSTURE
 * - ADDED: HIVE.saveBuffers
 * - ADDED: {@link MAGPIE.KEY.INDEX.ORIENTATION}
 * - ADDED: {@link MAGPIE.KEY.INDEX.VELOCITY}
 * - TWEAKED: URGENCY and GRAVITY incremental
 * - TWEAKED: changing Vstate and Rstate to FSM stateID
 * - FIXED: PHYSICS._getTt_local unable to seek target heading
 * - FIXED: PHYSICS._getTt_local unable to hold target heading
 * - FIXED: HIVE._host_context unreliable layerID
 *
 * @version 0.22.29 2026 05 22
 * - ADDED: HIVE._set_${component} methods
 * - ADDED: SYMBOL._add${element} methods
 * - TWEAKED: entity.onState => .addState
 * - TWEAKED: merged runtime-retrofit branch
 * - TWEAKED: SYMBOL._set aliased to HIVE instead of DATABASE
 * - FIXED: MAGPIE_IO.WORKER not being used
 * - FIXED: MAGPIE_SYSTEM .log & .error updated to use worker
 * - FIXED: emote cascading errors due to invalid passed stamina_index
 *
 * @version 0.22.24 2026 05 20
 * - FIXED: runtime.refresh lagging (being tested)
 * - FIXED: runtime.refresh racing ahead
 * - FIXED: hive.buffers not being used
 *
 * @version 0.22.21 2026 05 19
 * - ADDED: MAGPIE.KEY.INDEX.STAMINA Map<keyID, stamina_index>
 * - ADDED: MAGPIE.KEY.INDEX STAMINA_0 to STAMINA_9 Enumerator<stamina_index>
 * - TWEAKED: entity.addState is now .onState — stateID is fetched from trait
 * - TWEAKED: stamina_index instead of traitIndex, for tracking card played
 *
 * @version 0.22.19 2026 05 18
 * - FIXED: MAGPIE_DATE.weekDay not updating at ultraTICK
 *
 * @version 0.22.18 2026 05 17
 * - ADDED: entity ._trait* basic handling methods
 * - FIXED: typo in entity._get_exps causing cascading errors
 * - FIXED: entity fitness handling and validation
 *
 * @version 0.22.14 2026 05 16
 * - ADDED: server instance background logger
 * - ADDED: Termius SSH ID
 * - ADDED: nGix inverse proxy and npm extension
 * - ADDED: MAGPIE_CONTEXT prototype
 * - TWEAKED: improved RUNTIME.refresh ticking allows for layer-specific frame-count
 * - TWEAKED: wrapped entity exp handling to isolate future improvements
 * - TWEAKED: changing exp array handling from a dynamic/shift-push (O(n)) to static/index_accumulator (O(1))
 * - FIXED: MAGPIE_KEY.setup incorrectly indexing VSpeeds
 * - FIXED: MAGPIE_SYMBOL.getVspeeds incorrectly mapping Vspeeds
 * - FIXED: changing exp handling broke some methods
 * - FIXED: DATABASE key labels
 * - FIXED: RUNTIME ticking
 *
 * @version 0.22.11 2026 05 15
 * - ADDED: DATABASE.pragma cache_size -64000 to mitigate the read flooding
 * - ADDED: DATABASE.helpers for symbol recipes/components
 * - ADDED: MAGPIE.KEYS for requirements, compounds, recipes, components, and stats
 * - ADDED: RUNTIME.refresh clamp catch-up loop to prevent execution spikes if(this._base > 100) this._base = 100;
 * - ADDED: MAGPIE_KEY.setup routine to index the axiom keys
 * - TWEAKED: MAGPIE_SYMBOL.STATS now includes requirements/compounds
 * - TWEAKED: MAGPIE_SYMBOL .requirementID and .compoundID deprecated
 * - TWEAKED: DATABASE.getExpKeys using more efficient sql
 * - FIXED: DATABASE.saveSymbolSync iterating through inexistent symbol's .requirements and .compounds
 * - FIXED: DATABASE.getRow passing floats instead of integers, causing unnecessary read overhead
 * - FIXED: catastrophic bug "return" within for loop in HIVE .tick_buffer and .tick_remote causing subsequent entities in loop to be dropped
 * - FIXED: RUNTIME.refresh while(this._base > 1) race condition
 * - FIXED: RUNTIME.refresh not async preventing safe database execution
 * - FIXED: DATABASE.saveSymbol typo
 * - FIXED: SYMBOL.STATS inconsistent key/value pair
 * - FIXED: MAGPIE.KEY.INDEX.VSPEEDS incorrectly initializing, causing SYMBOL.getVspeeds to fail
 * - FIXED: SERVER.BOOT.shutdown hanging on incorrectly defined async behavior
 *
 * @version 0.22.4 2026 05 14
 * - ADDED: MAGPIE_IO.WORKER for fsio and logging
 * - ADDED: MAGPIE_SYMBOL_fts [FTS5 indexing](../../HASTRAL/03_MEMORY/wiki/better-sqlite3/fts5-search.md)
 * - ADDED: MAGPIE_SYMBOL name search
 * - TWEAKED: MAGPIE_SYMBOL.STATS back to Float64Array key/value pairs
 * - TWEAKED: [HIVE].save() logToConsole: true => false
 * - FIXED: [BOOT].shutdown logPath incorrectly set to err.message
 *
 * @version 0.22.2 2026 05 13
 * - ADDED: basic methods and logic for exp/key manipulation
 * - ADDED: {@link MAGPIE.KEY.EMOTE.INDEX.meta}
 * - ADDED: {@link MAGPIE_SYMBOL.meta}
 * - FIXED: key handling and database calls
 *
 * @version 0.21.11 2026 05 12
 * - ADDED: physics new method .rotorFromFrame and .rotorSlerp
 * - FIXED: physics.clampToGround jittery Og output due to contradicting rotor maths
 * - FIXED: physics.getAt braking magnitude decreasing exponentially resulting in inability to achieve Vspeed 0 in a timely manner
 * - FIXED: physics.getATpR incorrectly calculating Oerror
 * - FIXED: entity.clampToGround incorrectly clamping A and R when it should only be clamping P, O, and V
 *
 * @version 0.21.8 2026 05 11
 * - FIXED: physics.getAt has no cruise tolerance, causing jittering of
 * 	acceleration to constantly match the cruise speed
 * - FIXED: entity.updatePhysics infinite getAt due to no cutoff dV
 * - FIXED: entity.updatePhysics incorrectly applying vector deltas
 * - FIXED: physics._emote_seekTarget incorrectly passing options?.tolerance instead of options
 * - FIXED: runtime refresh incorrectly ticking layers
 * - FIXED: hive refresh incorrectly ticking entities, causing invalid physics updates
 * - FIXED: hive standard layer incorrectly treated as remote
 *
 * @version 0.21.5 2026 05 10
 * - FIXED: a number of typos and logic bugs in entity.refresh, states, and
 * 	emotes related to processing exp
 *
 * @version 0.21.4 2026 05 09
 * - ADDED: hive refresh fully restored
 * - ADDED: hive.move
 * - ADDED: database_worker dropTable and addColumnToTable methods
 * - FIXED: database tables foreign keys not properly setup
 * - FIXED: database tables fields not properly setup
 * - FIXED: SERVER.js handler not type-checking, causing a commented-out playerHandler.js to crash the boot
 * - FIXED: unnecessary "zod" dependency mistakenly added by ESlint
 * - FIXED: playerHandler.js put on stand-by
 *
 * @version 0.20.9 2026 05 08
 * - ADDED: database multi-entity save transaction
 * - FIXED: HIVE kick typo
 * - FIXED: HIVE hosting methods not setup for hybrid direct/remote hosting
 * - FIXED: Entity.setup of dummy slots for layer 0/1 causing errors
 * - FIXED: Entity hive getters invalid methods
 * - FIXED: Entity refresh bugs
 *
 * @version 0.20.8 2026 05 06
 * - ADDED: database_worker.js relations support
 * - ADDED: MAGPIE_EMOTE database fetch methods
 *
 * @version 0.20.7 2026 05 05
 * - ADDED: MAGPIE_EXP, and EXP_KEYS tables to setup
 * - ADDED: relational tables support for database_worker.createTable
 *
 * @version 0.20.6 2026 05 03
 * - TWEAKED: MAGPIE_ENTITY restructured for efficiency
 * - TWEAKED: reviver/replacer "@" swapped for "_firmware"
 * - FIXED: DATABASE prepareEntity not working due to lacking a return
 *
 * @version 0.20.5 2026 05 02
 * - ADDED: METASTATE clock back online
 * - ADDED: ENTITY back online
 * - ADDED: DATABASE, HIVE, and METASTATE back online
 * - FIXED: RUNTIME unable to complete loop
 *
 * @version 0.20.2 2026 04 30
 * - ADDED: MAGPIE_RUNTIME._memoryUsage() method
 * - FIXED: REPL.start({terminal: true}) might be causing memory leaks
 * - FIXED: invalid 0.19.3 MAGPIE_PHYSICS import in system.js
 * - FIXED: orphaned logging methods called in system.js
 *
 * @version 0.20.0 2026 04 25
 * - TWEAKED: new project structure from scratch
 *
 * @version 0.19.2 2026 04 20
 * - FIXED: MAGPIE_ENTITY.refresh() unable to process multiple exps and use STM/LTM
 * - TWEAKED: folder restructure with class decomposition in ./core/
 * - index.js (this file)
 * - system.js {@link MAGPIE_SYSTEM}
 * - component.js {@link MAGPIE_COMPONENT}
 * - entity.js {@link MAGPIE_ENTITY}
 * - player.js {@link MAGPIE_PLAYER}
 * - key.js {@link MAGPIE_KEY}
 * - class.js {@link MAGPIE.REGISTRY}
 *
 * @version 0.19.1 2026 04 19
 * - TWEAKED: MAGPIE_ENTITY overhaul
 *
 * @version 0.19.0 2026 04 14
 * - TWEAKED: few tweaks
 *
 * @version 0.18.9 2026 03 25
 *
 * @version 0.18.8 2026 03 19
 * - ADDED: SYSTEM.Utility.printETA(s)
 * - ADDED: ENTITY.refresh dt overflow protection
 * - ADDED: ENTITY.refresh dt overflow protection automatically attempt to sync metadate by requesting HIVE layer promotion
 * - FIXED: MAGPIE_SERVER.error unreadable format
 * - FIXED: ENTITY.refresh dt overflow nested bugs  leading up to HIVE.reqProm
 * - FIXED: printETA minutes not % 60, and hours not % 24
 *
 * @version 0.18.4 2026 03 17
 * - ADDED: Database sitrep during boot
 *
 * @version 0.18.3 2026 03 16
 * - FIXED: incongruence with "timestamp" and "CTZ"; timestamp must be a type Number of either Date.now() or equivalent; CTZ is a type String
 * - FIXED: multiple uses of "timestamp" as a "fake" Number for calculations, resulting in inaccurate data
 * - FIXED: ENTITY.refresh calculating its "dt" from real timestamp, resulting in inaccurate intervals and dt spikes due to time lag
 * - FIXED: entity refresh log bugs preventing correct application of forces
 *
 * @version 0.18.0 2026 03 13
 * - ADDED: helper methods for MAGPIE_ENTITY to get/set POVART elements
 * - FIXED: basic entity refresh and physics loop failing
 *
 * @version 0.17.18 2026 03 12
 * - FIXED: overhauled entity refresh and update loop
 *
 * @version 0.17.17 2026 03 11
 * - FIXED: various typos and syntax errors as well as returning null instead of proper types
 *
 * @version 0.17.16 2026 03 10
 * - FIXED: endless loop in MAGPIE_HIVE.save() due to "i < keys" instead of "i < count"
 * - FIXED: MAGPIE_EMOTE.setup() triggers circular dependency warning due to trying to load SERVER.js exports before being initialized
 * - FIXED: PHYSICS.validate(POVART) check for Object.prototype.toString.call() is "Float64Arrat" instead of "[object Float64Array]"
 * - FIXED: unable to HIVEsave any other type of entity other than default
 * - FIXED: {@link MAGPIE_SERVER.error} not logging error.stack
 * - FIXED: few bugs with typos. CTRL+F verison for details
 *
 * @version 0.17.10 2026 03 09
 * - FIXED: few bugs with typos and invalid return statements. CTRL+F version for details
 *
 * @version 0.17.9 2026 03 08
 * - FIXED: VSCode Remote SSH connection slow and draining excessively on VM performance
 * - FIXED: client relying on development-domain (localhost)
 * - FIXED: development vs production environment conficts
 * - FIXED: unable to save Map objects to database due to JSON.stringify limitations
 * - FIXED: MAGPIE_ENTITY not setting up properly due to malformed setupmethods
 *
 * @version 0.17.5 2026 03 07
 * - ADDED: {@link MAGPIE_SERVER.CLI} cli-progress bar to reduce logs bloat
 * - FIXED: MAGPIE_DATE.leapYear() is not a function => should be .leapDay()
 * - FIXED: MAGPIE_METASTATE and MAGPIE_DATE decoupled accidentally by 0.17.2 tweaking of runtime logic
 * - FIXED: server version not updated
 *
 * @version 0.17.2 2026 03 06
 * - ADDED: Google Cloud server compute instance and connected it to project MAGPIE
 * - ADDED: configuration to run DuckDNS subdomain
 * - FIXED: git repo running behind and having branch issues
 * - FIXED: DATABASE methods incorrectly setup for async calls by client systems
 * - FIXED: MAGPIE_HIVE lacking initialization
 *
 * @version 0.17.1 2026 03 05
 * - ADDED: worker_threads and web worker
 * - TWEAKED: MAGPIE_SERVER.error message handling for improved readability of errors
 * - FIXED: version not correctly showing up as M.m.p due to new number[] format
 * - FIXED: version saving broken and breaking the entire METASTATE revival process
 * @version 0.17.0 2026 03 02
 * - ADDED: complete rewrite
 * - ADDED: MAGPIE_HIVE for MAGPIE_ENTITY handling
 * - TWEAKED: removed MAGPIE_LOG
 * - TWEAKED: rearranged MAGPIE_RUNTIME for systems only
 * @version 0.16.4 2026 02 28
 * - TWEAKED: entity.update logic conformity with v0.4.3 MAGPIE_PHYSICS.js
 * - FIXED: various typos, context errors, and structural weaknesses
 * - FIXED: entity.update adds dA and dT to A0 and A1 when it's supposed to be the processInput's job to do that.
 * @version 0.16.3 2026 02 27
 * - TWEAKED: conformity update with v0.6.6 MAGPIE_SERVER.js and v0.4.2 MAGPIE_PHYSICS.js
 * - FIXED: RUNTIME.kick not kicking properly
 * @version 0.16.2 2026 02 26
 * - ADDED: RUNTIME.refreshGuest wrapper to handle server-side logic
 * - TWEAKED: re-introduced the "@" hydration method from RMMZ JsonEx by leveraging JSON.parse reviver and JSON.stringify replacer
 * - FIXED: ENTITY.refresh unable to processInput due to incorrect parameter defaults
 * - FIXED: RUNTIME.hosting and kicking incomplete logic
 *
 * @version 0.16.1 2026 02 24
 * - TWEAKED: conformity update with v0.4.0 MAGPIE_PHYSICS.js
 * - ADDED: MAGPIE_EXP prototype
 * - FIXED: MAGPIE.KEY.PHYSICS.POVART using deprecated definitions
 *
 * @version 0.16.0 2026 02 21
 * - ADDED: MAGPIE_DATE
 * - FIXED: MAGPIE_DATE.ultraTICK unable to parse months.days
 *
 * @version 0.15.0 2026 02 18
 * - TWEAKED: integrated MAGPIE_SERVER
 *
 * @version 0.14.0 2026 02 17
 * - TWEAKED: complete overhaul to decouple MAGPIE structure from RMMZ
 * - NEW: MAGPIE_MZ.js to handle RMMZ plugin integration
 * - NEW: MAGPIE_SYSTEM.login() to let MAGPIE_RUNTIME handle systems as
 *   guests
 *
 * @version 0.13.1 2026 02 15
 * - FIXED: now() not in MAGPIE_SYSTEM prototype, causing cascading issues in inheritance
 *
 * @version 0.13.0 2026 02 04
 * - complete rewrite
 * - project ADELE integration
 * - GEOTAC design integration
 * - ECS/OOP hybrid
 * - nwjs standalone compatibility
 *
 * @version 0.12.0 2025 12 25
 * - major overhaul
 *
 * @version 0.11.2 2025 11 01
 * - fixed: MAGPIE_Runtime guest hosting and system refresh not configured properly
 *
 * @version 0.11.1 2025 10 30
 * - fixed MAGPIE_Log only logging playtime data
 * - added MAGPIE_Log compatibility with DateTime System
 *
 * @version 0.11.0 2025 09 25
 * - MAGPIE_Commodity and MAGPIE_Entity integration
 *
 * @version 0.10.0 2025 08 28
 * - migrated MAGPIE_MCON to MAGPIE_CBE
 * - MAGPIE_Runtime bugfixes and consolidation
 *
 * @version 0.9.1 2025 08 27
 * - MAGPIE_EntityDatabase update and conformity overhaul
 *
 * @version 0.9.0 2025 08 25
 * - SYS overhaul with runtime prototypes and new structure
 * - NEW: Resource and Entity classes + databases framework
 * - NEW: Magpayan language initial build
 *
 * @version 0.8.0 2025 08 21
 * - HIMS overhaul
 *
 * @version 0.7.1 2025 08 14
 * - MAGPIE.run refresh loop bugfix: _guests refresh won't accept null causing catastrophic error
 *
 * @version 0.7.0 2025 07 31
 * - plugin suite overhaul
 *
 * @version 0.6.0 2025 07 26
 * - plugin rewrite
 *
 * @version 0.5.2
 * - plugin cleanup (removed Plugin Manager section)
 *
 * @version 0.5.1
 * - fixed: HIMS and MAGPIE code still in ShelderEvo_Core.js
 *
 * @version 0.5.0
 * - added utilities and HIMS framework
 *
 * @version 0.4.0
 * - restructuring
 *
 * @version v0.3.0
 * - added commodities and installation framework
 *
 * @version 0.2.0
 * - added basic functionality
 *
 * @version 0.1.0
 * - initial build
 * ------------------------------------------------------------------------
 *
 *
 */
//========================================================================
// #endregion -
//========================================================================
class MAGPIE {
  //
}
/**
 *
 *
 */
//========================================================================
// #region - INDEX
//========================================================================
MAGPIE.meta = {
  name: "M.A.G.P.I.E.",
  desc: "(M)odular (A)lgorithmic (G)eneral-(P)urpose (I)ntelligence (E)ngine",
  version: [0, 39, 92],
  firmwareName: "MAGPIE",
  firmwareDate: "20260616",
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
// #region - KEY
//========================================================================
MAGPIE.KEY = {};
MAGPIE.KEY.meta = {
  name: "M.A.G.P.I.E. semantic key dictionary",
  desc: "",
  firmwareName: "MAGPIE_KEY",
};
/**
 * @desc {@link MAGPIE.KEY.meta}
 *
 */
//------------------------------------------------------------------------
// #region > Type
//------------------------------------------------------------------------
MAGPIE.KEY.TYPE = {};
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
 * @typedef {Enumerator<Number>} key_index
 * @typedef {import("./component").key_label} key_label
 */
//========================================================================
// #region - SRC
//========================================================================
/** @desc Dictionary of keys */
MAGPIE.KEY.INDEX = {};
/** @desc  */
MAGPIE.KEY.SYSTEM = {};
/** {@link MAGPIE.KEY.HTTP.meta} */
MAGPIE.KEY.HTTP = {};
/** {@link MAGPIE.KEY.HTML.meta} */
MAGPIE.KEY.HTML = {};
/** {@link MAGPIE.KEY.SERVER.meta} */
MAGPIE.KEY.SERVER = {};
/** {@link MAGPIE.KEY.RUNTIME.meta} */
MAGPIE.KEY.RUNTIME = {};
/** {@link MAGPIE.KEY.HIVE.meta} */
MAGPIE.KEY.HIVE = {};
/** {@link MAGPIE.KEY.PHYSICS.meta} */
MAGPIE.KEY.PHYSICS = {};
/** {@link MAGPIE.KEY.GEODETIC.meta} */
MAGPIE.KEY.GEODETIC = {};
/** {@link MAGPIE.KEY.POVART.meta} */
MAGPIE.KEY.POVART = {};
/** {@link MAGPIE.KEY.ORBIT.meta} */
MAGPIE.KEY.ORBIT = {};
/** {@link MAGPIE.KEY.ENTITY.meta} */
MAGPIE.KEY.ENTITY = {};
/** {@link MAGPIE.KEY.STATE.meta} */
MAGPIE.KEY.STATE = {};
/**
 * @name
 * @desc
 *
 */
//------------------------------------------------------------------------
// #region > Config
//------------------------------------------------------------------------
MAGPIE.config = require("../config/server_config");
MAGPIE.KEY.NODE_ENV = MAGPIE.config.NODE_ENV;
// #endregion
//------------------------------------------------------------------------
/**
 * @name
 * @desc
 *
 */
//------------------------------------------------------------------------
// #region > Http
//------------------------------------------------------------------------
MAGPIE.KEY.HTTP.meta = {
  name: "HTTP cheat sheet",
  status_codes: "https://http.dev/status",
  headers: "https://http.dev/headers",
  methods: "https://http.dev/methods",
  tools: "https://http.dev/tools",
};
/**
 * @desc Successful
 * @desc In simple terms, the HTTP status 200 response code means that a
 * server has successfully processed a request. Likewise, codes in the
 * 400s and 500s mean a request has failed.
 */
MAGPIE.KEY.HTTP.STATUS_200 = {
  code: 200,
  message: "Successful",
  desc: `In simple terms, the HTTP status 200 response code means 
	that a server has successfully processed a request. Likewise, 
	codes in the 400s and 500s mean a request has failed.`,
};
/**
 * @desc Bad Request
 * @desc The 400 (Bad Request) status code indicates that the server
 * cannot or will not process the request due to something that is
 * perceived to be a client error. In response to an invalid request,
 * the server should issue the exact 4xx code in the case of an
 * unsuccessful request.
 */
MAGPIE.KEY.HTTP.STATUS_400 = {
  code: 400,
  message: "Bad Request",
  desc: `The 400 (Bad Request) status code indicates that the server 
	cannot or will not process the request due to something that is 
	perceived to be a client error. In response to an invalid request, 
	the server should issue the exact 4xx code in the case of an 
	unsuccessful request.`,
};
/**
 * @desc Unauthorized
 * @desc The HTTP 401 Unauthorized client error response status
 * code indicates that a request was not successful because it lacks
 * valid authentication credentials for the requested resource.
 */
MAGPIE.KEY.HTTP.STATUS_401 = {
  code: 401,
  message: "Unauthorized",
  desc: `The  HTTP 401 Unauthorized client error response status code 
	indicates that a request was not successful because it lacks valid 
	authentication credentials for the requested resource.`,
};
/**
 * @desc "Forbidden"
 * @desc A 403 'Forbidden' error is an HTTP status code indicating that
 * the server understood the request but refuses to authorize it,
 * usually due to insufficient permissions or intentional blocking.
 * It means the site is restricted or the user lacks access rights,
 * making repeated attempts without modification futile.
 */
MAGPIE.KEY.HTTP.STATUS_403 = {
  code: 403,
  message: "Forbidden",
  desc:
    "A 403 'Forbidden' error is an HTTP status code indicating " +
    "that the server understood the request but refuses to authorize " +
    "it, usually due to insufficient permissions or intentional " +
    "blocking. It means the site is restricted or the user lacks " +
    "access rights, making repeated attempts without modification futile.",
};
/**
 * @desc "Conflict"
 * @desc The standard HTTP status code for attempting to create a resource
 * that already exists (causing a unique constraint violation in your
 * database) is 409 Conflict. Using 409 tells the client specifically
 * that the server understands the request, but it cannot be completed
 * due to an asset collision.
 */
MAGPIE.KEY.HTTP.STATUS_409 = {
  code: 409,
  message: "Conflict",
  desc:
    "The standard HTTP status code for attempting to create a resource " +
    "that already exists (causing a unique constraint violation in your " +
    "database) is 409 Conflict. Using 409 tells the client specifically " +
    "that the server understands the request, but it cannot be completed " +
    "due to an asset collision.",
};
MAGPIE.KEY.HTTP.STATUS_410 = {
  code: 410,
  message: "Gone",
  desc:
    "Best for Expired Content/Links. " +
    "Use this standard code if a URL, link, or resource " +
    "(like a limited-time promotional page or an archive) " +
    "has expired permanently. " +
    "It tells the client and search engines that the resource " +
    "existed in the past but is now intentionally deleted " +
    "and will not return.",
};
/**
 * @desc Internal Server Error
 * @desc An HTTP 500 status code (Internal Server Error) indicates
 * that the server encountered an unexpected condition that prevented
 * it from fulfilling the request.
 */
MAGPIE.KEY.HTTP.STATUS_500 = {
  code: 500,
  message: "Internal Server Error",
  desc: `An HTTP 500 status code (Internal Server Error) indicates 
	that the server encountered an unexpected condition that prevented 
	it from fulfilling the request.`,
};
/**
 * @desc "too many requests"
 * @desc The HTTP 429 "Too Many Requests" status code indicates the user
 * has sent too many requests to a server within a given timeframe,
 * triggering rate limiting. This client-side error protects servers
 * from abuse, such as DDoS attacks, scrapers, or excessive bot activity.
 * It is commonly resolved by waiting, reducing request frequency, or
 * checking API limits.
 */
MAGPIE.KEY.HTTP.STATUS_429 = {
  code: 429,
  message: "Too many requests!",
  desc:
    "The HTTP 429 'Too Many Requests' status code indicates the user " +
    "has sent too many requests to a server within a given timeframe, " +
    "triggering rate limiting. This client-side error protects servers " +
    "from abuse, such as DDoS attacks, scrapers, or excessive bot activity. " +
    "It is commonly resolved by waiting, reducing request frequency, " +
    "or checking API limits.",
};
// #endregion
//------------------------------------------------------------------------
/**
 * @name
 * @desc
 *
 */
//------------------------------------------------------------------------
// #region > Server
//------------------------------------------------------------------------
MAGPIE.KEY.SERVER.meta = {
  //
};
MAGPIE.KEY.SERVER.DOMAIN = MAGPIE.config.domain;
MAGPIE.KEY.SERVER.JWT_SECRET = MAGPIE.config.jwtSecret;
MAGPIE.KEY.SERVER.PORT = MAGPIE.config.PORT;
MAGPIE.KEY.SERVER.EMAIL_MASTER_KEY = Buffer.from(
  MAGPIE.config.EMAIL_MASTER_KEY,
  "hex",
);
MAGPIE.KEY.SERVER.HASH_SALT = MAGPIE.config.HASH_SALT;
/** @desc 20 max login attemps within cooldown window */
MAGPIE.KEY.SERVER.LOGIN_MAX_ATTEMPTS = 20;
/** @desc 15m login attempts cooldown window*/
MAGPIE.KEY.SERVER.LOGIN_COOLDOWN = 15;
/** @type {String} domain without "http/https://" */
MAGPIE.KEY.SERVER.DOMAIN_STRIPPED = MAGPIE.config.domain.slice(
  MAGPIE.config.domain.indexOf(":") + 3,
);
MAGPIE.KEY.SERVER.CSP = {
  name: "Content-Security-Policy",
};
/**
 * @desc admin email route via
 * {@link [Cloudflare](https://dash.cloudflare.com/f9be63832257af6f7644accd541a4bca/shelderevolution.org/email/routing/routes)}
 * */
MAGPIE.KEY.SERVER.ADMIN_EMAIL = `admin@${MAGPIE.KEY.SERVER.DOMAIN_STRIPPED}`;
MAGPIE.KEY.SERVER.NO_REPLY = `noreply@${MAGPIE.KEY.SERVER.DOMAIN_STRIPPED}`;
/** @type {Enumerator<Number>} @desc grace time on socket disconnect (anti-F5 spam) */
MAGPIE.KEY.SERVER.GRACE_TIMER_DISCONNECTION = 10_000;
/** @desc development mode: debugging, testing, placeholders... */
MAGPIE.KEY.SERVER.IS_DEV = !!MAGPIE.config.devMode && !MAGPIE.config.production;
/** @desc socketEvent name for socket.on() */
MAGPIE.KEY.SERVER.EVENT_REQUEST = "REQUEST";
/** @desc socketEvent name for socket.emit() */
MAGPIE.KEY.SERVER.EVENT_RESPONSE = "RESPONSE";
/**
 * @desc server preset messages
 *
 */
MAGPIE.KEY.SERVER.MESSAGE = {};
MAGPIE.KEY.SERVER.MESSAGE.BOOT = "[BOOT SEQUENCE]";
MAGPIE.KEY.SERVER.MESSAGE.BOOTED = "SERVER ONLINE listening on: ";
MAGPIE.KEY.SERVER.MESSAGE.INTERNAL_ERROR = `<h1>Internal server error</h1>
    <p>Please, try again later.</p>
    <p>If you see this persist for over 1 hour, please, report it to [${MAGPIE.KEY.SERVER.ADMIN_EMAIL}].</p>`;
// #endregion
//------------------------------------------------------------------------
/**
 * @name Runtime
 * @desc
 *
 */
//------------------------------------------------------------------------
// #region > Runtime
//------------------------------------------------------------------------
MAGPIE.KEY.RUNTIME.meta = {
  firmwareName: "MAGPIE_RUNTIME",
  name: "M.A.G.P.I.E. runtime",
};
MAGPIE.KEY.RUNTIME.DELTA = new Float64Array([
  0.001,
  0.033,
  1,
  60,
  60 ** 2,
  60 ** 2 * 24,
]);
/**
 * @type {Map<Number, {
 * name: String,
 * delta: duration,
 * dt: duration,
 * switch: Number,
 * slots: Number
 * }}
 * */
MAGPIE.KEY.RUNTIME.LAYER = new Map();
MAGPIE.KEY.RUNTIME.LAYER.set(0, {
  name: "_GuestsBase",
  delta: MAGPIE.KEY.RUNTIME.DELTA[0],
  dt: MAGPIE.KEY.RUNTIME.DELTA[0],
  switch: 0,
  slots: 100,
});
MAGPIE.KEY.RUNTIME.LAYER.set(1, {
  name: "_GuestsGame",
  delta: MAGPIE.KEY.RUNTIME.DELTA[1],
  dt: MAGPIE.KEY.RUNTIME.DELTA[1],
  switch: 1,
  slots: 1000,
});
MAGPIE.KEY.RUNTIME.LAYER.set(2, {
  name: "_GuestsStandard",
  delta: MAGPIE.KEY.RUNTIME.DELTA[2],
  dt: MAGPIE.KEY.RUNTIME.DELTA[2],
  switch: 2,
  slots: 5000,
});
MAGPIE.KEY.RUNTIME.LAYER.set(3, {
  name: "_GuestsSuper",
  delta: MAGPIE.KEY.RUNTIME.DELTA[3],
  dt: MAGPIE.KEY.RUNTIME.DELTA[3],
  switch: 3,
  slots: 10000,
});
MAGPIE.KEY.RUNTIME.LAYER.set(4, {
  name: "_GuestsMega",
  delta: MAGPIE.KEY.RUNTIME.DELTA[4],
  dt: MAGPIE.KEY.RUNTIME.DELTA[4],
  switch: 4,
  slots: 50000,
});
MAGPIE.KEY.RUNTIME.LAYER.set(5, {
  name: "_GuestsUltra",
  delta: MAGPIE.KEY.RUNTIME.DELTA[5],
  dt: MAGPIE.KEY.RUNTIME.DELTA[5],
  switch: 5,
  slots: 100000,
});
// #endregion
//------------------------------------------------------------------------
/**
 * @name
 * @desc
 *
 */
//------------------------------------------------------------------------
// #region > Hive
//------------------------------------------------------------------------
MAGPIE.KEY.HIVE.meta = "";
/** @type {Enumerator<Number>} amount of HIVE buffer layers */
MAGPIE.KEY.HIVE.BUFFER_SIZE = 3;
/** @type {Enumerator<Number>} amount of HIVE remote layers */
MAGPIE.KEY.HIVE.REMOTE_SIZE = 3;
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
// #region - SEMANTIC
//========================================================================
/**
 * @name semantics
 * @desc component of {@link MAGPIE.KEY.meta}
 * @desc system of {@link MAGPIE}
 * @typedef {Number} keyID
 * @typedef {{
 * type: Number,
 * label: String,
 * origin: keyID,
 * component: keyID,
 * compound: keyID,
 * legacy: keyID
 * }} key_data
 * @typedef {Number} index array[index]
 * @typedef {Enumerator<Number>} key_type
 *
 */
MAGPIE.KEY.SEMANTICS = {};
MAGPIE.KEY.SEMANTICS.meta = {
  name: "M.A.G.P.I.E. semantic keys",
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
// #region - DATE/TIME
//========================================================================
/**
 * @name
 * @desc
 *
 */
//------------------------------------------------------------------------
// #region > Calendar
//------------------------------------------------------------------------
MAGPIE.KEY.CALENDAR = {};
MAGPIE.KEY.CALENDAR.GREGORIAN = {
  ID: 0,
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
// #region - ENTITY
//========================================================================
MAGPIE.KEY.ENTITY.meta = {
  //
};
/**
 * @name
 * @desc
 * @typedef {index} stamina_index entity.fitness[stamina_index] ({@link MAGPIE.KEY.FITNESS.STAMINA})
 * @typedef {index} state_index entity.fitness[2 + size * 2 + index]
 */
//------------------------------------------------------------------------
// #region > Fitness
//------------------------------------------------------------------------
MAGPIE.KEY.FITNESS = {};
MAGPIE.KEY.FITNESS.STAMINA = 6;
// #endregion
//------------------------------------------------------------------------
/**
 * @name
 * @desc
 *
 */
//------------------------------------------------------------------------
// #region > Type
//------------------------------------------------------------------------
MAGPIE.KEY.ENTITY.TYPE = require("../data/entity_types");
MAGPIE.KEY.ENTITY.UNIVERSE = 101;
/**
 * {@link MAGPIE_ENTITY.container}
 *
 */
MAGPIE.KEY.ENTITY.CONTAINER = {};
MAGPIE.KEY.ENTITY.CONTAINER.meta = {
  name: "container-entity",
  desc: "",
};
/**
 * @type {Enumerator<Number>}
 * @desc values = container.fitness.length / 4
 * @desc offset = i * values
 * */
MAGPIE.KEY.ENTITY.CONTAINER.SERIES = 4;
// #endregion
//------------------------------------------------------------------------
/**
 * @name
 * @desc
 *
 */
//------------------------------------------------------------------------
// #region > Growth
//------------------------------------------------------------------------
/**
 *
 *
 */
/** @type {state_index} */
MAGPIE.KEY.STATE.EMBRYO = 101;
/** @type {state_index} */
MAGPIE.KEY.STATE.INFANT = 102;
/** @type {state_index} */
MAGPIE.KEY.STATE.JUVENILE = 103;
/** @type {state_index} */
MAGPIE.KEY.STATE.ADOLESCENT = 104;
/** @type {state_index} */
MAGPIE.KEY.STATE.ADULT = 105;
/** @type {state_index} */
MAGPIE.KEY.STATE.ELDER = 106;
/** @desc Creature growth stats */
MAGPIE.KEY.GROWTH = {};
/**
 * @typedef {[stateID, growth_level, growth_level]} growth_stage
 */
/** @type {growth_stage} */
MAGPIE.KEY.GROWTH.EMBRYO = [MAGPIE.KEY.STATE.EMBRYO, -1, 0];
/** @type {growth_stage} */
MAGPIE.KEY.GROWTH.INFANT = [MAGPIE.KEY.STATE.INFANT, 0, 0.2];
/** @type {growth_stage} */
MAGPIE.KEY.GROWTH.JUVENILE = [MAGPIE.KEY.STATE.JUVENILE, 0.2, 0.5];
/** @type {creature_level} */
MAGPIE.KEY.GROWTH.ADOLESCENT = [MAGPIE.KEY.STATE.ADOLESCENT, 0.5, 0.8];
/** @type {creature_level} */
MAGPIE.KEY.GROWTH.ADULT = [MAGPIE.KEY.STATE.ADULT, 0.8, 1];
/** @type {creature_level} */
MAGPIE.KEY.GROWTH.ELDER = [MAGPIE.KEY.STATE.ELDER, 1, Infinity];
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
// #region - COMPON.
//========================================================================
/**
 * @name Geodetic
 * @desc
 *
 */
//------------------------------------------------------------------------
// #region > Geodetic
//------------------------------------------------------------------------
/**
 * component of {@link MAGPIE_GEOGRAPHY}
 *
 */
MAGPIE.KEY.GEODETIC.meta = {};
MAGPIE.KEY.GEODETIC.DEFAULT = {
  lat: NaN,
  lon: NaN,
  ASL: NaN,
  geog: [NaN],
  forces: [NaN],
};

// #endregion
//------------------------------------------------------------------------
/**
 * @name
 * @desc
 *
 */
//------------------------------------------------------------------------
// #region > Physics
//------------------------------------------------------------------------
/**
 * @typedef {Float64Array} physics_forces [FG, FF, FD, FL, AOA, Atm, OAT, Dew, Breeze, Lit, Rad]
 */
MAGPIE.KEY.PHYSICS.meta = {};
/**
 *
 * @desc component of {@link MAGPIE_ENTITY}
 * sister of {@link MAGPIE.KEY.STATS}
 * sister of {@link MAGPIE_PHYSICS.aero}
 */
MAGPIE.KEY.PHYSICS.FORCES = {};
/** @type {index} local gravity */
MAGPIE.KEY.PHYSICS.FORCES.FG = 0;
/** @type {index} friction */
MAGPIE.KEY.PHYSICS.FORCES.FF = MAGPIE.KEY.PHYSICS.FORCES.FG + 1;
/** @type {index} drag */
MAGPIE.KEY.PHYSICS.FORCES.FD = MAGPIE.KEY.PHYSICS.FORCES.FF + 1;
/** @type {index} lift */
MAGPIE.KEY.PHYSICS.FORCES.FL = MAGPIE.KEY.PHYSICS.FORCES.FD + 1;
/** @type {index} angle of attack */
MAGPIE.KEY.PHYSICS.FORCES.AOA = MAGPIE.KEY.PHYSICS.FORCES.FL + 1;
/** @type {Enumerator<Number>} amount of forces */
MAGPIE.KEY.PHYSICS.FORCES.ARRAY = MAGPIE.KEY.PHYSICS.FORCES.AOA + 1;
// #endregion
//------------------------------------------------------------------------
/**
 * @name Orbit
 * @desc
 *
 */
//------------------------------------------------------------------------
// #region > Orbit
//------------------------------------------------------------------------
/**
 * @typedef {{
 * a: distance,
 * e: ratio,
 * i: angle_rad,
 * raan: angle_rad,
 * aop: angle_rad,
 * nu: angle_rad,
 * T0: duration,
 * M0: angle_rad
 * }} orbit_data
 */
MAGPIE.KEY.ORBIT.meta = {};
/** @type {Enumerator<Number>} */
MAGPIE.KEY.ORBIT.ID = 1;
/** @type {Enumerator<Number>} */
MAGPIE.KEY.ORBIT.TYPE = 1;
/** @type {index} semi-major axis */
MAGPIE.KEY.ORBIT.A = 0;
/** @type {index} eccentricity */
MAGPIE.KEY.ORBIT.E = MAGPIE.KEY.ORBIT.A + 1;
/** @type {index} inclination */
MAGPIE.KEY.ORBIT.I = MAGPIE.KEY.ORBIT.E + 1;
/** @type {index} longitude of ascending node */
MAGPIE.KEY.ORBIT.RAAN = MAGPIE.KEY.ORBIT.I + 1;
/** @type {index} argument of periapsis */
MAGPIE.KEY.ORBIT.AOP = MAGPIE.KEY.ORBIT.RAAN + 1;
/** @type {index} true anomaly */
MAGPIE.KEY.ORBIT.NU = MAGPIE.KEY.ORBIT.AOP + 1;
/** @type {index} epoch */
MAGPIE.KEY.ORBIT.T0 = MAGPIE.KEY.ORBIT.NU + 1;
/** @type {index} mean anomaly at epoch */
MAGPIE.KEY.ORBIT.M0 = MAGPIE.KEY.ORBIT.T0 + 1;
/** @type {index} entityID */
MAGPIE.KEY.ORBIT.E_ID = MAGPIE.KEY.ORBIT.M0 + 1;
/** @type {Enumerator<Number>} */
MAGPIE.KEY.ORBIT.ARRAY = MAGPIE.KEY.ORBIT.E_ID + 1;
// #endregion
//------------------------------------------------------------------------
/**
 * @name
 * @desc
 *
 */
//------------------------------------------------------------------------
// #region > POVART
//------------------------------------------------------------------------
/**
 * component of {@link MAGPIE_ENTITY}
 * sister of {@link MAGPIE.KEY.ORBIT}
 * @desc Indices for the {@link MAGPIE_ENTITY}.POVART array
 * @property {vector3[0]} P_X
 * @property {vector3[1]} P_Y
 * @property {vector3[2]} P_Z
 * @property {entityID} P_C
 * @property {orbit_data[0]} P_O_A
 * @property {orbit_data[1]} P_O_E
 * @property {orbit_data[2]} P_O_I
 * @property {orbit_data[3]} P_O_RAAN
 * @property {orbit_data[4]} P_O_AOP
 * @property {orbit_data[5]} P_O_NU
 * @property {orbit_data[6]} P_O_T0
 * @property {orbit_data[7]} P_O_M0
 * @property {rotor[0]} O_YZ
 * @property {rotor[1]} O_XZ
 * @property {rotor[2]} O_XY
 * @property {rotor[3]} O_W
 * @property {vector3[0]} V_X
 * @property {vector3[1]} V_Y
 * @property {vector3[2]} V_Z
 * @property {vector3[0]} A_X
 * @property {vector3[1]} A_Y
 * @property {vector3[2]} A_Z
 * @property {bivector[0]} R_YZ
 * @property {bivector[1]} R_XZ
 * @property {bivector[2]} R_XY
 * @property {bivector[0]} T_YZ
 * @property {bivector[1]} T_XZ
 * @property {bivector[2]} T_XY
 * @property {entityID} E_ID
 *
 * @typedef {Number} P_X position x
 * @typedef {Number} P_Y position y
 * @typedef {Number} P_Z position z
 * @typedef {Number} P_C parent celestial body ID
 * @typedef {distance} P_O_A {@link MAGPIE.KEY.ORBIT.A} in m
 * @typedef {ratio} P_O_E {@link MAGPIE.KEY.ORBIT.E} 0 to 1
 * @typedef {angle_rad} P_O_I {@link MAGPIE.KEY.ORBIT.I} in rad
 * @typedef {angle_rad} P_O_RAAN {@link MAGPIE.KEY.ORBIT.RAAN} in rad
 * @typedef {angle_rad} P_O_AOP {@link MAGPIE.KEY.ORBIT.AOP} in rad
 * @typedef {angle_rad} P_O_NU {@link MAGPIE.KEY.ORBIT.NU} in rad
 * @typedef {epoch_real_s} P_O_T0 {@link MAGPIE.KEY.ORBIT.T0} in s
 * @typedef {angle_rad} P_O_M0 {@link MAGPIE.KEY.ORBIT.M0} in rad
 * @typedef {Number} O_YZ orientation rotor YZ
 * @typedef {Number} O_XZ orientation rotor XZ
 * @typedef {Number} O_XY orientation rotor XY
 * @typedef {Number} O_W orientation rotor scalar
 * @typedef {Number} V_X velocity x
 * @typedef {Number} V_Y velocity y
 * @typedef {Number} V_Z velocity z
 * @typedef {Number} A_X acceleration x
 * @typedef {Number} A_Y acceleration y
 * @typedef {Number} A_Z acceleration z
 * @typedef {Number} R_YZ rotation bivector YZ
 * @typedef {Number} R_XZ rotation bivector YZ
 * @typedef {Number} R_XY rotation bivector XY
 * @typedef {Number} T_YZ torque bivector YZ
 * @typedef {Number} T_XZ torque bivector XZ
 * @typedef {Number} T_XY torque bivector XY
 * @typedef {Number} E_ID entity ID
 * @typedef {Number[]} orbit [a,e,i,raan,aop,nu,T0,M0]
 *
 */
MAGPIE.KEY.POVART.meta = {};
/** @type {index} position x */
MAGPIE.KEY.POVART.P_X = 0;
/** @type {index} position y */
MAGPIE.KEY.POVART.P_Y = MAGPIE.KEY.POVART.P_X + 1;
/** @type {index} position z */
MAGPIE.KEY.POVART.P_Z = MAGPIE.KEY.POVART.P_Y + 1;
/** @type {index} parent celestial body ID */
MAGPIE.KEY.POVART.P_C = MAGPIE.KEY.POVART.P_Z + 1;
/** @type {index} @desc {@link MAGPIE.KEY.ORBIT.A} */
MAGPIE.KEY.POVART.P_O_A = MAGPIE.KEY.POVART.P_C + 1;
/** @type {index} @desc {@link MAGPIE.KEY.ORBIT.E} */
MAGPIE.KEY.POVART.P_O_E = MAGPIE.KEY.POVART.P_O_A + 1;
/** @type {index} @desc {@link MAGPIE.KEY.ORBIT.I} */
MAGPIE.KEY.POVART.P_O_I = MAGPIE.KEY.POVART.P_O_E + 1;
/** @type {index} @desc {@link MAGPIE.KEY.ORBIT.RAAN} */
MAGPIE.KEY.POVART.P_O_RAAN = MAGPIE.KEY.POVART.P_O_I + 1;
/** @type {index} @desc {@link MAGPIE.KEY.ORBIT.AOP} */
MAGPIE.KEY.POVART.P_O_AOP = MAGPIE.KEY.POVART.P_O_RAAN + 1;
/** @type {index} @desc {@link MAGPIE.KEY.ORBIT.NU} */
MAGPIE.KEY.POVART.P_O_NU = MAGPIE.KEY.POVART.P_O_AOP + 1;
/** @type {index} @desc {@link MAGPIE.KEY.ORBIT.T0} */
MAGPIE.KEY.POVART.P_O_T0 = MAGPIE.KEY.POVART.P_O_NU + 1;
/** @type {index} @desc {@link MAGPIE.KEY.ORBIT.M0} */
MAGPIE.KEY.POVART.P_O_M0 = MAGPIE.KEY.POVART.P_O_T0 + 1;
/** @type {index} orientation rotor YZ */
MAGPIE.KEY.POVART.O_YZ = MAGPIE.KEY.POVART.P_O_M0 + 1;
/** @type {index} orientation rotor XZ */
MAGPIE.KEY.POVART.O_XZ = MAGPIE.KEY.POVART.O_YZ + 1;
/** @type {index} orientation rotor XY */
MAGPIE.KEY.POVART.O_XY = MAGPIE.KEY.POVART.O_XZ + 1;
/** @type {index} orientation rotor scalar */
MAGPIE.KEY.POVART.O_W = MAGPIE.KEY.POVART.O_XY + 1;
/** @type {index} velocity x */
MAGPIE.KEY.POVART.V_X = MAGPIE.KEY.POVART.O_W + 1;
/** @type {index} velocity y */
MAGPIE.KEY.POVART.V_Y = MAGPIE.KEY.POVART.V_X + 1;
/** @type {index} velocity z */
MAGPIE.KEY.POVART.V_Z = MAGPIE.KEY.POVART.V_Y + 1;
/** @type {index} acceleration x */
MAGPIE.KEY.POVART.A_X = MAGPIE.KEY.POVART.V_Z + 1;
/** @type {index} acceleration y */
MAGPIE.KEY.POVART.A_Y = MAGPIE.KEY.POVART.A_X + 1;
/** @type {index} acceleration z */
MAGPIE.KEY.POVART.A_Z = MAGPIE.KEY.POVART.A_Y + 1;
/** @type {index} rotation bivector yz */
MAGPIE.KEY.POVART.R_YZ = MAGPIE.KEY.POVART.A_Z + 1;
/** @type {index} rotation bivector xz */
MAGPIE.KEY.POVART.R_XZ = MAGPIE.KEY.POVART.R_YZ + 1;
/** @type {index} rotation bivector xy */
MAGPIE.KEY.POVART.R_XY = MAGPIE.KEY.POVART.R_XZ + 1;
/** @type {index} torque bivector yz */
MAGPIE.KEY.POVART.T_YZ = MAGPIE.KEY.POVART.R_XY + 1;
/** @type {index} torque bivector xz */
MAGPIE.KEY.POVART.T_XZ = MAGPIE.KEY.POVART.T_YZ + 1;
/** @type {index} torque bivector xy */
MAGPIE.KEY.POVART.T_XY = MAGPIE.KEY.POVART.T_XZ + 1;
/** @type {index} entity's ID */
MAGPIE.KEY.POVART.E_ID = MAGPIE.KEY.POVART.T_XY + 1;
/** @type {Enumerator<Number>} */
MAGPIE.KEY.POVART.ARRAY = MAGPIE.KEY.POVART.E_ID + 1;
/** @type {vector3} entity's default 'forward' vector [x,y,z] */
MAGPIE.KEY.POVART.FWD = [0, 1, 0];
/** @type {vector3} default 'up' vector [x,y,z] */
MAGPIE.KEY.POVART.UP = [0, 0, 1];
/** @type {vector3} default 'right' vector */
MAGPIE.KEY.POVART.RIGHT = [1, 0, 0];
/** @type {Enumerator<String>[]} */
MAGPIE.KEY.POVART.AXES = ["x", "y", "z"];
/** @type {Map<String, Enumerator<Number>>} */
MAGPIE.KEY.POVART.R_AXES = new Map();
MAGPIE.KEY.POVART.R_AXES.set("pitch", 0);
MAGPIE.KEY.POVART.R_AXES.set("roll", 1);
MAGPIE.KEY.POVART.R_AXES.set("heading", 2);
MAGPIE.KEY.POVART.O_;
// #endregion
//------------------------------------------------------------------------
/**
 * component of {@link MAGPIE_ENTITY}
 * sister of {@link MAGPIE.KEY.PHYSICS.POVART}
 *
 *
 *
 */
//------------------------------------------------------------------------
//#region > Stats
//------------------------------------------------------------------------
MAGPIE.KEY.STATS = {};
/**
 * @typedef {Number} STAT aka static parameter
 * @typedef {Number} PARAM STAT modifier aka param
 * @typedef {STAT} FIT fitness aka MHP
 * @typedef {STAT} RES reserve aka HP
 * @typedef {STAT} LVL growth LvL aka LEVEL
 * @typedef {STAT} END endurance aka MMP
 * @typedef {STAT} STA stamina aka MP
 * @typedef {STAT} PWR power aka ATK
 * @typedef {STAT} MASS mass aka DEF
 * @typedef {STAT} SEN sense aka MAT
 * @typedef {STAT} DEX dexterity aka MDF
 * @typedef {STAT} RT reaction time aka AGI
 * @typedef {STAT} EVO evolution aka LUK
 * @typedef {{
 * FIT: FIT,
 * END: END,
 * PWR: PWR,
 * MASS: MASS,
 * SEN: SEN,
 * DEX: DEX,
 * RT: RT,
 * EVO: EVO,
 * G_R: Number,
 * G_I: Number,
 * INERT_X: Number,
 * INERT_Y: Number,
 * INERT_Z: Number,
 * TMAX_X: Number,
 * TMAX_Y: Number,
 * TMAX_Z: Number,
 * FB: coefficient,
 * CM: coefficient,
 * MASSKG: mass,
 * DENSITY: density,
 * LENGTH: distance,
 * HEIGHT: distance,
 * WIDTH: distance,
 * VOLUME: volume,
 * FT: force,
 * VMAX: velocity,
 * AMAX: velocity,
 * BMAX: velocity,
 * GMAX: acceleration,
 * CF: coefficient,
 * CL: coefficient,
 * CD: coefficient,
 * COM_X: distance,
 * COM_Y: distance,
 * COM_Z: distance
 * COL_X: distance,
 * COL_Y: distance,
 * COL_Z: distance
 * }} key_stats
 */
MAGPIE.KEY.STATS.meta = {};
/** @type {index}
 * @desc formerly: Fitness aka totalDeckSize
 * @desc repurposed to: [OWNER-playerID]
 * */
MAGPIE.KEY.STATS.FIT = MAGPIE.KEY.POVART.E_ID + 1; //@audit-ok can be repurposed becaused FIT can be derived by this.fitness[1]
/** @type {index} Endurance aka LVL_STA */
MAGPIE.KEY.STATS.END = MAGPIE.KEY.STATS.FIT + 1;
/** @type {index} Power aka ATK */
MAGPIE.KEY.STATS.PWR = MAGPIE.KEY.STATS.END + 1;
/** @type {index} Mass aka DEF */
MAGPIE.KEY.STATS.MASS = MAGPIE.KEY.STATS.PWR + 1;
/** @type {index} Sense aka MAT */
MAGPIE.KEY.STATS.SEN = MAGPIE.KEY.STATS.MASS + 1;
/** @type {index} Dexterity aka MDF */
MAGPIE.KEY.STATS.DEX = MAGPIE.KEY.STATS.SEN + 1;
/** @type {index} Reaction Time aka AGI */
MAGPIE.KEY.STATS.RT = MAGPIE.KEY.STATS.DEX + 1;
/** @type {index} Evolution aka LUK */
MAGPIE.KEY.STATS.EVO = MAGPIE.KEY.STATS.RT + 1;
/** @type {index} @desc Growth Level */
MAGPIE.KEY.STATS.G_LVL = MAGPIE.KEY.STATS.EVO + 1;
/** @type {index} @desc Growth Rate (curve steepness) */
MAGPIE.KEY.STATS.G_R = MAGPIE.KEY.STATS.G_LVL + 1;
/** @type {index} @desc Growth Inflection point ("puberty") */
MAGPIE.KEY.STATS.G_I = MAGPIE.KEY.STATS.G_R + 1;
/** @type {index} inertia x */
MAGPIE.KEY.STATS.INERT_X = MAGPIE.KEY.STATS.G_I + 1;
/** @type {index} Inertia y */
MAGPIE.KEY.STATS.INERT_Y = MAGPIE.KEY.STATS.INERT_X + 1;
/** @type {index} Inertia z */
MAGPIE.KEY.STATS.INERT_Z = MAGPIE.KEY.STATS.INERT_Y + 1;
/** @type {index} max Torque x */
MAGPIE.KEY.STATS.TMAX_X = MAGPIE.KEY.STATS.INERT_Z + 1;
/** @type {index} max Torque y */
MAGPIE.KEY.STATS.TMAX_Y = MAGPIE.KEY.STATS.TMAX_X + 1;
/** @type {index} max Torque z */
MAGPIE.KEY.STATS.TMAX_Z = MAGPIE.KEY.STATS.TMAX_Y + 1;
/** @type {index} Coefficient of Buoyancy */
MAGPIE.KEY.STATS.FB = MAGPIE.KEY.STATS.TMAX_Z + 1;
/** @type {index} @todo Coefficient of integrity: unsure of this */
MAGPIE.KEY.STATS.CM = MAGPIE.KEY.STATS.FB + 1;
/** @type {index} */
MAGPIE.KEY.STATS.MASSKG = MAGPIE.KEY.STATS.CM + 1;
/** @type {index} */
MAGPIE.KEY.STATS.DENSITY = MAGPIE.KEY.STATS.MASSKG + 1;
/** @type {index} */
MAGPIE.KEY.STATS.LENGTH = MAGPIE.KEY.STATS.DENSITY + 1;
/** @type {index} */
MAGPIE.KEY.STATS.HEIGHT = MAGPIE.KEY.STATS.LENGTH + 1;
/** @type {index} */
MAGPIE.KEY.STATS.WIDTH = MAGPIE.KEY.STATS.HEIGHT + 1;
/** @type {index} */
MAGPIE.KEY.STATS.VOLUME = MAGPIE.KEY.STATS.WIDTH + 1;
/** @type {index} Thrust in (N) */
MAGPIE.KEY.STATS.FT = MAGPIE.KEY.STATS.VOLUME + 1;
/** @type {index} */
MAGPIE.KEY.STATS.VMAX = MAGPIE.KEY.STATS.FT + 1;
/** @type {index} */
MAGPIE.KEY.STATS.AMAX = MAGPIE.KEY.STATS.VMAX + 1;
/** @type {index} */
MAGPIE.KEY.STATS.BMAX = MAGPIE.KEY.STATS.AMAX + 1;
/** @type {index} */
MAGPIE.KEY.STATS.GMAX = MAGPIE.KEY.STATS.BMAX + 1;
/** @type {index} Coefficient of friction*/
MAGPIE.KEY.STATS.CF = MAGPIE.KEY.STATS.GMAX + 1;
/** @type {index} Coefficient of Lift*/
MAGPIE.KEY.STATS.CL = MAGPIE.KEY.STATS.CF + 1;
/** @type {index} Coefficient of drag*/
MAGPIE.KEY.STATS.CD = MAGPIE.KEY.STATS.CL + 1;
/** @type {index} Center of Mass*/
MAGPIE.KEY.STATS.COM_X = MAGPIE.KEY.STATS.CD + 1;
/** @type {index} Center of Mass*/
MAGPIE.KEY.STATS.COM_Y = MAGPIE.KEY.STATS.COM_X + 1;
/** @type {index} Center of Mass*/
MAGPIE.KEY.STATS.COM_Z = MAGPIE.KEY.STATS.COM_Y + 1;
/** @type {index} Center of lift*/
MAGPIE.KEY.STATS.COL_X = MAGPIE.KEY.STATS.COM_Z + 1;
/** @type {index} Center of lift*/
MAGPIE.KEY.STATS.COL_Y = MAGPIE.KEY.STATS.COL_X + 1;
/** @type {index} Center of lift*/
MAGPIE.KEY.STATS.COL_Z = MAGPIE.KEY.STATS.COL_Y + 1;
/** @type {Enumerator<Number>} */
MAGPIE.KEY.STATS.MOTHER = MAGPIE.KEY.STATS.COL_Z + 1;
/** @type {Enumerator<Number>} */
MAGPIE.KEY.STATS.FATHER = MAGPIE.KEY.STATS.MOTHER + 1;
/** @type {Enumerator<Number>} */
MAGPIE.KEY.STATS.COMPOUND = MAGPIE.KEY.STATS.FATHER + 1;
/** @type {Enumerator<Number>} */
MAGPIE.KEY.STATS.HOST = MAGPIE.KEY.STATS.COMPOUND + 1;
/** @type {Enumerator<Number>} */
MAGPIE.KEY.STATS.ARRAY = MAGPIE.KEY.STATS.HOST + 1;
/** @desc max stretch for {@link MAGPIE_ENTITY.growth} */
//
MAGPIE.KEY.STATS.TOLERANCE_BASE = 0.5;
MAGPIE.KEY.STATS.AGILITY_MOD_MIN = 0.5;
MAGPIE.KEY.STATS.AGILITY_MOD_MAX = 100;
MAGPIE.KEY.STATS.STRETCH = 2;
//#endregion
//------------------------------------------------------------------------
/**
 * @namespace MAGPIE_CELESTIAL.traits
 * @component of {@link MAGPIE_CELESTIAL}
 * @sister of {@link MAGPIE_ORBIT}
 * @desc methods:
 * - {@link MAGPIE_PHYSICS.celestial}
 */
//------------------------------------------------------------------------
//#region > Celestial
//------------------------------------------------------------------------
MAGPIE.KEY.CELESTIAL = {};
/** @type {index} */
MAGPIE.KEY.CELESTIAL.MASS = MAGPIE.KEY.STATS.MASSKG;
/**@type {index} */
MAGPIE.KEY.CELESTIAL.CMF = MAGPIE.KEY.STATS.MASS;
/** @type {index} axial tilt */
MAGPIE.KEY.CELESTIAL.AXIAL = MAGPIE.KEY.STATS.COM_X;
/** @type {index} rotation period */
MAGPIE.KEY.CELESTIAL.ROTATION = MAGPIE.KEY.STATS.COM_Y;
/** @type {index} */
MAGPIE.KEY.CELESTIAL.ALBEDO = MAGPIE.KEY.STATS.RT;
/** @type {index} greenhouse effect */
MAGPIE.KEY.CELESTIAL.GREENHOUSE = MAGPIE.KEY.STATS.CM;
/** @type {index} */
MAGPIE.KEY.CELESTIAL.AGE = MAGPIE.KEY.STATS.G_R;
/** @type {index} radius */
MAGPIE.KEY.CELESTIAL.R = MAGPIE.KEY.STATS.COM_Z;
/** @type {index} gravity */
MAGPIE.KEY.CELESTIAL.G = MAGPIE.KEY.STATS.GMAX;
/** @type {index} escape velocity */
MAGPIE.KEY.CELESTIAL.ESCAPE = MAGPIE.KEY.STATS.VMAX;
/** @type {index} surface temperature */
MAGPIE.KEY.CELESTIAL.SURF_TEMP = MAGPIE.KEY.STATS.PWR;
/** @type {index} surface atmospheric pressure */
MAGPIE.KEY.CELESTIAL.ATM = MAGPIE.KEY.STATS.VOLUME;
/** @type {index} surface atmospheric density */
MAGPIE.KEY.CELESTIAL.ATD = MAGPIE.KEY.STATS.DENSITY;
/** @type {index} atmospheric composition */
MAGPIE.KEY.CELESTIAL.COMP = MAGPIE.KEY.STATS.FIT;
//#endregion
//------------------------------------------------------------------------
/**
 * @name
 * @desc
 *
 */
//------------------------------------------------------------------------
// #region > Fitness
//------------------------------------------------------------------------
MAGPIE.KEY.FITNESS = {};
MAGPIE.KEY.FITNESS.meta = {};
/** @type {index} */
MAGPIE.KEY.FITNESS.E_ID = 0;
/** @type {index} */
MAGPIE.KEY.FITNESS.DECKSIZE = 1;
/** @type {index} */
MAGPIE.KEY.FITNESS.TRAITS = 2;
/** @type {offset_mult} */
MAGPIE.KEY.FITNESS.STATES = 1;
/** @type {offset_mult} */
MAGPIE.KEY.FITNESS.EQUIPS = 2;
/** @type {offset_mult} */
MAGPIE.KEY.FITNESS.WASTE = 3;
/** @type {offset_mult} */
MAGPIE.KEY.FITNESS.INJURY = 4;
/** @type {offset_mult} */
MAGPIE.KEY.FITNESS.TRIBUTE = 5;
/** @type {offset_mult} */
MAGPIE.KEY.FITNESS.STAMINA = 6;
/** @type {offset_mult} */
MAGPIE.KEY.FITNESS.ZONES = MAGPIE.KEY.FITNESS.STAMINA;
/** @type {Map<String, index>} */
MAGPIE.KEY.FITNESS.OUTPUT = new Map();
/** @type {index} */
MAGPIE.KEY.FITNESS.OUTPUT.set("TRAIT_ID", 0);
/** @type {index} */
MAGPIE.KEY.FITNESS.OUTPUT.set("TRAIT_INDEX", 1);
// #endregion
//------------------------------------------------------------------------
/**
 *
 *
 */
//------------------------------------------------------------------------
//#region > Status
//------------------------------------------------------------------------
MAGPIE.KEY.STATUS = {};
MAGPIE.KEY.STATUS.meta = {};
MAGPIE.KEY.STATUS.NULL = 0;
MAGPIE.KEY.STATUS.DESTROYED = MAGPIE.KEY.STATUS.NULL + 1;
MAGPIE.KEY.STATUS.DISABLED = MAGPIE.KEY.STATUS.DESTROYED + 1;
MAGPIE.KEY.STATUS.DAMAGED = 10;
//#endregion
//------------------------------------------------------------------------
/**
 * @name Traits
 * @desc
 *
 */
//------------------------------------------------------------------------
// #region > traits
//------------------------------------------------------------------------
MAGPIE.KEY.TRAIT = {};
MAGPIE.KEY.TRAIT.meta = {};
MAGPIE.KEY.TRAIT.ARRAY = 0;
// #endregion
//------------------------------------------------------------------------
/**
 *
 *
 */
//------------------------------------------------------------------------
//#region > Comp
//------------------------------------------------------------------------
MAGPIE.KEY.COMPONENT = {};
/** @type {Map<String, keyID>} */
MAGPIE.KEY.COMPONENT.INDEX = new Map();
/** @type {Enumerator<Number>} */
MAGPIE.KEY.COMPONENT.PISTON_ENGINE = 20101;
MAGPIE.KEY.COMPONENT.STATE = {};
/** @type {Enumerator<Number>} @desc {@link MAGPIE.KEY.STATUS.meta} */
MAGPIE.KEY.COMPONENT.STATE.STATUS = 0;
/** @type {Enumerator<Number>} @desc current value Number */
MAGPIE.KEY.COMPONENT.STATE.VALUE = MAGPIE.KEY.COMPONENT.STATE.STATUS + 1;
/** @type {Enumerator<Number>} @desc last STATUS */
MAGPIE.KEY.COMPONENT.STATE.LAST_STATE = MAGPIE.KEY.COMPONENT.STATE.VALUE + 1;
/** @type {Enumerator<Number>} @desc timestamp of last state change */
MAGPIE.KEY.COMPONENT.STATE.LAST_CHANGE =
  MAGPIE.KEY.COMPONENT.STATE.LAST_STATE + 1;
/** @type {Enumerator<Number>} @desc dynamic number value for the trigger */
MAGPIE.KEY.COMPONENT.STATE.TARGET_VALUE =
  MAGPIE.KEY.COMPONENT.STATE.LAST_CHANGE + 1;
/** @type {Enumerator<Number>} @desc timestamp of trigger */
MAGPIE.KEY.COMPONENT.STATE.TARGET_TRIGGER =
  MAGPIE.KEY.COMPONENT.STATE.TARGET_VALUE + 1;
/** @type {Enumerator<Number>} @desc total size of array*/
MAGPIE.KEY.COMPONENT.STATE.ARRAY =
  MAGPIE.KEY.COMPONENT.STATE.TARGET_TRIGGER + 1;
//#endregion
//------------------------------------------------------------------------
/**
 * @name
 * @desc
 *
 */
//------------------------------------------------------------------------
// #region > Symbol
//------------------------------------------------------------------------
MAGPIE.KEY.SYMBOL = {};
/**
 * @typedef {Enumerator<Number>} symbol_type
 */
MAGPIE.KEY.SYMBOL.meta = "";
MAGPIE.KEY.SYMBOL.TYPE = {};
MAGPIE.KEY.SYMBOL.TYPE.meta = "";
/** @type {symbol_type} */
MAGPIE.KEY.SYMBOL.TYPE.AXIOM = 0;
/** @type {symbol_type} */
MAGPIE.KEY.SYMBOL.TYPE.SEMANTIC = 1;
/** @type {symbol_type} */
MAGPIE.KEY.SYMBOL.TYPE.RESOURCE = 2;
/** @type {symbol_type} */
MAGPIE.KEY.SYMBOL.TYPE.MATERIAL = 3;
/** @type {symbol_type} */
MAGPIE.KEY.SYMBOL.TYPE.PRODUCT = 4;
/** @type {symbol_type} */
MAGPIE.KEY.SYMBOL.TYPE.COMPONENT = 5;
/** @type {symbol_type} */
MAGPIE.KEY.SYMBOL.TYPE.UNIT = 6;
/** @type {symbol_type} */
MAGPIE.KEY.SYMBOL.TYPE.SERVICE = 7;
/** @type {symbol_type} */
MAGPIE.KEY.SYMBOL.TYPE.INTERACTION = 8;
/** @type {symbol_type} */
MAGPIE.KEY.SYMBOL.TYPE.CONCEPT = 9;
/** @type {symbol_type} */
MAGPIE.KEY.SYMBOL.TYPE.TERRITORY = 10;
/** @type {symbol_type} */
MAGPIE.KEY.SYMBOL.TYPE.SPECIES = 11;
/** @type {symbol_type} */
MAGPIE.KEY.SYMBOL.TYPE.PLAYER = 12;
MAGPIE.KEY.SYMBOL.INDEX = {};
// #endregion
//------------------------------------------------------------------------
/**
 * @name Context
 * @desc
 * @typedef {Enumerator<Number>} context_type
 * @typedef {{desc: String}} context_record
 */
//------------------------------------------------------------------------
// #region > Context
//------------------------------------------------------------------------
MAGPIE.KEY.CONTEXT = {};
/** @type {Map<context_type, {desc: String}} */
MAGPIE.KEY.CONTEXT.TYPE = new Map();
MAGPIE.KEY.CONTEXT.DEFAULT = 0;
MAGPIE.KEY.CONTEXT.TYPE.set(MAGPIE.KEY.CONTEXT.DEFAULT, {
  name: "Default",
  desc: "",
  allowedTypes: [],
});
MAGPIE.KEY.CONTEXT.GALAXY = 10;
MAGPIE.KEY.CONTEXT.TYPE.set(MAGPIE.KEY.CONTEXT.GALAXY, {
  name: "Galactic",
  desc: "",
  allowedTypes: ["GALAXY", "NEBULA", "STAR_CLUSTER", "MARKER"],
});
MAGPIE.KEY.CONTEXT.STAR = 30;
MAGPIE.KEY.CONTEXT.TYPE.set(MAGPIE.KEY.CONTEXT.STAR, {
  name: "Star system",
  desc: "",
  allowedTypes: ["STAR", "PLANET", "ASTEROID", "MARKER"],
});
MAGPIE.KEY.CONTEXT.PLANET = 40;
MAGPIE.KEY.CONTEXT.TYPE.set(MAGPIE.KEY.CONTEXT.PLANET, {
  name: "Planetary system",
  desc: "",
  allowedTypes: ["PLANET", "MOON", "ASTEROID", "MARKER"],
});
MAGPIE.KEY.CONTEXT.ORBIT = 50;
MAGPIE.KEY.CONTEXT.TYPE.set(MAGPIE.KEY.CONTEXT.ORBIT, {
  name: "Orbital",
  desc: "",
  allowedTypes: [
    "MARKER",
    "PLANET",
    "PLANET_MARKER",
    "MOON_MARKER",
    "GEOMARKER",
    "ORBITAL_MARKER",
    "BIOME",
  ],
});
MAGPIE.KEY.CONTEXT.SURFACE = 60;
MAGPIE.KEY.CONTEXT.TYPE.set(MAGPIE.KEY.CONTEXT.SURFACE, {
  name: "Surface",
  desc: "",
  allowedTypes: [
    "MARKER",
    "PLANET_MARKER",
    "MOON_MARKER",
    "GEOMARKER",
    "ORBITAL_MARKER",
    "BIOME",
    "REGION_MARKER",
  ],
});
MAGPIE.KEY.CONTEXT.REGION = 70;
MAGPIE.KEY.CONTEXT.TYPE.set(MAGPIE.KEY.CONTEXT.REGION, {
  name: "Regional",
  desc: "",
  allowedTypes: [
    "MARKER",
    "PLANET_MARKER",
    "MOON_MARKER",
    "GEOMARKER",
    "ORBITAL_MARKER",
    "BIOME",
    "REGION",
    "TERRITORY_MARKER",
  ],
});
MAGPIE.KEY.CONTEXT.ECOSYSTEM = 80;
MAGPIE.KEY.CONTEXT.TYPE.set(MAGPIE.KEY.CONTEXT.ECOSYSTEM, {
  name: "Ecosystem",
  desc: "",
  allowedTypes: [
    "MARKER",
    "PLANET_MARKER",
    "MOON_MARKER",
    "GEOMARKER",
    "ORBITAL_MARKER",
    "BIOME_MARKER",
    "REGION_MARKER",
    "TERRITORY_MARKER",
  ],
});
MAGPIE.KEY.CONTEXT.TERRITORY = 90;
MAGPIE.KEY.CONTEXT.TYPE.set(MAGPIE.KEY.CONTEXT.TERRITORY, {
  name: "Territorial",
  desc: "",
  allowedTypes: [
    "MARKER",
    "PLANET_MARKER",
    "MOON_MARKER",
    "GEOMARKER",
    "ORBITAL_MARKER",
    "BIOME",
    "REGION",
    "TERRITORY",
    "UNIT_MARKER",
  ],
});
MAGPIE.KEY.CONTEXT.LOCAL = 100;
MAGPIE.KEY.CONTEXT.TYPE.set(MAGPIE.KEY.CONTEXT.LOCAL, {
  name: "Local",
  desc: "",
  allowedTypes: [
    "MARKER",
    "PLANET_MARKER",
    "MOON_MARKER",
    "GEOMARKER",
    "ORBITAL_MARKER",
    "BIOME_MARKER",
    "REGION_MARKER",
    "TERRITORY_MARKER",
    "UNIT",
  ],
});
// #endregion
//------------------------------------------------------------------------
/**
 * @desc {@link MAGPIE_STATE}
 * @typedef {Number} stateID
 */
//------------------------------------------------------------------------
//#region > State
//------------------------------------------------------------------------
MAGPIE.KEY.STATE.meta = {};
/** {@link MAGPIE_STATE.setup} */
MAGPIE.KEY.STATE.meta.schema = [
  "ID",
  "type",
  "name",
  "description",
  "stack",
  "onApply",
  "onUpdate",
  "onRemove",
  "onExpire",
];
MAGPIE.KEY.STATE.TYPE = {};
//#endregion
//------------------------------------------------------------------------
/**
 * @name
 * @desc
 *
 */
//------------------------------------------------------------------------
// #region > Emote
//------------------------------------------------------------------------
MAGPIE.KEY.EMOTE = {};
MAGPIE.KEY.EMOTE.meta = {};
MAGPIE.KEY.EMOTE.TYPE = {};
MAGPIE.KEY.EMOTE.TYPE.DEFAULT = 0;
MAGPIE.KEY.EMOTE.TYPE.FSM = MAGPIE.KEY.EMOTE.TYPE.DEFAULT + 1;
MAGPIE.KEY.EMOTE.TYPE.TRIGGER = MAGPIE.KEY.EMOTE.TYPE.FSM + 1;
MAGPIE.KEY.EMOTE.TYPE.ARRAY = MAGPIE.KEY.EMOTE.TYPE.TRIGGER + 1;
MAGPIE.KEY.EMOTE.INDEX = {};
((MAGPIE.KEY.EMOTE.INDEX.meta = "index of all emotes"),
  (MAGPIE.KEY.EMOTE.INDEX.SEEK_TARGET = 302));
MAGPIE.KEY.EMOTE.INDEX.SCHEDULE = 310;
// #endregion
//------------------------------------------------------------------------
/**
 * @name switches
 * @desc
 *
 */
//------------------------------------------------------------------------
// #region > SWITCH
//------------------------------------------------------------------------
MAGPIE.KEY.SWITCHES = {};
/**
 * @name date
 * @desc
 *
 */
//------------------------------------------------------------------------
// #region > date
//------------------------------------------------------------------------
MAGPIE.KEY.SWITCHES.SUPER_TICK = 131;
MAGPIE.KEY.SWITCHES.MEGA_TICK = MAGPIE.KEY.SWITCHES.SUPER_TICK + 1;
MAGPIE.KEY.SWITCHES.ULTRA_TICK = MAGPIE.KEY.SWITCHES.MEGA_TICK + 1;
MAGPIE.KEY.SWITCHES.NEW_DAY = MAGPIE.KEY.SWITCHES.ULTRA_TICK + 1;
MAGPIE.KEY.SWITCHES.NEW_MONTH = MAGPIE.KEY.SWITCHES.NEW_DAY + 1;
MAGPIE.KEY.SWITCHES.NEW_YEAR = MAGPIE.KEY.SWITCHES.NEW_MONTH + 1;
MAGPIE.KEY.SWITCHES.LEAP_DAY = MAGPIE.KEY.SWITCHES.NEW_YEAR + 1;
MAGPIE.KEY.SWITCHES.LEAP_MONTH = MAGPIE.KEY.SWITCHES.LEAP_DAY + 1;
MAGPIE.KEY.SWITCHES.LEAP_YEAR = MAGPIE.KEY.SWITCHES.LEAP_MONTH + 1;
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
/**
 * @name
 * @desc
 *
 */
//========================================================================
// #region - GENERAL
//========================================================================
/**
 * @name
 * @desc
 *
 */
//------------------------------------------------------------------------
// #region > Urgency
//------------------------------------------------------------------------
/**
 * @typedef {Enumerator<Number>} urgency
 * @typedef {{value: Number, desc: String}} urgency_record
 * @type {Map<keyID, {value: urgency, desc: String>}}
 */
MAGPIE.KEY.INDEX.URGENCY = new Map();
/** @type {key_index} */
MAGPIE.KEY.INDEX.URGENCY_STRATEGIC = 10001;
MAGPIE.KEY.INDEX.URGENCY.set(MAGPIE.KEY.INDEX.URGENCY_STRATEGIC, {
  name: "STRATEGIC",
  value: -1,
  desc: "neutral urgency to always keep in mind",
});
/** @type {key_index} */
MAGPIE.KEY.INDEX.URGENCY_IMMEDIATE = 10100;
MAGPIE.KEY.INDEX.URGENCY.set(MAGPIE.KEY.INDEX.URGENCY_IMMEDIATE, {
  name: "IMMEDIATE",
  value: 4,
  desc: "Must do NOW",
});
/** @type {key_index} */
MAGPIE.KEY.INDEX.URGENCY_DIRE = 10101;
MAGPIE.KEY.INDEX.URGENCY.set(MAGPIE.KEY.INDEX.URGENCY_DIRE, {
  name: "DIRE",
  value: 3,
  desc: "Must do NEXT",
});
/** @type {key_index} */
MAGPIE.KEY.INDEX.URGENCY_CRITICAL = 10102;
MAGPIE.KEY.INDEX.URGENCY.set(MAGPIE.KEY.INDEX.URGENCY_CRITICAL, {
  name: "CRITICAL",
  value: 2,
  desc: "Must do AS SOON AS POSSIBLE (ASAP)",
});
/** @type {key_index} */
MAGPIE.KEY.INDEX.URGENCY_SIGNIFICANT = 10103;
MAGPIE.KEY.INDEX.URGENCY.set(MAGPIE.KEY.INDEX.URGENCY_SIGNIFICANT, {
  name: "SIGNIFICANT",
  value: 1,
  desc: "Should do SOON",
});
/** @type {key_index} */
MAGPIE.KEY.INDEX.URGENCY_LATENT = 10104;
MAGPIE.KEY.INDEX.URGENCY.set(MAGPIE.KEY.INDEX.URGENCY_LATENT, {
  name: "LATENT",
  value: 0,
  desc: "Can do if and when possible",
});
/**
 * @name
 * @desc
 *
 */
//------------------------------------------------------------------------
// #region > Gravity
//------------------------------------------------------------------------
/**
 * @typedef {Enumerator<Number>} gravity
 * @typedef {{value: Number, desc: String}} gravity_record
 * @type {Map<keyID, {value: gravity, desc: String>}}
 *
 * */
MAGPIE.KEY.INDEX.GRAVITY = new Map();
/** @type {key_index} */
MAGPIE.KEY.INDEX.GRAVITY_TACTICAL = 10199;
MAGPIE.KEY.INDEX.GRAVITY.set(MAGPIE.KEY.INDEX.GRAVITY_TACTICAL, {
  name: "TACTICAL",
  value: -1,
  desc: "Neutral gravity to keep in mind",
});
/** @type {key_index} */
MAGPIE.KEY.INDEX.GRAVITY_VITAL = 10200;
MAGPIE.KEY.INDEX.GRAVITY.set(MAGPIE.KEY.INDEX.GRAVITY_VITAL, {
  name: "VITAL",
  value: 4,
  desc: "Must care about this ABOVE ALL",
});
/** @type {key_index} */
MAGPIE.KEY.INDEX.GRAVITY_SEVERE = 10201;
MAGPIE.KEY.INDEX.GRAVITY.set(MAGPIE.KEY.INDEX.GRAVITY_SEVERE, {
  name: "SEVERE",
  value: 3,
  desc: "Must care about this AS MUCH AS POSSIBLE",
});
/** @type {key_index} */
MAGPIE.KEY.INDEX.GRAVITY_PRESSING = 10202;
MAGPIE.KEY.INDEX.GRAVITY.set(MAGPIE.KEY.INDEX.GRAVITY_PRESSING, {
  name: "PRESSING",
  value: 2,
  desc: "Should care about this when possible",
});
/** @type {key_index} */
MAGPIE.KEY.INDEX.GRAVITY_IMPORTANT = 10203;
MAGPIE.KEY.INDEX.GRAVITY.set(MAGPIE.KEY.INDEX.GRAVITY_IMPORTANT, {
  name: "IMPORTANT",
  value: 1,
  desc: "Might care sometimes; probably unsafe to ignore",
});
/** @type {key_index} */
MAGPIE.KEY.INDEX.GRAVITY_TRIVIAL = 10204;
MAGPIE.KEY.INDEX.GRAVITY.set(MAGPIE.KEY.INDEX.GRAVITY_TRIVIAL, {
  name: "TRIVIAL",
  value: 0,
  desc: "Probably safe to ignore",
});
// #endregion
//------------------------------------------------------------------------
/**
 * @name
 * @desc
 *
 */
//------------------------------------------------------------------------
// #region > Ambig.
//------------------------------------------------------------------------
/**
 * @typedef {Enumerator<Number>} ambiguity
 * @typedef {{value: Number, desc: String}} ambiguity_record
 * @type {Map<keyID, {value: ambiguity, desc: String}>}
 * */
MAGPIE.KEY.INDEX.AMBIGUITY = new Map();
/** @type {key_index} */
MAGPIE.KEY.INDEX.AMBIGUITY_UNIVERSAL = 10300;
MAGPIE.KEY.INDEX.AMBIGUITY.set(MAGPIE.KEY.INDEX.AMBIGUITY_UNIVERSAL, {
  value: 0,
  desc: "Anyone can know about this",
});
MAGPIE.KEY.INDEX.AMBIGUITY_AMBIGUOUS = 10301;
MAGPIE.KEY.INDEX.AMBIGUITY.set(MAGPIE.KEY.INDEX.AMBIGUITY_AMBIGUOUS, {
  value: 1,
  desc: "Must investigate to know",
});
MAGPIE.KEY.INDEX.AMBIGUITY_CONTESTED = 10302;
MAGPIE.KEY.INDEX.AMBIGUITY.set(MAGPIE.KEY.INDEX.AMBIGUITY_CONTESTED, {
  value: 2,
  desc: "Information about this is unreliable",
});
MAGPIE.KEY.INDEX.AMBIGUITY_DISCREET = 10303;
MAGPIE.KEY.INDEX.AMBIGUITY.set(MAGPIE.KEY.INDEX.AMBIGUITY_DISCREET, {
  value: 3,
  desc: "Information about this is hard to find",
});
MAGPIE.KEY.INDEX.AMBIGUITY_SECRET = 10304;
MAGPIE.KEY.INDEX.AMBIGUITY.set(MAGPIE.KEY.INDEX.AMBIGUITY_SECRET, {
  value: 4,
  desc: "Information about this is private",
});
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
// #region > ANSI esc
//------------------------------------------------------------------------
MAGPIE.KEY.ANSI = {};
/**
 * @desc ANSI escape characters
 * @typedef {String} ansi_escape
 */
MAGPIE.KEY.ANSI.meta = {};
/** @type {ansi_escape}  */
MAGPIE.KEY.ANSI.ESC = "\x1b";
/** @type {ansi_escape}  */
MAGPIE.KEY.ANSI.SAVE_CURSOR = `${MAGPIE.KEY.ANSI.ESC}[s`;
/** @type {ansi_escape}  */
MAGPIE.KEY.ANSI.RESTORE_CURSOR = `${MAGPIE.KEY.ANSI.ESC}[u`;
/** @type {ansi_escape}  */
MAGPIE.KEY.ANSI.CARRIAGE_RETURN = "\x0D";
/** @type {ansi_escape}  */
MAGPIE.KEY.ANSI.MOVE_UP = `${MAGPIE.KEY.ANSI.ESC}[1A`;
/** @type {ansi_escape}  */
MAGPIE.KEY.ANSI.moveUpCustom = (linesUP) =>
  `${MAGPIE.KEY.ANSI.ESC}[${linesUP}A`;
/** @type {ansi_escape}  */
MAGPIE.KEY.ANSI.moveDownCustom = (linesDown) =>
  `${MAGPIE.KEY.ANSI.ESC}[${linesDown}B`;
/** @type {ansi_escape}  */
MAGPIE.KEY.ANSI.MOVE_DOWN = `${MAGPIE.KEY.ANSI.ESC}[1B`;
/** @type {ansi_escape} @desc clear the line, reset horizontal position */
MAGPIE.KEY.ANSI.CLEAR_LINE = `${MAGPIE.KEY.ANSI.ESC}[2K`;
/** @type {ansi_escape} */
MAGPIE.KEY.ANSI.STYLE_RESET = "\x1b[0m";
/** @type {ansi_escape} */
MAGPIE.KEY.ANSI.STYLE_RED = "\x1b[31m";
/** @type {ansi_escape} */
MAGPIE.KEY.ANSI.STYLE_GREEN = "\x1b[32m";
/** @type {ansi_escape} */
MAGPIE.KEY.ANSI.STYLE_YELLOW = "\x1b[33m";
/** @type {ansi_escape} */
MAGPIE.KEY.ANSI.STYLE_BLUE = "\x1b[34m";
/** @type {ansi_escape} */
MAGPIE.KEY.ANSI.STYLE_CYAN = `\x1b[35m`;
/** @type {ansi_escape} */
MAGPIE.KEY.ANSI.STYLE_BOLD = "\x1b[1m";
/** @type {ansi_escape} */
MAGPIE.KEY.ANSI.STYLE_DIM = "\x1b[2m";
// #endregion
//------------------------------------------------------------------------
/**
 * @name HTML
 * @desc
 *
 */
//------------------------------------------------------------------------
// #region > HTML
//------------------------------------------------------------------------
MAGPIE.KEY.HTML.meta = {};
MAGPIE.KEY.HTML.VENDOR_PREFIX = [
  ["-webkit-", "Chrome, Safari, Edge, iOS"],
  ["-moz-", "Moizlla Firefox"],
  ["-ms-", "Internet Explorer / legacy Microsoft Edge"],
];
MAGPIE.KEY.HTML.INPUT = {};
/** @type {Map<String, {type: String}>} */
MAGPIE.KEY.HTML.INPUT = {};
MAGPIE.KEY.HTML.INPUT.TYPE = {};
/**
 * @desc Default input for free text
 */
MAGPIE.KEY.HTML.INPUT.TYPE.TEXT = "text";
/**
 * @desc By default, the browser chooses the mask symbol
 * (usually a solid dot •). If you want to force it to be an
 * asterisk * or a custom character, you can use the CSS text-security
 * property. Note that this property requires vendor prefixes for
 * compatibility with WebKit-based browsers like Chrome and Safari.
 */
MAGPIE.KEY.HTML.INPUT.TYPE.PASSWORD = "password";
/**
 * @desc Accepts only numeric characters. It provides up/down arrow
 * steppers in the input box.
 */
MAGPIE.KEY.HTML.INPUT.TYPE.NUMBER = "number";
/**
 * @desc Displays a visual slider control. Use min and max attributes
 * to set the boundaries.
 */
MAGPIE.KEY.HTML.INPUT.TYPE.RANGE = "range";
/**
 * @desc Formats the field for telephone numbers. It opens a numeric
 * keypad on mobile devices.
 */
MAGPIE.KEY.HTML.INPUT.TYPE.TEL = "tel";
/**
 * @desc Opens a native calendar dropdown picker to select a year, month, and day.
 */
MAGPIE.KEY.HTML.INPUT.TYPE.DATE = "date";
/**
 * @desc Opens a native time picker to select hours and minutes
 * (and sometimes seconds, depending on the browser).
 */
MAGPIE.KEY.HTML.INPUT.TYPE.TIME = "time";
/**
 * @desc Combines both the calendar picker and the time picker
 * into a single input field.
 */
MAGPIE.KEY.HTML.INPUT.TYPE.DATETIME_LOCAL = "datetime-local";
/**
 * @desc Specialized input types for selecting a month of the year.
 */
MAGPIE.KEY.HTML.INPUT.TYPE.MONTH = "month";
/**
 * @desc Specialized input types for selecting a week of the year.
 */
MAGPIE.KEY.HTML.INPUT.TYPE.WEEK = "week";
/**
 * @desc Validates that the input is a properly formatted email address.
 * It checks for the presence of an '@' symbol and a domain name.
 * On mobile devices, it often provides a keyboard optimized for email
 * input, including the '@' symbol and '.com' key.
 */
MAGPIE.KEY.HTML.INPUT.TYPE.EMAIL = "email";
/**
 * @desc Validates that the input is a properly formatted URL. It checks
 * for the presence of a valid protocol (like 'http://' or 'https://')
 * and a domain name. On mobile devices, it often provides a keyboard
 * optimized for URL input, including the '/' and '.com' keys.
 */
MAGPIE.KEY.HTML.INPUT.TYPE.URL = "url";
/**
 * @desc Provides a search field with built-in features like a clear button
 * to quickly erase the input. It is visually styled to indicate that it is
 * meant for search queries.
 */
MAGPIE.KEY.HTML.INPUT.TYPE.SEARCH = "search";
/**
 * @desc Allows users to select one or more files from their device. When
 * clicked, it opens the file explorer dialog. The selected files can then be
 * uploaded to a server or processed in the browser using JavaScript.
 */
MAGPIE.KEY.HTML.INPUT.TYPE.CHECKBOX = "checkbox";
/**
 * @desc Allows users to select one option from a predefined set of options.
 */
MAGPIE.KEY.HTML.INPUT.TYPE.RADIO = "radio";
/**
 * @desc Provides a color picker interface that allows users to select a color.
 * When clicked, it opens the operating system's native color picker palette.
 * The selected color is typically returned as a Hex code value (e.g., #ff0000 for red).
 */
MAGPIE.KEY.HTML.INPUT.TYPE.STYLE = "color";
/**
 * @desc A button that allows users to upload files. When clicked,
 * it opens the file explorer dialog, allowing users to select one or
 * more files from their device. The selected files can then be uploaded
 * to a server or processed in the browser using JavaScript.
 */
MAGPIE.KEY.HTML.INPUT.TYPE.FILE = "file";
/**
 * @desc Keeps data inside the form that the user cannot see or
 * interact with. It is used to pass system IDs.
 */
MAGPIE.KEY.HTML.INPUT.TYPE.HIDDEN = "hidden";
/**
 * @desc A button that submits the form data to the server. When clicked,
 * it triggers the form's submit event, sending all the input data to the
 * specified action URL using the defined method (GET or POST).
 */
MAGPIE.KEY.HTML.INPUT.TYPE.SUBMIT = "submit";
/**
 * @desc Standard clickable button.
 */
MAGPIE.KEY.HTML.INPUT.TYPE.BUTTON = "button";
/**
 * @desc Standard clickable button thatclears all fields in the form
 * back to their default values.
 */
MAGPIE.KEY.HTML.INPUT.TYPE.RESET = "reset";
/**
 * @desc Uses an image file as a clickable submit button. When clicked, it
 * submits the form data to the server, just like a regular submit button.
 * The image is specified using the 'src' attribute, and it can be styled
 * with CSS to fit the design of the webpage.
 */
MAGPIE.KEY.HTML.INPUT.TYPE.IMAGE = "image";
// #endregion
//------------------------------------------------------------------------
/**
 *
 *
 */
//------------------------------------------------------------------------
//#region > WMedia
//------------------------------------------------------------------------
MAGPIE.KEY.WMEDIA = {};
MAGPIE.KEY.WMEDIA.DEFAULT_PATH = "C:\\Windows\\Media\\";
MAGPIE.KEY.WMEDIA.CHORD = `${MAGPIE.KEY.WMEDIA.DEFAULT_PATH}chord.wav`;
//#endregion
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
 *
 * @desc back to {@link MAGPIE}
 *
 */
module.exports = { MAGPIE };
//========================================================================
// END OF FILE
//========================================================================
