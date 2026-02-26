"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const errors_1 = require("../../services/escaperoom/utils/errors");
const response_1 = require("../../services/escaperoom/utils/response");
const errorHandler = (err, _req, res, _next) => {
    if (err instanceof errors_1.AppError) {
        return (0, response_1.error)(res, err.message, err.statusCode);
    }
    console.error('Error no manejado:', err);
    return (0, response_1.error)(res, 'Error interno del servidor', 500);
};
exports.errorHandler = errorHandler;
