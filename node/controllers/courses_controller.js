const mysql = require('../database/mysql');

/**
 * Create a course
 * @param  {String} req.body.owner
 * @param  {String} req.body.coursename
 * @param  {String} req.body.description
 * @param {String} req.body.category
 * @return {Number} 201 if OK | 403 if owner or category does not exist
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
            if (response_sql[0] === undefined) {
                res.status(403).send({error: 'User does not exist'});
            } else {
                mysql.connection.query(
                    `select * from CATEGORIES where name = "${req.body.category}"`, (error, response_sql) => {
                        if (response_sql[0] === undefined) {
                            res.status(403).send({error: 'Category does not exist'});
                        } else {
                            mysql.connection.query(
                                `insert into COURSES (coursename, description, category, owner) values ("${req.body.coursename}", "${req.body.description}", "${req.body.category}", "${req.body.owner}")`, (error) => {
                                    if (error) {
                                        res.status(403).send();
                                    }
                                    else {
                                        res.status(201).send();
                                    }
                                }
                            );
                        }
                    }
                );
            }
        }
    );
};

/**
 * Delete a course from the system
 * @param  {String} req.body.id
 * @return {Number} 204 if course was deleted | 404 if course does not exist | 500 if internal server error
 */
exports.delete = (req, res) => {
    mysql.connection.query(
        `delete from COURSES where id = "${req.body.id}"`,
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
 * Update the information of a course
 * @param  {String} req.body.id
 * @param  {String} req.body.coursename
 * @param {String} req.body.description
 * @param  {String} req.body.category
 * @return {Number} 200 if OK | 404 if id is invalid | 500 if internal server error
 * @return {JSON}
 *
 * if not OK and not internal server error:
 * {
 *      error: description
 * }
 *
 else:
 * {
 *   id: uuid,
 *   coursename: coursename,
 *   description: description,
 *   category: category,
 * }
 */
exports.update_course = (req, res) => {
    mysql.connection.query(
        `select * from USERS where uuid = "${req.body.uuid}"`,
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
                        `UPDATE USERS SET username = "${req.body.name}", description = "${req.body.description}", email = "${req.body.email}" WHERE uuid = "${req.body.uuid}"`,
                        (error,response) => {
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
