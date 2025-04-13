import express from "express";
webPreferences: {
  nodeIntegration: true;
}
import { logRegService } from "./services/logReg.service.js";
import { LogRegRouter } from "./controller/logReg.controller.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();

async function main(params) {
  app.use(express.json());
  app.use(express.urlencoded());
  app.set("view engine", "pug");
  app.get("/", async (req, res) => {
    res.render("login");
  });
  app.get("/main", async (req, res) => {
    const data = await logRegService.prisma.test.findMany({});
    if (logRegService.auth) {
      res.render("main", { array: data });
    } else {
      res.json({ message: "авторизация необходима" }).status(500);
    }
  });
  app.get("/register", async (req, res) => {
    res.render("register");
  });
  app.get("/result", async function (req, res) {
    if (logRegService.auth && logRegService.admin) {
      let array = await logRegService.prisma.result.findMany({});
      for (let i = 0; i < array.length; i++) {
        array[i] = JSON.stringify(array[i].meta);
      }
      console.log(array);

      res.render("result", { array: array });
    } else {
      res.json({ message: "у вас недостаточно прав" }).status(500);
    }
  });
  app.post("/register/request", LogRegRouter);
  app.post("/login/request", LogRegRouter);
  app.post("/request", async (req, res) => {
    try {
      var mark = 0;
      var obj = {};
      for (var i = 0; i < Object.values(req.body).length; i++) {
        const temp = await logRegService.prisma.test.findFirst({
          where: { id: i + 1 },
        });
        if (temp.answer != "") {
          console.log(temp.answer);
          if (req.body[i] === temp.answer) {
            mark++;
          }
        }
        const name = temp.text;
        obj[name] = req.body[i];
      }
    } catch (e) {
      res.json({ message: "ошибка" }).status(500);
    }
    obj.mark = mark;

    const test = await logRegService.prisma.result.create({
      data: {
        meta: obj,
      },
    });
    res.json({ message: "success" }).status(200);
  });
  app.listen(process.env.SERVER_PORT, () => {
    console.log(
      `server started on port ${process.env.SERVER_PORT}`,
      `http://localhost:${process.env.SERVER_PORT}`
    );
  });
  app.all("*", function (req, res) {
    res.status(404).send("404 Not Found");
  });
}

main()
  .then(async () => {
    await logRegService.prisma.$connect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
