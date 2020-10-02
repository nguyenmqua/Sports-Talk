const fs = require("fs");

const db = require("../models");
// var url = window.location.search;
// if (url.indexOf("?") !== -1) {
//   var userID = url.split("?")[1];
// }
const uploadFiles = async (req, res) => {
  try {
    
    
    var url = req.headers.referer
    if (url.indexOf("?") !== -1) {
      var userID = url.split("?")[1];
     
    }
    if (req.file == undefined) {
      return res.send(`You must select a file.`);
    }

    db.Image.create({
      type: req.file.mimetype,
      name: req.file.originalname,
      data: fs.readFileSync(
        __basedir + "/public/resources/static/assets/uploads/" + req.file.filename
      ),
      filepath: "/resources/static/assets/uploads/" + req.file.filename,
      UserId: userID
    }).then((image) => {
  
      fs.writeFileSync(
        __basedir + "/public/resources/static/assets/tmp/" + image.name,
        image.data
      );

      // return res.redirect('/members?'+ userID)
    });
  } catch (error) {
    console.log(error);
    return res.send(`Error when trying upload images: ${error}`);
  }
};

module.exports = {
  uploadFiles
};