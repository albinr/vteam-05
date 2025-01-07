"use strict";

const express = require("express");
const router = express.Router();

const bikeRouter = require("./bike.js");
const tripRouter = require("./trip.js");
const userRouter = require("./user.js");

router.use("/bikes", bikeRouter);
router.use("/trips", tripRouter);
router.use("/users", userRouter);

module.exports = router;
