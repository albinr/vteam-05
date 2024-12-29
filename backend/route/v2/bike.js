"use strict";
const express = require("express");
const router = express.Router();
const bike = require("../../src/modules/bike.js");

// Lägg till en ny cykel
router.post("/add", async (req, res) => {
    const { batteryLevel, longitude, latitude, isSimulated = 0, bikeId } = req.body;
    try {
        const newBike = await bike.addBike(bikeId, batteryLevel, longitude, latitude, isSimulated);
        res.json({ message: "Cykel tillagd med ID", bikeId: newBike });
    } catch (error) {
        res.json({ error: error.message || "Något gick fel vid tillägg av cykel." });
    }
});

// Radera en cykel
router.delete("/one/:bikeId", async (req, res) => {
    const { bikeId } = req.params;
    try {
        const result = await bike.deleteBike(bikeId);
        res.json({ message: `Cykel med ID ${bikeId} har raderats` });
    } catch (error) {
        res.json({ error: error.message || "Något gick fel vid borttagning av cykel." });
    }
});

// Radera alla cyklar eller bara simulerade cyklar
router.delete("/all/:isSimulated", async (req, res) => {
    const simulatedOnly = req.params.isSimulated === "1";
    try {
        await bike.deleteBikes(simulatedOnly);
        res.json({
            message: simulatedOnly ? "Simulerade cyklar har tagits bort" : "Alla cyklar har tagits bort"
        });
    } catch (error) {
        res.json({ error: error.message || "Något gick fel vid borttagning av cyklar." });
    }
});

// Hämta alla cyklar
router.get("/", async (req, res) => {
    const bikes = await bike.showBikes();
    res.json(bikes);
});

// Hämta en Cykel
router.get("/:bikeId", async (req, res) => {
    const { bikeId } = req.params;
    try {
        const bikes = await bike.showBike(bikeId);

        res.json(bikes);
    } catch (error) {
        res.json({ message: `Cykel med ID ${bikeId} finns inte` });
    }
});

// Uppdatera cykel
router.put("/:bikeId", async (req, res) => {
    const { bikeId } = req.params;
    const updatedData = req.body;
    try {
        const result = await bike.updateBike(bikeId, updatedData);
        res.json(result);
    } catch (error) {
        res.json({ error: error.message || "Något gick fel vid uppdatering av cykeln." });
    }
});

module.exports = router;
