const express = require('express')
const router = express.Router()

const { check } = require('express-validator')
const { signup, login } = require('../controllers/authController')
const { createANewWorkspace, authenticateUser, getAllChannelDetails, getAllWorkspaces, getWorkspace, createANewChannel, addAMemberToGroup } = require('../controllers/userController')
const { verifyUser } = require('../middleware/verify')

router.get(
    '/authenticate',
    verifyUser,
    authenticateUser
)

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

    verifyUser,

    createANewWorkspace
)

router.get(
    '/workspaces',

    verifyUser,
    getAllWorkspaces
)

router.post(
    '/get-workspace',

    verifyUser,
    getWorkspace
)

router.get(
    '/dashboard',

    verifyUser,

    getAllChannelDetails
)

router.post(
    '/new-channel',

    verifyUser,

    createANewChannel
)

router.post(
    '/addGroup',

    verifyUser,

    addAMemberToGroup
)

module.exports = router