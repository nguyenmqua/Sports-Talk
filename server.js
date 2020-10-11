
var express = require("express");
var session = require("express-session");

var passport = require("./config/passport");
var post = require("./routes/post-Routes")
var profile = require("./routes/profile-routes")
var comment = require("./routes/comment-routes")

var PORT = process.env.PORT || 3001;
var db = require("./models");
global.__basedir = __dirname;
var app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
app.use(session({ secret: "keyboard cat", resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());


var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");


var routes = require("./routes/html-routes");


app.use(routes);
app.use(post);
app.use(profile)
app.use(comment)



// Requiring our routes

// Syncing our database and logging a message to the user upon success
db.sequelize.sync().then(function() {
  app.listen(PORT, function() {
    console.log("==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.", PORT, PORT);
  });
});
