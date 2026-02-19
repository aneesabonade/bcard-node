require("dotenv").config();

const config = {
  port: process.env.PORT || 8181,
  env: process.env.ENV || "local",
  mongoUri:
    (process.env.ENV || "local") === "atlas"
      ? process.env.MONGO_URI_ATLAS
      : process.env.MONGO_URI_LOCAL,
  jwtSecret: process.env.JWT_SECRET,
};

module.exports = config;