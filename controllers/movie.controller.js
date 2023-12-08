const { models } = require("../config/sequalize-config");

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
    const getMovies = await models.users.findOne({
      where: {
        user_id: req.decoded.id,
      },
      returning: true,
    });

    res.json(getMovies);
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
};
