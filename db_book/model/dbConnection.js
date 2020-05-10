const mysql = require('mysql2');
const fs = require('fs');

// DB Connection
const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: 'cometrue',
    port: 3306,
    database: 'example',
    multipleStatements: true,
 };

// Connection Pool module export
const pool = mysql.createPool(dbConfig).promise();
module.exports = pool;