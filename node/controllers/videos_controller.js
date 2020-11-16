const mysql = require('../database/mysql');

/**
 * @api {post} /videos/upload Upload a video into a course
 * @apiName Create a video
 * @apiGroup Video
 *
 * @apiParam {String} id Course id.
 * @apiParam {String} title Video name.
 * @apiParam {String} description Video description.
 * @apiParam {String} location Location of the video in the frontend server filesystem.
 *
 * @apiSuccess 201 OK.
 * @apiError  403 Course does not exist
 * @apiError 500 Internal Server Error.
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 403 Not Found
 *     {
 *       "error": "description"
 *     }
 */
exports.upload = (req, res) => {
    mysql.connection.query(
        `select * from COURSES where id = "${req.body.id}"`, (error, response_sql) => {
            if (response_sql[0] === undefined) {
                res.status(403).send({error: 'Course does not exist'});
            }
            else {
                mysql.connection.query(
                    `insert into VIDEOS (title, description, course, location) values 
                    ("${req.body.title}", "${req.body.description}", "${req.body.id}", "${req.body.location}")`,
                    (error) => {
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
};

/**
 * @api {post} /videos/get_list Get videos
 * @apiName Get videos
 * @apiGroup Video
 *
 * @apiSuccess OK Get videos successful.
 * @apiError 500 Internal Server Error.
 */
exports.get_list = (req, res) => {
    mysql.connection.query(
        `select * from VIDEOS`, (error, response_sql) => {
            if (error) {
                res.status(500).send();
            }
            else {
                res.status(200).send(response_sql);
            }
        }
    );
}
