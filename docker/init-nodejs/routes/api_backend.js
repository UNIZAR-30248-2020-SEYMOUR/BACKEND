const router = require("express").Router()

const usersController = require('../controllers/users_controller');

// USERS
router.post('/users/register', usersController.register)
router.post('/users/login', usersController.login)

// MODULE 2

// MODULE 3

// ...

module.exports = router
