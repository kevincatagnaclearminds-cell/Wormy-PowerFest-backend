"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendReservationWhatsApp = void 0;
const twilio_1 = __importDefault(require("twilio"));
const client = (0, twilio_1.default)(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const sendReservationWhatsApp = async (whatsapp, reservation, qrImage // Ahora es opcional, no se usa
) => {
    const { user, timeslot } = reservation;
    // Convertir formato 09XXXXXXXX a +593XXXXXXXXX
    const fullNumber = whatsapp.startsWith('0')
        ? `+593${whatsapp.substring(1)}`
        : whatsapp;
    console.log(`📱 Enviando WhatsApp a ${fullNumber}...`);
    const message = `
🎉 *¡Reserva Confirmada - Escape Room!*

Hola *${user.firstName}*,

Tu reserva ha sido confirmada exitosamente.

📅 *Detalles de tu reserva:*
• Fecha: ${new Date(timeslot.date).toLocaleDateString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })}
• Hora: ${timeslot.startTime} - ${timeslot.endTime}
• Duración: 15 minutos

📧 *Tu código QR ha sido enviado a:*
${user.email}

⚠️ *Importante:*
• Revisa tu correo electrónico
• Guarda el código QR que recibiste
• Llega 5 minutos antes de tu horario
• Presenta el QR en la entrada del evento
• El código es de un solo uso

📍 *Ubicación:*
Expo Educativa 2026
27-28 Feb y 1 Mar

¡Nos vemos pronto en el Escape Room! 🔐
  `.trim();
    try {
        await client.messages.create({
            from: process.env.TWILIO_WHATSAPP_FROM,
            to: `whatsapp:${fullNumber}`,
            body: message,
        });
        console.log(`✅ WhatsApp enviado exitosamente a ${fullNumber}`);
    }
    catch (error) {
        console.error(`❌ Error enviando WhatsApp a ${fullNumber}:`, error);
        throw error;
    }
};
exports.sendReservationWhatsApp = sendReservationWhatsApp;
