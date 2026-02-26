"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const verification_controller_1 = require("../controllers/verification.controller");
const router = (0, express_1.Router)();
const controller = new verification_controller_1.VerificationController();
router.post('/', (req, res) => controller.verify(req, res));
exports.default = router;
