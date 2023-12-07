const sequel = require("sequelize");
const { Sequelize } = require("sequelize");
const path = require("path");
const fs = require("fs");
const config = require("./config");

const sequelize = new Sequelize(
  config.development.database,
  config.development.username,
  config.development.password,
  {
    host: config.development.host,
    dialect: "postgres",
    logging: true,
  }
);

const db = {
  Sequelize: sequel,
  sequelize,
  models: {},
};

const modelsDir = path.normalize(`${__dirname}/../models`);

// loop through all files in models directory ignoring hidden files and this file
fs.readdirSync(modelsDir)
  .filter(
    (file) =>
      file.indexOf(".") !== 0 &&
      file.indexOf(".map") === -1 &&
      file.endsWith(".js")
  )
  // import model files and save model names
  .forEach((file) => {
    // console.info(`Loading model file ${file}`);
    const model = require(path.join(modelsDir, file))(
      db.sequelize,
      db.Sequelize.DataTypes
    );
    if (model && model.isMaster) {
      db.masterTables[model.name] = model;
    }
    db.models[model.name] = model;
  });

// calling all the associate function, in order to make the association between the models
Object.keys(db.models).forEach((modelName) => {
  if (db.models[modelName].associate) {
    db.models[modelName].associate(db.models);
  }
});

db.sequelize.options.logging = (str) => {
  if (config.dbLog) {
    console.log("\n", str, "\n");
  }
};

db.sequelize
  .authenticate()
  .then(async () => {
    console.log("Connection has been established successfully.");
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });

process.on("SIGINT", () => {
  console.log("SIGINT: Closing postgres connection");
  db.sequelize.close();
  process.exit(0);
});

module.exports = db;
