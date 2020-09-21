const {
  toDecimal,
  toPercent,
} = require("../../../../src/libraries/commission-fees/helpers/math")

describe("Math Helper", () => {
  test("should return rounded off to placevalue", () => {
    expect(toDecimal(0.056)).toBe("0.06")
    expect(toDecimal(0.053)).toBe("0.05")
    expect(toDecimal(87)).toBe("87.00")
  })

  test("should convert decimal value to percentage value", () => {
    expect(toPercent(0.03)).toBe(0.0003)
    expect(toPercent(2.03)).toBe(0.0203)
  })
})
