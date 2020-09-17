import * as file from "../../src/helpers/file"

test("read json file", () => {
  const expected = {
    date: "2016-01-05",
    user_id: 1,
    user_type: "natural",
    type: "cash_in",
    operation: {
      amount: 200,
      currency: "EUR",
    },
  }

  expect(file.readContents("src/mock-data/input.json")).toEqual(expected)
})
