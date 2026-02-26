"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const trivia_controller_1 = require("./trivia.controller");
const registrationTimeValidator_1 = require("../../middleware/escaperoom/registrationTimeValidator");
const router = (0, express_1.Router)();
router.get('/questions', registrationTimeValidator_1.validateRegistrationTime, trivia_controller_1.getQuestions);
router.post('/validate', registrationTimeValidator_1.validateRegistrationTime, trivia_controller_1.validateAnswers);
exports.default = router;
