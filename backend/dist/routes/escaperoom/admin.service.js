"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
const prisma_1 = require("../../services/escaperoom/prisma");
const timeslot_service_1 = require("../../services/escaperoom/services/timeslot.service");
class AdminService {
    // ==================== CONTROL DE REGISTRO ====================
    async getRegistrationStatus() {
        const control = await prisma_1.prismaEscapeRoom.registrationControl.findFirst({
            orderBy: { updatedAt: 'desc' },
        });
        const config = await prisma_1.prismaEscapeRoom.timeslotConfig.findFirst({
            orderBy: { updatedAt: 'desc' },
        });
        return {
            manualOverride: control?.isOpen ?? null,
            reason: control?.reason,
            updatedAt: control?.updatedAt,
            updatedBy: control?.updatedBy,
            // Configuración de turnos
            eventDates: config?.eventDates ?? [],
            durationMinutes: config?.durationMinutes ?? 15,
            startHour: config?.startHour ?? 8,
            endHour: config?.endHour ?? 20,
            slotsPerDay: config?.slotsPerDay ?? 48,
        };
    }
    async setRegistrationControl(isOpen, reason, adminEmail) {
        const control = await prisma_1.prismaEscapeRoom.registrationControl.create({
            data: {
                isOpen,
                reason,
                updatedBy: adminEmail,
            },
        });
        return control;
    }
    async resetToAutomatic() {
        // Eliminar todos los registros de control manual
        await prisma_1.prismaEscapeRoom.registrationControl.deleteMany({});
        return {
            message: 'Control manual eliminado. Sistema en modo automático.',
        };
    }
    // ==================== CONFIGURACIÓN DE TURNOS ====================
    async getTimeslotConfig() {
        const config = await prisma_1.prismaEscapeRoom.timeslotConfig.findFirst({
            orderBy: { updatedAt: 'desc' },
        });
        return {
            eventDates: config?.eventDates ?? [],
            durationMinutes: config?.durationMinutes ?? 15,
            startHour: config?.startHour ?? 8,
            endHour: config?.endHour ?? 20,
            slotsPerDay: config?.slotsPerDay ?? 48,
        };
    }
    async setTimeslotConfig(data) {
        const { eventDates, durationMinutes, startHour, endHour, adminEmail } = data;
        // Calcular slots por día
        const slotsPerDay = timeslot_service_1.timeslotService.calculateSlotsPerDay(durationMinutes, startHour, endHour);
        const config = await prisma_1.prismaEscapeRoom.timeslotConfig.create({
            data: {
                eventDates,
                durationMinutes,
                startHour,
                endHour,
                slotsPerDay,
                updatedBy: adminEmail,
            },
        });
        return config;
    }
    // ==================== GESTIÓN DE TURNOS ====================
    async generateTimeslots() {
        const config = await prisma_1.prismaEscapeRoom.timeslotConfig.findFirst({
            orderBy: { updatedAt: 'desc' },
        });
        if (!config || !config.eventDates || config.eventDates.length === 0) {
            throw new Error('No hay configuración de turnos. Configure primero.');
        }
        // Borrar turnos existentes antes de generar nuevos
        await timeslot_service_1.timeslotService.clearAllTimeslots();
        const timeslots = await timeslot_service_1.timeslotService.generateFromConfig({
            eventDates: config.eventDates,
            durationMinutes: config.durationMinutes,
            startHour: config.startHour,
            endHour: config.endHour,
        });
        return {
            message: `Generados ${timeslots.length} turnos`,
            totalSlots: timeslots.length,
            slotsPerDay: config.slotsPerDay,
            days: config.eventDates.length,
        };
    }
    async clearTimeslots() {
        const deletedCount = await timeslot_service_1.timeslotService.clearAllTimeslots();
        return {
            message: `Eliminados ${deletedCount} turnos`,
            deletedCount,
        };
    }
    // ==================== EXPORTACIÓN DE DATOS ====================
    async getUsersData() {
        // Obtener todos los usuarios con sus reservas
        const users = await prisma_1.prismaEscapeRoom.user.findMany({
            include: {
                reservations: {
                    where: {
                        status: {
                            not: 'CANCELLED'
                        }
                    },
                    orderBy: {
                        createdAt: 'desc'
                    },
                    take: 1,
                    include: {
                        timeslot: true
                    }
                },
                partner: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
        // Mapear datos para exportación
        const exportData = users.map(user => {
            const reservation = user.reservations[0];
            // Mapear interestRating a texto
            let interestLevel = 'Sin calificar';
            if (reservation?.interestRating === 1) {
                interestLevel = 'No interesado';
            }
            else if (reservation?.interestRating === 2) {
                interestLevel = 'Poco interesado';
            }
            else if (reservation?.interestRating === 3) {
                interestLevel = 'Bastante interesado';
            }
            return {
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                whatsapp: user.whatsapp,
                triviaCompleted: user.triviaCompleted,
                hasReservation: !!reservation,
                reservationStatus: reservation?.status || 'Sin reserva',
                checkedIn: !!reservation?.checkedInAt,
                interestRating: reservation?.interestRating || null,
                interestLevel,
                partnerName: user.partner ? `${user.partner.firstName} ${user.partner.lastName}` : 'Sin compañero',
                timeslot: reservation?.timeslot ? `${reservation.timeslot.startTime} - ${reservation.timeslot.endTime}` : 'Sin turno',
                createdAt: user.createdAt,
            };
        });
        return exportData;
    }
}
exports.AdminService = AdminService;
