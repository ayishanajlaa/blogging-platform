const { validationResult } = require('express-validator');
const blogService = require('../services/blogService');

// Create a blog post
const createBlog = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { title, content } = req.body;
        const newBlog = await blogService.createBlog(title, content, req.user.userId);
        res.status(201).json({data:newBlog});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get All Blogs
const getBlogs = async (req, res) => {
    try {
        const blogs = await blogService.getBlogs();
        res.status(200).json({data:blogs});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a one blog post
const getBlogById = async (req, res) => {
    console.log("ib")
    try {
        const blog = await blogService.getBlogById(req.params.id);
        res.status(200).json({data:blog});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a blog post
const updateBlog = async (req, res) => {
    const { title, content } = req.body;

    try {
        const blog = await blogService.updateBlog(req.params.id, title, content);
        res.status(200).json({data:blog});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete a blog post
const deleteBlog = async (req, res) => {
    try {
        const result = await blogService.deleteBlog(req.params.id);
        res.status(200).json({data:result});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//get blog count
const getBlogCount = async (req, res) => {
    try {
      const count = await blogService.getBlogCount();
      res.json({ data:{count} });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching blog count' });
    }
  }

module.exports = {
    createBlog,
    getBlogs,
    getBlogById,
    updateBlog,
    deleteBlog,
    getBlogCount
};
