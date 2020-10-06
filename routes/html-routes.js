var express = require("express")
var router = express.Router()
var db = require("../models");
var passport = require("../config/passport");
var isAuthenticated = require("../config/middleware/isAuthenticated");
var upload = require("../config/middleware/upload");
var uploadController = require("../controllers/upload");


    router.get("/signup", function(req, res) {
    // If the user already has an account send them to the members page
    if (req.user) {
      res.render("members");
    }
    res.render("signup")
  });

  router.get("/", function(req, res) {
    // If the user already has an account send them to the members page
    if (req.user) {
      res.render("members");
    }
    res.render("index")
  });

  router.get("/profilePage", isAuthenticated, function(req, res) {
    res.render("profilePage")
  });

  router.get("/members", isAuthenticated, function(req, res) {
    res.render("members",res);
  });

  router.get("/profilePic",isAuthenticated, function(req, res){
    res.render ("profilePic");
  })

  router.get("/profile", isAuthenticated, function(req, res){
    res.render ("profile");
  })

  router.get("/blog",isAuthenticated, function(req, res) {
    res.render("blog")
  });

  router.post("/api/login", passport.authenticate("local"), function(req, res) {
    res.json(req.user);
  });

  router.post("/api/signup", function(req, res) {
    db.User.create({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: req.body.password
    })
    .then(function() {
      res.redirect(307, "/api/login");
    })
      .catch(function(err) {
        res.status(401).json(err);
      });
  });
  // Route for logging user out
  router.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/");
  });

  router.get("/api/user_data", isAuthenticated, function(req, res) {
  
    if (!req.user) {
      // The user is not logged in, send back an empty object
      res.json({});
    } else {
      // Otherwise send back the user's email and id
      // Sending back a password, even a hashed password, isn't a good idea
      res.json({
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        email: req.user.email,
        id: req.user.id
      });
    }
  });
 
  router.post("/upload", upload.single("file"), uploadController.uploadFiles);
  router.get("/api/profilePic:id", function(req,res){
    db.Image.findOne({
      where: {
        userId: req.params.id
      },
    }).then(function(dbImage){
      res.json(dbImage)
    })
  })

  module.exports = router