const { 
    getUserInfo, 
    addUser, 
    updateUser, 
    deleteUsers, 
    getAllUsers, 
    deleteUser, 
    findOrCreateUser, 
    giveAdmin, 
    isUserAdmin 
} = require('../../src/modules/user.js');
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

    test('should delete a single user', async () => {
        const userId = 5;
        await addUser(userId, "toDelete@hotmail.com", 10);

        const result = await deleteUser(userId);
        expect(result.affectedRows).toEqual(1);

        const users = await getAllUsers();
        expect(users.find(user => user.user_id === userId)).toBeUndefined();
    });

    test('should give admin rights to a user', async () => {
        const userId = 6;
        await addUser(userId, "adminTest@hotmail.com", 100);

        const adminResult = await giveAdmin(userId);
        expect(adminResult.affectedRows).toEqual(1);

        const user = await getUserInfo(userId);
        expect(user.admin).toBe(1);
    });

    test('should check if user is admin or not', async () => {
        const userIdAdmin = 7;
        const userIdNonAdmin = 8;
        
        await addUser(userIdAdmin, "admin@hotmail.com", 100);
        await giveAdmin(userIdAdmin);
        
        await addUser(userIdNonAdmin, "notAdmin@hotmail.com", 100);

        const isAdmin = await isUserAdmin(userIdAdmin);
        expect(isAdmin).toBe(true);

        const isNotAdmin = await isUserAdmin(userIdNonAdmin);
        expect(isNotAdmin).toBe(false);
    });

    test('should find or create a user', async () => {
        const oauthUser = {
            id: 'oauth123',
            emails: [{ value: 'oauth@example.com' }],
            displayName: 'OAuth User',
            photos: [{ value: 'photo-url.com' }]
        };

        const user = await findOrCreateUser(oauthUser);
        expect(user).toEqual(expect.objectContaining({
            user_id: 'oauth123',
            email: 'oauth@example.com',
            balance: 0
        }));

        // Check if user already exists
        const existingUser = await findOrCreateUser(oauthUser);
        expect(existingUser).toEqual(user); // Should return the same user object
    });
});