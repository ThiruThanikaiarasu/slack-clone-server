const express = require('express')
const router = express.Router()

const { check } = require('express-validator')
const { signup, login } = require('../controllers/authController')
const { createANewWorkspace } = require('../controllers/userController')

router.post(
    '/signup',
    check('email')
        .isEmail()
        .withMessage('Enter a valid Email address')
        .normalizeEmail(),
    check('password')
        .notEmpty()
        .isLength({min: 8})
        .withMessage('Password length is atleast 8 character'),
    signup
)

router.post(
    '/login',
    check('email')
        .isEmail()
        .withMessage('Enter a valid email address')
        .normalizeEmail(),
    check('password')
        .not()
        .isEmpty(),
    login
)

router.post(
    '/create-workspace',
    check('companyName')
        .not()
        .isEmpty()
        .withMessage('Company name is a mandatory field')
        .trim()
        .escape(),
    check('firstChannel')
        .not()
        .isEmpty()
        .withMessage('First Channel is a mandatory field')
        .trim()
        .escape(),
    check('firstName')
        .not()
        .isEmpty()
        .withMessage('First name is a mandatory field')
        .trim()
        .escape(),

    createANewWorkspace
)

module.exports = router