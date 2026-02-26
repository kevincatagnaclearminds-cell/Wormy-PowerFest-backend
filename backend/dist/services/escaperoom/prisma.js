"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prismaEscapeRoom = void 0;
const client_escaperoom_1 = require(".prisma/client-escaperoom");
exports.prismaEscapeRoom = new client_escaperoom_1.PrismaClient({
    datasources: {
        db: {
            url: process.env.ESCAPEROOM_DATABASE_URL,
        },
    },
});
// Manejo de desconexión
process.on('beforeExit', async () => {
    await exports.prismaEscapeRoom.$disconnect();
});
