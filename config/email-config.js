const nodemailer = require("nodemailer");
const mailConfig = {
  email: "sineka_mv@zohomail.in",
  password: "sIneka@619",
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
