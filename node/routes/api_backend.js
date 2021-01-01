const router = require("express").Router();

const usersController = require('../controllers/users_controller');
const coursesController = require('../controllers/courses_controller');
const categoriesController = require('../controllers/categories_controller');
const videosController = require('../controllers/videos_controller');

// USERS
router.post('/users/register', usersController.register)
router.post('/users/login', usersController.login)
router.post('/users/forgot_password', usersController.forgot_password)
router.post('/users/reset_password', usersController.reset_password)
router.post('/users/user_profile', usersController.user_profile)
router.post('/users/get_user', usersController.get_user)
router.post('/users/delete', usersController.delete)
router.post('/users/get_list', usersController.get_list)
router.post('/users/update_profile', usersController.update_profile)
router.post('/users/search', usersController.search)
router.post('/users/feed', usersController.feed)


// COURSES
router.post('/courses/create_course', coursesController.create_course)
router.post('/courses/delete', coursesController.delete)
router.post('/courses/update_course', coursesController.update_course)
router.post('/courses/get_list', coursesController.get_list)
router.post('/courses/get_info', coursesController.get_info)
router.post('/courses/get_videos', coursesController.get_videos)
router.post('/courses/search', coursesController.search)
router.post('/courses/subscribe', coursesController.subscribe)
router.post('/courses/unsubscribe', coursesController.unsubscribe)
router.post('/courses/check_subscription', coursesController.check_subscription)

// CATEGORIES
router.post('/categories/get_list', categoriesController.get_list)


// VIDEOS
router.post('/videos/upload', videosController.upload)
router.post('/videos/details', videosController.details)
router.post('/videos/get_list', videosController.get_list)
router.post('/videos/get_video', videosController.get_video)
router.post('/videos/rate', videosController.rate)
router.post('/videos/comment', videosController.comment)

module.exports = router
