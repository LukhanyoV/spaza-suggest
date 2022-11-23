require("dotenv").config();

const pgp = require("pg-promise")({});
const isProduction = process.env.NODE_ENV === "production";

const databaseURL = isProduction ? process.env.MY_DATABASE_URL : process.env.LOCAL_DATABASE_URL;

const config = {
    connectionString: databaseURL
};

if(isProduction){
    config.ssl = {
        rejectUnauthorized: false
    }
};

module.exports = pgp(config);