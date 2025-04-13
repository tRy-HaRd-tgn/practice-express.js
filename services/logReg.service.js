import * as readline from "readline";
import * as fs from "fs";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
class LogRegService {
  prisma = prisma;

  createUser(user) {
    return this.prisma.user.create({ data: user });
  }
  createTest(test) {
    return this.prisma.test.create({ data: test });
  }

  constructor() {
    this.auth = false; // флаг отвечающий за авторизацию
    this.admin = false; // флаг отвечающий за наличие прав администратора
  }
}
export const logRegService = new LogRegService();
