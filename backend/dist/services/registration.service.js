"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegistrationService = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class RegistrationService {
    async createRegistration(data) {
        return await prisma.registration.create({
            data: {
                firstName: data.firstName,
                lastName: data.lastName,
                phone: data.phone,
                email: data.email,
                sports: data.sports,
                cedula: data.cedula || null,
                edad: data.edad || null,
                sector: data.sector || null,
            },
        });
    }
    async getAllRegistrations(status, limit, offset) {
        const where = status ? { status: status } : {};
        return await prisma.registration.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            take: limit,
            skip: offset,
        });
    }
    async getRegistrationById(id) {
        return await prisma.registration.findUnique({
            where: { id },
        });
    }
    async getRegistrationByEmail(email) {
        return await prisma.registration.findFirst({
            where: { email },
        });
    }
    async getRegistrationByCedula(cedula) {
        return await prisma.registration.findFirst({
            where: { cedula },
        });
    }
    async updateRegistration(id, data) {
        try {
            return await prisma.registration.update({
                where: { id },
                data: {
                    ...(data.email && { email: data.email }),
                    ...(data.phone && { phone: data.phone }),
                },
            });
        }
        catch (error) {
            return null;
        }
    }
    async checkIn(id) {
        return await prisma.registration.update({
            where: { id },
            data: {
                status: client_1.Status.CHECKED_IN,
                checkInTime: new Date(),
            },
        });
    }
    async getStats() {
        const [total, checkedIn, pending, noShow, allRegistrations, recentScans] = await Promise.all([
            prisma.registration.count(),
            prisma.registration.count({ where: { status: client_1.Status.CHECKED_IN } }),
            prisma.registration.count({ where: { status: client_1.Status.PENDING } }),
            prisma.registration.count({ where: { status: client_1.Status.NO_SHOW } }),
            prisma.registration.findMany({ select: { sports: true } }),
            prisma.registration.findMany({
                where: { status: client_1.Status.CHECKED_IN },
                orderBy: { checkInTime: 'desc' },
                take: 10,
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    checkInTime: true,
                    sports: true,
                },
            }),
        ]);
        const sportCounts = new Map();
        let totalSportsCount = 0;
        allRegistrations.forEach(reg => {
            reg.sports.forEach(sport => {
                sportCounts.set(sport, (sportCounts.get(sport) || 0) + 1);
                totalSportsCount++;
            });
        });
        const sportBreakdown = {
            'Correr': sportCounts.get('Correr') || 0,
            'Nadar': sportCounts.get('Nadar') || 0,
            'Gimnasio': sportCounts.get('Gimnasio') || 0,
            'Baile': sportCounts.get('Baile') || 0,
            'Futbol': sportCounts.get('Futbol') || 0,
            'Basket': sportCounts.get('Basket') || 0,
            'Ninguno': sportCounts.get('Ninguno') || 0,
        };
        return {
            total,
            checkedIn,
            pending,
            noShow,
            sportsCount: totalSportsCount,
            sportBreakdown,
            recentScans,
        };
    }
}
exports.RegistrationService = RegistrationService;
