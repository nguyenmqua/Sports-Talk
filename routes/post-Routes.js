const express = require("express");
const router = express.Router();
const postController = require("../controllers/postController")

router.post("/api/posts", postController.postPost)
router.delete("/api/posts/:id", postController.deletePost)
router.put("/api/posts", postController.updatePost)
router.get("/api/posts", postController.getPost)
router.get("/api/posts/:id",postController.getPostID)
module.exports = router