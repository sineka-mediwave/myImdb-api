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

app.post("/test-mail", async function (req, res) {
  const options = {
    from: `sender<${mailConfig.email}>`,
    to: "sineka@mindwaveventures.com",
    subject: "test mail",
    text: "Hello", // plain text body
    // html: `<button>test mail ${otp} </button> <a href="${url}" target="_blank">View</a>`, // html body
  };

  transporter.sendMail(options, (error, info) => {
    if (error) console.log("\n mail error..", error);
    return console.log("\n success...", info);
  });

  res.json("sending mail");
});

// 404 handler
app.use(notfound);

// error handler middleware
app.use(errorHandler);

app.listen(config.port, config.host, () => {
  console.log(`Server running at http://${config.host}:${config.port}/`);
});
