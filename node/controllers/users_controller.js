const mysql = require('../database/mysql');
const jwt = require('jsonwebtoken');
const nodemailer = require('../controllers/email_controller');
const { v4: uuidv4 } = require('uuid');
const RESET_PASSWORD_MASTERKEY = 'MasterKey1.'

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
    let uuid = uuidv4()
    mysql.connection.query(
        `insert into USERS (uuid, username, email, password, description) values
                    ("${uuid}", "${req.body.username}", "${req.body.email}", "${req.body.password}", "${req.body.description}")`,
        (error) => {
            if (error) {
                if (error.code === 'ER_DUP_ENTRY') {
                    res.status(409).send({error: error.sqlMessage});
                }
                else {
                    res.status(500).send()
                }
            }
            else {
                res.status(201).send({UUID: uuid});
            }
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
 *       "uuid": 123456-123456-123456,
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
        `select password, uuid from USERS where email = "${req.body.email}"`,
        (error, response_sql) => {
            if (error) {
                res.status(500).send();
            }
            else {
                row = response_sql[0]
                if (row === undefined) {
                    res.status(403).send({error: 'Invalid email'});
                } else if (req.body.password !== row.password) {
                    res.status(403).send({error: 'Invalid password'});
                } else {
                    res.status(200).send({UUID: row.uuid});
                }
            }
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
    mysql.connection.query(
        `select * from USERS`,
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
    jwt.verify(req.body.token, RESET_PASSWORD_MASTERKEY, function(error, decodedData) {
        if(error) {
            return res.status(401).send({error: 'Incorrect token or token expired'})
        }
        else {
            mysql.connection.query(`UPDATE USERS SET resetLink = "", password = "${req.body.newPassword}" WHERE resetLink = "${req.body.token}"`,
                (error) => {
                    if (error) {
                        res.status(500).send()
                    }
                    else {
                        res.status(200).send();
                    }
                }
            );
        }
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
            if (error) {
                res.status(500).send();
            }
            else {
                row = response_sql[0];
                if (row === undefined) {
                    res.status(403).send({error: 'Invalid email'});
                }
                else {
                    const token = jwt.sign({_uuid: row.uuid}, RESET_PASSWORD_MASTERKEY , {expiresIn: '30m'});
                    const emailData = {
                        from: 'noreply.seymour@gmail.com',
                        to: req.body.email,
                        subject: '[SEYMOUR] Recupera tu contraseña',
                        html: `<h2>Accede al siguiente link para recuperar tu contraseña</h2>
                                   <p>http://91.250.180.41/#/recover-password?token=${token}</p>`
                    };
                    mysql.connection.query(`UPDATE USERS SET resetLink = "${token}" WHERE email = "${req.body.email}"`);
                    nodemailer.sendEmail(emailData);
                    res.status(200).send();
                }
            }
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
            let rowUser;
            if (error) {
                res.status(500).send();
            } else {
                rowUser = response_sqlUser[0]
                if (rowUser === undefined) {
                    res.status(404).send({error: 'User does not exist'});
                } else {
                    responseData.username = rowUser.username;
                    responseData.description = rowUser.description;
                    responseData.email = rowUser.email;
                    responseData.rate = rowUser.rate;
                    responseData.courses = [];
                    mysql.connection.query(
                        `select c.id, c.coursename, c.description, cat.name, cat.imageUrl from COURSES c, CATEGORIES cat where c.owner = "${req.body.uuid}" and c.category = cat.name`,
                        (error, response_sqlCourses) => {
                            let rowCourse;
                            if (error) {
                                res.status(500).send();
                            }
                            else {
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
                                res.status(200).send(responseData);
                            }
                        }
                    )
                }
            }
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
            let rowUser;
            if (error) {
                res.status(500).send();
            } else {
                rowUser = response_sqlUser[0]
                if (rowUser === undefined) {
                    res.status(404).send({error: 'User does not exist'});
                } else {
                    responseData.username = rowUser.username;
                    responseData.description = rowUser.description;
                    responseData.email = rowUser.email;
                    responseData.rate = rowUser.rate;
                    responseData.courses = [];
                    let uuid = rowUser.uuid;
                    mysql.connection.query(
                        `select c.id, c.coursename, c.description, cat.name, cat.imageUrl from COURSES c, CATEGORIES cat where c.owner = "${uuid}" and c.category = cat.name`,
                        (error, response_sqlCourses) => {
                            let rowCourse;
                            if (error) {
                                res.status(500).send();
                            }
                            else {
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
                                res.status(200).send(responseData);
                            }
                        }
                    )
                }
            }
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
            let rowUser;
            if (error) {
                res.status(500).send();
            } else {
                rowUser = response_sqlUser[0]
                if (rowUser === undefined) {
                    res.status(404).send({error: 'User does not exist'});
                } else {
                    mysql.connection.query(
                        `UPDATE USERS SET username = "${req.body.username}", description = "${req.body.description}", email = "${req.body.email}" WHERE uuid = "${req.body.uuid}"`,
                        (error) => {
                            if (error) {
                                if (error.code === 'ER_DUP_ENTRY') {
                                    res.status(409).send({error: error.sqlMessage});
                                }
                                else {
                                    res.status(500).send()
                                }
                            }
                            else {
                                mysql.connection.query(
                                    `select * from USERS where uuid = "${req.body.uuid}"`,
                                    (error, response_sqlUser) => {
                                        if (error) {
                                            res.status(500).send();
                                        } else {
                                            res.status(200).send(response_sqlUser[0]);
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
            if (error) {
                res.status(500).send();
            }
            else {
                let responseData = [];
                if (response_sql.length > 0) {
                    for (let i = 0; i < response_sql.length; ++i) {
                        rowUser = response_sql[i];
                        let user = {};
                        user.uuid = rowUser.uuid;
                        user.username = rowUser.username;
                        user.description = rowUser.description;
                        responseData.push(user);
                    }
                }
                res.status(200).send(responseData);
            }
        }
    );
};
