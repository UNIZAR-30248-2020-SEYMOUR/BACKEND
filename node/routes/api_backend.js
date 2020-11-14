const router = require("express").Router();

const usersController = require('../controllers/users_controller');
const coursesController = require('../controllers/courses_controller');
const categoriesController = require('../controllers/categories_controller');

// USERS
router.post('/users/register', usersController.register)
router.post('/users/login', usersController.login)
router.post('/users/forgot_password', usersController.forgot_password)
router.post('/users/reset_password', usersController.reset_password)
router.post('/users/user_profile', usersController.user_profile)
router.delete('/users/delete', usersController.delete)
router.get('/users/get_list', usersController.get_list)
router.put('/users/update_profile', usersController.update_profile)


// COURSES
router.post('/courses/create_course', coursesController.create_course)
router.delete('/courses/delete', coursesController.delete)
router.put('/courses/update_course', coursesController.update_course)
router.get('/courses/get_list', coursesController.get_list)

// CATEGORIES
router.get('/categories/get_list', categoriesController.get_list)

module.exports = router
