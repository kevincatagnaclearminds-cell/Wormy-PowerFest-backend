"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerificationController = void 0;
const registration_service_1 = require("../services/registration.service");
const registrationService = new registration_service_1.RegistrationService();
class VerificationController {
    async verify(req, res) {
        try {
            const { ticketId } = req.body;
            if (!ticketId) {
                return res.status(400).json({
                    success: false,
                    error: 'Ticket ID es requerido'
                });
            }
            const registration = await registrationService.getRegistrationById(ticketId);
            if (!registration) {
                return res.status(404).json({
                    success: false,
                    status: 'not_found',
                    message: 'Ticket no encontrado'
                });
            }
            if (registration.status === 'CHECKED_IN') {
                return res.json({
                    success: true,
                    status: 'already_used',
                    message: 'Este ticket ya fue usado',
                    data: {
                        id: registration.id,
                        firstName: registration.firstName,
                        lastName: registration.lastName,
                        checkInTime: registration.checkInTime,
                        status: registration.status
                    }
                });
            }
            const updatedRegistration = await registrationService.checkIn(ticketId);
            res.json({
                success: true,
                status: 'success',
                message: 'Check-in exitoso',
                data: {
                    id: updatedRegistration.id,
                    firstName: updatedRegistration.firstName,
                    lastName: updatedRegistration.lastName,
                    phone: updatedRegistration.phone,
                    email: updatedRegistration.email,
                    sports: updatedRegistration.sports,
                    status: updatedRegistration.status,
                    checkInTime: updatedRegistration.checkInTime,
                    registrationDate: updatedRegistration.registrationDate
                }
            });
        }
        catch (error) {
            console.error('Error verifying ticket:', error);
            res.status(500).json({
                success: false,
                error: 'Error al verificar ticket'
            });
        }
    }
}
exports.VerificationController = VerificationController;
