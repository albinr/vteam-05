"use strict";

const mysql = require("promise-mysql");
const config = require("./vteam.json");
let db;

async function connect() {
    db = await mysql.createConnection(config);

    process.on("exit", () => {
        db.end();
    });
}

async function Bikes() {
    const sql = "SELECT * FROM Bike WHERE bike_id = '1'";
    return await db.query(sql);
};

async function Bikestart() {
    const sql = "CALL StartTrip(1, 1)";
    return await db.query(sql);
};

async function BikeMoving() {
    const max = 20;
    let count = 0;
    let coordinates1 = { lat: 16.161311, lng: 55.586931 };
    let coordinates2 = { lat: 16.161311, lng: 55.586931 };

    return new Promise(async (resolve) => {
        async function BikeMove() {
            if (count >= max) {
                console.log("Trip is over");
                resolve();
                return;
            }

            count++;
            coordinates1 = {
                lat: Math.round((coordinates1.lat + 0.1) * 1000000) / 1000000,
                lng: Math.round((coordinates1.lng + 0.1) * 1000000) / 1000000
            };
            coordinates2 = {
                lat: Math.round((coordinates2.lat - 0.1) * 1000000) / 1000000,
                lng: Math.round((coordinates2.lng - 0.1) * 1000000) / 1000000
            };

            const sql1 = `CALL LogBikeMovement(1, POINT(${coordinates1.lat}, ${coordinates1.lng}))`;
            const sql2 = `CALL LogBikeMovement(2, POINT(${coordinates2.lat}, ${coordinates2.lng}))`;

            await Promise.all([db.query(sql1), db.query(sql2)]);
            console.log(`bike 1 moved to ${coordinates1.lat}, ${coordinates1.lng}`);
            console.log(`bike 2 moved to ${coordinates2.lat}, ${coordinates2.lng}`);

            setTimeout(BikeMove, 10000);
        }

        await BikeMove();
    });
}

async function BikeEnd() {
    const sql = "CALL EndTrip(1)";
    return await db.query(sql);
};

(async function main() {
    await connect();
    await Bikestart();
    await BikeMoving();
    await BikeEnd();

    const bikes = await Bikes();
})();