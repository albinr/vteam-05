const { addBike, showBikes, showBike, deleteBike, updateBike, deleteBikes, getAvailableBikes } = require('../../src/modules/bike.js');

// Byt ut db/db.js mot testDB
jest.mock('../../src/db/db.js', () => require('../db/dbDev.js'));

describe('Bike Module Tests', () => {
    beforeAll(async () => {
        await addBike('test123', 100, 10, 20);
        await addBike('test456', 50, 11, 22, 1);
    });

    afterAll(async () => {
        const testDB = require('../db/dbDev.js');
        await testDB.query('DELETE FROM Bike');
        await testDB.end();
    });

    test('should fetch all bikes successfully', async () => {
        const bikes = await showBikes();
        expect(bikes).toEqual([
            { bike_id: 'test123', status: "available", battery_level: 100, longitude: 10, latitude: 20, simulation: 0, speed: 0 },
            { bike_id: 'test456', status: "available", battery_level: 50, longitude: 11, latitude: 22, simulation: 1, speed: 0 },
        ]);
    });

    test('should update a bike and fetch it', async () => {
        await updateBike("test123", {
            battery_level:0,
            status: "charging",
            longitude: 20,
            latitude: 30
        })

        const updated = await showBike("test123")

        expect(updated[0].battery_level).toEqual(0)
        expect(updated[0].status).toEqual("charging")
        expect(updated[0].longitude).toEqual(20)
        expect(updated[0].latitude).toEqual(30)
    })

    test('should delete a bike', async () => {
        await deleteBike("test456")

        await expect(showBike("test456")).rejects.toThrow(
            "Error att hämta cykel: Cykel med ID test456 finns inte"
        );
    })

    test('should delete all simulated bikes or all bikes', async () => {
        await addBike('simulatedBike1', 50, 11, 22, 1);
        await addBike('simulatedBike2', 50, 11, 22, 1);
        await addBike('Bike1', 50, 11, 22);

        await deleteBikes(1)
        const bikes = await showBikes();
        expect(bikes).toEqual([
            { bike_id: 'Bike1', status: "available", battery_level: 50, longitude: 11, latitude: 22, simulation: 0, speed: 0 },
            { bike_id: 'test123', status: "charging", battery_level: 0, longitude: 20, latitude: 30, simulation: 0, speed: 0 },
        ])

        await expect(deleteBikes(0)).resolves.toBeDefined();
        const bikesx = await showBikes();

        await expect(bikesx).toEqual([])
    })

    test('should fetch available bikes', async () => {
        await addBike('simulatedBike1', 50, 11, 22, 1);
        const availableBikes = await getAvailableBikes();
        expect(Array.isArray(availableBikes)).toBe(true);

        expect(availableBikes.length).toBeGreaterThan(0); 
        expect(availableBikes[0]).toHaveProperty('bike_id');
        expect(availableBikes[0]).toHaveProperty('status', 'available');
    });
});
