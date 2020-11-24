const mysql = require('../database/mysql');


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
 * @apiError  403 Owner or category does not exists
 * @apiError 500 Internal Server Error.
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 403 Not Found
 *     {
 *       "error": "description"
 *     }
 */
exports.create_course = (req, res) => {
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
            if (error) {
                res.status(500).send();
            }
            else {
                res.status(200).send(response_sql);
            }
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
            if (error) {
                res.status(500).send();
            }
            else if (response_sql.affectedRows === 1){
                res.status(204).send();
            }
            else if (response_sql.affectedRows === 0){
                res.status(404).send();
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
        `select * from COURSES where id = "${req.body.id}"`,
        (error, response_sqlCourse) => {
            let rowCourse;
            if (error) {
                res.status(500).send();
            }
            else {
                rowCourse = response_sqlCourse[0]
                if (rowCourse === undefined) {
                    res.status(403).send({error: 'Course does not exist'});
                }
                else {
                    mysql.connection.query(
                        `select * from CATEGORIES where name = "${req.body.category}"`, (error, response_sql) => {
                            if (response_sql[0] === undefined) {
                                res.status(403).send({error: 'Category does not exist'});
                            }
                            else {
                                mysql.connection.query(
                                    `UPDATE COURSES SET coursename = "${req.body.coursename}", description = "${req.body.description}", category = "${req.body.category}" WHERE id = "${req.body.id}"`,
                                    (error, response) => {
                                        if (error) {
                                            res.status(500).send()
                                        } else {
                                            mysql.connection.query(
                                                `select * from COURSES where id = "${req.body.id}"`,
                                                (error, response_sqlCourse) => {
                                                    if (error) {
                                                        res.status(500).send();
                                                    } else {
                                                        res.status(200).send(response_sqlCourse[0]);
                                                    }
                                                }
                                            );
                                        }
                                    }
                                );
                            }
                        }
                    );
                }
            }
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
        `SELECT course.coursename, course.description, cat.name, cat.imageUrl FROM COURSES course, CATEGORIES cat WHERE course.id = "${req.body.id}" AND course.category = cat.name`, (error, response_sql) => {
            if (error) {
                res.status(500).send();
            } else {
                if (response_sql[0] === undefined) {
                    res.status(404).send({error: 'Course does not exist'});
                }
                else {
                    let courseData = response_sql[0];
                    responseData.name = courseData.coursename;
                    responseData.description = courseData.description;
                    let category = {};
                    category.name = courseData.name;
                    category.imageUrl = courseData.imageUrl;
                    responseData.category = category;
                    res.status(200).send(responseData);
                }
            }
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
            if (error) {
                res.status(500).send();
            }
            else if (response_sql[0] === undefined) {
                res.status(404).send({error: 'Course does not exist'});
            }
            else {
                mysql.connection.query(
                    `SELECT * FROM VIDEOS WHERE course = "${req.body.id}" ORDER BY id ASC`, (error, response_sql) => {
                        if (error) {
                            res.status(500).send();
                        }
                        else {
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
                                responseData.push(videoData);
                            }
                            res.status(200).send(responseData);
                        }
                    }
                );
            }
        }
    );
};



