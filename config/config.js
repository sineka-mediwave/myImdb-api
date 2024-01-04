require("dotenv").config();

const dbConfig = {
  database: process.env.PG_DB,
  username: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  host: process.env.PG_HOST,
  port: process.env.PG_PORT,
  dialect: "postgres",
};

const envConfigs = {
  development: { ...dbConfig },
  test: { ...dbConfig },
  staging: { ...dbConfig },
  uat: { ...dbConfig },
  port: process.env.PORT,
  host: process.env.HOST,
  jwtSecret: "shop-secret",
  fileSavePath: process.env.FILE_STORAGE_PATH,
};

module.exports = { ...envConfigs };
