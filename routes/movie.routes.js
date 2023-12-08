const express = require("express");
const router = express.Router();

const { validate } = require("../middleware/validation.middleware");
const { movieSchema } = require("../validations/movies.schema");
const { isAuthorised } = require("../middleware/authorization.middleware");
const { addMoviesController } = require("../controllers/movie.controller");

router.post("/", validate(movieSchema), isAuthorised, addMoviesController);

module.exports = router;
