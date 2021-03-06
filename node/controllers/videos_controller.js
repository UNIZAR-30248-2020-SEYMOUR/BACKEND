const mysql = require('../database/mysql');
const extractFrames = require('ffmpeg-extract-frames')
const fs = require('fs');


/**
 * @api {post} /videos/upload Upload a video to a course
 * @apiName Upload a video
 * @apiGroup Video
 *
 * @apiParam {String} video Video file itself
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
    if (!req.files) {
        return res.status(400).send({error: 'No video uploaded'});
    }
    if (!req.files.video) {
        return res.status(400).send({error: 'No video uploaded'});
    }
    if (req.files.video.mimetype !== 'video/mp4') {
        return res.status(400).send({error: 'Video format must be video/mp4'});
    }
    if (req.files.video.size > 200000000) {
        return res.status(400).send({error: 'Video must not exceed 200 MiB'});
    }

    let name = new Date().getTime()

    // Storing video
    let videoPathname = 'videos/' + name;
    req.files.video.mv(videoPathname);

    // Storing imagePreview
    let imagePreviewPathname = 'imagePreview/' + name;
    extractFrames({
        input: videoPathname,
        output: imagePreviewPathname,
        offsets: [0] // Extract first frame
    })
      .then(function () {
        // Storing the paths in the database
        mysql.connection.query(
          `insert into VIDEOS (location, imagePreview) values ("${videoPathname}", "${imagePreviewPathname}.png")`,
          (error, sqlResult) => {
            return res.status(201).send(sqlResult.insertId + "");
          }
        );
      })
      .catch(function (reason) {
        return res.status(400).send();
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
 * @apiName Get all videos
 * @apiGroup Video
 *
 * @apiSuccess OK Get videos successful.
 * @apiError 500 Internal Server Error.
 */
exports.get_list = (req, res) => {
    mysql.connection.query(
        `select * from VIDEOS`, (error, response_sql) => {
            return res.status(200).send(response_sql);
        }
    );
}

/**
 * @api {post} /videos/get_video Get information of a video
 * @apiName Get one video
 * @apiGroup Video
 * @apiParam {Integer} video Video id.
 *
 * @apiSuccess 200 OK. Get video successful.
 * @apiError 404 If video not found.
 * @apiError 500 Internal Server Error.
 */
exports.get_video = (req, res) => {
    let videoData = {};
    mysql.connection.query(
        `select * from VIDEOS WHERE id=${req.body.id}`, (error, video) => {

            if (video[0] === undefined) {
                return res.status(404).send();
            }
            videoData.id=video[0].id;
            videoData.title=video[0].title;
            videoData.description=video[0].description;
	        videoData.course=video[0].course;
	        videoData.imagePreview=base64_encode(video[0].imagePreview);
            mysql.connection.query(
                `select * from USERS where uuid IN (select uuid from COURSES where id=${video[0].course})`, (error, users) => {
			        videoData.owner=users[0].username;
                }
            );
            videoData.location=video[0].location;
            videoData.rate=video[0].rate;
            mysql.connection.query(
                `select u.username, c.comment from USER_COMMENTS c, USERS u WHERE c.id_video=${req.body.id} AND u.UUID=c.id_user`, (error, comments) => {
                    videoData.comments=comments;
                    return res.status(200).json(videoData);
                }
            );
        }
    );
}

/**
 * @api {post} /videos/rate Rate one video
 * @apiName Rate video
 * @apiGroup Video
 *
 * @apiParam {Integer} video Video id.
 * @apiParam {String} uuid Rater uuid.
 * @apiParam {Integer} rate Rate.
 *
 * @apiSuccess 201 OK.
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 201 OK
 *     {
 *       "rate": 3.4
 *     }
 * @apiError 404 User or video does not exist.
 * @apiError 500 Internal Server Error.
 */
exports.rate = (req, res) => {
    mysql.connection.query( `SELECT * FROM USERS WHERE uuid="${req.body.uuid}"`, (error, response) => {
        if(response[0] === undefined) {
            return res.status(404).send("User does not exist")
        }
        mysql.connection.query( `SELECT * FROM VIDEOS WHERE id="${req.body.video}"`, (error, response) => {
            if(response[0] === undefined) {
                return res.status(404).send("Video does not exist")
            }
            mysql.connection.query( `INSERT INTO USER_RATES (id_user, id_video, score) VALUES("${req.body.uuid}", 
                "${req.body.video}", "${req.body.rate}") ON DUPLICATE KEY UPDATE score="${req.body.rate}"`, () => {
                    mysql.connection.query( `SELECT rate FROM VIDEOS WHERE id=${req.body.video}`, (error, response) => {
                        return res.status(201).send(response[0])
                    });
            });
        });
    });
}

/**
 * @api {post} /videos/comment Comment one video
 * @apiName Comment video
 * @apiGroup Video
 *
 * @apiParam {Integer} video Identificator of the video which is being commented.
 * @apiParam {String} uuid Identificator of the user who is commenting.
 * @apiParam {String} comment Text to comment.
 *
 * @apiSuccess 201 OK.
 * @apiError 404 User or video does not exist.
 * @apiError 500 Internal Server Error.
 */
exports.comment = (req, res) => {
    mysql.connection.query( `SELECT * FROM USERS WHERE uuid="${req.body.uuid}"`, (error, response) => {
        if(response[0] === undefined) {
            return res.status(404).send("User does not exist")
        }
        mysql.connection.query( `SELECT * FROM VIDEOS WHERE id="${req.body.video}"`, (error, response) => {
            if(response[0] === undefined) {
                return res.status(404).send("Video does not exist")
            }
            mysql.connection.query( `INSERT INTO USER_COMMENTS (id_user, id_video, comment) VALUES("${req.body.uuid}", 
                "${req.body.video}", "${req.body.comment}")`, () => {
                    return res.status(201).send()
            });
        });
    });
}

// get info (param id) me devuelves title, description, userNameOwnerVideo, url





// function to encode file data to base64 encoded string: imagePreviews
function base64_encode(file) {
    // read binary data
    const bitmap = fs.readFileSync(file);
    // convert binary data to base64 encoded string
    return new Buffer.from(bitmap).toString('base64');
}
