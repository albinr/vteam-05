"use strict";
const express = require("express");

const bike = require("../../src/first.js");

const router = express.Router();
const app = express();

app.use(express.json());

// Route för att lägga till en ny cykel
router.post("/add_bike", async (req, res) => {
    const { batteryLevel, longitude, latitude, isSimulated = 0, bikeId } = req.body;

    try {
        const newBike = await bike.addBike(bikeId, batteryLevel, longitude, latitude, isSimulated);
        res.json({ message: "Cykel tillagd med ID", bikeId: newBike });
    } catch (error) {
        console.error("Error att lägga till cykel:", error.message);
        res.json({ error: error.message || "Något gick fel vid tillägg av cykel." });
    }
});

router.delete("/delete_bike/:bikeId", async (req, res) => {
    const { bikeId } = req.params;

    try {
        const result = await bike.deleteBike(bikeId);
        res.json({
            message: `Cykel med ID ${bikeId} har raderats`
        });
    } catch (error) {
        console.error("Error att ta bort cykel:", error.message);
        res.json({ error: error.message || "Något gick fel vid borttagning av cykel." });
    }
});

// route för att se alla cyklar
router.get("/bikes", async (req, res) => {
    const bikes = await bike.showBikes();
    console.log(bikes);
    res.json(bikes);
});

// Route för att visa alla resor
router.get("/trips", async (req, res) => {
    const trips = await bike.showTrip();
    console.log(trips);
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
    const bikeId = req.params.bikeId;
    const userId = req.params.userId;

    try {
        const result = await bike.startTrip(bikeId, userId);
        res.json({ message: `Resa startad för cykel med ID ${bikeId} för användare med ID ${userId}`, result });
        req.io.to(bikeId).emit("command", {
            bike_id: bikeId,
            command: "rent",
        });
    } catch (error) {
        res.json({ error: 'Något gick fel när resan skulle startas', details: error.message });
    }
});

// Route för att avsluta en resa
router.post("/trip/end/:bike_id", async (req, res) => {
    const bikeId = req.params.bike_id;

    const result = await bike.endTrip(bikeId);

    req.io.to(bikeId).emit("command", {
        bike_id: bikeId,
        command: "available",
    });

    res.json({ message: "Resa avslutad", result });
});

// Route för att radera alla cyklar eller enbart simulerade cyklar
router.delete("/bikes/:isSimulated", async (req, res) => {
    const simulatedOnly = req.params.isSimulated === "1";

    try {
        await bike.deleteBikes(simulatedOnly);
        res.json({
            message: simulatedOnly ? "Simulerade cyklar har tagits bort" : "Alla cyklar har tagits bort"
        });
    } catch (error) {
        console.error("Error vid borttagning av cyklar:", error.message);
        res.json({
            error: error.message || "Något gick fel vid borttagning av cyklar."
        });
    }
});

// Route för att radera alla resor
router.delete("/trips/:isSimulated", async (req, res) => {
    const simulatedOnly = req.params.isSimulated === "1";

    try {
        await bike.deleteTrips(simulatedOnly);
        res.json({
            message: simulatedOnly ? "Simulerade resor har tagits bort" : "Alla resor har tagits bort"
        });
    } catch (error) {
        console.error("Error vid borttagning av resor:", error.message);
        res.json({
            error: error.message || "Något gick fel vid borttagning av resor."
        });
    }
});

// Route för att lägga till en ny användare
router.post("/add_user", async (req, res) => {
    const { email, balance = 0 } = req.body;

    const result = await bike.addUser(email, balance);

    res.json({ message: "Användare skapad", userId: result.insertId });
});

router.put("/update_user/:userId", async (req, res) => {
    const { userId } = req.params;
    const updatedData = req.body;

    try {
        const result = await bike.updateUser(userId, updatedData);
        res.json(result);
    } catch (error) {
        console.error("Error vid uppdatering av användare:", error.message);
        res.json({ error: error.message || "Något gick fel vid uppdatering av användaren." });
    }
});

router.put("/bikes/:bikeId", async (req, res) => {
    const { bikeId } = req.params;
    const updatedData = req.body;

    try {
        const result = await bike.updateBike(bikeId, updatedData);
        res.json(result);
    } catch (error) {
        console.error("Error vid uppdatering av cykel:", error.message);
        res.json({ error: error.message || "Något gick fel vid uppdatering av cykeln." });
    }
});

// Route för visa resor från en viss cykel
router.get("/user/trips/:user_id", async (req, res) => {
    const { user_id } = req.params;

    const user = await bike.showTripsByUserId(user_id);

    console.log(user);
    res.json(user);
});

// Route för visa resor från en viss cykel
router.get("/user/:user_id", async (req, res) => {
    const { user_id } = req.params;

    const user = await bike.getUserInfo(user_id);

    console.log(user);
    res.json(user);
});

module.exports = router;
