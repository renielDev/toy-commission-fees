"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withWeeklyLimit = exports.withMinimum = exports.withMaximum = void 0;
const commission_1 = require("../helpers/commission");
/**
 * Check if exceeding the max limit
 *
 * @param max
 * @param amount
 *
 * @return {number}
 */
exports.withMaximum = (max, amount) => amount > max ? max : amount;
/**
 * Check if below minimum
 *
 * @param min
 * @param amount
 *
 * @return {number}
 */
exports.withMinimum = (min, amount) => amount < min ? min : amount;
/**
 * Check transaction is below its weekly limit
 * and qualifies for free commission
 *
 * @param limitInWeek
 * @param weeklyTotal
 * @param data
 * @param commission
 *
 * @return {number} - total commissionalble amount
 */
exports.withWeeklyLimit = (limitInWeek, weeklyTotal, transaction) => {
    const key = commission_1.generateWeeklyKey(transaction);
    const amount = transaction.operation.amount;
    if (weeklyTotal.hasOwnProperty(key)) {
        if (weeklyTotal[key] <= limitInWeek)
            return 0;
        if (amount > limitInWeek)
            return amount - limitInWeek;
        return amount;
    }
    return 0;
};
//# sourceMappingURL=index.js.map