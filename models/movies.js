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
      name: {
        type: types.STRING,
        allowNull: false,
      },
      about: {
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
