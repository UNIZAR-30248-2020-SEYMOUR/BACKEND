const mysql = require('../database/mysql');
const fs = require('fs');


/**
 * @api {post} /courses/create_course Create a course
 * @apiName Create a course
 * @apiGroup Course
 *
 * @apiParam {String} owner UUID of user creator.
 * @apiParam {String} coursename Course name.
 * @apiParam {String} description Course description.
 * @apiParam {String} category Course category.
 *
 * @apiSuccess 200 OK.
 * @apiError 400 Coursename or descriptions are very long.
 * @apiError 403 Owner or category does not exists
 * @apiError 500 Internal Server Error.
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 403 Not Found
 *     {
 *       "error": "description"
 *     }
 */
exports.create_course = (req, res) => {
    if (req.body.coursename.length >= 40) {
      return res.status(400).send();
    }
    if (req.body.description.length >= 255) {
      return res.status(400).send();
    }

    mysql.connection.query(
        `select * from USERS where uuid = "${req.body.owner}"`, (error, response_sql) => {
            if (response_sql[0] === undefined) {
                res.status(403).send({error: 'User does not exist'});
            } else {
                mysql.connection.query(
                    `select * from CATEGORIES where name = "${req.body.category}"`, (error, response_sql) => {
                        if (response_sql[0] === undefined) {
                            res.status(403).send({error: 'Category does not exist'});
                        } else {
                            mysql.connection.query(
                                `insert into COURSES (coursename, description, category, owner) values ("${req.body.coursename}", "${req.body.description}", "${req.body.category}", "${req.body.owner}")`, (error) => {
                                    if (error) {
                                        res.status(500).send();
                                    }
                                    else {
                                        res.status(201).send();
                                    }
                                }
                            );
                        }
                    }
                );
            }
        }
    );
};

/**
 * @api {post} /courses/get_list Get courses
 * @apiName Get courses
 * @apiGroup Course
 *
 * @apiSuccess OK Get courses successful.
 * @apiError 500 Internal Server Error.
 */
exports.get_list = (req, res) => {
    mysql.connection.query(
        `select * from COURSES`,
        (error, response_sql) => {
            res.status(200).send(response_sql);
        }
    );
};



/**
 * @api {post} /courses/delete Delete a course
 * @apiName Delete a course
 * @apiGroup Course
 *
 * @apiParam {Integer} id Course id.

 * @apiSuccess 204 Course deleted.
 * @apiError  404 Course does not exists
 * @apiError 500 Internal Server Error.
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "description"
 *     }
 */
exports.delete = (req, res) => {
    mysql.connection.query(
        `delete from COURSES where id = "${req.body.id}"`,
        (error, response_sql) => {
            if (response_sql.affectedRows === 1){
                return res.status(204).send();
            }
            else if (response_sql.affectedRows === 0){
                return res.status(404).send();
            }
        }
    );
};

/**
 * @api {post} /courses/update_course Update course info
 * @apiName Update course info
 * @apiGroup Course
 *
 * @apiParam {Integer} id Course id.
 * @apiParam {String} coursename Course name.
 * @apiParam {String} description Course description.
 * @apiParam {String} Category Course category.

 * @apiSuccess 200 Course modified.
 * @apiError  403 Course id or category not exists
 * @apiError 500 Internal Server Error.
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 403 Not Found
 *     {
 *       "error": "description"
 *     }
 */
exports.update_course = (req, res) => {
    mysql.connection.query(
        `select * from COURSES where id = "${req.body.id}"`, (error, courses) => {
            if (courses[0] === undefined) {
                return res.status(403).send({error: 'Course does not exist'})
            }
            mysql.connection.query(
                `select * from CATEGORIES where name = "${req.body.category}"`, (error, categories) => {
                    if (categories[0] === undefined) {
                        return res.status(403).send({error: 'Category does not exist'});
                    }
                    mysql.connection.query(
                        `UPDATE COURSES SET coursename = "${req.body.coursename}", 
                            description = "${req.body.description}", category = "${req.body.category}" 
                                WHERE id = "${req.body.id}"`, (error) => {
                                    mysql.connection.query(
                                        `select c.id, c.coursename, c.description, cat.name, cat.imageUrl from COURSES c, 
                                            CATEGORIES cat where c.id = "${req.body.id}" and c.category = cat.name`,
                                        (error, updated) => {
                                            return res.status(200).send(updated[0]);
                                        }
                                    );
                        }
                    );
                }
            );
        }
    );
};

