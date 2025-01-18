const { 
    getUserInfo, addUser, updateUser, deleteUsers, getAllUsers, deleteUser 
} = require('../../src/modules/user.js');
const { 
    showAllTrips, startTrip, endTrip, deleteTrips, showTripsByUser, 
    showTripsByBikeId, deleteTripById, OngoingTripByUser 
} = require('../../src/modules/trip.js');
const { addBike } = require('../../src/modules/bike.js');

// Mockar till testdb
jest.mock('../../src/db/db.js', () => require('../db/dbDev.js'));

describe('Trip Module Tests', () => {
    let userId1, userId2, bikeId1, bikeId2;

    beforeAll(async () => {
        const testDB = require('../db/dbDev.js');
        await testDB.query('DELETE FROM Trip');
        await testDB.query('DELETE FROM User');
        await testDB.query('DELETE FROM Bike');
    });

    beforeEach(async () => {
        // Generera unika användar-ID
        userId1 = `user1_${Date.now()}`;
        userId2 = `user2_${Date.now()}`;
        
        // Lägg till användare i databasen
        await addUser(userId1, "test1@gmail.com", 100, 1);
        await addUser(userId2, "test2@gmail.com", 100, 1);
        
        // Generera unika cykel-ID
        bikeId1 = `bike1_${Date.now()}`;
        bikeId2 = `bike2_${Date.now()}`;
        
        // Lägg till cyklar i databasen
        await addBike(bikeId1, 100, 10, 10, 1);
        await addBike(bikeId2, 100, 11, 11, 1);

        // Se till att alla trippar avslutas före test
        await endTrip(bikeId1);
        await endTrip(bikeId2);
    });

    afterEach(async () => {
        const testDB = require('../db/dbDev.js');
        await testDB.query('DELETE FROM Trip');
        await testDB.query('DELETE FROM User');
        await testDB.query('DELETE FROM Bike');
        await testDB.query('ALTER TABLE User AUTO_INCREMENT = 1'); // Återställ auto-inkrement
    });

    afterAll(async () => {
        const testDB = require('../db/dbDev.js');
        await testDB.end();
    });

    test('should start a trip successfully', async () => {
        const result = await startTrip(bikeId1, userId1);
        
        // If StartTrip returns a flat array or object instead:
        expect(result).toBeDefined();
        expect(result.message).toBeUndefined(); // Adjust based on actual return format
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
        await endTrip(bikeId1);
        await endTrip(bikeId2);

        const user1Trips = await showTripsByUser(userId1);
        expect(user1Trips).toHaveLength(1);
        expect(user1Trips[0].bike_id).toBe(bikeId1);

        const user2Trips = await showTripsByUser(userId2);
        expect(user2Trips).toHaveLength(1);
        expect(user2Trips[0].bike_id).toBe(bikeId2);
    });

    test('should fetch trips by bike ID', async () => {
        await startTrip(bikeId1, userId1);
        await endTrip(bikeId1);

        const bikeTrips = await showTripsByBikeId(bikeId1);
        expect(bikeTrips).toHaveLength(1);
        expect(bikeTrips[0].bike_id).toBe(bikeId1);
    });

    test('should delete all simulated trips', async () => {
        await startTrip(bikeId1, userId1);
        await startTrip(bikeId2, userId2);

        const result = await deleteTrips(1); // Simulated trips only
        expect(result).toBeDefined();

        const trips = await showAllTrips();
        expect(trips).toHaveLength(0);
    });

    test('should delete a trip by ID', async () => {
        await startTrip(bikeId1, userId1);
        const trips = await showAllTrips();
        const tripToDelete = trips[0].trip_id;

        const wasDeleted = await deleteTripById(tripToDelete);
        expect(wasDeleted).toBe(true);

        const remainingTrips = await showAllTrips();
        expect(remainingTrips.find(trip => trip.trip_id === tripToDelete)).toBeUndefined();
    });

    test('should get an ongoing trip for a user', async () => {
        await startTrip(bikeId1, userId1);
    
        const ongoingTrip = await OngoingTripByUser(userId1);
        expect(ongoingTrip).toBeDefined();
        expect(ongoingTrip.length).toBe(1); // Since it's an array with one item
        expect(ongoingTrip[0].end_time).toBeNull(); // Check the first (and only) item's end_time
    
        await endTrip(bikeId1);
        const noOngoingTrip = await OngoingTripByUser(userId1);
        expect(noOngoingTrip).toEqual([]); // Expecting an empty array when no trip is ongoing
    });
});
