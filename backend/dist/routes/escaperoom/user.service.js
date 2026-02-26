"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const prisma_1 = require("../../services/escaperoom/prisma");
const errors_1 = require("../../services/escaperoom/utils/errors");
const dateHelpers_1 = require("../../services/escaperoom/utils/dateHelpers");
class UserService {
    async createUser(data) {
        const existingUser = await prisma_1.prismaEscapeRoom.user.findUnique({
            where: { email: data.email },
        });
        if (existingUser) {
            throw new errors_1.ConflictError('El email ya está registrado');
        }
        return await prisma_1.prismaEscapeRoom.user.create({
            data: {
                ...data,
                createdAt: (0, dateHelpers_1.getEcuadorTime)(),
            },
        });
    }
    async createMultipleUsers(data) {
        const { users } = data;
        if (!users || users.length !== 2) {
            throw new errors_1.BadRequestError('Debes registrar exactamente 2 personas');
        }
        // Validar que los emails sean diferentes
        if (users[0].email === users[1].email) {
            throw new errors_1.BadRequestError('Los emails deben ser diferentes');
        }
        // Verificar que ningún email esté registrado Y que no tengan partnerId previo
        const existingUsers = await prisma_1.prismaEscapeRoom.user.findMany({
            where: {
                email: {
                    in: [users[0].email, users[1].email]
                }
            }
        });
        if (existingUsers.length > 0) {
            // Verificar si alguno ya tiene partner (ya participó)
            const usersWithPartner = existingUsers.filter(u => u.partnerId !== null);
            if (usersWithPartner.length > 0) {
                const participatedEmails = usersWithPartner.map(u => u.email).join(', ');
                throw new errors_1.ConflictError(`Las siguientes personas ya participaron en un grupo: ${participatedEmails}`);
            }
            const existingEmails = existingUsers.map(u => u.email).join(', ');
            throw new errors_1.ConflictError(`Los siguientes emails ya están registrados: ${existingEmails}`);
        }
        // Crear ambos usuarios en una transacción y vincularlos como partners
        const createdUsers = await prisma_1.prismaEscapeRoom.$transaction(async (tx) => {
            // Crear primer usuario
            const user1 = await tx.user.create({
                data: {
                    ...users[0],
                    createdAt: (0, dateHelpers_1.getEcuadorTime)(),
                },
            });
            // Crear segundo usuario vinculado al primero
            const user2 = await tx.user.create({
                data: {
                    ...users[1],
                    createdAt: (0, dateHelpers_1.getEcuadorTime)(),
                    partnerId: user1.id, // Vincular al primer usuario
                },
            });
            // Actualizar primer usuario con el partnerId del segundo
            const updatedUser1 = await tx.user.update({
                where: { id: user1.id },
                data: { partnerId: user2.id },
            });
            return [updatedUser1, user2];
        });
        return createdUsers;
    }
    async getUserById(id) {
        return await prisma_1.prismaEscapeRoom.user.findUnique({
            where: { id },
        });
    }
    async getUserByEmail(email) {
        return await prisma_1.prismaEscapeRoom.user.findUnique({
            where: { email },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                whatsapp: true,
                triviaCompleted: true,
                createdAt: true,
                partnerId: true,
                partner: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                        whatsapp: true,
                        triviaCompleted: true,
                    }
                },
                reservations: {
                    select: {
                        id: true,
                        qrCode: true,
                        status: true,
                        timeslotId: true,
                    },
                    where: {
                        status: {
                            not: 'CANCELLED'
                        }
                    },
                    orderBy: {
                        createdAt: 'desc'
                    },
                    take: 1
                },
            },
        });
    }
}
exports.UserService = UserService;
