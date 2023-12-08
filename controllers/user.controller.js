const helper = require("../services/helper");
const jwt = require("jsonwebtoken");
const config = require("../config/config");
const { sequelize, models, Sequelize } = require("../config/sequalize-config");
const Op = Sequelize.Op;

//creating new user account
const addUserController = async (req, res, next) => {
  try {
    const searchUser = await models.users.findAndCountAll({
      where: {
        email: req.body.email,
      },
      logging: true,
    });

    if (searchUser.count == 0) {
      const addUser = await models.users.create({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        user_name: req.body.user_name,
        user_password: req.body.user_password,
      });
      if (addUser) {
        res.json({
          message: `Welcome to Myimdb ${addUser.user_name}`,
        });
      }
    } else {
      return next({
        status: 400,
        message: "user already exits",
      });
    }
  } catch (error) {
    console.log(error);
    return next({
      status: 400,
      message: error.message,
    });
  }
};

// login
const loginController = async (req, res, next) => {
  try {
    const searchUser = await models.users.findOne({
      //attributes: ["email", "user_name"],
      where: {
        email: req.body.email,
      },
      logging: true,
    });

    const passwordMatch = await helper.comparePassword(
      req.body.user_password,
      searchUser.user_password
    );
    if (passwordMatch) {
      const payload = {
        id: searchUser.id,
        user_name: searchUser.user_name,
      };
      const generated_token = jwt.sign(payload, config.jwtSecret);

      return res.json({
        token: generated_token,
      });
    }
    return res.status(403).json({ message: "Invalid User" });
  } catch (error) {
    return next({
      status: 400,
      message: error.message,
    });
  }
};

// view the account details
const getAccountController = async (req, res, next) => {
  //"select * from account_users au where id = $1";
  try {
    const getUserController = await models.users.findOne({
      attributes: ["first_name", "last_name", "user_name", "email"],
      where: {
        id: req.decoded.id,
      },
      returning: true,
    });

    res.json(getUserController);
  } catch (error) {
    return next({
      status: 400,
      message: error.message,
    });
  }
};

//updating the userData
const updateUserController = async (req, res, next) => {
  try {
    const updateUser = await models.users.update(
      {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        user_name: req.body.user_name,
        user_password: req.body.user_password,
      },
      {
        where: {
          id: req.decoded.id,
        },
        returning: true,
        individualHooks: true,
      }
    );

    res.json(req.body);
  } catch (error) {
    return next({
      status: 400,
      message: error.message,
    });
  }
};

module.exports = {
  addUserController,
  loginController,
  getAccountController,
  updateUserController,
};
