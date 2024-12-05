const { buildSchema } = require("graphql");
const bike = require("../src/bike.js");

const schema = buildSchema(`
    type Bike {
        bike_id: ID!
        status: String
        battery_level: Int
        latitude: Float
        longitude: Float
    }

    type Trip {
        trip_id: ID!
        bike_id: ID
        start_time: String
        end_time: String
        start_coords: String
        end_coords: String
        price: String
        speed: Float
    }

    type Query {
        getAllBikes: [Bike]
        getAllTrips: [Trip]
        getBikeById(bike_id: ID!): Bike
        getTripsByBikeId(bike_id: ID!): [Trip]
    }
`);

const root = {
    getAllBikes: async () => await bike.showBikes(),
    getAllTrips: async () => await bike.showTrip(),
    
    getBikeById: async ({ bike_id }) => {
        const sql = `SELECT 
                       bike_id, status, battery_level, 
                       ST_X(position) AS latitude, ST_Y(position) AS longitude
                    FROM Bike WHERE bike_id = ?`;
        const bikes = await bike.pool.query(sql, [bike_id]);
        return bikes[0]; // Returnerar den första cykeln om den finns
    },
    
    getTripsByBikeId: async ({ bike_id }) => {
        const sql = `SELECT 
                       trip_id, bike_id, start_time, end_time, 
                       CONCAT(ST_X(start_position), ' ', ST_Y(start_position)) AS start_coords,
                       CONCAT(ST_X(end_position), ' ', ST_Y(end_position)) AS end_coords, 
                       CONCAT(price, 'kr') AS price, speed 
                    FROM Trip WHERE bike_id = ?`;
        const trips = await bike.pool.query(sql, [bike_id]);
        return trips; // Returnera alla resor för cykeln
    },
};

module.exports = { schema, root };
