const Blog = require("../models/blogModel");

const createBlog = async (title, content, userId) => {
    try {
        const newBlog = new Blog({
            title,
            content,
            author: userId,  
        });
        await newBlog.save();
        const blogCount = await Blog.countDocuments();
        io.emit('blogAnalytics', { action: 'CREATE', blogId: newBlog._id,blogCount });
        return newBlog;
    } catch (error) {
        throw new Error('Server error: ' + error.message);
    }
};

const getBlogs = async () => {
    try {
        const blogs = await Blog.find().lean();
        return blogs;
    } catch (error) {
        throw new Error('Server error: ' + error.message);
    }
};

const getBlogById = async (id) => {
    try {
        const blog = await Blog.findById(id);
        if (!blog) throw new Error('Blog post not found');
        return blog;
    } catch (error) {
        throw new Error('Server error: ' + error.message);
    }
};

const updateBlog = async (id, title, content) => {
    try {
        const blog = await Blog.findById(id);
        if (!blog) throw new Error('Blog post not found');
        
        blog.title = title || blog.title;
        blog.content = content || blog.content;

        await blog.save();
        io.emit('blogAnalytics', { action: 'UPDATE', blogId: blog._id });

        return blog;
    } catch (error) {
        throw new Error('Server error: ' + error.message);
    }
};

const deleteBlog = async (id) => {
    try {
        const blog = await Blog.findById(id);
        if (!blog) throw new Error('Blog post not found');
        
        await Blog.findByIdAndDelete(id);
        io.emit('blogAnalytics', { action: 'DELETE', blogId: id});
        return { message: 'Blog post deleted' };
    } catch (error) {
        throw new Error('Server error: ' + error.message);
    }
};

const getBlogCount = async () => {
    try {
      const count = await Blog.countDocuments(); 
      return count;
    } catch (error) {
      console.error("Error fetching blog count:", error);
      throw new Error('Error fetching blog count');
    }
  };
  
module.exports = {
    createBlog,
    getBlogs,
    getBlogById,
    updateBlog,
    deleteBlog,
    getBlogCount
};
