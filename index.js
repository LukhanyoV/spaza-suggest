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
app.use(require("express-flash")());

app.use(express.urlencoded({extended: true}));
app.use(express.json());

const db = require("./db");
const spazaSuggest = require("./spaza-suggest")(db);
const routes = require("./routes")(spazaSuggest);

function authCheck(req, res, next){
    const currentPath = req.path;
    if(currentPath.startsWith("/client")){
        const client = req.session?.client;
        const authPath = /(register|login)$/i.test(currentPath);
        if(authPath){
            return !client ? next() : res.redirect("/clienthome");
        } 
        else {
            return !client ? res.redirect("/clientlogin") : next();
        }
    } 
    next()
}
app.use(authCheck)

// routes for the client
app.get("/clienthome", routes.clientSuggest);
app.post("/clientsuggest", routes.clientSuggestPost);

app.get("/clientsuggestions", routes.clientSuggested);

app.get("/clientregister", routes.clientRegister);
app.post("/clientregister", routes.clientRegisterPost);

app.get("/clientlogin", routes.clientLogin);
app.post("/clientlogin", routes.clientLoginPost);

app.get("/clientlogout", (req, res) => {
    req.session.destroy();
    res.redirect("/clientlogin");
})

// deploy with https://deta.sh
module.exports = app;

// test on localhost or deploy on heroku
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 App runnning at http://localhost:4000`));