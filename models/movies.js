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
      title: {
        type: types.STRING,
        allowNull: false,
      },
      story: {
        type: types.STRING,
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
