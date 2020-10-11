const express = require("express");
const router = express.Router();
const profileController = require("../controllers/profileController")

router.post("/api/profile:id", profileController.post)
router.put("/api/profile:id", profileController.update)
router.get("/api/profile:id", profileController.get)
router.delete("/delete:id", profileController.destroy)
module.exports = router