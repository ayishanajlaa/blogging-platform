const { body } = require('express-validator');

const registerValidator = [
    body('email')
        .isEmail()
        .normalizeEmail()
        .trim()
        .escape(), 
    body('name')
        .trim()
        .escape()
        .isLength({ min: 3 })
        .withMessage('Name must be at least 3 characters long'),

    body('password')
        .trim()
        .isLength({ min: 6 }) 
        .withMessage('Password must be at least 6 characters long')
        .custom(value => {
            // Password complexity checks
            if (!/[0-9]/.test(value) || 
                !/[a-z]/.test(value) || 
                !/[A-Z]/.test(value) || 
                !/[\W_]/.test(value)) {
                throw new Error('Password must contain at least 1 number, 1 lowercase letter, 1 uppercase letter, and 1 special character');
            }
            return true;
        }),

    body('isAdmin')
        .optional()
        .isBoolean()
        .withMessage('isAdmin must be a boolean'),

    body('interests')
        .optional()
        .isArray()
        .withMessage('Interests must be an array')
        .custom((value) => {
            if (value && value.some(interest => typeof interest !== 'string')) {
                throw new Error('Each interest must be a string');
            }
            return true;
        })
];

const loginValidator = [
    body('email')
        .isEmail()
        .normalizeEmail()
        .trim()
        .escape(), 

    body('password')
        .trim()
        .isLength({ min: 6 }) 
        .withMessage('Password must be at least 6 characters long')
];


const updateProfileValidator = [
    body('name')
        .optional()
        .trim()
        .escape()
        .isLength({ min: 3 })
        .withMessage('Name must be at least 3 characters long.'),

    body('profile')
        .optional()
        .trim()
        .escape()
        .isLength({ max: 500 })
        .withMessage('Profile must be less than 500 characters.'),

    body('interests')
        .optional()
        .isArray()
        .withMessage('Interests must be an array.')
        .custom(value => {
            if (value && value.length === 0) {
                return true;  // Allow empty array
            }
            if (value && value.length > 0 && value.some(item => typeof item !== 'string')) {
                throw new Error('Each interest must be a string.');
            }
            return true;
        })
        .withMessage('Interests must be an array with strings'),

    body('interests.*')
        .optional()
        .isString()
        .trim()
        .escape()
        .isLength({ min: 2, max: 50 })
        .withMessage('Each interest must be between 2 and 50 characters.'),

    body('isAdmin')
        .optional()
        .isBoolean()
        .withMessage('isAdmin must be a boolean'),

    body().custom((value, { req }) => {
        if (!req.body.name && !req.body.profile && !req.body.interests) {
            throw new Error('At least one field (name, profile, or interests) must be provided.');
        }
        return true;
    })
];



module.exports = { registerValidator,loginValidator, updateProfileValidator };