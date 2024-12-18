/**
 * @module users
 * @description Hanterar användarrelaterade routes.
 */

"use strict";
const express = require("express");
const router = express.Router();
const user = require("../../src/modules/user.js");

/**
 * Skapa en ny användare.
 * @function
 * @memberof users
 * @route POST /users
 * @name users POST /users
 * @param {object} req.body - Användarens data
 * @param {string} req.body.email - Användarens emailadress
 * @param {number} [req.body.balance=0] - Startbalans för användaren (valfritt, default 0)
 * @returns {object} - Ett objekt med meddelande och userId
 * @returns {string} returns.message - Ett meddelande
 * @returns {number} returns.userId - ID för den nyskapade användaren
 * @returns {object} - Ett felobjekt vid fel
 * @returns {string} returns.error - Felmeddelandet
 */
router.post("/", async (req, res) => {
    const { email, balance = 0 } = req.body;
    try {
        const result = await user.addUser(email, balance);
        res.json({ message: "Användare skapad", userId: result.insertId });
    } catch (error) {
        res.json({ error: error.message || "Något gick fel vid skapande av användare." });
    }
});

/**
 * Uppdatera en användare.
 * @route PUT /users/{userId}
 * @param {string} req.params.userId - Användarens ID
 * @param {object} req.body - Data som ska uppdateras
 * @returns {object} - Resultatet av uppdateringen
 * @returns {object} - Ett felobjekt vid fel
 * @returns {string} returns.error - Felmeddelandet
 */
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


router.get("/:userId/trips", async (req, res) => {
    const { userId } = req.params;
    const userTrips = await user.showTripsByUserId(userId);
    res.json(userTrips);
});


router.delete("/:isSimulated", async (req, res) => {
    const simulatedOnly = req.params.isSimulated === "1";
    try {
        await trip.deleteTrips(simulatedOnly);
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

module.exports = router;
