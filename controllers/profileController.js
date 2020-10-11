const db = require("../models")

const post = (req,res) => {
  console.log(req.user.id)
    db.Profile.create({
        UserId: req.user.id
    })
    .then(function(dbPost) {
      res.json(dbPost);
    });
  }

const update = (req,res) => {
    console.log(req.body)
    db.Profile.update(
      req.body,
      {
           where: {
            userId: req.params.id
          }
        }).then(function(dbPost) {
        res.json(dbPost);
      });
}

const destroy = (req,res) => {
  console.log(req.params.id)
  db.User.destroy({
         where: {
          id: req.params.id
        }
      }).then(function(dbPost) {
      res.json(dbPost);
    });
}

const get = (req,res) => {
  console.log(req)
  db.Profile.findOne({
    where: {
      userId: req.params.id
    },
    include: [{
      model:db.User,
      include:[db.Image]
    }],
   
  }).then(function(dbPost) {
    res.json(dbPost);
  });
}
  module.exports = {
    post,
    update,
    get,
    destroy
  }  