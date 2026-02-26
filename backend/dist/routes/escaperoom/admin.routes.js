"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const admin_controller_1 = require("./admin.controller");
const router = (0, express_1.Router)();
// Control de registro
router.get('/registration-status', admin_controller_1.getRegistrationStatus);
router.post('/registration-control', admin_controller_1.setRegistrationControl);
router.delete('/registration-control', admin_controller_1.resetToAutomatic);
// Configuración de turnos
router.get('/timeslot-config', admin_controller_1.getTimeslotConfig);
router.post('/timeslot-config', admin_controller_1.setTimeslotConfig);
// Gestión de turnos
router.post('/generate-timeslots', admin_controller_1.generateTimeslots);
router.delete('/timeslots', admin_controller_1.clearTimeslots);
// Exportación de datos
router.get('/users-data', admin_controller_1.getUsersData);
exports.default = router;
