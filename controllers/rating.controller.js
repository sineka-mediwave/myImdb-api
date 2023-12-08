const { models } = require("../config/sequalize-config");

const addRatingController = async (req, res, next) => {
  try {
    const addRating = await models.ratings.create({
      rating: req.xop.rating,
      user_id: req.decoded.user_id,
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

module.exports = {
  addRatingController,
};
