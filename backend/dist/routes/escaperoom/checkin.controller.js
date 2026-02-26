"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rateGroup = exports.getCheckedInGroups = exports.reassignGroupTimeslot = exports.checkinGroup = exports.validateQR = exports.getAvailableTimeslots = exports.reassignTimeslot = exports.checkin = exports.getReservationByQR = void 0;
const checkin_service_1 = require("./checkin.service");
const response_1 = require("../../services/escaperoom/utils/response");
const asyncHandler_1 = require("../../middleware/escaperoom/asyncHandler");
const checkinService = new checkin_service_1.CheckinService();
// Obtener datos de reserva por QR (sin hacer check-in)
exports.getReservationByQR = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { qrCode } = req.body;
    const reservation = await checkinService.getReservationByQR(qrCode);
    return (0, response_1.success)(res, reservation);
});
// Hacer check-in (marcar como USED)
exports.checkin = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { qrCode } = req.body;
    const reservation = await checkinService.checkin(qrCode);
    return (0, response_1.success)(res, reservation);
});
// Reasignar turno
exports.reassignTimeslot = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { qrCode, newTimeslotId } = req.body;
    const reservation = await checkinService.reassignTimeslot(qrCode, newTimeslotId);
    return (0, response_1.success)(res, reservation);
});
// Obtener turnos disponibles del día
exports.getAvailableTimeslots = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const timeslots = await checkinService.getAvailableTimeslots();
    return (0, response_1.success)(res, timeslots);
});
// Legacy endpoint (compatibilidad)
exports.validateQR = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { qrCode } = req.body;
    const reservation = await checkinService.validateQR(qrCode);
    return (0, response_1.success)(res, reservation);
});
// Check-in grupal (ambas personas)
exports.checkinGroup = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { qrCode1, qrCode2 } = req.body;
    const result = await checkinService.checkinGroup(qrCode1, qrCode2);
    return (0, response_1.success)(res, result);
});
// Reasignar turno grupal (ambas personas)
exports.reassignGroupTimeslot = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { qrCode1, qrCode2, newTimeslotId } = req.body;
    const result = await checkinService.reassignGroupTimeslot(qrCode1, qrCode2, newTimeslotId);
    return (0, response_1.success)(res, result);
});
// Obtener grupos con check-in (para calificar)
exports.getCheckedInGroups = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const groups = await checkinService.getCheckedInGroups();
    return (0, response_1.success)(res, groups);
});
// Calificar grupo
exports.rateGroup = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { reservationId1, reservationId2, rating } = req.body;
    const result = await checkinService.rateGroup(reservationId1, reservationId2, rating);
    return (0, response_1.success)(res, result);
});
