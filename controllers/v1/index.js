"use strict";

const express = require("express");
const Controller = require('./controller');
const router = new express.Router();

router.post("/bet", Controller.bet);

module.exports = router;