/**
 * @api {post} /courses/get_info
 * @apiName Get course info
 * @apiGroup Course
 *
 * @apiParam {Integer} id Course id.
 *
 * @apiSuccess 200 Course info retrieved.
 * @apiError  404 Course id does not exist.
 * @apiError 500 Internal Server Error.
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "description"
 *     }
 */
exports.get_info = (req, res) => {
  let responseData = {};

  mysql.connection.query(
    `SELECT course.coursename, course.description, user.username, cat.name, cat.imageUrl, course.rate 
	 FROM COURSES course
	 INNER JOIN CATEGORIES cat ON course.category = cat.name
	 INNER JOIN USERS user ON course.owner = user.uuid
	 WHERE course.id = "${req.body.id}" 
	 AND course.category = cat.name`, (error, response_sql) => {

      if (response_sql[0] === undefined) {
        return res.status(404).send({error: 'Course does not exist'});
      }

      let courseData = response_sql[0];
      responseData.name = courseData.coursename;
      responseData.description = courseData.description;
      responseData.rate = courseData.rate;
      responseData.ownername = courseData.username;

      let category = {};
      category.name = courseData.name;
      category.imageUrl = courseData.imageUrl;
      responseData.category = category;

      return res.status(200).send(responseData);
    });
};

/**
 * @api {post} /courses/get_videos
 * @apiName Get list of videos in a course
 * @apiGroup Course
 *
 * @apiParam {Integer} id Course id.
 * @apiParam {Integer} firstVideo First video.
 * @apiParam {Integer} lastVideo Last video.
 *
 * @apiSuccess 200 Videos of the course retrieved.
 * @apiError  404 Course id does not exist.
 * @apiError 500 Internal Server Error.
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "description"
 *     }
 */
exports.get_videos = (req, res) => {
    let responseData = [];
    mysql.connection.query(
        `SELECT id FROM COURSES WHERE id = "${req.body.id}"`, (error, response_sql) => {
            if (response_sql[0] === undefined) {
                return res.status(404).send({error: 'Course does not exist'});
            }
            mysql.connection.query(
                `SELECT * FROM VIDEOS WHERE course = "${req.body.id}" ORDER BY id ASC`, (error, response_sql) => {
                    let videoList = response_sql;
                    const first = req.body.firstVideo;
                    const last = req.body.lastVideo;
                    let i;
                    for (i = first-1; i < last; i++) {
                        let currentVideo = videoList[i];
                        if (currentVideo === undefined) { break; }
                        let videoData = {};
                        videoData.id = currentVideo.id;
                        videoData.name = currentVideo.title;
                        videoData.description = currentVideo.description;
                        videoData.rate = currentVideo.rate;
                        videoData.imagePreview=base64_encode(currentVideo.imagePreview);
                        responseData.push(videoData);
                    }
                    return res.status(200).send(responseData);
                }
            );
        }
    );
};

/**
 * @api {post} /courses/search Search for a course
 * @apiName Search course
 * @apiGroup Course
 *
 * @apiParam {String} textToSearch Text.
 * @apiParam {String} category Category.
 *
 * @apiSuccess 200 OK.
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "id": "2",
 *       "coursename": "Course 1",
 *       "description": "My course description",
 *       "category" : {
 *           "name" : "Software",
 *           "imageUrl" : "assets/img/categories/software.jpg"
 *       }
 *     }
 * @apiError 500 Internal Server Error.
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 500 Not Found
 *     {
 *       "error": "description"
 *     }
 */
