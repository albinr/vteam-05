"use strict";
const express = require("express");

const router = express.Router();
const zone = require("../../src/modules/zone.js");

const { authenticateJWT, authorizeAdmin } = require("../../middleware/auth.js");

// Lägg till en ny zon (Admin Only)
router.post("/add", authenticateJWT, authorizeAdmin, async (req, res) => {
    const { name, city, type, longitude, latitude, capacity, radius } = req.body;
    try {
        const newZone = await zone.addZone(name, city, type, longitude, latitude, capacity, radius);
        res.json({ message: "Zon tillagd med ID", zoneId: newZone.zoneId });
    } catch (error) {
        res.json({ error: error.message || "Något gick fel vid tillägg av zon." });
    }
});

// Radera en zon (Admin Only)
router.delete("/one/:zoneId", authenticateJWT, authorizeAdmin, async (req, res) => {
    const { zoneId } = req.params;
    try {
        const result = await zone.deleteZone(zoneId);
        res.json({ message: `Zon med ID ${zoneId} har raderats` });
    } catch (error) {
        res.json({ error: error.message || "Något gick fel vid borttagning av zon." });
    }
});

// Radera alla zoner (Admin Only)
router.delete("/all", authenticateJWT, authorizeAdmin, async (req, res) => {
    try {
        await zone.deleteAllZones();
        res.json({ message: "Alla zoner har raderats" });
    } catch (error) {
        res.json({ error: error.message || "Något gick fel vid borttagning av zoner." });
    }
});

// Hämta alla zoner (Public)
router.get("/", async (req, res) => {
    try {
        const zones = await zone.showZones();
        res.json(zones);
    } catch (error) {
        res.json({ error: error.message || "Något gick fel vid hämtning av zoner." });
    }
});

// Sök en zon (Public)
router.get("/search", async (req, res) => {
    const { type, search } = req.query; // Use query parameters for search
    try {
        const zones = await zone.searchZone(type, search);
        res.json(zones);
    } catch (error) {
        res.json({ error: error.message || "Något gick fel vid sökning av zon." });
    }
});

// Uppdatera zon (Admin Only)
router.put("/:zoneId", authenticateJWT, authorizeAdmin, async (req, res) => {
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
