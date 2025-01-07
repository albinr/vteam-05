"use strict";
const express = require("express");
const router = express.Router();
const zone = require("../../src/modules/zone.js");

// Lägg till en ny zon
router.post("/add", async (req, res) => {
    const { name, city, type, longitude, latitude, capacity, radius } = req.body;
    try {
        const newZone = await zone.addZone(name, city, type, longitude, latitude, capacity, radius);
        res.json({ message: "Zon tillagd med ID", zoneId: newZone.zoneId });
    } catch (error) {
        res.json({ error: error.message || "Något gick fel vid tillägg av zon." });
    }
});

// Radera en zon
router.delete("/one/:zoneId", async (req, res) => {
    const { zoneId } = req.params;
    try {
        const result = await zone.deleteZone(zoneId);
        res.json({ message: `Zon med ID ${zoneId} har raderats` });
    } catch (error) {
        res.json({ error: error.message || "Något gick fel vid borttagning av zon." });
    }
});

// Radera alla zoner
router.delete("/all", async (req, res) => {
    try {
        await zone.deleteAllZones();
        res.json({ message: "Alla zoner har raderats" });
    } catch (error) {
        res.json({ error: error.message || "Något gick fel vid borttagning av zoner." });
    }
});

// Hämta alla zoner
router.get("/", async (req, res) => {
    try {
        const zones = await zone.showZones();
        res.json(zones);
    } catch (error) {
        res.json({ error: error.message || "Något gick fel vid hämtning av zoner." });
    }
});

// Sök en zon
router.get("/search", async (req, res) => {
    const { type, search } = req.body;
    try {
        const zones = await zone.searchZone(type, search);
        res.json(zones);
    } catch (error) {
        res.json({ error: error.message || "Något gick fel vid sökning av zon." });
    }
});

// Uppdatera zon
router.put("/:zoneId", async (req, res) => {
    const { zoneId } = req.params;
    const updatedData = req.body;
    try {
        const result = await zone.updateZone(zoneId, updatedData);
        res.json(result);
    } catch (error) {
        res.json({ error: error.message || "Något gick fel vid uppdatering av zon." });
    }
});

module.exports = router;
