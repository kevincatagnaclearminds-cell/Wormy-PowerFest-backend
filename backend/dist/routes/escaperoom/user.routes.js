"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("./user.controller");
const registrationTimeValidator_1 = require("../../middleware/escaperoom/registrationTimeValidator");
const router = (0, express_1.Router)();
// BLOQUEADO: Solo se permite registro de 2 personas
// router.post('/register', validateRegistrationTime, validate(createUserSchema), registerUser);
router.post('/register-multiple', registrationTimeValidator_1.validateRegistrationTime, user_controller_1.registerMultipleUsers);
router.get('/search', registrationTimeValidator_1.validateRegistrationTime, user_controller_1.searchUserByEmail);
exports.default = router;
