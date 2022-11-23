require("dotenv").config();

const pgp = require("pg-promise")({});
const isProduction = process.env.NODE_ENV === "production";
const databaseURL = process.env.LOCAL_DATABASE_URL;

const config = {
    connectionString: databaseURL
};

if(isProduction){
    config.connectionString = process.env.DATABASE_URL;
    config.ssl = {
        rejectUnauthorized: false
    }
};

module.exports = pgp(config);