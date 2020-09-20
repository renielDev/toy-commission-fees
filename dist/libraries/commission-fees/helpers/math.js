"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toDecimal = exports.toPercent = void 0;
/**
 * Convert decimal to percentage
 *
 * @param number
 * @return {number}
 */
exports.toPercent = (number) => number / 100;
exports.toDecimal = (num = 0, decimalPlace = 2) => num.toFixed(decimalPlace);
//# sourceMappingURL=math.js.map