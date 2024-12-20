const mysql = require('mysql2/promise');
require('dotenv').config();

const isTestEnvironment = process.env.NODE_ENV === 'test';
const database = isTestEnvironment ? 'testdb' : process.env.DB_NAME || 'testdb';

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'Timpa.local',
    user: process.env.DB_USER || 'dbadm',
    password: process.env.DB_PASSWORD || 'P@ssw0rd',
    database,
    multipleStatements: true,
    connectionLimit: 10,
    waitForConnections: true,
    queueLimit: 0,
});

process.on('exit', () => {
    pool.end();
});

module.exports = pool;
