const validateValue = require("./validateValue");

test("валидация значения", () => {
  expect(validateValue(55)).toBe(true);
});
