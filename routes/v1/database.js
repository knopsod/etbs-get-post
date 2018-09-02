var mysql = require('mysql');
var config = require('../../config/config.json');

var db = {};

db.getConnection = function () {
    var conn = mysql.createConnection({
        host: config.dbserver.host,
        user: config.dbserver.user,
        password: config.dbserver.password,
        database: config.dbserver.database,
        dateStrings: true
    });

    return conn;
}

module.exports = db;
