const db = require("../models")

const post = (req,res) => {   
    db.Comment.create(req.body)
    .then(function(dbPost) {
      res.json(dbPost.UserId);
    });
  }
  
  module.exports = {
      post
    }