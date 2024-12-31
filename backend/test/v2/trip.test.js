const { getUserInfo, addUser, updateUser, deleteUsers, getAllUsers, deleteUser } = require('../../src/modules/user.js');

// mockar till testdb
jest.mock('../../src/db/db.js', () => require('../db/dbDev.js'));

describe('User Module Tests', () => {
    afterAll(async () => {
        const testDB = require('../db/dbDev.js');
        await testDB.query('DELETE FROM User');
        await testDB.query('ALTER TABLE User AUTO_INCREMENT = 1');
        await testDB.end();
    });

});
