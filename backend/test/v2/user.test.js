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

    test('should add a new user successfully and fetch it', async () => {
        const email = "testuser@hotmail.com";
        const balance = 100;
        const result = await addUser(email, balance);
        const newUser = await getUserInfo(1);

        expect(result.affectedRows).toEqual(1);

        expect(newUser).toEqual(expect.objectContaining({
            email: "testuser@hotmail.com",
            balance: 100
        }));
    });

    test('should update user and fetch it', async () => {
        await addUser("another@hotmail.com", 50);

        await updateUser(2, { email: "updated@hotmail.com" });

        const updatedUser = await getUserInfo(2);

        expect(updatedUser).toEqual(expect.objectContaining({
            email: "updated@hotmail.com",
            balance: 50,
        })); 
    });
    
    test('should fetch all users and then delete them', async () => {
        const all = await getAllUsers();

        expect(all).toEqual([
            { email: "testuser@hotmail.com", balance: 100, user_id: 1 },
            { email: "updated@hotmail.com", balance: 50, user_id: 2 }
        ]);

        await deleteUser(1);

        const allAfter = await getAllUsers();

        expect(allAfter).toEqual([
            { email: "updated@hotmail.com", balance: 50, user_id: 2 }
        ]);
    });

});
