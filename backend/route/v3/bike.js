"use strict";
const express = require("express");
const router = express.Router();
const bike = require("../../src/modules/bike.js");
const { authenticateJWT, authorizeAdmin } = require("../../middleware/auth.js");

// Lägg till en ny cykel (Bara Admin)
router.post("/add", authenticateJWT, authorizeAdmin, async (req, res) => {
    const { batteryLevel, longitude, latitude, isSimulated = 0, bikeId } = req.body;
    try {
        const newBike = await bike.addBike(bikeId, batteryLevel, longitude, latitude, isSimulated);
        res.json({ message: "Cykel tillagd med ID", bikeId: newBike });
    } catch (error) {
        res.json({ error: error.message || "Något gick fel vid tillägg av cykel." });
    }
});

// Radera en cykel (Only Admin)
router.delete("/one/:bikeId", authenticateJWT, authorizeAdmin, async (req, res) => {
    const { bikeId } = req.params;
    try {
        const result = await bike.deleteBike(bikeId);
        res.json({ message: `Cykel med ID ${bikeId} har raderats` });
    } catch (error) {
        res.json({ error: error.message || "Något gick fel vid borttagning av cykel." });
    }
});

// Radera alla cyklar eller bara simulerade cyklar (Bara Admin)
router.delete("/all/:isSimulated", authenticateJWT, authorizeAdmin, async (req, res) => {
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

// Hämta alla cyklar
router.get("/available", async (req, res) => {
    const bikes = await bike.getAvailableBikes();
    res.json(bikes);
});

// Hämta alla cyklar i en stad
router.get("/city/:city", async (req, res) => {
    const { city } = req.params;
    const bikes = await bike.getCityBikes(city);
    res.json(bikes);
});

// Hämta en cykel
router.get("/:bikeId", async (req, res) => {
    const { bikeId } = req.params;
    try {
        const bikes = await bike.showBike(bikeId);
        res.json(bikes);
    } catch (error) {
        res.json({ message: `Cykel med ID ${bikeId} finns inte` });
    }
});

// Uppdatera cykel (Bara Admin)
router.put("/:bikeId", authenticateJWT, authorizeAdmin, async (req, res) => {
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
