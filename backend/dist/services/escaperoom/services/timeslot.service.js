"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.timeslotService = exports.TimeslotService = void 0;
const prisma_1 = require("../prisma");
const errors_1 = require("../utils/errors");
class TimeslotService {
    /**
     * Genera turnos seguidos según la configuración proporcionada
     * Los turnos son continuos (sin espacios entre ellos)
     */
    async generateFromConfig(config) {
        const { eventDates, durationMinutes, startHour, endHour } = config;
        console.log('📋 Generando turnos con configuración:');
        console.log(`   - Fechas: ${eventDates.length} días`);
        console.log(`   - Duración: ${durationMinutes} minutos por turno`);
        console.log(`   - Horario: ${startHour}:00 - ${endHour}:00`);
        const timeslots = [];
        for (const date of eventDates) {
            let currentMinute = startHour * 60; // Convertir hora a minutos
            const endMinute = endHour * 60;
            // Generar turnos seguidos (sin espacios entre ellos)
            while (currentMinute + durationMinutes <= endMinute) {
                const startHourCalc = Math.floor(currentMinute / 60);
                const startMinuteCalc = currentMinute % 60;
                const endMinuteCalc = currentMinute + durationMinutes;
                const endHourCalc = Math.floor(endMinuteCalc / 60);
                const endMinuteCalcMod = endMinuteCalc % 60;
                const startTime = `${startHourCalc.toString().padStart(2, '0')}:${startMinuteCalc.toString().padStart(2, '0')}`;
                const endTime = `${endHourCalc.toString().padStart(2, '0')}:${endMinuteCalcMod.toString().padStart(2, '0')}`;
                const timeslot = await prisma_1.prismaEscapeRoom.timeSlot.create({
                    data: {
                        date,
                        startTime,
                        endTime,
                    },
                });
                timeslots.push(timeslot);
                // Avanzar al siguiente turno (inmediatamente después del anterior)
                currentMinute += durationMinutes;
            }
        }
        const slotsPerDay = Math.floor(timeslots.length / eventDates.length);
        console.log(`✅ ${timeslots.length} turnos creados (${slotsPerDay} por día)`);
        return timeslots;
    }
    /**
     * Elimina todos los turnos de la base de datos
     * Verifica que no haya reservas activas antes de eliminar
     */
    async clearAllTimeslots() {
        // Verificar si hay reservas existentes
        const reservationsCount = await prisma_1.prismaEscapeRoom.reservation.count();
        if (reservationsCount > 0) {
            throw new errors_1.BadRequestError(`No se pueden eliminar los turnos porque existen ${reservationsCount} reserva${reservationsCount > 1 ? 's' : ''} activa${reservationsCount > 1 ? 's' : ''}. Elimina las reservas primero.`);
        }
        const deleted = await prisma_1.prismaEscapeRoom.timeSlot.deleteMany({});
        console.log(`🗑️  ${deleted.count} turnos eliminados`);
        return deleted.count;
    }
    /**
     * Obtiene la configuración actual de turnos desde TimeslotConfig
     */
    async getCurrentConfig() {
        const config = await prisma_1.prismaEscapeRoom.timeslotConfig.findFirst({
            orderBy: { updatedAt: 'desc' },
        });
        if (!config || !config.eventDates || config.eventDates.length === 0) {
            return null;
        }
        return {
            eventDates: config.eventDates,
            durationMinutes: config.durationMinutes,
            startHour: config.startHour,
            endHour: config.endHour,
            slotsPerDay: config.slotsPerDay,
        };
    }
    /**
     * Calcula cuántos turnos se generarán con una configuración dada
     */
    calculateSlotsPerDay(durationMinutes, startHour, endHour) {
        const totalMinutes = (endHour - startHour) * 60;
        return Math.floor(totalMinutes / durationMinutes);
    }
}
exports.TimeslotService = TimeslotService;
exports.timeslotService = new TimeslotService();
