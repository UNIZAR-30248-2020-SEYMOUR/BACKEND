const mysql = require('../database/mysql-connection');

exports.register = (req, res) => {
    mysql.connection.query(
        'insert into users (email, password) values ("' +
        req.body.email +
        '","' +
        req.body.password +
        '")',
        (error) => {
            if (error) {
                console.log(error);
                res.status(500).send(error);
            }
            else {
                res.status(201).send({message: 'User registered'});
            }
        }
    );
};

exports.login = (req, res) => {
    res.status(404).send({message: 'Todo'})
};
