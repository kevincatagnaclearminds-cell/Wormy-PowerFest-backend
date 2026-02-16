import { PrismaClient } from '@prisma/client';
import { ScanMode } from '../types';

const prisma = new PrismaClient();

export class ScanService {
  async validateQR(qr_code: string, mode: ScanMode) {
    const registration = await prisma.registration.findUnique({
      where: { id: qr_code },
    });

    if (!registration) {
      return {
        success: false,
        error: {
          code: 'INVALID_QR',
          message: 'Código QR no válido o no existe'
        }
      };
    }

    const canScan = this.canScanMode(registration, mode);

    return {
      success: true,
      data: {
        participant_id: registration.id,
        name: `${registration.firstName} ${registration.lastName}`,
        email: registration.email,
        registration_date: registration.registrationDate,
        status: {
          entrada: registration.entradaScanned,
          entrega: registration.entregaScanned,
          completo: registration.completoScanned
        },
        can_scan: canScan.can,
        message: canScan.message
      }
    };
  }

  async scanEntrada(qr_code: string, scanned_at?: string, device_id?: string) {
    const registration = await prisma.registration.findUnique({
      where: { id: qr_code },
    });

    if (!registration) {
      return {
        success: false,
        error: {
          code: 'INVALID_QR',
          message: 'Código QR no válido'
        }
      };
    }

    if (registration.entradaScanned) {
      return {
        success: false,
        error: {
          code: 'ALREADY_ENTERED',
          message: 'El participante ya registró su entrada'
        }
      };
    }

    const updated = await prisma.registration.update({
      where: { id: qr_code },
      data: {
        entradaScanned: true,
        entradaTime: scanned_at ? new Date(scanned_at) : new Date(),
        status: 'CHECKED_IN',
        checkInTime: scanned_at ? new Date(scanned_at) : new Date()
      }
    });

    return {
      success: true,
      data: {
        scan_id: `scan-${Date.now()}`,
        participant_id: updated.id,
        name: `${updated.firstName} ${updated.lastName}`,
        mode: 'entrada',
        timestamp: updated.entradaTime,
        message: 'Entrada registrada exitosamente'
      }
    };
  }

  async scanEntrega(qr_code: string, scanned_at?: string, device_id?: string) {
    const registration = await prisma.registration.findUnique({
      where: { id: qr_code },
    });

    if (!registration) {
      return {
        success: false,
        error: {
          code: 'INVALID_QR',
          message: 'Código QR no válido'
        }
      };
    }

    if (!registration.entradaScanned) {
      return {
        success: false,
        error: {
          code: 'NOT_ENTERED',
          message: 'El participante debe registrar entrada primero'
        }
      };
    }

    if (registration.entregaScanned) {
      return {
        success: false,
        error: {
          code: 'ALREADY_SCANNED',
          message: 'El pasaporte ya fue entregado'
        }
      };
    }

    const updated = await prisma.registration.update({
      where: { id: qr_code },
      data: {
        entregaScanned: true,
        entregaTime: scanned_at ? new Date(scanned_at) : new Date()
      }
    });

    return {
      success: true,
      data: {
        scan_id: `scan-${Date.now()}`,
        participant_id: updated.id,
        name: `${updated.firstName} ${updated.lastName}`,
        mode: 'entrega',
        timestamp: updated.entregaTime,
        message: 'Entrega de pasaporte registrada'
      }
    };
  }

  async scanCompleto(qr_code: string, scanned_at?: string, device_id?: string) {
    const registration = await prisma.registration.findUnique({
      where: { id: qr_code },
    });

    if (!registration) {
      return {
        success: false,
        error: {
          code: 'INVALID_QR',
          message: 'Código QR no válido'
        }
      };
    }

    if (!registration.entregaScanned) {
      return {
        success: false,
        error: {
          code: 'PASSPORT_NOT_DELIVERED',
          message: 'El pasaporte debe ser entregado primero'
        }
      };
    }

    if (registration.completoScanned) {
      return {
        success: false,
        error: {
          code: 'ALREADY_SCANNED',
          message: 'El pasaporte ya fue marcado como completo'
        }
      };
    }

    const updated = await prisma.registration.update({
      where: { id: qr_code },
      data: {
        completoScanned: true,
        completoTime: scanned_at ? new Date(scanned_at) : new Date()
      }
    });

    return {
      success: true,
      data: {
        scan_id: `scan-${Date.now()}`,
        participant_id: updated.id,
        name: `${updated.firstName} ${updated.lastName}`,
        mode: 'completo',
        timestamp: updated.completoTime,
        message: 'Pasaporte completado exitosamente'
      }
    };
  }

  async getHistory(date?: string, mode?: string, limit: number = 50) {
    const where: any = {};
    
    if (mode === 'entrada') {
      where.entradaScanned = true;
    } else if (mode === 'entrega') {
      where.entregaScanned = true;
    } else if (mode === 'completo') {
      where.completoScanned = true;
    }

    const registrations = await prisma.registration.findMany({
      where,
      take: limit,
      orderBy: { updatedAt: 'desc' }
    });

    const scans = registrations.map(reg => {
      let timestamp = reg.updatedAt;
      if (mode === 'entrada' && reg.entradaTime) timestamp = reg.entradaTime;
      if (mode === 'entrega' && reg.entregaTime) timestamp = reg.entregaTime;
      if (mode === 'completo' && reg.completoTime) timestamp = reg.completoTime;

      return {
        scan_id: `scan-${reg.id}`,
        participant_id: reg.id,
        name: `${reg.firstName} ${reg.lastName}`,
        mode: mode || 'entrada',
        timestamp,
        status: 'valid'
      };
    });

    return {
      success: true,
      data: {
        total: scans.length,
        scans
      }
    };
  }

  async getStats(date?: string) {
    const [entrada, entrega, completo, total] = await Promise.all([
      prisma.registration.count({ where: { entradaScanned: true } }),
      prisma.registration.count({ where: { entregaScanned: true } }),
      prisma.registration.count({ where: { completoScanned: true } }),
      prisma.registration.count()
    ]);

    const totalScans = entrada + entrega + completo;

    return {
      success: true,
      data: {
        date: date || new Date().toISOString().split('T')[0],
        total_scans: totalScans,
        by_mode: {
          entrada,
          entrega,
          completo
        },
        valid_scans: totalScans,
        invalid_scans: 0,
        last_updated: new Date().toISOString()
      }
    };
  }

  private canScanMode(registration: any, mode: ScanMode) {
    if (mode === 'entrada') {
      if (registration.entradaScanned) {
        return { can: false, message: 'Ya se registró la entrada' };
      }
      return { can: true, message: 'Puede registrar entrada' };
    }

    if (mode === 'entrega') {
      if (!registration.entradaScanned) {
        return { can: false, message: 'Debe registrar entrada primero' };
      }
      if (registration.entregaScanned) {
        return { can: false, message: 'El pasaporte ya fue entregado' };
      }
      return { can: true, message: 'Puede entregar pasaporte' };
    }

    if (mode === 'completo') {
      if (!registration.entregaScanned) {
        return { can: false, message: 'Debe entregar pasaporte primero' };
      }
      if (registration.completoScanned) {
        return { can: false, message: 'El pasaporte ya está completo' };
      }
      return { can: true, message: 'Puede marcar como completo' };
    }

    return { can: false, message: 'Modo inválido' };
  }
}
