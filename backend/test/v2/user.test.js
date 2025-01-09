const { getUserInfo, addUser, updateUser, deleteUsers, getAllUsers, deleteUser } = require('../../src/modules/user.js');
jest.mock('../../src/db/db.js', () => require('../db/dbDev.js'));

describe('User Module Tests', () => {
    afterEach(async () => {
        const testDB = require('../db/dbDev.js');
        await testDB.query('DELETE FROM User');
        await testDB.query('ALTER TABLE User AUTO_INCREMENT = 1');
    });

    afterAll(async () => {
        const testDB = require('../db/dbDev.js');
        await testDB.end();
    });

    test('should add a new user successfully and fetch it', async () => {

        const userId = 1;
        const email = "testuser@hotmail.com";
        const balance = 100;

        const result = await addUser(userId, email, balance);
        const newUser = await getUserInfo(userId);

        expect(result.affectedRows).toEqual(1);
        expect(newUser).toEqual(expect.objectContaining({
            email: "testuser@hotmail.com",
            balance: 100
        }));
    });

    test('should update user and fetch it', async () => {
        const userId = 2;
        await addUser(userId, "another@hotmail.com", 50);

        const updatedData = { email: "updated@hotmail.com", balance: 60 };
        await updateUser(userId, updatedData);

        const updatedUser = await getUserInfo(userId);

        expect(updatedUser).toEqual(expect.objectContaining({
            email: "updated@hotmail.com",
            balance: 60,
        }));
    });

    test('should fetch all users and then delete them', async () => {
        await deleteUsers(0);
        const userId1 = 3;
        const userId2 = 4;

        await addUser(userId1, "user1@hotmail.com", 100, 1);
        await addUser(userId2, "user2@hotmail.com", 200, 1);

        const all = await getAllUsers();

        expect(all).toEqual(expect.arrayContaining([
            expect.objectContaining({ 
                email: "user1@hotmail.com", 
                balance: 100, 
                user_id: String(userId1),
                simulation_user: 1
            }),
            expect.objectContaining({ 
                email: "user2@hotmail.com", 
                balance: 200, 
                user_id: String(userId2),
                simulation_user: 1
            })
        ]));

        await deleteUsers(1);

        const allAfter = await getAllUsers();
    
        expect(allAfter).toEqual([]);
    });
});
