const express = require("express");
const router = express.Router();

const { validate } = require("../middleware/validation.middleware");
const { movieSchema } = require("../validations/movies.schema");
const { isAuthorised } = require("../middleware/authorization.middleware");
const {
  addMoviesController,
  getMoviesController,
  getMovieController,
  getAllMoviesController,
} = require("../controllers/movie.controller");
const { ratingSchema } = require("../validations/rating.schema");
const {
  addRatingController,
  overallRatingController,
} = require("../controllers/rating.controller");

router.post("/", validate(movieSchema), isAuthorised, addMoviesController);

router.post(
  "/rating",
  validate(ratingSchema),
  isAuthorised,
  addRatingController
);
router.get("/o", overallRatingController);
router.get("/", getAllMoviesController);
router.get("/:id", isAuthorised, getMovieController);

module.exports = router;
