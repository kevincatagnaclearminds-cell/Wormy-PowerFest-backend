"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchUserByEmail = exports.registerMultipleUsers = exports.registerUser = void 0;
const user_service_1 = require("./user.service");
const response_1 = require("../../services/escaperoom/utils/response");
const asyncHandler_1 = require("../../middleware/escaperoom/asyncHandler");
const userService = new user_service_1.UserService();
exports.registerUser = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const user = await userService.createUser(req.body);
    return (0, response_1.success)(res, user, 201);
});
exports.registerMultipleUsers = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const users = await userService.createMultipleUsers(req.body);
    return (0, response_1.success)(res, users, 201);
});
exports.searchUserByEmail = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { email } = req.query;
    if (!email || typeof email !== 'string') {
        return res.status(400).json({
            success: false,
            error: 'Email es requerido',
        });
    }
    const user = await userService.getUserByEmail(email);
    if (!user) {
        return res.status(404).json({
            success: false,
            error: 'Usuario no encontrado',
        });
    }
    return (0, response_1.success)(res, user);
});
