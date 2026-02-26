"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateAnswers = exports.getQuestions = void 0;
const trivia_service_1 = require("./trivia.service");
const asyncHandler_1 = require("../../middleware/escaperoom/asyncHandler");
const response_1 = require("../../services/escaperoom/utils/response");
const triviaService = new trivia_service_1.TriviaService();
exports.getQuestions = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const questions = await triviaService.getQuestions();
    return (0, response_1.success)(res, questions);
});
exports.validateAnswers = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const result = await triviaService.validateAnswers(req.body);
    return (0, response_1.success)(res, result);
});
