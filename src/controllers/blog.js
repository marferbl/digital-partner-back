const Blog = require('../models/blog');

exports.createBlog = async (req, res) => {
    try {
        const blog = await Blog.create(req.body);
        res.status(200).send({ success: true, blog });
    } catch (error) {
        res.status(500).send({ message: 'Something went wrong', error });
    }
}

exports.getBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find();
        res.status(200).send({ success: true, blogs });
    } catch (error) {
        res.status(500).send({ message: 'Something went wrong', error });
    }
}

exports.getBlogById = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        res.status(200).send({ success: true, blog });
    } catch (error) {
        res.status(500).send({ message: 'Something went wrong', error });
    }
}
