require("dotenv").config();
var express = require("express");
var session = require("express-session");
var exphbs = require("express-handlebars");
var passport = require("passport");
var auth = require("./config/auth");
var db = require("./models");
// var ingredients = require("./ig-addon.json");

var app = express();
var PORT = process.env.PORT || 3000;

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static("public"));
auth(passport);

var sessionConfig = {
  secret: "secret",
  resave: false,
  saveUninitialized: false
};

app.use(session(sessionConfig));
app.use(passport.initialize());
app.use(passport.session());

// Handlebars
app.engine(
  "handlebars",
  exphbs({
    defaultLayout: "main"
  })
);
app.set("view engine", "handlebars");
  
// Routes
require("./routes/apiRoutes")(app);
require("./routes/htmlRoutes")(app);
  
var syncOptions = { force: false };
  
// If running a test, set syncOptions.force to true
// clearing the `testdb`
if (process.env.NODE_ENV === "test") {
  syncOptions.force = true;
}
  
// Starting the server, syncing our models ------------------------------------/
db.sequelize.sync(syncOptions).then(function() {
  app.listen(PORT, function() {
    // db.Ingredient.bulkCreate(ingredients).then(function(res) {
    //   if (res) {
    //     console.log(true);
    //   }
    // });
    console.log(
      "==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.",
      PORT,
      PORT
    );
  });
});
    
module.exports = app;
    