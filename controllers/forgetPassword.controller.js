const { models, Sequelize } = require("../config/sequalize-config");
const Op = Sequelize.Op;
const { mailConfig, transporter } = require("../config/email-config");

// Function to generate OTP
function generateOTP() {
  let digits = "0123456789";
  let OTP = "";
  for (let i = 0; i < 4; i++) {
    OTP += digits[Math.floor(Math.random() * 10)];
  }
  return parseInt(OTP);
}

const forgetPassword = async (req, res, next) => {
  try {
    const searchUser = await models.users.findOne({
      attributes: ["id"],
      where: { email: req.body.email },
    });
    const otp = generateOTP();
    if (searchUser === null) {
      return next({
        status: 400,
        message: "User not found",
      });
    } else {
      const OtpEntry = await models.verification.create({
        verification_type: "forget",
        otp: otp,
        expiresAt: new Date().getTime() + 5 * 60000,
        user_id: searchUser.id,
      });
      if (OtpEntry) {
        const options = {
          from: `sender<${mailConfig.email}>`,
          to: req.body.email,
          subject: "forget password",
          html: `
          <div style="overflow:auto;line-height:2; color: #000">
          <div style="margin:50px auto;width:70%;padding:20px 0">
            <div style="border-bottom:1px solid #eee">
              <a href="" style="font-size:1.4em;background-color: #000;color: #f5c518;padding: 5px; border-radius: 5px;text-decoration:none;font-weight:600">MyIMDb</a>
            </div>
            <p style="font-size:18px">Hi,</p>
            <p>Forget Password Verification mai. Use the following OTP to complete your Sign Up procedures. OTP is valid for 5 minutes. </p>
            <p>Click 
              <a href="" style="color: #00466a;text-decoration:none">here</a> to view the page.</p>
            <h2 style="background: #f5c518;margin: 0 auto;width: max-content;padding: 0 10px;color: #000;border-radius: 4px;">324457</h2>
            <p style="font-size:0.9em;">Regards,<br />Your Brand</p>
            <hr style="border:none;border-top:1px solid #eee" />
            <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
              <p>my-Imdb-website</p>
              <p>Rate your favroute movie</p>
         
            </div>
          </div>
        </div>`, // html body
        };
        transporter.sendMail(options, (error, info) => {
          if (error) console.log("\n mail error..", error);
          return console.log("\n success...", info);
        });
        return res.json("sending mail");
      } else {
        return next({
          status: 400,
          message: "Otp not created",
        });
      }
    }
  } catch (error) {
    return next({
      status: 400,
      message: error.message,
    });
  }
};

module.exports = {
  forgetPassword,
};
