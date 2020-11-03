const mysql = require('../database/mysql');
const jwt = require('jsonwebtoken');
const nodemailer = require('../controllers/email_controller');
const { v4: uuidv4 } = require('uuid');
const RESET_PASSWORD_MASTERKEY = 'MasterKey1.'


/**
 * Register a user
 * @param  {String} req.body.username
 * @param  {String} req.body.email
 * @param  {String} req.body.password
 * @param  {String} req.body.description
 * @return {Number} 201 if OK | 409 if email or username exists | 500 if internal server error
 * @return {JSON}
 *
 * if not OK:
 * {
 *      error: description
 * }
 *
 else:
 * {
 *      UUID: uuid
 * }
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
 * Login in the system
 * @param  {String} req.body.email
 * @param  {String} req.body.password
 * @return {Number} 200 if OK | 403 if invalid email or password | 500 if internal server error
 * @return {JSON}
 *
 * if not OK and not internal server error:
 * {
 *      error: description
 * }
 *
 else:
 * {
 *      UUID: uuid
 * }
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
 * Reset user password
 * @param  {String} req.body.token
 * @param  {String} req.body.newPassword
 * @return {Number} 200 if OK | 401 if invalid token | 500 if internal server error
 * @return {JSON}
 *
 * if not OK and not internal server error:
 * {
 *      error: description
 * }
 *
 */
exports.resetPassword = (req, res) => {
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
 * Request password reset
 * @param  {String} req.body.email
 * @return {Number} 200 if OK | 403 if invalid email | 500 if internal server error
 * @return {JSON}
 *
 * if not OK and not internal server error:
 * {
 *      error: description
 * }
 *
 */
exports.forgotPassword = (req, res) => {
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
                        subject: '[SEYMOUR] Reset your password',
                        html: `<h2>Please click on given link to reset your password</h2>
                                   <p>http://${process.env.API_IP}/users/recover-password?token=${token}</p>`
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
 * Get user profile info
 * @param  {String} req.body.uuid
 * @return {Number} 200 if OK | 404 if user does not exist | 500 if internal server error
 * @return {JSON}
 *
 * if not OK and not internal server error:
 * {
 *      error: description
 * }
 *
 else:
 * {
 *      username : username,
 *      description : description,
 *      email: email,
 *      courses: [
 *          [
 *              id: id,
 *              coursename : coursename,
 *              description : description,
 *              category: {
 *                  name: name,
 *                  imageUrl: url
 *              }
 *          ],
 *          ...
 *      ]
 * }
 */
exports.user_profile = (req, res) => {
    let responseData = {};
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
                    responseData.username = rowUser.username;
                    responseData.description = rowUser.description;
                    responseData.email = rowUser.email;
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
