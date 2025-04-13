import { logRegService } from "../services/logReg.service";
const validateCreateTest = (data) => {
  try {
    const user = logRegService.prisma.test.create({ data: data });
    return true;
  } catch (e) {
    return e;
  }
};

module.exports = validateCreateTest;
