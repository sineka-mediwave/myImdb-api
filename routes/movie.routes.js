const express = require("express");
const router = express.Router();

const { validate } = require("../middleware/validation.middleware");
const { movieSchema } = require("../validations/movies.schema");
const { isAuthorised } = require("../middleware/authorization.middleware");
const {
  addMoviesController,
  getMovieController,
  getAllMoviesController,
  updateMovieController,
} = require("../controllers/movie.controller");
const { ratingSchema } = require("../validations/rating.schema");
const { addRatingController } = require("../controllers/rating.controller");

router.get("/", getAllMoviesController);
// router.get("/search", searchController);

router.post("/", validate(movieSchema), isAuthorised, addMoviesController);
router.get("/:id", isAuthorised, getMovieController);
router.put("/:id", isAuthorised, updateMovieController);

//Rating
router.post(
  "/:id/rating",
  validate(ratingSchema),
  isAuthorised,
  addRatingController
);
module.exports = router;
