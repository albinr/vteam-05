"use strict";
const express = require("express");

const router = express.Router();
const trip = require("../../src/modules/trip.js");

const { authenticateJWT, authorizeAdmin } = require("../../middleware/auth.js");

// Visa alla resor
router.get("/", async (req, res) => {
    const trips = await trip.showAllTrips();
    res.json(trips);
});

// Visa resor av en användare
router.get("/from/:userId", authenticateJWT, async (req, res) => {
    const { userId } = req.params;

    if (req.user.id !== userId && req.user.role !== 'admin') {
        return res.status(403).json({ message: "Access denied: You cannot view trips of other users." });
    }

    const trips = await trip.showTripsByUser(userId);
    res.json(trips);
});

// Visa resor från en viss cykel
router.get("/:bike_id", async (req, res) => {
    const { bike_id } = req.params;
    const trips = await trip.showTripsByBikeId(bike_id);
    res.json(trips);
});

// Starta en resa
router.post("/start/:bikeId/:userId", authenticateJWT, async (req, res) => {
    const { bikeId, userId } = req.params;

    if (req.user.id !== userId) {
        return res.status(403).json({ message: "Du kan bara starta dina egna resor." });
    }

    try {
        const result = await trip.startTrip(bikeId, userId);

        req.io.to(bikeId).emit("command", {
            bike_id: bikeId,
            command: "rent",
        });

        res.json({ message: `Resa startad för cykel med ID ${bikeId} för användare med ID ${userId}`, result });
    } catch (error) {
        res.json({ error: 'Något gick fel när resan skulle startas', details: error.message });
    }
});

// Avsluta en resa
router.post("/end/:bike_id", authenticateJWT, async (req, res) => {
    const { bike_id } = req.params;

    try {
        const [activeBike] = await trip.OngoingTripByUser(req.user.id);

        if (activeBike.bike_id !== bike_id) {
            return res.json({ message: `Du har ingen aktiv resa för cykel med ID ${bike_id}` });
        }

        const result = await trip.endTrip(bike_id);

        req.io.to(bike_id).emit("command", {
            bike_id: bike_id,
            command: "available",
            // user_id: req.user.id
        });
        return res.json({ message: `Resa avslutad för cykel med ID ${bike_id}`, result });
    } catch (error) {
        return res.json({ message: "Ett fel uppstod vid avslutning av resan." });
    }
});

// Route för att radera alla resor (Bara Admin)
router.delete("/:isSimulated", authenticateJWT, authorizeAdmin, async (req, res) => {
    const simulatedOnly = req.params.isSimulated === "1";

    try {
        await trip.deleteTrips(simulatedOnly);
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

// Hämta aktiv resa från användare
router.get("/active/:userId", authenticateJWT, async (req, res) => {
    const { userId } = req.params;

    if (req.user.id !== userId && req.user.role !== 'admin') {
        return res.json({ message: "Du kan bara se dina egna resor om du inte är admin." });
    }

    const trips = await trip.OngoingTripByUser(userId);
    res.json(trips);
});

// Radera utifrån tripId (Admin Only)
router.delete("/one/:tripId", authenticateJWT, authorizeAdmin, async (req, res) => {
    const { tripId } = req.params;

    try {
        const trips = await trip.deleteTripById(tripId);
        res.json({ message: `Resa med ID ${tripId} har raderats`, trips });
    } catch (error) {
        res.json({ error: error.message || "Något gick fel vid borttagning av resa." });
    }
});

module.exports = router;
