const db = require("../models")

const postPost = (req,res) => {
    db.Post.create(req.body)
    .then(function(dbPost) {
      res.json(dbPost);
    });
  }

const deletePost = (req,res) => {
    db.Post.destroy({
        where: {
          id: req.params.id
        }
      }).then(function(dbPost) {
        res.json(dbPost);
      });
}

const updatePost = (req,res) => {
    db.Post.update(
        req.body,
        {
          where: {
            id: req.body.id
          }
        }).then(function(dbPost) {
        res.json(dbPost);
      });
    }

const getPost = (req,res) => {
      db.Post.findAll({
      include:[{
        model: db.User,
        include:[db.Image]
      },{
        model: db.Comment,
        include: [{
          model: db.User,
          include:[db.Image]
        }]
      }],
    }).then(function(dbPost) {
      res.json(dbPost);
    });
}

const getPostID = (req,res) => {
  db.Post.findOne({
    where: {
      id: req.params.id
    },
    include: [db.User]
  }).then(function(dbPost) {
    res.json(dbPost);
  });
}

module.exports = {
    getPost,
    updatePost,
    deletePost,
    postPost,
    getPostID
}