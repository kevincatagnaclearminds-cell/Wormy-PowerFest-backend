"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TriviaService = void 0;
const prisma_1 = require("../../services/escaperoom/prisma");
const errors_1 = require("../../services/escaperoom/utils/errors");
const uuid_1 = require("uuid");
const qr_service_1 = require("../../services/escaperoom/services/qr.service");
const email_service_1 = require("../../services/escaperoom/services/email.service");
const whatsapp_service_1 = require("../../services/escaperoom/services/whatsapp.service");
const dateHelpers_1 = require("../../services/escaperoom/utils/dateHelpers");
class TriviaService {
    async getQuestions() {
        const questions = await prisma_1.prismaEscapeRoom.question.findMany({
            orderBy: { order: 'asc' },
            include: {
                answers: {
                    select: {
                        id: true,
                        text: true,
                    },
                },
            },
        });
        return questions;
    }
    async validateAnswers(data) {
        const { userId, answers } = data;
        // Verificar que el usuario existe
        const user = await prisma_1.prismaEscapeRoom.user.findUnique({
            where: { id: userId },
            include: { partner: true },
        });
        if (!user) {
            throw new errors_1.NotFoundError('Usuario no encontrado');
        }
        // Verificar que se respondieron exactamente 5 preguntas
        if (answers.length !== 5) {
            throw new errors_1.BadRequestError('Debes responder las 5 preguntas');
        }
        // Validar cada respuesta
        let allCorrect = true;
        for (const answer of answers) {
            const correctAnswer = await prisma_1.prismaEscapeRoom.answer.findFirst({
                where: {
                    questionId: answer.questionId,
                    id: answer.answerId,
                    isCorrect: true,
                },
            });
            if (!correctAnswer) {
                allCorrect = false;
                break;
            }
        }
        // Si todas son correctas, actualizar triviaCompleted en AMBAS personas del grupo
        if (allCorrect) {
            const updatePromises = [
                prisma_1.prismaEscapeRoom.user.update({
                    where: { id: userId },
                    data: { triviaCompleted: true },
                })
            ];
            // Si tiene partner, también marcar su trivia como completada
            if (user.partnerId) {
                updatePromises.push(prisma_1.prismaEscapeRoom.user.update({
                    where: { id: user.partnerId },
                    data: { triviaCompleted: true },
                }));
            }
            await Promise.all(updatePromises);
            console.log(`✅ Trivia completada para usuario ${userId}${user.partnerId ? ` y su compañero ${user.partnerId}` : ''}`);
        }
        return {
            correct: allCorrect,
            message: allCorrect
                ? 'Trivia completada correctamente. Ahora selecciona tu turno.'
                : 'Algunas respuestas son incorrectas',
        };
    }
    /**
     * DEPRECATED: Ya no se usa - Se mantiene por compatibilidad
     * Crea una reserva automáticamente después de completar la trivia
     * - Busca el primer turno disponible del día actual (en zona horaria de Ecuador)
     * - Genera un código QR único
     * - Envía el QR por email y WhatsApp
     */
    async createAutoReservation(userId) {
        console.log(`🎫 Creando reserva automática para usuario ${userId}...`);
        // Obtener datos del usuario
        const user = await prisma_1.prismaEscapeRoom.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            throw new errors_1.NotFoundError('Usuario no encontrado');
        }
        // Obtener fecha actual en Ecuador
        const { year, month, day } = (0, dateHelpers_1.getEcuadorDate)();
        console.log(`📅 Buscando turnos para: ${year}-${month + 1}-${day} (Ecuador)`);
        // Obtener todos los turnos y filtrar por fecha actual
        const allTimeslots = await prisma_1.prismaEscapeRoom.timeSlot.findMany({
            orderBy: { startTime: 'asc' },
        });
        // Filtrar turnos que coincidan con la fecha actual de Ecuador
        const todayTimeslots = allTimeslots.filter((slot) => {
            const slotDate = new Date(slot.date);
            return (slotDate.getUTCFullYear() === year &&
                slotDate.getUTCMonth() === month &&
                slotDate.getUTCDate() === day);
        });
        if (todayTimeslots.length === 0) {
            throw new errors_1.BadRequestError('No hay turnos disponibles para hoy');
        }
        // Obtener hora y minutos actuales en Ecuador
        const { hour: currentHour, minute: currentMinute } = (0, dateHelpers_1.getEcuadorTimeComponents)();
        const currentTimeInMinutes = currentHour * 60 + currentMinute;
        console.log(`🕐 Hora actual Ecuador: ${currentHour}:${currentMinute.toString().padStart(2, '0')}`);
        // Buscar el turno que corresponde a la hora actual o el siguiente disponible
        let timeslot = todayTimeslots.find((slot) => {
            // Parsear startTime (formato "HH:MM")
            const [startHour, startMinute] = slot.startTime.split(':').map(Number);
            const [endHour, endMinute] = slot.endTime.split(':').map(Number);
            const startTimeInMinutes = startHour * 60 + startMinute;
            const endTimeInMinutes = endHour * 60 + endMinute;
            // El turno actual es aquel donde la hora actual está entre start y end
            return currentTimeInMinutes >= startTimeInMinutes && currentTimeInMinutes < endTimeInMinutes;
        });
        // Si no hay turno actual (por ejemplo, entre turnos), buscar el siguiente
        if (!timeslot) {
            timeslot = todayTimeslots.find((slot) => {
                const [startHour, startMinute] = slot.startTime.split(':').map(Number);
                const startTimeInMinutes = startHour * 60 + startMinute;
                return currentTimeInMinutes < startTimeInMinutes;
            });
        }
        // Si aún no hay turno, tomar el primero (fallback)
        if (!timeslot) {
            timeslot = todayTimeslots[0];
        }
        console.log(`✅ Turno asignado: ${timeslot.startTime} - ${timeslot.endTime}`);
        // Generar código QR único
        const qrCode = (0, uuid_1.v4)();
        console.log(`🔑 Código QR generado: ${qrCode}`);
        // Generar imagen QR
        const qrImage = await (0, qr_service_1.generateQR)(qrCode);
        // Crear reserva en la base de datos
        const reservation = await prisma_1.prismaEscapeRoom.reservation.create({
            data: {
                userId,
                timeslotId: timeslot.id,
                qrCode,
                createdAt: (0, dateHelpers_1.getEcuadorTime)(),
            },
            include: {
                user: true,
                timeslot: true,
            },
        });
        console.log(`✅ Reserva creada con ID: ${reservation.id}`);
        // Enviar notificaciones
        try {
            // Enviar email
            await (0, email_service_1.sendReservationEmail)(user.email, reservation, qrCode);
            console.log(`📧 Email enviado a ${user.email}`);
        }
        catch (error) {
            console.error('❌ Error enviando email:', error);
            // No lanzar error, continuar con WhatsApp
        }
        try {
            // Enviar WhatsApp
            await (0, whatsapp_service_1.sendReservationWhatsApp)(user.whatsapp, reservation, qrImage);
            console.log(`📱 WhatsApp enviado a ${user.whatsapp}`);
        }
        catch (error) {
            console.error('❌ Error enviando WhatsApp:', error);
            // No lanzar error, la reserva ya está creada
        }
        console.log(`🎉 Reserva automática completada para ${user.firstName} ${user.lastName}`);
        return reservation;
    }
}
exports.TriviaService = TriviaService;
