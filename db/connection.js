const { Pool } = require("pg");
const ENV = process.env.NODE_ENV || "development";
const config = {};

require("dotenv").config({
  path: `${__dirname}/../.env.${ENV}`,
});

if (ENV === "production") {
  config.connectionString = process.env.DATABASE_URL;
  config.max = 4;
}

if (!process.env.PGDATABASE && !process.env.DATABASE_URL) {
  throw new Error("PGDATABASE not set");
}

console.log(ENV);

module.exports = new Pool(config);
