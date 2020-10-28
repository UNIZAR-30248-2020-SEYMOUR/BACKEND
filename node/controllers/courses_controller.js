const mysql = require('../database/mysql');

/**
 * Create a course
 * @param  {String} req.body.owner
 * @param  {String} req.body.coursename
 * @param  {String} req.body.description
 * @return {Number} 201 if OK | 403 if owner does not exist | 500 if internal server error
 * @return {JSON}
 *
 * if not OK:
 * {
 *      error: description
 * }
 */
exports.create_course = (req, res) => {
    mysql.connection.query(
        `insert into COURSES (coursename, description, owner) values
                    ("${req.body.coursename}", "${req.body.description}", "${req.body.owner}")`,
        (error) => {
            if (error) {
                res.status(500).send()
            }
            else {
                res.status(201).send({});
            }
        }
    );
};