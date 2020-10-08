const db = require("../models")

const post = (req,res) => {
   
    db.Comment.create(req.body)
    .then(function(dbPost) {
      res.json(dbPost.UserId);
    });
  }

const get = (req,res) => {

    db.Comment.findAll({
      where: {
        postId: req.params.id,
      },
      include:[{
        model: db.User,
        include:[db.Image]
      }]   
    }).then(function(dbPost) {
      res.json(dbPost);
    });
}

  module.exports = {
      post,
      get
    }