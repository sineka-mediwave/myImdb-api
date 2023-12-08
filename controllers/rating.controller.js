const { models } = require("../config/sequalize-config");

const addRatingController = async (req, res, next) => {
  try {
    const addRating = await models.ratings.create({
      rating: req.xop.rating,
      user_id: req.decoded.id,
      movie_id: req.xop.movie_id,
    });
    return res.json({
      addRating,
    });
  } catch (error) {
    return next({
      status: 400,
      message: error.message,
    });
  }
};

const overallRatingController = async (req, res, next) => {
  try {
    const overallRating = await models.ratings.findAll({
      attributes: [
        [Sequelize.fn("AVG", Sequelize.col("rating")), "overall_rating"],
      ],
      group: ["movie_id"],
    });

    res.json({ overallRating });
  } catch (error) {
    return next({
      status: 400,
      message: error.message,
    });
  }
};
module.exports = {
  addRatingController,
  overallRatingController,
};
