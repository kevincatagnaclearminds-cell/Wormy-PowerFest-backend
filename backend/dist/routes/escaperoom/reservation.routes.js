"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const reservation_controller_1 = require("./reservation.controller");
const router = (0, express_1.Router)();
router.post('/', reservation_controller_1.createReservation);
router.post('/multiple', reservation_controller_1.createMultipleReservations);
router.post('/resend', reservation_controller_1.resendQR);
exports.default = router;
