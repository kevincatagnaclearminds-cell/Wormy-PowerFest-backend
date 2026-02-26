"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimeslotService = void 0;
const prisma_1 = require("../../services/escaperoom/prisma");
const dateHelpers_1 = require("../../services/escaperoom/utils/dateHelpers");
class TimeslotService {
    async getAvailableSlots(date) {
        // Parsear la fecha correctamente (mediodía UTC)
        const targetDate = (0, dateHelpers_1.parseDate)(date);
        // Obtener todos los turnos y filtrar por fecha
        const allSlots = await prisma_1.prismaEscapeRoom.timeSlot.findMany({
            select: {
                id: true,
                date: true,
                startTime: true,
                endTime: true,
                _count: {
                    select: { reservations: true },
                },
            },
            orderBy: { startTime: 'asc' },
        });
        // Filtrar turnos que coincidan con la fecha objetivo
        const slots = allSlots.filter((slot) => (0, dateHelpers_1.isSameDay)(new Date(slot.date), targetDate));
        return slots;
    }
}
exports.TimeslotService = TimeslotService;
