"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CashOut = exports.CashIn = void 0;
const compose_function_1 = __importDefault(require("compose-function"));
const commission_1 = require("./helpers/commission");
const enhancers_1 = require("./enhancers");
function CashIn(config) {
    return {
        getCommission: (data) => {
            const max = config.max.amount;
            const enhanced = compose_function_1.default((commission) => enhancers_1.withMaximum(max, commission), () => commission_1.computeCommission(data.operation.amount, config.percents));
            return enhanced();
        },
    };
}
exports.CashIn = CashIn;
function CashOut(config, transactions) {
    const weeklyTotal = commission_1.getWeeklyTotalByUser(transactions);
    const computeNatural = (transaction) => {
        const limit = config.week_limit.amount;
        const enhanced = compose_function_1.default(
        // (commission: number) =>
        //   withLessWeeklyLimit(commission, limit, config.percents),
        (totalCommissionableAmount) => commission_1.computeCommission(totalCommissionableAmount, config.percents), () => enhancers_1.withWeeklyLimit(limit, weeklyTotal, transaction));
        return enhanced();
    };
    const computeJuridical = (transaction) => {
        const min = config.min.amount;
        const enhanced = compose_function_1.default((commission) => enhancers_1.withMinimum(min, commission), () => commission_1.computeCommission(transaction.operation.amount, config.percents));
        return enhanced();
    };
    const calculator = (type) => {
        if (type === "natural")
            return computeNatural;
        return computeJuridical;
    };
    return {
        getCommission: (data) => {
            const commissionCalculator = calculator(data.user_type);
            return commissionCalculator(data);
        },
    };
}
exports.CashOut = CashOut;
exports.default = {
    CashIn,
    CashOut,
};
//# sourceMappingURL=Calculator.js.map