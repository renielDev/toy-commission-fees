"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const file = __importStar(require("./helpers/file"));
const Calculator_1 = require("./libraries/commission-fees/Calculator");
const math_1 = require("./libraries/commission-fees/helpers/math");
const pathToFile = process.argv.slice(2)[0];
const transactions = file.readContents(pathToFile);
const cashInConfig = {
    percents: 0.03,
    max: {
        amount: 5,
        currency: "EUR",
    },
};
const cashOutConfig = {
    percents: 0.3,
    min: {
        amount: 0.5,
        currency: "EUR",
    },
    week_limit: {
        amount: 1000,
        currency: "EUR",
    },
};
const CashInCommission = Calculator_1.CashIn(cashInConfig);
const CashOutCommission = Calculator_1.CashOut(cashOutConfig, transactions);
const commissions = transactions.map((transaction) => {
    if (transaction.type === "cash_in")
        return math_1.toDecimal(CashInCommission.getCommission(transaction), 2);
    return math_1.toDecimal(CashOutCommission.getCommission(transaction), 2);
});
process.stdout.write(commissions.join(" \n"));
//# sourceMappingURL=app.js.map