"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const timeslot_controller_1 = require("./timeslot.controller");
const router = (0, express_1.Router)();
router.get('/', timeslot_controller_1.getAvailableSlots);
exports.default = router;
