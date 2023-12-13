module.exports = function model(sequelize, types) {
  const Movies = sequelize.define(
    "movies",
    {
      id: {
        type: types.UUID,
        defaultValue: types.UUIDV4,
        primaryKey: true,
        unique: true,
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

  Movies.associate = function (models) {
    Movies.hasMany(models.ratings, {
      as: "rating",
      foreignKey: "movie_id",
      sourceKey: "id",
    });
    Movies.belongsTo(models.users, {
      as: "addedBy",
      foreignKey: "user_id",
      sourceKey: "id",
    });
  };

  return Movies;
};
