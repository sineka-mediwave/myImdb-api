const { models, Sequelize, sequelize } = require("../config/sequalize-config");
const Op = Sequelize.Op;
const { paginate } = require("../services/pagination");

//CREATE
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

//UPDATE
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

//READ
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

// All movies
const getAllMoviesController = async (req, res, next) => {
  try {
    let order = "ASC";
    if (req.query.sortby) {
      order = req.query.sortby;
    }
    const searchQuery = await models.movies.findAndCountAll(
      paginate(
        {
          include: [
            {
              association: "rating",
              attributes: ["rating"],
            },
          ],

          where: {
            title: {
              [Op.iLike]: `%${req.query.search || ""}%`,
            },
          },
          order: [["title", order]],
          distinct: true,
          logging: true,
        },
        { page: req.query.page || 1, pageSize: req.query.pagesize || 3 }
      )
    );
    if (searchQuery.length == 0) {
      next({
        status: 400,
        message: ["Movie not found"],
      });
    } else {
      return res.json({
        movies: searchQuery.rows,
        totalCount: searchQuery.count,
      });
    }
  } catch (error) {
    return next({
      status: 400,
      message: error.message,
    });
  }
};

//DELETE
const deleteMovieController = async (req, res, next) => {
  try {
    const getMovie = await models.movies.findOne({
      where: { id: req.params.id },
    });
    if (!getMovie) {
      return next({
        status: 400,
        message: "Movie not found",
      });
    }
    if (req.decoded.id !== getMovie.user_id) {
      return next({
        status: 403,
        message: "You don't have access to this movie",
      });
    } else {
      // const result = await sequelize.transaction(async () => {
      const deleteMovie = await models.movies.destroy({
        where: { id: req.params.id },
        returning: true,
      });

      res.json({ deleteMovie });
      // });
    }
  } catch (error) {
    return next({
      status: 400,
      message: error.message,
    });
  }
};

module.exports = {
  getAllMoviesController,
  addMoviesController,
  getMovieController,
  updateMovieController,
  deleteMovieController,
};
