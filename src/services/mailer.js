const nodemailer = require("nodemailer")
const { MAGPIE } = require("../index")
const transporter = nodemailer.createTransport({
    host: "://gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
})
module.exports = {
    sendConfirmation: async (toEmail, token) => {
        const link = `${MAGPIE.KEY.SERVER.DOMAIN}${token}`
        await transporter.sendMail({
            from: `'Shelder Evolution' <${MAGPIE.KEY.SERVER.NO_REPLY}>`,
            to: toEmail,
            subject: "Activate your Shelder Evolution account 🪐",
            html:   `<p>Thanks for joining! Click the link below to confirm your email:</p>
                    <a href="${link}">${link}</a>`
        })
    },
    sendRecovery: async (toEmail, token) => {
        const link = `${MAGPIE.KEY.SERVER.DOMAIN}${token}`;
        await transporter.sendMail({
            from: `'Shelder Evolution' <${MAGPIE.KEY.SERVER.NO_REPLY}>`,
            to: toEmail,
            subject: "Reset your M.A.G.P.I.E. Account Password 🔑",
            html:   `<p>We received a password reset request.</p> 
                    <p>If you did not make the request, you can ignore this email. 
                    Do let us know by writing at [${MAGPIE.KEY.SERVER.ADMIN_EMAIL}] if this
                    persists.</p>
                    <p>If you indeed made the request to reset your password, click the link below:</p>
                    <a href="${link}">${link}</b>`
        })
    }
}