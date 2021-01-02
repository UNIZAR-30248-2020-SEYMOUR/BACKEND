const mysql = require('../database/mysql');
const jwt = require('jsonwebtoken');
const nodemailer = require('../controllers/email_controller');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');

const RESET_PASSWORD_MASTERKEY = 'MasterKey1.'
const bcrypt = require("bcryptjs")
const saltRounds=10

/**
 * @api {post} /users/register User register
 * @apiName User register
 * @apiGroup User
 *
 * @apiParam {String} username Username.
 * @apiParam {String} email E-mail.
 * @apiParam {String} password Password.
 * @apiParam {String} description Description.
 *
 * @apiSuccess OK User registered successfully.
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "uuid": 123456-123456-123456,
 *     }
 *
 * @apiError  400 Bad user parameters.
 * @apiError 226 Username already exists.
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 409 Not Found
 *     {
 *       "error": "description"
 *     }
 */

exports.register = (req, res) => {
    if (req.body.password.length > 40) {
        return res.status(400).send()
    }

    let uuid = uuidv4()
    let hashedPassword = bcrypt.hashSync(req.body.password, saltRounds)

    mysql.connection.query(
        `insert into USERS (uuid, username, email, password, description) values
                ("${uuid}", "${req.body.username}", "${req.body.email}", "${hashedPassword}", "${req.body.description}")`,
        (error) => {
            if (error) {
                if (error.code === 'ER_DUP_ENTRY') {
                    return res.status(409).send({error: error.sqlMessage});
                }
                return res.status(500).send()
            }
            return res.status(201).send({UUID: uuid});
        }
    );
};



/**
 * @api {post} /users/login User login
 * @apiName User login
 * @apiGroup User
 *
 * @apiParam {String} email E-mail.
 * @apiParam {String} password Password.
 *
 * @apiSuccess OK User login successful.
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "UUID": 123456-123456-123456,
 *       "username" pepito-grillo
 *     }
 *
 * @apiError  403 Wrong e-mail or password.
 * @apiError 500 Internal Server Error.
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 403 Invalid email
 *     {
 *       "error": "description"
 *     }
 */
exports.login = (req, res) => {
    mysql.connection.query(
        `select password, uuid, username from USERS where email = "${req.body.email}"`,
        (error, response_sql) => {
            if (response_sql[0] === undefined) {
                return res.status(403).send({error: 'Invalid email'});
            }
            if (bcrypt.compareSync(req.body.password, response_sql[0].password)) {
                return res.status(200).send({UUID: response_sql[0].uuid, username: response_sql[0].username});
            }
            return res.status(403).send({error: 'Invalid password'});
        }
    );
};

/**
 * @api {post} /users/get_list Get users
 * @apiName Get users
 * @apiGroup User
 *
 * @apiSuccess OK Get users successful.
 * @apiError 500 Internal Server Error.
 */
exports.get_list = (req, res) => {
    mysql.connection.query(`select * from USERS`,(error, response_sql) => {
        return res.status(200).send(response_sql);
    });
};

/**
 * @api {post} /users/reset_password Reset user password
 * @apiName Reset user password
 * @apiGroup User
 *
 * @apiParam {String} token Token.
 * @apiParam {String} newPassword New password.
 *
 * @apiSuccess 200 Password changed successfully.
 * @apiError  401 Invalid token.
 * @apiError 500 Internal Server Error.
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 401 Invalid token
 *     {
 *       "error": "description"
 *     }
 */
exports.reset_password = (req, res) => {
    jwt.verify(req.body.token, RESET_PASSWORD_MASTERKEY, function(error) {
        if (error) {
            return res.status(401).send({error: 'Incorrect token or token expired'})
        }
        mysql.connection.query(`UPDATE USERS SET resetLink = "", password = "${req.body.newPassword}" 
            WHERE resetLink = "${req.body.token}"`, () => {
                    return res.status(200).send();
            }
        );
    })
};


/**
 * @api {post} /users/forgot_password Request password reset
 * @apiName Request password reset
 * @apiGroup User
 *
 * @apiParam {String} email E-mail.
 *
 * @apiSuccess 200 E-mail sent.
 * @apiError  403 Invalid e-mail.
 * @apiError 500 Internal Server Error.
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 403 Invalid e-mail
 *     {
 *       "error": "description"
 *     }
 */
exports.forgot_password = (req, res) => {
    mysql.connection.query(
        `SELECT * FROM USERS WHERE email = "${req.body.email}"`, (error, response_sql) => {
            if (response_sql[0] === undefined) {
                return res.status(403).send({error: 'Invalid email'});
            }
            const token = jwt.sign({_uuid: response_sql[0].uuid}, RESET_PASSWORD_MASTERKEY , {expiresIn: '30m'});
            const emailData = {
                from: 'noreply.seymour@gmail.com',
                to: req.body.email,
                subject: '[SEYMOUR] Recupera tu contraseña',
                html: `<h2>Accede al siguiente link para recuperar tu contraseña</h2>
                           <p>http://91.250.180.41/#/recover-password?token=${token}</p>`
            };
            mysql.connection.query(`UPDATE USERS SET resetLink = "${token}" WHERE email = "${req.body.email}"`);
            nodemailer.sendEmail(emailData);
            return res.status(200).send();
        }
    );
};

