"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const registration_controller_1 = require("../controllers/registration.controller");
const router = (0, express_1.Router)();
const controller = new registration_controller_1.RegistrationController();
router.get('/', (req, res) => controller.getStats(req, res));
exports.default = router;
