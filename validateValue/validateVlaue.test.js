const validateCreateTest = require("./validateCreateTest");

test("валидация значения", () => {
  expect(validateCreateTest({ text: "ваше имя" })).toBe(true);
});