/**
 * @api {post} /users/user_profile Get user profile info
 * @apiName Get user profile info
 * @apiGroup User
 *
 * @apiParam {String} uuid UUID.
 *
 * @apiSuccess 200 OK.
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "username": "Juan",
 *       "description": "My profile description",
 *       "email": "juan@gmail.com",
 *       "rate": 54,
 *       "courses": [{
 *           "id", "1",
 *           "coursename":"My course",
 *           "description":"This is my first course",
 *           "category" : {
 *               "name" : "Science",
 *               "imageUrl" : "example.com/science.jpg"
 *               }
 *           }
 *       }
 * @apiError  404 User does not exists.
 * @apiError 500 Internal Server Error.
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "description"
 *     }
 */
exports.user_profile = (req, res) => {
    let responseData = {};
    mysql.connection.query(
        `select username, description, email, rate from USERS where uuid = "${req.body.uuid}"`,
            (error, response_sqlUser) => {
                if (response_sqlUser[0] === undefined) {
                    return res.status(404).send({error: 'User does not exist'});
                }
                responseData.username = response_sqlUser[0].username;
                responseData.description = response_sqlUser[0].description;
                responseData.email = response_sqlUser[0].email;
                responseData.rate = response_sqlUser[0].rate;
                responseData.courses = [];
                mysql.connection.query(
                    `select c.id, c.coursename, c.description, cat.name, cat.imageUrl from COURSES c, CATEGORIES cat 
                        where c.owner = "${req.body.uuid}" and c.category = cat.name`,
                        (error, response_sqlCourses) => {
                            if (response_sqlCourses.length > 0) {
                                for (let i = 0; i < response_sqlCourses.length; ++i) {
                                    let course = {};
                                    let category = {};
                                    course.id = response_sqlCourses[i].id;
                                    course.coursename = response_sqlCourses[i].coursename;
                                    course.description = response_sqlCourses[i].description;
                                    category.name = response_sqlCourses[i].name;
                                    category.imageUrl = response_sqlCourses[i].imageUrl;
                                    course.category = category;
                                    responseData.courses.push(course);
                                }
                            }
                            return res.status(200).send(responseData);
                        }
                )
            }
    );
};

/**
 * @api {post} /users/get_user Get user info
 * @apiName Get user info
 * @apiGroup User
 *
 * @apiParam {String} username Username of the user to retrieve.
 *
 * @apiSuccess 200 OK.
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "username": "Juan",
 *       "description": "My profile description",
 *       "email": "juan@gmail.com",
 *       "rate": 54,
 *       "courses": [{
 *           "id", "1",
 *           "coursename":"My course",
 *           "description":"This is my first course",
 *           "category" : {
 *               "name" : "Science",
 *               "imageUrl" : "example.com/science.jpg"
 *               }
 *           }
 *       }
 * @apiError  404 User does not exists.
 * @apiError 500 Internal Server Error.
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "description"
 *     }
 */
exports.get_user = (req, res) => {
    let responseData = {};
    mysql.connection.query(
        `select username, description, email, rate, uuid from USERS where username = "${req.body.username}"`,
        (error, response_sqlUser) => {
            if (response_sqlUser[0] === undefined) {
                return res.status(404).send({error: 'User does not exist'});
            }
            responseData.username = response_sqlUser[0].username;
            responseData.description = response_sqlUser[0].description;
            responseData.email = response_sqlUser[0].email;
            responseData.rate = response_sqlUser[0].rate;
            responseData.courses = [];
            let uuid = response_sqlUser[0].uuid;
            mysql.connection.query(
                `select c.id, c.coursename, c.description, cat.name, cat.imageUrl from COURSES c, CATEGORIES cat 
                    where c.owner = "${uuid}" and c.category = cat.name`,
                        (error, response_sqlCourses) => {
                            let rowCourse;
                            if (response_sqlCourses.length > 0) {
                                for (let i = 0; i < response_sqlCourses.length; ++i) {
                                    rowCourse = response_sqlCourses[i];
                                    let course = {};
                                    let category = {};
                                    course.id = rowCourse.id;
                                    course.coursename = rowCourse.coursename;
                                    course.description = rowCourse.description;
                                    category.name = rowCourse.name;
                                    category.imageUrl = rowCourse.imageUrl;
                                    course.category = category;
                                    responseData.courses.push(course);
                                }
                            }
                            return res.status(200).send(responseData);
                        }
            )
        }
    );
};

/**
 * @api {post} /users/delete Delete user
 * @apiName Delete user
 * @apiGroup User
 *
 * @apiParam {String} uuid UUID.
 *
 * @apiSuccess 204 OK.
 * @apiError  404 User does not exists.
 * @apiError 500 Internal Server Error.
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "description"
 *     }
 */
