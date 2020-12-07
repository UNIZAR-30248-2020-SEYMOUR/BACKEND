const mysql = require('../database/mysql');

/**
 * @api {post} /videos/upload Upload a video to a course
 * @apiName Upload a video
 * @apiGroup Video
 *
 * @apiParam {Raw video} video Video file itself
 *
 * @apiSuccess 201 OK.
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 201 OK
 *     {
 *       "id": 128491
 *     }
 * @apiError 400 No video uploaded.
 * @apiError 500 Internal Server Error.
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 400 Bad request
 *     {
 *       "error": "description"
 *     }
 */
exports.upload = (req, res) => {
    if(!req.files) {
        return res.status(400).send({error: 'No video uploaded'});
    }
    if (!req.files.video) {
        return res.status(400).send({error: 'No video uploaded'});
    }
    if(req.files.video.mimetype !== 'video/mp4') {
        return res.status(400).send({error: 'Video format must be video/mp4'});
    }
    if(req.files.video.size > 200000000) {
        return res.status(400).send({error: 'Video must not exceed 200 MiB'});
    }
    let pathname = __dirname + '/../videos/' + new Date().getTime();
    req.files.video.mv(pathname, function (err) {
        if (err) {
            return res.send().status(500);
        }
        mysql.connection.query(
            `insert into VIDEOS (location) values ("${pathname}")`,
            (error, sqlResult) => {
                if (error) {
                    return res.status(500).send();
                }
                return res.status(201).send(sqlResult.insertId + "");
            }
        );
    });
}

// Just for testing!!!
exports.upload_test = (req, res) => {
    mysql.connection.query(`insert into VIDEOS (location) values ("/var/test")`,
        (error, sqlResult) => {
                if(error) {
                    return res.status(201).send();
                }
                return res.status(201).send(sqlResult.insertId + "");
        });
}

/**
 * @api {post} /videos/details Assign details to an uploaded video
 * @apiName Detail a video
 * @apiGroup Video
 *
 * @apiParam {Integer} course Course id.
 * @apiParam {Integer} video Video id.
 * @apiParam {String} title Video name.
 * @apiParam {String} description Video description.
 *
 * @apiSuccess 201 OK.
 * @apiError 403 Course or video does not exist
 * @apiError 500 Internal Server Error.
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 403 Not Found
 *     {
 *       "error": "description"
 *     }
 */
exports.details = (req, res) => {
    mysql.connection.query(
        `select * from COURSES where id = "${req.body.course}"`, (error, response_sql) => {
            if (response_sql[0] === undefined) {
                return res.status(403).send({error: 'Course does not exist'});
            }
            mysql.connection.query(
                `select * from VIDEOS where id = "${req.body.video}"`, (error, response_sql) => {
                    if (response_sql[0] === undefined) {
                        return res.status(403).send({error: 'Video does not exist'});
                    }
                    mysql.connection.query(`UPDATE VIDEOS SET 
                    course = "${req.body.course}", 
                    title = "${req.body.title}",
                    description = "${req.body.description}" 
                    WHERE id = "${req.body.video}"`,
                        (error) => {
                            if (error) {
                                return res.status(500).send();
                            }
                            return res.status(201).send();
                        }
                    );
                }
            );
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
                return res.status(500).send();
            }
            return res.status(200).send(response_sql);
        }
    );
}
