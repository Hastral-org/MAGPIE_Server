# Account handling

Source: [main/SERVER.js](https://github.com/Hastral-org/MAGPIE_Server/blob/main/SERVER.js)

```javascript
/**
 * @name
 * @desc
 *
 */
//------------------------------------------------------------------------
// #region > Account
//------------------------------------------------------------------------
app.post("/login", MAGPIE_SERVER.public.loginLimiter, async (req, res) => {
    const ePrefix = "[APP POST].login: ";
    const { email, pass } = req.body;
    try
    {
        if(!email || !pass)
            return res.status(MAGPIE.KEY.SERVER.HTTP.STATUS_400).json({
                error: ePrefix + "Missing credentials"
            })
        const { token } = await account.verifyCredentials(email, pass, MAGPIE_SERVER)
        return res.status(MAGPIE.KEY.SERVER.HTTP.STATUS_200).json({ token })
    }
    catch(e)
    {
        const status = e.message === "Invalid credentials"
            ? MAGPIE.KEY.SERVER.HTTP.STATUS_401.code
            : e.message === "Account is frozen"
                ? MAGPIE.KEY.SERVER.HTTP.STATUS_403.code
                : MAGPIE.KEY.SERVER.HTTP.STATUS_500.code
        if(status === 500)
            MAGPIE_SERVER.error(ePrefix + e.message, e)
        return res.status(status).json({
            error: ePrefix + e.message
        })
    }
})
// app.get("/api/player-data", account.authenticateToken, async (req, res) => {
// res.json({ message: "Welcome, " + req.user.username })
// })
app.get("/verify-email", async (req, res) => {
    const ePrefix = "[HTTP]/verify-email: "
    const code = MAGPIE.KEY.SERVER.HTTP;
    const { token } = req.query;
    const db = MAGPIE_DATABASE;
    try
    {
        const printPlayer = function(ID, email, username)
        {
            const handle = email ? email : username
            return `[PLAYER-${ID} | ${handle}]`
        }
        if(!token)
            return res.status(code.STATUS_401.code).send("<h1>Missing verification token</h1>");
        const decoded = MAGPIE_SERVER.JWT.verify(token, MAGPIE_SERVER.config.jwtSecret)
        // console.error(new Error(Object.entries(decoded)))
        const email = decoded?.email
        const username = decoded?.username
        if(!decoded.isRegistrationToken)
            return res.status(code.STATUS_400.code).send("<h1>Invalid token type</h1>")
        const existingEmail = await db.getPlayerByEmail(decoded.email)
        const existingUser = await db.getPlayerByUsername(decoded.username)
        const player = printPlayer(existingEmail?.ID || existingUser?.ID, decoded.email)
        if(!existingEmail && !existingUser)
        {
            res.status(code.STATUS_200.code).send(`<h1>Registration Complete!</h1>
                    <p>Your M.A.G.P.I.E. profile is active.
                    You can now close this window and login.</p>`)
            MAGPIE_SERVER.log(ePrefix + `Registration completed for ${player}.`)
            return await db.createPlayer({
                username: decoded.username,
                PASS: decoded.PASS,
                email: decoded.email
            })
        }
        if(existingEmail?.email !== email)
            return res.status(code.STATUS_409.code).send("<h1>Error</h1><p>This email has already been registered.</p>")
        if(existingUser?.username !== username)
            return res.status(code.STATUS_409.code).send("<h1>Error</h1><p>This username has already been taken.</p>")
        const isAlreadyConfirmed = `<h1>${player} created.</h1>
        <p>You already successfully used this link to confirm registration.</p>
        <p>Login with your credentials at ${MAGPIE_SERVER.config.domain}/login or within the ShelderEvolution app.</p>
        <p>You may now close this window.</p>`
        return res.status(code.STATUS_200.code).send(isAlreadyConfirmed)
    }
    catch(e)
    {
        MAGPIE_SERVER.error(ePrefix + e.message, e)
        if (e.name === 'JsonWebTokenError' || e.name === 'TokenExpiredError')
            return res.status(code.STATUS_400.code).send("<h1>Verification Failed</h1><p>The link is invalid, altered, or has expired.</p>");
        res.status(500).send(MAGPIE.KEY.SERVER.MESSAGE.INTERNAL_ERROR)
    }
})
app.get("/reset-password", (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'routes', 'reset-password.html'));
})
app.post("/reset-password", async (req, res) => {
    const ePrefix = "[HTTP].resetPassword: "
    const { email } = req.body
    try
    {
        if(!email)
            return res.status(400).send("<h1>Email required</h1>")
        await account.requestPassowrdReset(email, MAGPIE_SERVER)
        res.status(200).send(`
            <h1>Recovery requested</h>
            <p>Recovery link has been sent to the provided email.</p>`)
    }
    catch(e)
    {
        MAGPIE_SERVER.error(ePrefix + e.message, e)
        res.status(500).send("<h1>Internal server error</h1><p>Please, try again later.</h1>")
    }
})
app.post("/finalize-account", async (req, res) => {
    const ePrefix = "[HTTP] "
    try
    {
        const { token, email } = req.body
        await MAGPIE_SERVER.handlers.accountHandler.account.process
    }
    catch(e)
    {
        MAGPIE_SERVER.error(ePrefix + e.message, e)
    }
})
app.post("/finalize-password-reset", async (req, res) => {
    try
    {
        const ePrefix = "[HTTP].finalizePasswordReset: "
        const { token, password } = req.body
        await MAGPIE_SERVER.handlers.accountHandler.account
            .processPasswordReset(token, password, MAGPIE_SERVER)
        res.status(200).redirect("/reset-password?success=true&token=" + token + "&email=" + req.body.email)
    }
    catch(e)
    {
        res.status(400).send("<h1>Reset failed</h1><p>Please, request a new link.</p>")
    }
})
// #endregion
//------------------------------------------------------------------------
```
