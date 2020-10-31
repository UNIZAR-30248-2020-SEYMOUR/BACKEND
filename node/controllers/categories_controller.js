const mysql = require('../database/mysql');

/**
 * Get list of categories
 * @return {Number} 200 if OK | 500 if error
 * @return {JSON}
 *
 * if not OK:
 * {
 *      error: description
 * }
 *
 else:
 * {
 *      [
 *          {
 *              "name" : "category"
 *          },
 *          {
 *              ...
 *          }
 *      ]
 * }
 */
exports.get_list = (req, res) => {
    mysql.connection.query(
        `select * from CATEGORIES`, (error, response_sql) => {
            if (error) {
                res.status(500).send();
            }
            else {
                res.status(200).send(response_sql);
            }
        }
    );
}