exports.search = (req, res) => {
    let sqlRequest = "";
    if (req.body.category === "") {
        sqlRequest = `select course.id, course.coursename, course.category, course.description, cat.imageUrl, cat.name from COURSES course, CATEGORIES cat WHERE course.coursename LIKE "%${req.body.textToSearch}%" AND cat.name = course.category`
    }
    else {
        sqlRequest = `select course.id, course.coursename, course.category, course.description, cat.imageUrl, cat.name from COURSES course, CATEGORIES cat WHERE course.coursename LIKE "%${req.body.textToSearch}%" AND cat.name = course.category AND course.category = "${req.body.category}"`
    }
    mysql.connection.query(
        sqlRequest,
        (error, response_sql) => {
            let responseData = [];
            if (response_sql.length > 0) {
                for (let i = 0; i < response_sql.length; ++i) {
                    let courseData = response_sql[i];
                    let course = {};
                    course.id = response_sql[i].id;
                    course.coursename = courseData.coursename;
                    course.description = courseData.description;
                    let category = {};
                        category.name = courseData.name;
                    category.imageUrl = courseData.imageUrl;
                    course.category = category;
                    responseData.push(course);
                }
            }
            return res.status(200).send(responseData);
        }
    );
};

/**
 * @api {post} /courses/subscribe Subscribe an user to a course
 * @apiName Subscribe to course
 * @apiGroup Course
 *
 * @apiParam {String} id_user User UUID.
 * @apiParam {String} id_course Course id.
 *
 * @apiSuccess 204 OK.
 * @apiError 500 Internal Server Error.
 * @apiError 409 User already subscribed to the course.
 * @apiError 400 User or course does not exist.
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 500 Not Found
 *     {
 *       "error": "description"
 *     }
 */
exports.subscribe = (req, res) => {
    mysql.connection.query(
        `insert into SUBSCRIPTIONS (id_user, id_course) values ("${req.body.id_user}", "${req.body.id_course}")`, (error) => {
            if (error) {
                if (error.code === 'ER_DUP_ENTRY') {
                    return res.status(409).send({error: "User already subscribed to the course."});
                }
                else if (error.sqlMessage.includes("Cannot add or update a child row")) {
                    if (error.sqlMessage.includes("id_user")) {
                        return res.status(400).send({error: "User does not exist."});
                    }
                    else {
                        return res.status(400).send({error: "Course does not exist."});
                    }
                }
                else {
                    return res.status(500).send();
                }
            }
            else {
                return res.status(204).send()
            }
        }
    );
};

/**
 * @api {post} /courses/unsubscribe Unsubscribe an user to a course
 * @apiName Unsubscribe to course
 * @apiGroup Course
 *
 * @apiParam {String} id_user User UUID.
 * @apiParam {String} id_course Course id.
 *
 * @apiSuccess 204 OK.
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "status": "true"
 *     }
 * @apiError 500 Internal Server Error.
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 500 Not Found
 *     {
 *       "error": "description"
 *     }
 */
exports.unsubscribe = (req, res) => {
    mysql.connection.query(
        `delete from SUBSCRIPTIONS WHERE id_user="${req.body.id_user}" AND id_course="${req.body.id_course}"`, (error) => {
            if (error) {
                return res.status(500).send({error: error.sqlMessage});
            }
            else {
                return res.status(204).send()
            }
        }
    );
};

/**
 * @api {post} /courses/check_subscription Check if an user is subscribed to a course
 * @apiName Check subscription
 * @apiGroup Course
 *
 * @apiParam {String} id_user User UUID.
 * @apiParam {String} id_course Course id.
 *
 * @apiSuccess 200 OK.
 * @apiError 500 Internal Server Error.
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 500 Not Found
 *     {
 *       "error": "description"
 *     }
 */
exports.check_subscription = (req, res) => {
    mysql.connection.query(
        `select * from SUBSCRIPTIONS WHERE id_user="${req.body.id_user}" AND id_course="${req.body.id_course}"`, (error, response_sql) => {
            if (error) {
                return res.status(500).send({error: error.sqlMessage});
            }
            else {
                let response = {};
                if (response_sql.length > 0) {
                    response.status = "true";
                }
                else {
                    response.status = "false";
                }
                return res.status(200).send(response);
            }
        }
    );
};

// function to encode file data to base64 encoded string: imagePreviews
function base64_encode(file) {
    // read binary data
    const bitmap = fs.readFileSync(file);
    // convert binary data to base64 encoded string
    return new Buffer.from(bitmap).toString('base64');
}
