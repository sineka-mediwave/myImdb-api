module.exports = function model(sequelize, types) {
  const ratings = sequelize.define(
    "ratings",
    {
      rating_id: {
        type: types.UUID,
        defaultValue: types.UUIDV4,
        primarykey: true,
        unique: true,
      },
      rating: {
        type: types.INTEGER,
        defaultValue: 0,
      },
      user_id: {
        type: types.UUID,
        references: {
          model: {
            tableName: "users",
          },
          key: "user_id",
        },
        allowNull: false,
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      movie_id: {
        type: types.UUID,
        references: {
          model: {
            tableName: "movies",
          },
          key: "movie_id",
        },
        allowNull: false,
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
    },

    {
      tableName: "ratings",
      timestamps: false,
    }
  );

  return ratings;
};
