const mysql = require('../database/mysql');
const { v4: uuidv4 } = require('uuid');


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
            }
            else {
                row = response_sql[0]
                if (row === undefined) {
                    res.status(403).send({error: 'Invalid email'});
                }
                else if (req.body.password !== row.password) {
                    res.status(403).send({error: 'Invalid password'});
                }
                else {
                    res.status(200).send({UUID: row.uuid});
                }
            }
        }
    );
};
