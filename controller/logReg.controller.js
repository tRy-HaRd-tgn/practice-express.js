import { Router } from "express";
import { logRegService } from "../services/logReg.service.js";
import { PrismaClient } from "@prisma/client";
import readline from "readline";
import * as fs from "fs";
const router = Router();
const prisma = new PrismaClient();

router.post("/login/request", async function (req, res) {
  try {
    var lineReaderS = readline.createInterface({
      input: fs.createReadStream(`information.txt`),
      crlfDelay: Infinity,
    });
    lineReaderS.on("line", (line) => {
      const str = JSON.parse(line);

      if (str.email === req.body.email && str.password === req.body.password) {
        logRegService.auth = true;
        logRegService.admin = str.admin;
        console.log(logRegService.auth);
        res.json({ message: "success" }).status(200);
      }
    });
    lineReaderS.on("close", () => {
      if (logRegService.auth === false) {
        logRegService.auth = false;
        logRegService.admin = false;
        res.json({ message: "пользователя не существует" }).status(200);
      }
    });
  } catch (e) {
    console.log(e);
    logRegService.auth = false;
    logRegService.admin = false;
    res.json({ message: "ошибка" }).status(500);
  }
});

router.post("/register/request", async function (req, res) {
  const obj = {};
  try {
    obj.email = req.body.email;
    obj.password = req.body.password;
    obj.admin = false;
    const newUser = await prisma.user.create({
      data: {
        email: req.body.email,
        password: req.body.password,
        admin: false,
      },
    });
    res.json(newUser);
  } catch (e) {
    console.log(e);
  }
});

export const LogRegRouter = router;
