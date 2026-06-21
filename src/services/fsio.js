/**
 * @name FSIO
 * @desc File System Input-Output worker
 * @version 0.39.0
 */
const { parentPort } = require("worker_threads");
const fs = require("fs");
const path = require("path");
const logDir = "";
const worker = {};
const ePrefix = "[FSIO WORKER] "
parentPort.on("message", async(payload) => {
	if(!parentPort) return
	const { method, args } = payload
	/** @type {Number} */
	const requestID = args?.requestID || Date.now()
	try
	{
		if(!worker[method])
			throw new Error(`[${method}] is invalid method`)
		const result = await worker[method](args)
		parentPort.postMessage( { requestID, result })
	}
	catch(e)
	{
		console.error(ePrefix + e.message, e)
		parentPort.postMessage({ requestID, error: e.message })
	}
})
worker.close = function close()
{
	try
	{
		console.log(ePrefix + "closing I/O filesystem...")
		process.exit(0)
	}
	catch(e)
	{
		process.stderr.write(ePrefix + `Failed to close: ${e.message}. Forcing shutdown...`)
		process.exit(1)
	}
}
worker.appendLog = function (args)
{
	try
	{
		const log = args
		const message = `${log.timestamp}[${log.level}] ${log.message}`
		fs.appendFileSync(logDir + log.filename, message + "\n", "utf-8")
		// process.stdout.write(`message logged to ${logDir}${log.filename}`)
	}
	catch(e)
	{
		process.stderr.write(`Failed to write log: ${e.message}`)
	}
}