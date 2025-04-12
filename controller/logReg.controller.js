import { Router } from "express";
import { logRegService } from "../services/logReg.service.js";

const router = Router();

router.post("/login/request", async function (req, res) {
  try {
    const user = await logRegService.prisma.user.findUnique({
      where: { username: req.body.email },
    });
    console.log(user);
    if (user.password == req.body.password) {
      logRegService.auth = true;
      logRegService.admin = user.admin;
      res.json({ message: "авторизация прошла успешно" });
    } else {
      res.json({ message: "такого пользователя не существует" }).status(500);
    }
  } catch (e) {
    console.log(e);
    logRegService.auth = false;
    logRegService.admin = false;
    res.json({ message: "ошибка" }).status(500);
  }
});

router.post("/register/request", async function (req, res) {
  try {
    if (req.body.email != "" || req.body.password != "") {
      var newUser = await logRegService.prisma.user.create({
        data: {
          username: req.body.email,
          password: req.body.password,
          admin: false,
        },
      });
      console.log(newUser);
    } else {
      res.json("ошибка");
    }
    res.json("регистрация прола успешно");
  } catch (e) {
    console.log(e);
    res.json({ message: "данный пользователь существует" }).status(500);
  }
});

export const LogRegRouter = router;
