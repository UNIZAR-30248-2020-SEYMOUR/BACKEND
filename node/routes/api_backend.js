const router = require("express").Router();

const usersController = require('../controllers/users_controller');
const coursesController = require('../controllers/courses_controller');
const categoriesController = require('../controllers/categories_controller');

// USERS
router.post('/users/register', usersController.register)
router.post('/users/login', usersController.login)
router.post('/users/forgot_password', usersController.forgotPassword)
router.post('/users/reset_password', usersController.resetPassword)
router.post('/users/user_profile', usersController.user_profile)

// COURSES
router.post('/courses/create_course', coursesController.create_course)

// CATEGORIES
router.get('/categories/get_list', categoriesController.get_list)

module.exports = router
