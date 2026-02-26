"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const zod_1 = require("zod");
const response_1 = require("../../services/escaperoom/utils/response");
const validate = (schema) => {
    return async (req, res, next) => {
        try {
            await schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params,
            });
            next();
        }
        catch (err) {
            if (err instanceof zod_1.ZodError) {
                const messages = err.issues.map((e) => e.message).join(', ') || 'Error de validación';
                return (0, response_1.error)(res, messages, 400);
            }
            console.error('Error en validación:', err);
            return (0, response_1.error)(res, 'Error de validación', 400);
        }
    };
};
exports.validate = validate;
