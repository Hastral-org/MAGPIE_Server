const { MAGPIE } = require("../src/index");
/**
 *
 * @desc
 */
const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
  host: "smtp.sendgrid.net",
  port: 465,
  secure: true,
  auth: {
    user: "apikey",
    pass: MAGPIE.config.sendGrid_API,
  },
});
// const domain = "http://localhost:3000"
const domain = MAGPIE.KEY.SERVER.DOMAIN;
const mailer = {};
mailer.sendRecovery = async function (email, token) {
  const line1 =
    "A password reset has been requested. If you didn't initiate the request, ignore this email. You can report the problem to 'admin@shelderevolution.org'.";
  const link = `${domain}/reset-password?token=${token}`;
  const follow = "Follow this link ";
  const clickhere = "Click here ";
  const reset = "to reset your credentials";
  const mailOptions = {
    from: "'ShelderEvolution' <noreply@shelderevolution.org>",
    to: email,
    subject: "ShelderEvolution — Password reset request",
    text: `${line1}. ` + `${follow}${reset}: ${link}`,
    html:
      `<p>${line1}</p>` + `<p><a href="${link}">${clickhere}${reset}.</a></p>`,
  };
  return transporter.sendMail(mailOptions);
};
/**
 *
 * @param {String} email
 * @param {String} token
 */
mailer.sendConfirmation = async function (email, token) {
  const line1 =
    "Welcome to ShelderEvolution MMORPG! To enable your login access, confirm your registration";
  const link = `${domain}/account/verify-email?token=${token}`;
  const follow = "Follow this link ";
  const clickhere = "Click here ";
  const verify = "to verify your email address";
  const mailOptions = {
    from: "'ShelderEvolution' <noreply@shelderevolution.org>",
    to: email,
    subject: "ShelderEvolution — Confirm your registration",
    text: `${line1}. ${follow}${verify}: ${link}`,
    html:
      `<p>${line1}</p>` + `<p><a href="${link}">${clickhere}${verify}.</a></p>`,
  };
  return transporter.sendMail(mailOptions);
};
module.exports = mailer;
