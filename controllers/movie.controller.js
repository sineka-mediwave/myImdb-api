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

    // const overallRating = await models.ratings.findAll({
    //   attributes: [
    //     "movie_id",
    //     [Sequelize.fn("AVG", Sequelize.col("rating")), "overall_rating"],
    //   ],
    //   logging: true,
    //   group: ["movie_id"],
    // });

    res.json(getMovies);
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
      attributes: ["title"],
      where: req.body.id,
      include: [
        {
          model: models.ratings,
          as: "rating",
          attributes: ["rating"],
          include: [
            {
              model: models.users,
              as: "userRating",
              attributes: ["user_name"],
            },
          ],
        },
        {
          model: models.users,
          as: "addedBy",
          attributes: ["user_name"],
        },
      ],
      logging: true,
    });
    const ratings = getMovie.ratings.map((rating) => ({
      rating: rating.rating,
      ratedBy: rating.userRating.user_name,
    }));
    const overallRating = getMovie.ratings.length
      ? getMovie.ratings.reduce((total, rating) => total + rating.rating, 0) /
        getMovie.ratings.length
      : 0;
    const movieWithFormattedData = {
      movieName: getMovie.title,
      addedBy: getMovie.addedBy.user_name,
      ratings,
      overallRating,
    };
    res.json({
      getMovie,
    });
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
