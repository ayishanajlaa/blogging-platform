const express = require('express');
const router = express.Router();
const { registerUser, loginUser, updateUser, verifyToken, getUserInfo, getUserCount } = require('../controller/userController');
const { registerValidator, updateProfileValidator, loginValidator } = require('../validators/userValidator');
const { authMiddleware } = require('../middleware/authMiddleware');

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *       properties:
 *         name:
 *           type: string
 *         email:
 *           type: string
 *           format: email
 *         password:
 *           type: string
 *         isAdmin:
 *           type: boolean
 *         interests:
 *           type: array
 *           items:
 *             type: string
 *       example:
 *         name: 'John Doe'
 *         email: 'johndoe@example.com'
 *         password: 'password123'
 *         isAdmin: false
 *         interests: ['Technology', 'Music', 'Gaming']
 */


/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Validation error
 * 
 */
router
  .route('/register')
  .post(registerValidator, registerUser);

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Log in a user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successfully logged in
 *       401:
 *         description: Unauthorized
 */
router
  .route('/login')
  .post(loginValidator, loginUser);

/**
 * @swagger
 * /api/users/update-profile:
 *   put:
 *     summary: Update user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []  # Requires a bearer token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: "User's full name (min 3 characters)"
 *               profile:
 *                 type: string
 *                 description: "Short bio or profile description (max 500 characters)"
 *               interests:
 *                 type: array
 *                 description: "User's interests as an array of strings"
 *                 items:
 *                   type: string
 *               isAdmin:
 *                 type: boolean
 *                 description: "User admin status"
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 user:
 *                   type: object
 *                   description: Updated user information
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: string
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */

router
  .route('/update-profile')
  .put(authMiddleware, updateProfileValidator, updateUser);

/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     summary: Get user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []  # This requires a bearer token
 *     responses:
 *       200:
 *         description: Profile fetched successfully
 *       401:
 *         description: Unauthorized
 */
router
  .route('/profile')
  .get(authMiddleware, getUserInfo);

/**
 * @swagger
 * /api/users/verify-token:
 *   get:
 *     summary: Verify JWT token
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Token is valid
 *       401:
 *         description: Unauthorized
 */
router
  .route('/verify-token')
  .get(verifyToken);

/**
 * @swagger
 * /api/users/user-count:
 *   get:
 *     summary: Get the total number of users
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []  # This requires a bearer token
 *     responses:
 *       200:
 *         description: Successfully fetched user count
 *       401:
 *         description: Unauthorized
 */
router
  .route('/user-count')
  .get(authMiddleware, getUserCount);

module.exports = router;
