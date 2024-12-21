const { addBike, showBikes, showBike, deleteBike, updateBike } = require('../../src/modules/bike.js');

// Byt ut db/db.js mot testDBsd
jest.mock('../../src/db/db.js', () => require('../db/dbDev.js'));

describe('Bike Module Integration Tests', () => {
    beforeAll(async () => {
        await addBike('test123', 100, 10, 20);
        await addBike('test456', 50, 11, 22);
    });

    afterAll(async () => {
        const testDB = require('../db/dbDev.js');
        await testDB.query('DELETE FROM Bike');
        await testDB.end();
    });

    test('should fetch all bikes successfully', async () => {
        const bikes = await showBikes();
        console.log(bikes)
        expect(bikes).toEqual([
            { bike_id: 'test123', status: "available", battery_level: 100, longitude: 10, latitude: 20 },
            { bike_id: 'test456', status: "available", battery_level: 50, longitude: 11, latitude: 22 },
        ]);
    });

    test('should update a bike and fetch it', async () => {
        await updateBike("test123", {battery_level:0, status: "charging" })
        const updated = await showBike("test123")

        expect(updated[0].battery_level).toEqual(0)
        expect(updated[0].status).toEqual("charging")
    })


});
