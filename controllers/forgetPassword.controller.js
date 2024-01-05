const { models, Sequelize } = require("../config/sequalize-config");
const Op = Sequelize.Op;
const { mailConfig, transporter } = require("../config/email-config");

// Function to generate OTP
function generateOTP() {
  let digits = "0123456789";
  let OTP = "";
  for (let i = 0; i < 6; i++) {
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
      const expiresAt = new Date().getTime() + 5 * 60000;
      const otpEntry = await models.verification.create({
        verification_type: "forget password",
        otp: otp,
        expiresAt: expiresAt,
        user_id: searchUser.id,
      });
      if (otpEntry) {
        //sends email with otp
        sendVerificationEmail(req.body.email, otp, next);
        //delete the otpEntry after it expires
        setTimeout(() => {
          scheduleRemoveExpiredOtps(next);
        }, 1000 * 60 * 5);
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

// Function to send verification email
const sendVerificationEmail = (email, otp, next) => {
  const options = {
    from: `sender<${mailConfig.email}>`,
    to: email,
    subject: "forget password",
    html: `
    <div style="overflow:auto;line-height:2; color: #000">
    <div style="margin:50px auto;width:70%;padding:20px 0">
      <div style="border-bottom:1px solid #eee">
        <a href="" style="font-size:1.4em;background-color: #000;color: #f5c518;padding: 5px; border-radius: 5px;text-decoration:none;font-weight:600">
        MyIMDb</a>
      </div>
      <p style="font-size:18px">Hi,</p>
      <p>Forget Password Verification mai. Use the following OTP to complete your Sign Up procedures. OTP is valid for 5 minutes. </p>
      <p>Click 
        <a href="" style="color: #00466a;text-decoration:none">here</a> to view the page.</p>
      <h2 style="background: #f5c518;margin: 0 auto;width: max-content;padding: 0 10px;color: #000;border-radius: 4px;">${otp}</h2>
      <p style="font-size:0.9em;">Regards,<br />MyIMDb</p>
      <hr style="border:none;border-top:1px solid #eee" />
      <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
        <p>my-Imdb-website</p>
        <p>Rate your favroute movie</p>
   
      </div>
    </div>
  </div>`, // html body
  };

  transporter.sendMail(options, (error, info) => {
    if (error) next({ status: 400, message: error.message });

    return next({ status: 200, message: `mail send to ${info.envelope.to}` });
  });
};

const scheduleRemoveExpiredOtps = (next) => {
  // Delete those entries to clean up expired OTPs
  models.verification
    .destroy({
      where: {
        expiresAt: { [Op.lt]: new Date().getTime() }, // Entries with expiresAt less than the current time
      },
    })
    .then((numDeleted) => {
      console.log(`Removed ${numDeleted} expired OTP entries.`);
      return next({
        status: 200,
        message: `Removed ${numDeleted} expired OTP entries.`,
      });
    })
    .catch((error) => {
      console.error("Error removing expired OTP entries:", error);
      return next({ status: 200, message: error.message });
    });
};

const otpVerification = async (req, res, next) => {
  try {
    const searchUser = await models.verification.findOne({
      //   attributes: ["id"],
      where: { otp: req.body.otp, user_id: req.params.id },
    });
    if (searchUser === null) {
      return next({
        status: 400,
        message: "Invalid otp",
      });
    }
    // const updatedPassword = await models.users.update(
    //   {
    //     user_password: req.body.newPassword,
    //   },
    //   {
    //     where: {
    //       id: req.decoded.id,
    //     },
    //     returning: true,
    //     individualHooks: true,
    //   }
    // );
    return res.json(searchUser);
  } catch (error) {
    return next({
      status: 400,
      message: error.message,
    });
  }
};
module.exports = {
  forgetPassword,
  otpVerification,
};
