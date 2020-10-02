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
  module.exports = {
    post,
    update
  }  