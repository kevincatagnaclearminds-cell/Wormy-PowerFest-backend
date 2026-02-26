"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resendQR = exports.createMultipleReservations = exports.createReservation = void 0;
const reservation_service_1 = require("./reservation.service");
const response_1 = require("../../services/escaperoom/utils/response");
const asyncHandler_1 = require("../../middleware/escaperoom/asyncHandler");
const reservationService = new reservation_service_1.ReservationService();
exports.createReservation = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const reservation = await reservationService.createReservation(req.body);
    return (0, response_1.success)(res, reservation, 201);
});
exports.createMultipleReservations = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const reservations = await reservationService.createMultipleReservations(req.body);
    return (0, response_1.success)(res, reservations, 201);
});
exports.resendQR = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const result = await reservationService.resendQR(req.body);
    return (0, response_1.success)(res, result);
});
