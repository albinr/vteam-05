const { 
    getUserInfo, addUser, updateUser, deleteUsers, getAllUsers, deleteUser
} = require('../../src/modules/user.js');
const { showAllTrips, startTrip, endTrip, deleteTrips, showTripsByUser } = require('../../src/modules/trip.js');
const { addBike } = require('../../src/modules/bike.js');

// Mockar till testdb
jest.mock('../../src/db/db.js', () => require('../db/dbDev.js'));

describe('User Module Tests', () => {
    let userId1, userId2;
    let bikeId1, bikeId2;

    beforeEach(async () => {
        // Skapa användare och cyklar för varje test
        userId1 = (await addUser("test1@gmail.com", 100)).insertId;
        userId2 = (await addUser("test2@gmail.com", 100)).insertId;

        bikeId1 = "testBike1";
        bikeId2 = "testBike2";

        await addBike(bikeId1, 100, 10, 10, 1);
        await addBike(bikeId2, 100, 11, 11, 1);
    });

    afterEach(async () => {
        // Rensa databasen efter varje test
        const testDB = require('../db/dbDev.js');
        await testDB.query('DELETE FROM Trip');
        await testDB.query('DELETE FROM User');
        await testDB.query('DELETE FROM Bike');
        await testDB.query('ALTER TABLE User AUTO_INCREMENT = 1');
        
    });

    afterAll(async () => {
        const testDB = require('../db/dbDev.js');
        await testDB.end();
    })

    test('should start a trip successfully', async () => {
        const result = await startTrip(bikeId1, userId1);

        expect(result).toBeDefined();
        expect(result[0]?.[0]?.message).toBeUndefined();
    });

    test('should return an error if bike is unavailable', async () => {
        const unavailableBikeId = "nonexistentBike";
        const result = await startTrip(unavailableBikeId, userId1);

        expect(result).toBeDefined();
        expect(result[0][0].message).toBe(`Bike ${unavailableBikeId} is Unavailable`);
    });

    test('should end a trip successfully', async () => {
        await startTrip(bikeId1, userId1);

        await expect(endTrip(bikeId1)).resolves.not.toThrow();

        const trips = await showAllTrips();
        const endedTrip = trips.find(trip => trip.bike_id === bikeId1);
        expect(endedTrip).toBeDefined();
        expect(endedTrip.end_time).not.toBeNull();
    });

    test('should fetch trips by user', async () => {
        await startTrip(bikeId1, userId1);
        await startTrip(bikeId2, userId2);

        const user1Trips = await showTripsByUser(userId1);
        expect(user1Trips).toHaveLength(1);
        expect(user1Trips[0].bike_id).toBe(bikeId1);

        const user2Trips = await showTripsByUser(userId2);
        expect(user2Trips).toHaveLength(1);
        expect(user2Trips[0].bike_id).toBe(bikeId2);
    });

    test('should delete all simulated trips', async () => {
        await startTrip(bikeId1, userId1);
        await startTrip(bikeId2, userId2);

        const result = await deleteTrips(1);
        expect(result).toBeDefined();

        const trips = await showAllTrips();
        expect(trips).toHaveLength(0);
    });


});
