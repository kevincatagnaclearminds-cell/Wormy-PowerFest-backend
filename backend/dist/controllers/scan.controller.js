"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScanController = void 0;
const scan_service_1 = require("../services/scan.service");
const scanService = new scan_service_1.ScanService();
class ScanController {
    async validate(req, res) {
        try {
            const { qr_code, mode } = req.body;
            if (!qr_code || !mode) {
                return res.status(400).json({
                    success: false,
                    error: {
                        code: 'INVALID_REQUEST',
                        message: 'QR code y mode son requeridos'
                    }
                });
            }
            if (!['entrada', 'entrega', 'completo', 'sorteo'].includes(mode)) {
                return res.status(400).json({
                    success: false,
                    error: {
                        code: 'INVALID_MODE',
                        message: 'Modo de escaneo no válido'
                    }
                });
            }
            const result = await scanService.validateQR(qr_code, mode);
            if (!result.success) {
                return res.status(404).json(result);
            }
            res.json(result);
        }
        catch (error) {
            console.error('Error validating QR:', error);
            res.status(500).json({
                success: false,
                error: {
                    code: 'SERVER_ERROR',
                    message: 'Error interno del servidor'
                }
            });
        }
    }
    async entrada(req, res) {
        try {
            const { qr_code, scanned_at, device_id } = req.body;
            if (!qr_code) {
                return res.status(400).json({
                    success: false,
                    error: {
                        code: 'INVALID_REQUEST',
                        message: 'QR code es requerido'
                    }
                });
            }
            const result = await scanService.scanEntrada(qr_code, scanned_at, device_id);
            if (!result.success) {
                return res.status(400).json(result);
            }
            res.json(result);
        }
        catch (error) {
            console.error('Error scanning entrada:', error);
            res.status(500).json({
                success: false,
                error: {
                    code: 'SERVER_ERROR',
                    message: 'Error interno del servidor'
                }
            });
        }
    }
    async entrega(req, res) {
        try {
            const { qr_code, scanned_at, device_id } = req.body;
            if (!qr_code) {
                return res.status(400).json({
                    success: false,
                    error: {
                        code: 'INVALID_REQUEST',
                        message: 'QR code es requerido'
                    }
                });
            }
            const result = await scanService.scanEntrega(qr_code, scanned_at, device_id);
            if (!result.success) {
                return res.status(400).json(result);
            }
            res.json(result);
        }
        catch (error) {
            console.error('Error scanning entrega:', error);
            res.status(500).json({
                success: false,
                error: {
                    code: 'SERVER_ERROR',
                    message: 'Error interno del servidor'
                }
            });
        }
    }
    async completo(req, res) {
        try {
            const { qr_code, scanned_at, device_id } = req.body;
            if (!qr_code) {
                return res.status(400).json({
                    success: false,
                    error: {
                        code: 'INVALID_REQUEST',
                        message: 'QR code es requerido'
                    }
                });
            }
            const result = await scanService.scanCompleto(qr_code, scanned_at, device_id);
            if (!result.success) {
                return res.status(400).json(result);
            }
            res.json(result);
        }
        catch (error) {
            console.error('Error scanning completo:', error);
            res.status(500).json({
                success: false,
                error: {
                    code: 'SERVER_ERROR',
                    message: 'Error interno del servidor'
                }
            });
        }
    }
    async sorteo(req, res) {
        try {
            const { qr_code, scanned_at, device_id } = req.body;
            if (!qr_code) {
                return res.status(400).json({
                    success: false,
                    error: {
                        code: 'INVALID_REQUEST',
                        message: 'QR code es requerido'
                    }
                });
            }
            const result = await scanService.scanSorteo(qr_code, scanned_at, device_id);
            if (!result.success) {
                return res.status(400).json(result);
            }
            res.json(result);
        }
        catch (error) {
            console.error('Error scanning sorteo:', error);
            res.status(500).json({
                success: false,
                error: {
                    code: 'SERVER_ERROR',
                    message: 'Error interno del servidor'
                }
            });
        }
    }
    async history(req, res) {
        try {
            const { date, mode, limit } = req.query;
            const result = await scanService.getHistory(date, mode, limit ? parseInt(limit) : 50);
            res.json(result);
        }
        catch (error) {
            console.error('Error fetching history:', error);
            res.status(500).json({
                success: false,
                error: {
                    code: 'SERVER_ERROR',
                    message: 'Error interno del servidor'
                }
            });
        }
    }
    async stats(req, res) {
        try {
            const { date } = req.query;
            const result = await scanService.getStats(date);
            res.json(result);
        }
        catch (error) {
            console.error('Error fetching stats:', error);
            res.status(500).json({
                success: false,
                error: {
                    code: 'SERVER_ERROR',
                    message: 'Error interno del servidor'
                }
            });
        }
    }
}
exports.ScanController = ScanController;
