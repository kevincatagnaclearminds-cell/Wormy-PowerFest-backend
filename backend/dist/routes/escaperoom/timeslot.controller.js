"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAvailableSlots = void 0;
const timeslot_service_1 = require("./timeslot.service");
const response_1 = require("../../services/escaperoom/utils/response");
const asyncHandler_1 = require("../../middleware/escaperoom/asyncHandler");
const errors_1 = require("../../services/escaperoom/utils/errors");
const timeslotService = new timeslot_service_1.TimeslotService();
exports.getAvailableSlots = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { date } = req.query;
    if (!date || typeof date !== 'string') {
        throw new errors_1.BadRequestError('Fecha requerida');
    }
    const slots = await timeslotService.getAvailableSlots(date);
    return (0, response_1.success)(res, slots);
});