exports.delete = (req, res) => {
    mysql.connection.query(
        `delete from USERS where uuid = "${req.body.uuid}"`,
        (error, response_sql) => {
            if (response_sql.affectedRows === 1){
                return res.status(204).send();
            }
            if (response_sql.affectedRows === 0){
                return res.status(404).send();
            }
        }
    );
};

/**
 * @api {post} /users/update_profile Update user profile info
 * @apiName Update user profile info
 * @apiGroup User
 *
 * @apiParam {String} uuid UUID.
 * @apiParam {String} username Username.
 * @apiParam {String} email E-mail.
 * @apiParam {String} description User description.
 *
 * @apiSuccess 200 OK.
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "uuid": "123456-123456-123456",
 *       "username": "Juan",
 *       "description": "My profile description",
 *       "email":"juan@gmail.com",
 *       "password: mypassword123"
 *       "resetlink" : "3289uuc3298j89h32n9cedumelon328rmiobgreg43h5643twefwt3regjrio"
 *     }
 * @apiError  404 User does not exist.
 * @apiError  409 New username or email already exists.
 * @apiError 500 Internal Server Error.
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "description"
 *     }
 */
exports.update_profile = (req, res) => {
    mysql.connection.query(
        `select username, description, email from USERS where uuid = "${req.body.uuid}"`,
            (error, response_sqlUser) => {
                if (response_sqlUser[0] === undefined) {
                    return res.status(404).send({error: 'User does not exist'});
                }
                mysql.connection.query(
                    `UPDATE USERS SET username = "${req.body.username}", description = "${req.body.description}", 
                        email = "${req.body.email}" WHERE uuid = "${req.body.uuid}"`,
                            (error) => {
                                if (error) {
                                    if (error.code === 'ER_DUP_ENTRY') {
                                        return res.status(409).send({error: error.sqlMessage});
                                    }
                                    return res.status(500).send()
                                }
                                mysql.connection.query(
                                    `select * from USERS where uuid = "${req.body.uuid}"`,
                                    (error, response_sqlUser) => {
                                        return res.status(200).send(response_sqlUser[0]);
                                    }
                                );
                            }
                );
        }
    );
}

/**
 * @api {post} /users/search Search for an user
 * @apiName Search user
 * @apiGroup User
 *
 * @apiParam {String} textToSearch text.
 *
 * @apiSuccess 200 OK.
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "uuid": "123456-123456-123456",
 *       "username": "Juan",
 *       "description": "My profile description"
 *     }
 * @apiError 500 Internal Server Error.
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 500 Not Found
 *     {
 *       "error": "description"
 *     }
 */
exports.search = (req, res) => {
    mysql.connection.query(
        `select uuid, username, description from USERS where username LIKE "%${req.body.textToSearch}%"`,
        (error, response_sql) => {
            let responseData = [];
            if (response_sql.length > 0) {
                for (let i = 0; i < response_sql.length; ++i) {
                    let user = {};
                    user.uuid = response_sql[i].uuid;
                    user.username = response_sql[i].username;
                    user.description = response_sql[i].description;
                    responseData.push(user);
                }
            }
            return res.status(200).send(responseData);
        }
    );
};


/**
 * @api {post} /users/feed Ged user feed
 * @apiName Get feed of an user
 * @apiGroup User
 *
 * @apiParam {Integer} uuid User id.
 * @apiParam {Integer} first_video Start point.
 * @apiParam {Integer} last_video End point.
 *
 * @apiSuccess 200 Feed info retrieved.
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "id": "123456-123456-123456",
 *       "title": "Example title",
 *       "description": "My description",
 *       "imagePreview": "../../test.jpg",
 *       "course": "1"
 *     }
 * @apiError 500 Internal Server Error.
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "description"
 *     }
 */
exports.feed = (req, res) => {
    mysql.connection.query(
        `SELECT videos.id, videos.title, videos.imagePreview, videos.description, videos.course FROM VIDEOS videos
            WHERE videos.course IN (SELECT subscriptions.id_course FROM SUBSCRIPTIONS subscriptions
            WHERE id_user = "${req.body.uuid}") ORDER BY videos.id DESC LIMIT ${req.body.firstVideo}, ${req.body.lastVideo}`, (error, response_sql) => {
            
            let responseData = [];
            if (error) {
                return res.status(500).send({error: 'Internal server error'});
            } 
            
            for (let i = 0; i < response_sql.length; ++i) {
                let video = {};
                video.id = response_sql[i].id;
                video.title = response_sql[i].title;
                video.description = response_sql[i].description;
                video.imagePreview = base64_encode(response_sql[i].imagePreview);
                video.course = response_sql[i].course;
                responseData.push(video);
            }
            return res.status(200).send(responseData);
    });
};

// function to encode file data to base64 encoded string: imagePreviews
function base64_encode(file) {
    // read binary data
    const bitmap = fs.readFileSync(file);
    // convert binary data to base64 encoded string
    return new Buffer.from(bitmap).toString('base64');
}
