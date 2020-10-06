const multer = require("multer");

const imageFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb("Please upload only images.", false);
  }
};


var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, __basedir + "/public/resources/static/assets/uploads/");
  },
  filename: (req, file, cb) => {
    console.log(file.originalname)
    var originalName = file.originalname
    var imageName = originalName.replace(/\s/g, '');
    cb(null, `${Date.now()}-photo-${imageName}`);
  },
});



var uploadFile = multer({ storage: storage, fileFilter: imageFilter });
module.exports = uploadFile;