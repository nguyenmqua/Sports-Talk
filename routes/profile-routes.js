const express = require("express");
const router = express.Router();
const profileController = require("../controllers/profileController")

router.post("/api/profile:id", profileController.post)
router.put("/api/profile:id", profileController.update)
module.exports = router