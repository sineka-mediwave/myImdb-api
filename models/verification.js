// const { DataTypes } = require("sequelize");

module.exports = function model(sequelize, DataTypes) {
  const verification = sequelize.define(
    "verification",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        unique: true,
      },
      verification_type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      otp: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      expiresAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      user_id: {
        type: DataTypes.UUID,
        references: {
          model: {
            tableName: "users",
          },
          key: "id",
        },
        allowNull: false,
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
    },

    {
      tableName: "verification",
    }
  );

  return verification;
};
