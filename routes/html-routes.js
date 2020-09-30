var express = require("express")
var router = express.Router()
var db = require("../models");
var passport = require("../config/passport");
var isAuthenticated = require("../config/middleware/isAuthenticated");

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

  router.get("/members", isAuthenticated, function(req, res) {
    res.render("members",res);
  });

  router.get("/blog", function(req, res) {
    res.render("blog")
  });

module.exports = router