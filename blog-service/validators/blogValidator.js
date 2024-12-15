const { body } = require('express-validator');

const blogValidationRules = [
    body('title')
        .trim()
        .notEmpty().withMessage('Title is required')
        .isLength({ min: 5 }).withMessage('Title must be at least 5 characters')
        .escape(),

    body('content')
        .trim()
        .notEmpty().withMessage('Content is required')
        .isLength({ min: 20 }).withMessage('Content must be at least 20 characters')
        .escape(),
];

module.exports = blogValidationRules;
