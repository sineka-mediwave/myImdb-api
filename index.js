const bodyParser = require("body-parser");
const config = require("./config/config");

const express = require("express");
const morgan = require("morgan");

const { notfound } = require("./middleware/notfound.middleware");
const { errorHandler } = require("./middleware/errorhandler.middleware");

const app = express();

app.use(morgan("dev"));
// create application/json parser
const jsonParser = bodyParser.json();

// create application/x-www-form-urlencoded parser
const urlencodedParser = bodyParser.urlencoded({ extended: false });

app.use(jsonParser);
app.use(urlencodedParser);

//routes
app.get("/", (req, res) => {
  res.send("hello");
});

// 404 handler
app.use(notfound);

// error handler middleware
app.use(errorHandler);

app.listen(config.port, config.host, () => {
  console.log(`Server running at http://${config.host}:${config.port}/`);
});
