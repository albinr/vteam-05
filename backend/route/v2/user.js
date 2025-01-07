/**
 * @module users
 * @description Hanterar användarrelaterade routes.
 */

"use strict";
const express = require("express");
const router = express.Router();
const user = require("../../src/modules/user.js");

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

// hämta alla trips av en användare
router.get("/:userId/trips", async (req, res) => {
    const { userId } = req.params;
    const userTrips = await user.showTripsByUserId(userId);
    res.json(userTrips);
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

router.delete("/", async (req, res) => {
    const delUsers = await user.deleteUsers();
    res.json(delUsers);
});

module.exports = router;
