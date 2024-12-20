const mysql = require('mysql2/promise');
const config = require('../../data/development.json');
require('dotenv').config();

const useDocker = process.env.USE_DOCKER === 'true';
const isTestEnvironment = process.env.NODE_ENV === 'test';
const database = isTestEnvironment ? 'testdb' : process.env.DB_NAME;

const pool = mysql.createPool(
    useDocker
        ? {
              host: process.env.DB_HOST || 'localhost',
              port: process.env.DB_PORT || 1387,
              user: process.env.DB_USER || 'root',
              password: process.env.DB_PASSWORD || '',
              database,
              waitForConnections: true,
              connectionLimit: 10,
              multipleStatements: true,
              queueLimit: 0,
          }
        : {
              ...config,
              database,
          }
);

process.on('exit', () => {
    pool.end();
});

module.exports = pool;
