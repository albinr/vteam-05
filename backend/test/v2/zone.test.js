const { showZones, addZone, searchZone, updateZone, deleteZone, deleteAllZones } = require('../../src/modules/zone.js');
jest.mock('../../src/db/db.js', () => require('../db/dbDev.js'));

describe('Zone Module Tests', () => {
    beforeAll(async () => {
        const testDB = require('../db/dbDev.js');
        await testDB.query('DELETE FROM Trip');
        await testDB.query('DELETE FROM User');
        await testDB.query('DELETE FROM Bike');
    });

    afterEach(async () => {
        const testDB = require('../db/dbDev.js');
        await testDB.query('DELETE FROM Zone');
    });

    afterAll(async () => {
        const testDB = require('../db/dbDev.js');
        await testDB.end();
    });

    test('should add a new zone successfully and fetch it', async () => {
        const zoneData = {
            name: "Central Park",
            city: "Stockholm",
            type: "parking",
            longitude: 18.0686,
            latitude: 59.3293,
            capacity: 1000,
            radius: 75
        };

        const result = await addZone(...Object.values(zoneData));
        const newZone = await showZones();

        expect(result).toHaveProperty('zoneId');
        expect(newZone).toEqual(expect.arrayContaining([
            expect.objectContaining({
                ...zoneData,
                zone_id: result.zoneId,
                radius: 75
            })
        ]));
    });

    test('should search for a zone by name', async () => {
        await addZone("Central Park", "Stockholm", "parking", 18.0686, 59.3293, 1000);
        const zones = await searchZone('name', 'Central Park');

        expect(zones).toHaveLength(1);
        expect(zones[0]).toHaveProperty('name', 'Central Park');
    });

    test('should update zone information', async () => {
        const zone = await addZone("Old Town", "Stockholm", "chargestation", 18.0686, 59.3293, 500);
        const updatedData = {
            name: "Gamla Stan",
            type: "wrongly_parked",
            capacity: 600
        };

        await updateZone(zone.zoneId, updatedData);
        const updatedZone = await showZones();

        expect(updatedZone).toEqual(expect.arrayContaining([
            expect.objectContaining({
                zone_id: zone.zoneId,
                name: "Gamla Stan",
                city: "Stockholm",
                type: "wrongly_parked",
                capacity: 600,
                radius: 25
            })
        ]));
    });

    test('should delete a specific zone', async () => {
        const zone = await addZone("Test Zone", "Test City", "parking", 0, 0, 10);
        await deleteZone(zone.zoneId);
        
        const zones = await showZones();
        expect(zones).toHaveLength(0);
    });

    test('should delete all zones', async () => {
        await addZone("Zone1", "City", "chargestation", 1, 1, 10);
        await addZone("Zone2", "City", "wrongly_parked", 2, 2, 20);

        await deleteAllZones();
        const zones = await showZones();
        expect(zones).toHaveLength(0);
    });
});