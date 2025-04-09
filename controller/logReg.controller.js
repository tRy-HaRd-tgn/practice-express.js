import { Router } from "express";
import { logRegService } from "../services/logReg.service.js";
import readline from "readline";
import * as fs from "fs";
const router = Router();

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
    const data = fs.readFileSync("information.txt");
    if (data?.toString().includes(obj.email) === false) {
      fs.appendFileSync("information.txt", JSON.stringify(obj));
      fs.appendFileSync("information.txt", "\n", function (err) {
        if (err) throw err;
      });
      res.json({ message: "success" }).status(200);
    } else {
      res.json({ message: "пользователь уже существует" }).status(200);
    }
    logRegService.appPath = logRegService.errase(logRegService.appPath);
  } catch (e) {
    console.log(e);
  }
}); // есть проверка, которая не позволяет зарегистрароваться ещё одному пользователю по одному и тому же email

export const LogRegRouter = router;
