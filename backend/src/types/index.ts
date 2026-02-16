export interface CreateRegistrationDTO {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  sports: string[];
}

export interface VerifyTicketDTO {
  ticketId: string;
}

export interface StatsResponse {
  totalRegistrations: number;
  checkedIn: number;
  pending: number;
  noShow: number;
  sportStats: { sport: string; count: number }[];
}

export interface ValidateQRDTO {
  qr_code: string;
  mode: 'entrada' | 'entrega' | 'completo';
}

export interface ScanQRDTO {
  qr_code: string;
  scanned_at: string;
  device_id?: string;
}

export type ScanMode = 'entrada' | 'entrega' | 'completo';
