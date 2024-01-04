module.exports = function model(sequelize, types) {
  const verification = sequelize.define(
    "verification",
    {
      id: {
        type: types.UUID,
        defaultValue: types.UUIDV4,
        primaryKey: true,
        unique: true,
      },
      verification_type: {
        type: types.STRING,
        allowNull: false,
      },
      otp: {
        type: types.INTEGER,
        allowNull: false,
      },
      expiresAt: {
        type: types.BIGINT,
        allowNull: false,
      },
      user_id: {
        type: types.UUID,
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
