"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsersData = exports.clearTimeslots = exports.generateTimeslots = exports.setTimeslotConfig = exports.getTimeslotConfig = exports.resetToAutomatic = exports.setRegistrationControl = exports.getRegistrationStatus = void 0;
const response_1 = require("../../services/escaperoom/utils/response");
const asyncHandler_1 = require("../../middleware/escaperoom/asyncHandler");
const admin_service_1 = require("./admin.service");
const adminService = new admin_service_1.AdminService();
// ==================== CONTROL DE REGISTRO ====================
/**
 * GET /api/admin/registration-status
 * Obtiene el estado actual del registro (manual override + configuración de turnos)
 */
exports.getRegistrationStatus = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const status = await adminService.getRegistrationStatus();
    return (0, response_1.success)(res, status);
});
/**
 * POST /api/admin/registration-control
 * Controla manualmente la apertura/cierre del registro
 */
exports.setRegistrationControl = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { isOpen, reason, adminEmail } = req.body;
    const control = await adminService.setRegistrationControl(isOpen, reason, adminEmail);
    return (0, response_1.success)(res, control);
});
/**
 * DELETE /api/admin/registration-control
 * Elimina el control manual y vuelve al modo automático
 */
exports.resetToAutomatic = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const result = await adminService.resetToAutomatic();
    return (0, response_1.success)(res, result);
});
// ==================== CONFIGURACIÓN DE TURNOS ====================
/**
 * GET /api/admin/timeslot-config
 * Obtiene la configuración actual de turnos
 */
exports.getTimeslotConfig = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const config = await adminService.getTimeslotConfig();
    return (0, response_1.success)(res, config);
});
/**
 * POST /api/admin/timeslot-config
 * Guarda la configuración de turnos
 */
exports.setTimeslotConfig = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { eventDates, durationMinutes, startHour, endHour, adminEmail } = req.body;
    // Validaciones
    if (!eventDates || eventDates.length !== 3) {
        return (0, response_1.error)(res, 'Debe seleccionar exactamente 3 fechas', 400);
    }
    if (durationMinutes < 1) {
        return (0, response_1.error)(res, 'Duración debe ser mayor a 0', 400);
    }
    if (startHour < 0 || startHour > 23 || endHour < 0 || endHour > 23) {
        return (0, response_1.error)(res, 'Horas deben estar entre 0 y 23', 400);
    }
    if (startHour >= endHour) {
        return (0, response_1.error)(res, 'Hora de inicio debe ser menor a hora de fin', 400);
    }
    // Convertir strings de fechas a objetos Date (mediodía UTC para evitar cambios de día)
    const parsedDates = eventDates.map((dateStr) => new Date(dateStr + 'T12:00:00.000Z'));
    const config = await adminService.setTimeslotConfig({
        eventDates: parsedDates,
        durationMinutes,
        startHour,
        endHour,
        adminEmail,
    });
    return (0, response_1.success)(res, config);
});
// ==================== GESTIÓN DE TURNOS ====================
/**
 * POST /api/admin/generate-timeslots
 * Genera turnos según la configuración guardada
 */
exports.generateTimeslots = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const result = await adminService.generateTimeslots();
    return (0, response_1.success)(res, result);
});
/**
 * DELETE /api/admin/timeslots
 * Elimina todos los turnos (valida que no haya reservas)
 */
exports.clearTimeslots = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const result = await adminService.clearTimeslots();
    return (0, response_1.success)(res, result);
});
// ==================== EXPORTACIÓN DE DATOS ====================
/**
 * GET /api/admin/users-data
 * Obtiene datos de usuarios para exportación
 */
exports.getUsersData = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const data = await adminService.getUsersData();
    return (0, response_1.success)(res, data);
});
