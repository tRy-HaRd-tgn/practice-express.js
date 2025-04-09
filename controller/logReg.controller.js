import { Router } from "express";
import { LogRegService } from "../services/logReg.service.js";
import readline from "readline";
import * as fs from "fs";

const router = Router();

const logRegService = new LogRegService();

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
    auth = false;
    admin = false;
    res.json({ message: "ошибка" }).status(500);
  }
});

export const LogRegRouter = router;
