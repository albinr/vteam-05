// modul för att välja mellan att använda docker eller bara "node app.js."
// för att ändra det gå till .env filen och sätt USE_DOCKER till true eller false

const mysql = require('mysql2/promise');
const config = require('../../data/vteam.json');
require('dotenv').config();

const useDocker = process.env.USE_DOCKER === 'true'; // Kontrollera om Docker ska användas

const pool = mysql.createPool(
    useDocker
        ? {
              host: process.env.DB_HOST,
              port: process.env.DB_PORT,
              user: process.env.DB_USER,
              password: process.env.DB_PASSWORD,
              database: process.env.DB_NAME,
              waitForConnections: true,
              connectionLimit: 10,
              multipleStatements: true,
              queueLimit: 0,
          }
        : {
              host: config.host,
              user: config.user,
              password: config.password,
              database: config.database,
              multipleStatements: config.multipleStatements,
              connectionLimit: config.connectionLimit,
              waitForConnections: true,
              queueLimit: 0,
          }
);

process.on('exit', () => {
    pool.end();
});

module.exports = pool;
