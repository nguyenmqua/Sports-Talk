// Requiring our models and passport as we've configured it
var express = require("express")
var router = express.Router()
var db = require("../models");
var passport = require("../config/passport");
var isAuthenticated = require("../config/middleware/isAuthenticated");

  
  router.get("/", function(req, res) {
    // If the user already has an account send them to the members page
    if (req.user) {
      res.render("members");
    }
    res.render("signup")
  });

  router.get("/login", function(req, res) {
    // If the user already has an account send them to the members page
    if (req.user) {
      res.render("members");
    }
    res.render("index")
  });

  router.get("/members", isAuthenticated, function(req, res) {
    res.render("members");
  });

  router.get("/blog", function(req, res) {
    // If the user already has an account send them to the members page

    res.render("blog")
  });
  
  // Using the passport.authenticate middleware with our local strategy.
  // If the user has valid login credentials, send them to the members page.
  // Otherwise the user will be sent an error

  router.post("/api/login", passport.authenticate("local"), function(req, res) {
    res.json(req.user);
    console.log(req.user)
  });

  // Route for signing up a user. The user's password is automatically hashed and stored securely thanks to
  // how we configured our Sequelize User Model. If the user is created successfully, proceed to log the user in,
  // otherwise send back an error

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

  // Route for getting some data about our user to be used client side
  router.get("/api/user_data", function(req, res) {
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

  // Get route for retrieving a single post
  router.get("/api/posts/:id", function(req, res) {
    db.Post.findOne({
      where: {
        id: req.params.id
      }
    }).then(function(dbPost) {
      console.log(dbPost);
      res.json(dbPost);
    });
  });


  // Get route for retrieving a single post
  router.get("/api/posts/:id", function(req, res) {
    // Here we add an "include" property to our options in our findOne query
    // We set the value to an array of the models we want to include in a left outer join
    // In this case, just db.Author
    db.Post.findOne({
      where: {
        id: req.params.id
      },
      include: [db.User]
    }).then(function(dbPost) {
      res.json(dbPost);
    });
  });

  // POST route for saving a new post
  router.post("/api/posts", function(req, res) {
    db.Post.create(req.body).then(function(dbPost) {
      res.json(dbPost);
    });
  });

  // DELETE route for deleting posts
  router.delete("/api/posts/:id", function(req, res) {
    db.Post.destroy({
      where: {
        id: req.params.id
      }
    }).then(function(dbPost) {
      res.json(dbPost);
    });
  });

  // PUT route for updating posts
  router.put("/api/posts", function(req, res) {
    db.Post.update(
      req.body,
      {
        where: {
          id: req.body.id
        }
      }).then(function(dbPost) {
      res.json(dbPost);
    });
  });

  router.get("/api/posts", function(req, res) {
    db.Post.findAll({
      include: [db.User]
    }).then(function(dbPost) {
      res.json(dbPost);
    });
  });

  router.delete("/api/posts/:id", function(req, res) {
    db.Post.destroy({
      where: {
        id: req.params.id
      }
    }).then(function(dbPost) {
      res.json(dbPost);
    });
  });


  module.exports = router;
