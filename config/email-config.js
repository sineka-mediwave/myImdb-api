const nodemailer = require("nodemailer");
require("dotenv").config();

const mailConfig = {
  email: process.env.ZOHO_MAIL,
  password: process.env.ZOHO_PASSWORD,
};

// create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
  host: "smtp.zoho.in",
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: mailConfig.email,
    pass: mailConfig.password,
  },
});

module.exports = { transporter, mailConfig };
