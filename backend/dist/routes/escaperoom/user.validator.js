"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUserSchema = void 0;
const zod_1 = require("zod");
exports.createUserSchema = zod_1.z.object({
    body: zod_1.z.object({
        firstName: zod_1.z.string().min(2, 'Nombre debe tener al menos 2 caracteres'),
        lastName: zod_1.z.string().min(2, 'Apellido debe tener al menos 2 caracteres'),
        email: zod_1.z.string().email('Email inválido'),
        whatsapp: zod_1.z.string().regex(/^09\d{8}$/, 'WhatsApp debe tener formato 09XXXXXXXX'),
    }),
});
