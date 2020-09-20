"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.computeCommission = exports.getWeeklyTotalByUser = exports.generateWeeklyKey = void 0;
const moment_1 = __importDefault(require("moment"));
const math_1 = require("./math");
/**
 * Generate key based on the transaction date and user
 * @param data
 * @return {string}
 */
exports.generateWeeklyKey = (data) => {
    const date = moment_1.default(data.date);
    const year = date.year();
    // subtract 1 day to count monday as starting week instead of sunday
    const week = date.subtract(1, "day").week();
    return `${data.user_id}-${year}-${week}-${data.type}`;
};
/**
 * Get weekly total by each user
 *
 * @param data - all data transaction
 * @return {object} - users and its weekly total per year
 */
exports.getWeeklyTotalByUser = (data) => {
    const weeklyTotal = data.reduce((acc, curr) => {
        const key = exports.generateWeeklyKey(curr);
        if (acc.hasOwnProperty(key)) {
            acc[key] += curr.operation.amount;
            return acc;
        }
        return Object.assign(Object.assign({}, acc), { [key]: curr.operation.amount });
    }, {});
    return weeklyTotal;
};
/**
 * Calculate the commission based on the percentage on total amount
 *
 * @param amount
 * @param percentage
 *
 * @return {number}
 */
exports.computeCommission = (amount, percentage) => amount * math_1.toPercent(percentage);
//# sourceMappingURL=commission.js.map