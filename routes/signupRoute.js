const express = require('express')
const router = express.Router()
const {registerNewUser} = require('../controllers/signupController')

router.route('/').post(registerNewUser)

module.exports = router