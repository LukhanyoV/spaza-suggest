require("dotenv").config()

const express = require("express");
const app = express();

app.engine("hbs", require("express-handlebars").engine({
    defaultLayout: "main",
    extname: "hbs"
}));
app.set("view engine", "hbs");

app.use(require("express-session")({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: false,
    resave: true
}))
app.use(require("express-flash")())

const db = require("./db")
const spazaSuggest = require("./spaza-suggest")(db)
const routes = require("./routes")(spazaSuggest)

app.get("/", routes.clientSuggest);

// deploy with https://deta.sh
module.exports = app;

// test on localhost or deploy on heroku
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 App runnning at http://localhost:4000`))