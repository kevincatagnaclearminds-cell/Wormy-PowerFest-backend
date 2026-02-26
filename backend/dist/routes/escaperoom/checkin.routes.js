"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const checkin_controller_1 = require("./checkin.controller");
const router = (0, express_1.Router)();
// Legacy endpoint (compatibilidad - hace check-in automático)
router.post('/', checkin_controller_1.validateQR);
// Endpoints individuales
router.post('/validate', checkin_controller_1.getReservationByQR); // Solo obtener datos sin check-in
router.post('/confirm', checkin_controller_1.checkin); // Hacer check-in
router.post('/reassign', checkin_controller_1.reassignTimeslot); // Reasignar turno
router.get('/timeslots', checkin_controller_1.getAvailableTimeslots); // Obtener turnos disponibles
// Endpoints grupales (NUEVOS)
router.post('/group/checkin', checkin_controller_1.checkinGroup); // Check-in de ambos usuarios
router.post('/group/reassign', checkin_controller_1.reassignGroupTimeslot); // Reasignar turno de ambos
router.get('/groups/checked-in', checkin_controller_1.getCheckedInGroups); // Obtener grupos para calificar
router.post('/groups/rate', checkin_controller_1.rateGroup); // Calificar grupo
exports.default = router;
