/**
 * @module users
 * @description Hanterar användarrelaterade routes.
 */

"use strict";
const express = require("express");

const router = express.Router();
const user = require("../../src/modules/user.js");

const { deleteTripByUserId } = require("../../src/modules/trip.js");

// lägg till en ny användare
router.post("/", async (req, res) => {
    const { user_id, email, balance = 0, isSimulated = 0 } = req.body;
    try {
        const result = await user.addUser(user_id, email, balance, isSimulated);
        res.json({ message: "Användare skapad", user_id, email, balance });
    } catch (error) {
        res.json({ error: error.message || "Något gick fel vid skapande av användare." });
    }
});

// uppdatera en användare
router.put("/:userId", async (req, res) => {
    const { userId } = req.params;
    const updatedData = req.body;
    try {
        const result = await user.updateUser(userId, updatedData);
        res.json(result);
    } catch (error) {
        res.json({ error: error.message || "Något gick fel vid uppdatering av användaren." });
    }
});

// ge en användare admin rättigheter
router.put("/admin/:userId", async (req, res) => {
    const { userId } = req.params;

    const result = await user.giveAdmin(userId);

    res.json(result.info);
});

// hämta alla trips av en användare
router.get("/:userId/trips", async (req, res) => {
    const { userId } = req.params;
    const userTrips = await user.showTripsByUserId(userId);
    res.json(userTrips);
});

// hämta info från en användare
router.get("/one/:userId", async (req, res) => {
    const { userId } = req.params;
    const userInfo = await user.getUserInfo(userId);
    res.json(userInfo);
});

// Radera alla simulerade eller alla användare
router.delete("/:isSimulated", async (req, res) => {
    const simulatedOnly = req.params.isSimulated === "1";
    try {
        await user.deleteUsers(simulatedOnly);
        res.json({
            message: simulatedOnly ? "Simulerade användare har tagits bort" : "Alla användare har tagits bort"
        });
    } catch (error) {
        console.error("Error vid borttagning av användare:", error.message);
        res.json({
            error: error.message || "Något gick fel vid borttagning av användare."
        });
    }
});

// Radera en användare
router.delete("/one/:userId", async (req, res) => {
    const { userId } = req.params;
    try {
        await deleteTripByUserId(userId);
        const result = await user.deleteUser(userId);
        res.json({ message: `Användare med ID ${userId} har raderats` });
    } catch (error) {
        res.json({ error: error.message || "Något gick fel vid borttagning av användare." });
    }
});

// Hämta alla användare
router.get("/", async (req, res) => {
    const allUsers = await user.getAllUsers();
    res.json(allUsers);
});

module.exports = router;
