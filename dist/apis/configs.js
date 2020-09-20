"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cashIn = exports.cashOut = void 0;
const axios_1 = __importDefault(require("axios"));
const BASE_URL = "http://private-38e18c-uzduotis.apiary-mock.com/";
exports.cashOut = (type) => {
    return axios_1.default.get(`${BASE_URL}config/cash-out/${type}`);
};
exports.cashIn = () => {
    return axios_1.default.get(`${BASE_URL}config/cash-in`);
};
//# sourceMappingURL=configs.js.map