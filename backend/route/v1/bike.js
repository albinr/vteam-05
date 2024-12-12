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
    graphiql: true,
}));

// Route för att lägga till en ny cykel
router.post("/add_bike", async (req, res) => {
    const { batteryLevel, longitude, latitude, isSimulated = 0 } = req.body;

    const newBikeId = await bike.addBike(batteryLevel, longitude, latitude, isSimulated);

    res.status(201).json({ message: "Cykel tillagd med ID", bikeId: newBikeId });
});

router.delete("/delete_bike/:bikeId", async (req, res) => {
    const { bikeId } = req.params;

    const result = await bike.deleteBike(bikeId);

    if (result.affectedRows === 0) {
        res.status(404).json({ 
            message: `Ingen cykel med ID ${bikeId}` 
        });
    } else {
        res.status(200).json({
            message: `Cykel med ID ${bikeId} har raderats`
        });
    }
});

// route för att se alla cyklar
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
router.post('/trip/start/:bikeId/:userId', async (req, res) => {
    const bikeId = req.params.bikeId;  // Hämtar bikeId från URL
    const userId = req.params.userId;  // Hämtar userId från URL

    try {
        // Startar resan genom att skicka både bikeId och userId till startTrip
        const result = await bike.startTrip(bikeId, userId);
        
        // Skicka tillbaka ett svar om att resan startades
        res.json({ message: `Resa startad för cykel med ID ${bikeId} för användare med ID ${userId}`, result });
    } catch (error) {
        // Hantera eventuella fel
        res.status(500).json({ error: 'Något gick fel när resan skulle startas', details: error.message });
    }
});

// Route för att avsluta en resa
router.post("/trip/end/:bike_id", async (req, res) => {
    const bikeId = req.params.bike_id;

    const result = await bike.endTrip(bikeId);
    res.json({ message: "Resa avslutad", result });
});

// Route för att radera alla cyklar eller enbart simulerade cyklar
router.delete("/bikes/:isSimulated", async (req, res) => {
    const simulatedOnly = req.params.isSimulated === "1";

    await bike.deleteBikes(simulatedOnly);
    res.json({ message: simulatedOnly ? "Simulerade cyklar har tagits bort" : "Alla cyklar har tagits bort" });
});


// Route för att radera alla resor
router.delete("/trips", async (req, res) => {

    await bike.deleteTrips();
    res.json({ message: 'Alla resor har raderats.' });

});

// Route för att lägga till en ny användare
router.post("/add_user", async (req, res) => {
    const { username, email, balance = 0 } = req.body;

    const result = await bike.addUser(username, email, balance);

    res.status(201).json({ message: "Användare skapad", userId: result.insertId });

});


module.exports = router;
