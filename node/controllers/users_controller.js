const mysql = require('../database/mysql');
const jwt = require('jsonwebtoken');
const mysql_query = require('../controllers/mysql_query');
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
 * @return {Number} 201 if OK | 403 if invalid email or password | 500 if internal server error
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
            } else {
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
}

exports.resetPassword = (req, res) => {
    const {token, newPassword} = req.body;
    jwt.verify(token, RESET_PASSWORD_MASTERKEY, function(error, decodedData) {
        if(error) {
            return res.status(401).send({error: 'Incorrect token or token expired'})
        }
    })
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

exports.forgotPassword = (req, res) => {
    console.log(req.body);
    mysql.connection.query(
        `select uuid from USERS where email = "${req.body.email}"`,
        (error, response_sql) => {
            if (error) {
                res.status(500).send();
            }
            else {
                row = response_sql[0]
                if (row === undefined) {
                    res.status(403).send({error: 'Invalid email'});
                } else {
                    const token = jwt.sign({_uuid: row.uuid}, RESET_PASSWORD_MASTERKEY , {expiresIn: '30m'});
                    var emailData = {
                        from: 'noreply.seymour@gmail.com',
                        to: req.body.email,
                        subject: '[SEYMOUR] Reset your password',
                        html: `<h2>Please click on given link to reset your password</h2>
                                <p>${process.env.API_IP}/users/resetPassword/${token}</p>`

                    };
                    mysql.connection.query(`UPDATE USERS SET resetLink = "${token}" WHERE email = "${req.body.email}"`)
                    nodemailer.sendEmail(emailData);
                    res.status(200).send();
                }
            }
        }
    );
};

