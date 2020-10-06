const db = require("../models")

const post = (req,res) => {
   
    db.Comment.create(req.body)
    .then(function(dbPost) {
      res.json(dbPost);
    });
  }

const get = (req,res) => {
    db.Comment.findAll({
      where: {
        postId: req.params.id,
      }   
    }).then(function(dbPost) {
      console.log(dbPost)
      res.json(dbPost);
    });
}

  module.exports = {
      post,
      get
    }