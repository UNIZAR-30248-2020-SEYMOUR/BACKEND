const router = require("express").Router()

const usersController = require('../controllers/users_controller');
const coursesController = require('../controllers/courses_controller')

// USERS
router.post('/users/register', usersController.register)
router.post('/users/login', usersController.login)
router.post('/users/user_profile', usersController.user_profile)

// COURSES
router.post('/courses/create_course', coursesController.create_course)


// MODULE 3

// ...

module.exports = router
