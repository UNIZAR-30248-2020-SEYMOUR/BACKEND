const mysql = require('../database/mysql');

exports.doQuery = (query) => {
    mysql.connection.query(query,
        (error, sql_response) => {
            if (error) {
                console.log('Error' + error.code);
                return error.code;
            }
            else {
                console.log('OK');
                return sql_response;
            }
        }
    );
}