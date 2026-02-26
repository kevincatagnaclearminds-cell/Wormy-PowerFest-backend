"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
// Cargar variables de entorno lo antes posible
dotenv_1.default.config();
// Validar variables críticas
if (!process.env.DATABASE_URL) {
    console.error('❌ ERROR: DATABASE_URL no está definida en el archivo .env');
    process.exit(1);
}
console.log('✅ Variables de entorno cargadas correctamente');
