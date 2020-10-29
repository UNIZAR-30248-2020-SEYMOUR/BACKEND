const router = require("express").Router()

const usersController = require('../controllers/users_controller');

// USERS
router.post('/users/register', usersController.register)
router.post('/users/login', usersController.login)
router.post('/users/forgot', usersController.forgotPassword)
router.post('/users/resetPassword', usersController.resetPassword)

// MODULE 2


// MODULE 3

// ...

module.exports = router
