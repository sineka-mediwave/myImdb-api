const bodyParser = require("body-parser");
const config = require("./config/config");
const cors = require("cors");
const express = require("express");
const morgan = require("morgan");

const { mailConfig, transporter } = require("./config/email-config");
const { notfound } = require("./middleware/notfound.middleware");
const { errorHandler } = require("./middleware/errorhandler.middleware");
const userRouter = require("./routes/user.routes");
const movieRouter = require("./routes/movie.routes");
const { multerupload } = require("./middleware/multerUpload.middleware");

const app = express();

app.use(cors());
app.use(morgan("dev"));
// create application/json parser
const jsonParser = bodyParser.json();

// create application/x-www-form-urlencoded parser
const urlencodedParser = bodyParser.urlencoded({ extended: false });

app.use(jsonParser);
app.use(urlencodedParser);

//routes
app.use("/", userRouter);
app.use("/movies", movieRouter);

app.use("/uploads", express.static(__dirname + "/uploads"));

app.post(
  "/upload",
  multerupload("").single("file"),
  async function (err, req, res, next) {
    console.log("\n req.file...", req.file);
    // const image = req.file;
    // if (!image) {
    //   return next({ status: 400, message: "upload file" });
    // }
    console.log(err);
    return res.json({
      file: req.file,
    });
  }
);
// 404 handler
app.use(notfound);

// error handler middleware
app.use(errorHandler);

app.listen(config.port, config.host, () => {
  console.log(`Server running at http://${config.host}:${config.port}/`);
});
