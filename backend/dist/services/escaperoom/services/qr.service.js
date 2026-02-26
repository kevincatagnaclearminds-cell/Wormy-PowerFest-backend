"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateQR = void 0;
const qrcode_1 = __importDefault(require("qrcode"));
const generateQR = async (data) => {
    try {
        // Genera QR en formato base64
        const qrImage = await qrcode_1.default.toDataURL(data, {
            errorCorrectionLevel: 'H',
            type: 'image/png',
            width: 300,
            margin: 2,
        });
        return qrImage;
    }
    catch (error) {
        console.error('Error generando QR:', error);
        throw new Error('No se pudo generar el código QR');
    }
};
exports.generateQR = generateQR;
