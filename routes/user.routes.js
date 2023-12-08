const express = require("express");
const router = express.Router();

const {
  addUserController,
  updateUserController,
  loginController,
  getAccountController,
} = require("../controllers/user.controller");
const { validate } = require("../middleware/validation.middleware");
const {
  signUpSchema,
  updateUserSchema,
  loginSchema,
} = require("../validations/authentication.schema");
const { isAuthorised } = require("../middleware/authorization.middleware");

//CREATE USER ACCOUNT
router.post("/signup", validate(signUpSchema), addUserController);

//LOGIN
router.post("/login", validate(loginSchema), loginController);

//UPDATE USER DATA
router.put(
  "/users/u",
  isAuthorised,
  validate(updateUserSchema),
  updateUserController
);

//VIEW THE USER DATA
router.get("/users/u", isAuthorised, getAccountController);

module.exports = router;
