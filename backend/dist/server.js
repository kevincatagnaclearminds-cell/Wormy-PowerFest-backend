"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const client_1 = require("@prisma/client");
const registration_routes_1 = __importDefault(require("./routes/registration.routes"));
const verification_routes_1 = __importDefault(require("./routes/verification.routes"));
const stats_routes_1 = __importDefault(require("./routes/stats.routes"));
const scan_routes_1 = __importDefault(require("./routes/scan.routes"));
const errorHandler_1 = require("./middleware/errorHandler");
// Rutas EscapeRoom
const user_routes_1 = __importDefault(require("./routes/escaperoom/user.routes"));
const trivia_routes_1 = __importDefault(require("./routes/escaperoom/trivia.routes"));
const timeslot_routes_1 = __importDefault(require("./routes/escaperoom/timeslot.routes"));
const reservation_routes_1 = __importDefault(require("./routes/escaperoom/reservation.routes"));
const checkin_routes_1 = __importDefault(require("./routes/escaperoom/checkin.routes"));
const admin_routes_1 = __importDefault(require("./routes/escaperoom/admin.routes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
const prisma = new client_1.PrismaClient();
app.use((0, cors_1.default)({
    origin: process.env.FRONTEND_URL || 'https://wpowerfests.vercel.app',
    credentials: true,
}));
app.use(express_1.default.json());
app.get('/health', (req, res) => {
    res.json({ status: 'ok', service: 'wpowerfest', timestamp: new Date().toISOString() });
});
app.get('/escaperoom/health', (req, res) => {
    res.json({ status: 'ok', service: 'escaperoom', timestamp: new Date().toISOString() });
});
// Rutas wpowerfest
app.use('/api/registrations', registration_routes_1.default);
app.use('/api/verify', verification_routes_1.default);
app.use('/api/stats', stats_routes_1.default);
app.use('/api/scan', scan_routes_1.default);
// Rutas escaperoom (con prefijo /escaperoom/api)
app.use('/escaperoom/api/users', user_routes_1.default);
app.use('/escaperoom/api/trivia', trivia_routes_1.default);
app.use('/escaperoom/api/timeslots', timeslot_routes_1.default);
app.use('/escaperoom/api/reservations', reservation_routes_1.default);
app.use('/escaperoom/api/checkin', checkin_routes_1.default);
app.use('/escaperoom/api/admin', admin_routes_1.default);
app.use(errorHandler_1.errorHandler);
async function startServer() {
    try {
        await prisma.$connect();
        console.log('✅ Base de datos wpowerfest conectada');
        // Conectar base de datos de escaperoom
        const { prismaEscapeRoom } = await Promise.resolve().then(() => __importStar(require('./services/escaperoom/prisma')));
        await prismaEscapeRoom.$connect();
        console.log('✅ Base de datos escaperoom conectada');
        app.listen(PORT, () => {
            console.log(`🚀 Server running on http://localhost:${PORT}`);
            console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
            console.log(`🎮 wpowerfest API: http://localhost:${PORT}/api`);
            console.log(`🔐 EscapeRoom API: http://localhost:${PORT}/escaperoom/api`);
        });
    }
    catch (error) {
        console.error('❌ Error conectando a las bases de datos:', error);
        process.exit(1);
    }
}
startServer();
process.on('SIGINT', async () => {
    await prisma.$disconnect();
    const { prismaEscapeRoom } = await Promise.resolve().then(() => __importStar(require('./services/escaperoom/prisma')));
    await prismaEscapeRoom.$disconnect();
    process.exit(0);
});
