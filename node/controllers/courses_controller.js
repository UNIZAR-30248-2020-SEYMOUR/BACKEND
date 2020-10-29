const mysql = require('../database/mysql');

/**
 * Create a course
 * @param  {String} req.body.owner
 * @param  {String} req.body.coursename
 * @param  {String} req.body.description
 * @return {Number} 201 if OK | 403 if owner does not exist
 * @return {JSON}
 *
 * if not OK:
 * {
 *      error: description
 * }
 */
exports.create_course = (req, res) => {
    mysql.connection.query(
        `select * from USERS where uuid = "${req.body.owner}"`, (error, response_sql) => {
            if(response_sql[0] === undefined) {
                res.status(403).send();
            }
            else {
                mysql.connection.query(
                    `insert into COURSES (coursename, description, owner) values ("${req.body.coursename}", "${req.body.description}", "${req.body.owner}")`, (error) => {
                        if (error) {
                            res.status(403).send();
                        }
                        else {
                            res.status(201).send();
                        }
                });
            }
    });


};