const mysql = require('../database/mysql');


/**
 * @api {post} /categories/get_list Get categories
 * @apiName Get categories
 * @apiGroup Category
 *
 * @apiSuccess OK Get categories successful.
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     [
 *          {
 *              "name" : "category"
 *          },
 *          {
 *              ...
 *          }
 *      ]
 *
 * @apiError 500 Internal Server Error.
 */
exports.get_list = (req, res) => {
    mysql.connection.query(
        `select * from CATEGORIES`, (error, response_sql) => {
            return res.status(200).send(response_sql);
        }
    );
}
