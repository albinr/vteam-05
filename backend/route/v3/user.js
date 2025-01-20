"use strict";
const express = require("express");
const router = express.Router();
const user = require("../../src/modules/user.js");
const { authenticateJWT, authorizeAdmin, authUserOrAdmin } = require("../../middleware/auth.js");

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

// uppdatera en användare (Self or Admin)
router.put("/:userId", authenticateJWT, authUserOrAdmin,  async (req, res) => {
    const { userId } = req.params;
    const updatedData = req.body;
    try {
        const result = await user.updateUser(userId, updatedData);
        res.json(result);
    } catch (error) {
        res.json({ error: error.message || "Något gick fel vid uppdatering av användaren." });
    }
});

// ge en användare admin rättigheter (Admin Only)
router.put("/admin/:userId", authenticateJWT, authorizeAdmin, async (req, res) => {
    const { userId } = req.params;

    try {
        const result = await user.giveAdmin(userId);
        res.json(result.info);
    } catch (error) {
        res.json({ error: error.message || "Något gick fel vid uppdatering av admin." });
    }
});

// hämta alla trips av en användare (Authenticated - User or Admin)
router.get("/:userId/trips", authenticateJWT, authUserOrAdmin, async (req, res) => {
    const { userId } = req.params;
    const userTrips = await user.showTripsByUserId(userId);
    res.json(userTrips);
});

// Radera alla simulerade eller alla användare (Admin Only)
router.delete("/:isSimulated", authenticateJWT, authorizeAdmin, async (req, res) => {
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

// Radera en användare (Self or Admin)
router.delete("/one/:userId", authenticateJWT, authUserOrAdmin, async (req, res) => {
    const { userId } = req.params;
    try {
        const result = await user.deleteUser(userId);
        res.json({ message: `Användare med ID ${userId} har raderats` });
    } catch (error) {
        res.json({ error: error.message || "Något gick fel vid borttagning av användare." });
    }
});

// Hämta alla användare (Admin Only)
router.get("/", authenticateJWT, authorizeAdmin, async (req, res) => {
    const allUsers = await user.getAllUsers();
    res.json(allUsers);
});

// hämta info från en användare
router.get("/one/:userId", authenticateJWT, authUserOrAdmin, async (req, res) => {
    const { userId } = req.params
    const userInfo = await user.getUserInfo(userId);
    res.json(userInfo);
});


// Radera en användare (Self or Admin)
router.post("/add_money/:userId", authenticateJWT, authUserOrAdmin, async (req, res) => {
    const { userId } = req.params;
    const { amount } = req.body;
    try {
        const result = await user.addMoney(userId, amount);
        res.json({ message: `Användare med ID ${userId} har lagt till ${amount}` });
    } catch (error) {
        res.json({ error: error.message || "Något gick fel vid överföring av pengar." });
    }
});

module.exports = router;
