const express = require("express");
const router = express.Router();

const {
  addUserController,
  updateUserController,
  loginController,
  getAccountController,
  updatePasswordController,
} = require("../controllers/user.controller");
const { validate } = require("../middleware/validation.middleware");
const {
  signUpSchema,
  updateUserSchema,
  loginSchema,
  updatePasswordSchema,
} = require("../validations/authentication.schema");
const { isAuthorised } = require("../middleware/authorization.middleware");
const {
  forgetPassword,
  otpVerification,
} = require("../controllers/forgetPassword.controller");

//CREATE USER ACCOUNT
router.post("/signup", validate(signUpSchema), addUserController);

//LOGIN
router.post("/login", validate(loginSchema), loginController);

//UPDATE USER DATA
router.put(
  "/u/account",
  isAuthorised,
  validate(updateUserSchema),
  updateUserController
);

router.put(
  "/u/account/password",
  isAuthorised,
  validate(updatePasswordSchema),
  updatePasswordController
);

router.post("/forget-password", forgetPassword);
router.post("/otp-verification", otpVerification);
//VIEW THE USER DATA
router.get("/u/account", isAuthorised, getAccountController);

module.exports = router;
