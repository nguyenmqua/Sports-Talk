const express = require("express");
const router = express.Router();
const commentController = require("../controllers/commentController")

router.post("/api/comment", commentController.post)
// router.delete("/api/comments/:id", commentController.deleteComment)
// router.put("/api/comments", commentController.updateComment)
// router.get("/api/comments", commentController.get)
// router.get("/api/comment:id", commentController.get)
module.exports = router