const router = require("express").Router();
const blogController = require('../controllers/blog.js');

router.get("/blogs", async (req, res) => {
    blogController.getBlogs(req, res);
});

router.post("/save", async (req, res) => {
    blogController.createBlog(req, res);
});

router.get("/blog/:id", async (req, res) => {
    blogController.getBlogById(req, res);
});








module.exports = router;
