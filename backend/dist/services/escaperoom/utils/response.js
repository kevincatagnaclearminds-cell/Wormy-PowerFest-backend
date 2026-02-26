"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.error = exports.success = void 0;
const success = (res, data, statusCode = 200) => {
    const response = {
        success: true,
        data,
    };
    return res.status(statusCode).json(response);
};
exports.success = success;
const error = (res, message, statusCode = 400) => {
    const response = {
        success: false,
        error: message,
    };
    return res.status(statusCode).json(response);
};
exports.error = error;
