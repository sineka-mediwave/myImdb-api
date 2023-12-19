const { models, Sequelize } = require("../config/sequalize-config");
const { paginate } = require("../services/pagination");

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

const updateMovieController = async (req, res, next) => {
  try {
    const searchMovie = await models.movies.findOne({
      where: { id: req.params.id },
      logging: true,
    });
    console.log(searchMovie);
    if (req.decoded.id !== searchMovie.user_id) {
      return next({
        status: 403,
        message: "You don't have access to this movie",
      });
    }
    const updateMovie = await models.movies.update(
      {
        image: req.body.image,
        title: req.body.title,
        story: req.body.story,
        language: req.body.language,
        year: req.body.year,
      },
      {
        where: { id: req.params.id },
        returning: true,
      }
    );

    res.json(updateMovie);
  } catch (error) {
    return next({
      status: 400,
      message: error.message,
    });
  }
};

const getAllMoviesController = async (req, res, next) => {
  try {
    const getMovies = await models.movies.findAndCountAll(
      paginate(
        {
          include: [
            {
              association: "rating",
              attributes: ["rating"],
            },
          ],
          logging: true,
          // where: {}, // conditions
        },
        { page: req.query.page & 1, pageSize: req.query.pagesize & 3 }
      )
    );
    // res.json(getMovies);
    res.json({ movies: getMovies.rows, totalCount: getMovies.count });
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
  updateMovieController,
  getMovieController,
  getAllMoviesController,
};
