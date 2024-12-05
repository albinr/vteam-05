"use strict";
const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const { schema, root } = require("../../graphql/bikegraph.js");
const bike = require("../../src/bike.js");

const router = express.Router();
const app = express();


app.use(express.json());

// GraphQL route
router.use("/graphql", graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true, // Visual interface for testing
}));

// REST route for /bikes
router.get("/bikes", async (req, res) => {
    const bikes = await bike.showBikes();

    console.log(bikes)
    res.json(bikes);
});


// Route för att visa alla resor
router.get("/trips", async (req, res) => {
    const trips = await bike.showTrip();

    console.log(trips)
    res.json(trips);
});

// Route för visa resor från en viss cykel
router.get("/trips/:bike_id", async (req, res) => {
    const { bike_id } = req.params;

    const trips = await bike.showTripsByBikeId(bike_id);

    console.log(trips);
    res.json(trips);
   
});

// Route för att starta en resa
router.post('/trip/start/:bikeId', async (req, res) => {
    const bikeId = req.params.bikeId;
    const result = await bike.startTrip(bikeId);
    res.json({ message: `Trip started for bike ${bikeId}`, result });
});

// Route för att avsluta en resa
router.post("/trip/end/:bike_id", async (req, res) => {
    const bikeId = req.params.bike_id;
    const [longitude, latitude] = req.body.endPosition.split(',').map(parseFloat);

    const result = await bike.endTrip(bikeId, longitude, latitude);
    res.json({ message: "Trip ended successfully", result });
});


module.exports = router;
