//sss

const mysql = require('mysql2/promise');
const config = require('../../data/noDocker.json');
require('dotenv').config();

const useDocker = process.env.USE_DOCKER === 'true';
const isTestEnvironment = process.env.NODE_ENV === 'test';
const database = isTestEnvironment ? 'testdb' : process.env.DB_NAME;
const pool = mysql.createPool(
    useDocker
        ? {
              host: "testdatabase",
              port: 3306,
              user: "dbadm",
              password: 'scrt_pa_s_db',
              database: "testdb",
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
