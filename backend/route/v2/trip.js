"use strict";
const express = require("express");
const router = express.Router();
const trip = require("../../src/modules/trip.js");

// Visa alla resor
router.get("/", async (req, res) => {
    const trips = await trip.showAllTrips();
    res.json(trips);
});

// Visa resor av en användare
router.get("/from/:userId", async (req, res) => {
    const { userId } = req.params;

    const trips = await trip.showTripsByUser(userId)

    res.json(trips)
})

// Visa resor från en viss cykel
router.get("/:bike_id", async (req, res) => {
    const { bike_id } = req.params;
    const trips = await trip.showTripsByBikeId(bike_id);
    res.json(trips);
});

// Starta en resa
router.post("/start/:bikeId/:userId", async (req, res) => {
    const { bikeId, userId } = req.params;
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
router.post("/end/:bike_id", async (req, res) => {
    const { bike_id } = req.params;
    const result = await trip.endTrip(bike_id);

    req.io.to(bike_id).emit("command", {
        bike_id: bike_id,
        command: "available",
    });

    res.json({ message: `Resa avslutad för cykel med ID ${bike_id}`, result });
});

// Route för att radera alla resor
router.delete("/:isSimulated", async (req, res) => {
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
router.get("/active/:userId", async (req, res) => {
    const { userId } = req.params;

    const trips = await trip.OngoingTripByUser(userId)

    res.json(trips)
})

// Radera utifrån tripId
router.delete("/one/:tripId", async (req, res) => {
    const { tripId } = req.params;

    const trips = await trip.deleteTripById(tripId)

    res.json(trips)
})


module.exports = router;
