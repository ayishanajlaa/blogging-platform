const express = require('express');
const blogValidationRules = require('../validators/blogValidator');
const { verifyToken } = require('../middlewares/authMiddleware');
const blogController = require('../controllers/blogController');

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Blog:
 *       type: object
 *       required:
 *         - title
 *         - content
 *       properties:
 *         title:
 *           type: string
 *         content:
 *           type: string
 *         author:
 *           type: string
 *       example:
 *         title: 'My First Blog'
 *         content: 'This is my first blog post content'
 *         author: 'user123'
 */

/**
 * @swagger
 * /blogs:
 *   post:
 *     summary: Create a blog post
 *     tags: [Blogs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Blog'
 *     responses:
 *       201:
 *         description: Blog created successfully
 *       400:
 *         description: Bad request (validation error)
 *       500:
 *         description: Internal server error
 */
router.post('/', verifyToken, blogValidationRules, blogController.createBlog);  // Create Blog

/**
 * @swagger
 * /blogs:
 *   get:
 *     summary: Get all blog posts
 *     tags: [Blogs]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of blog posts
 *       500:
 *         description: Internal server error
 */
router.get('/', verifyToken, blogController.getBlogs);

router.get('/blog-count', verifyToken, blogController.getBlogCount);


/**
 * @swagger
 * /blogs/{id}:
 *   get:
 *     summary: Get a single blog post by ID
 *     tags: [Blogs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The blog ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A single blog post
 *       404:
 *         description: Blog post not found
 *       500:
 *         description: Internal server error
 * 
 * 
 */
router.get('/:id', verifyToken, blogController.getBlogById);



/**
 * @swagger
 * /blogs/{id}:
 *   put:
 *     summary: Update a blog post by ID
 *     tags: [Blogs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The blog ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Blog'
 *     responses:
 *       200:
 *         description: Blog updated successfully
 *       404:
 *         description: Blog post not found
 *       500:
 *         description: Internal server error
 */
router.put('/:id', verifyToken, blogController.updateBlog);

/**
 * @swagger
 * /blogs/{id}:
 *   delete:
 *     summary: Delete a blog post by ID
 *     tags: [Blogs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The blog ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Blog post deleted
 *       404:
 *         description: Blog post not found
 *       500:
 *         description: Internal server error
 */
router.delete('/:id', verifyToken, blogController.deleteBlog);



module.exports = router;
