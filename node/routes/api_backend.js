const router = require("express").Router()

const usersController = require('../controllers/users_controller');

// USERS
router.get('/users/register', usersController.register)
router.get('/users/login', usersController.login)

// MODULE 2

// MODULE 3

// ...

module.exports = router
