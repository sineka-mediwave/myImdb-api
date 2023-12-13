const { models, Sequelize } = require("../config/sequalize-config");

const addMoviesController = async (req, res, next) => {
  try {
    const addMovie = await models.movies.create({
      user_id: req.decoded.id,
      image: req.body.image,
      title: req.body.title,
      story: req.body.story,
      language: req.body.language,
      year: req.body.year,
    });
    addMovie && res.json(addMovie);
  } catch (error) {
    return next({
      status: 400,
      message: error.message,
    });
  }
};

const getMoviesController = async (req, res, next) => {
  try {
    const getMovies = await models.movies.findAll();

    const overallRating = await models.ratings.findAll({
      attributes: [
        "movie_id",
        [Sequelize.fn("AVG", Sequelize.col("rating")), "overall_rating"],
      ],
      logging: true,
      group: ["movie_id"],
    });

    res.json({ getMovies, overallRating });
  } catch (error) {
    return next({
      status: 400,
      message: error.message,
    });
  }
};

const getMovieController = async (req, res, next) => {
  try {
    const getMovie = await models.movies.findOne({
      where: { id: req.params.id },
      include: [
        {
          association: "rating",
          attributes: ["rating"],
          include: [
            {
              association: "userRating",
              attributes: ["user_name"],
            },
          ],
        },
        {
          association: "addedBy",
          attributes: ["first_name"],
        },
      ],
      logging: true,
    });

    res.json(getMovie);
  } catch (error) {
    return next({
      status: 400,
      message: error.message,
    });
  }
};
module.exports = {
  addMoviesController,
  getMoviesController,
  getMovieController,
};
