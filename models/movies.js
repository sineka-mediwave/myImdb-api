module.exports = function model(sequelize, types) {
  const Movies = sequelize.define(
    "movies",
    {
      movie_id: {
        type: types.UUID,
        defaultValue: types.UUIDV4,
        primarykey: true,
        unique: true,
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
      image: {
        type: types.STRING,
        allowNull: false,
      },
      title: {
        type: types.STRING,
        allowNull: false,
      },
      story: {
        type: types.TEXT,
        defaultValue: "",
      },
      language: {
        type: types.STRING,
        defaultValue: "",
      },
      year: {
        type: types.INTEGER,
        allowNull: false,
      },
    },

    {
      tableName: "movies",
      timestamps: false,
    }
  );

  return Movies;
};
