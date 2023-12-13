const helper = require("../services/helper");

module.exports = function model(sequelize, types) {
  const Users = sequelize.define(
    "users",
    {
      id: {
        type: types.UUID,
        defaultValue: types.UUIDV4,
        primaryKey: true,
        unique: true,
      },
      first_name: {
        type: types.STRING,
        defaultValue: "",
      },
      last_name: {
        type: types.STRING,
        defaultValue: "",
      },
      user_name: {
        type: types.STRING,
        allowNull: false,
      },
      email: {
        type: types.STRING,
        allowNull: false,
        unique: true,
      },
      user_password: {
        type: types.STRING,
        allowNull: false,
      },
    },
    {
      tableName: "users",
    }
  );

  Users.beforeCreate(async (user) => {
    try {
      if (user.user_password) {
        user.user_password = await helper.hashPassword(user.user_password);
      }
    } catch (error) {
      console.log("\n hash error on save password..", error);
    }
  });

  Users.addHook("beforeUpdate", async (user) => {
    try {
      if (user.changed("user_password") && user.user_password) {
        user.user_password = await helper.hashPassword(user.user_password);
      }
    } catch (error) {
      console.log("\n hash error on update password..", error);
    }
  });

  Users.associate = function (models) {
    Users.hasMany(models.movies, {
      as: "movie",
      foreignKey: "user_id",
      sourceKey: "id",
    });
    Users.hasMany(models.ratings, {
      as: "addedRating",
      foreignKey: "user_id",
      sourceKey: "id",
    });
  };
  return Users;
};
