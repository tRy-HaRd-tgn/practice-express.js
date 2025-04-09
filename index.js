import express from "express";
webPreferences: {
  nodeIntegration: true;
}
import { LogRegService } from "./services/logReg.service.js";
import * as fs from "fs";
import { data } from "./data/index.js";
import { LogRegRouter } from "./controller/logReg.controller.js";

const app = express();
const logRegService = new LogRegService();

async function main(params) {
  app.use(express.json());
  app.use(express.urlencoded());
  app.set("view engine", "pug");
  app.get("/", async (req, res) => {
    res.render("login");
  });
  app.get("/main", async (req, res) => {
    if (auth) res.render("main", { array: data });
  });
  app.get("/register", async (req, res) => {
    res.render("register");
  });
  app.get("/result", function (req, res) {
    if (auth && admin) {
      res.render("result", { array: array });
    } else {
      res.json({ message: "у вас недостаточно прав" }).status(500);
    }
  });
  app.post("/register/request", function (req, res) {
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
      appPath = errase(appPath);
    } catch (e) {
      console.log(e);
    }
  }); // есть проверка, которая не позволяет зарегистрароваться ещё одному пользователю по одному и тому же email
  app.post("/login/request", LogRegRouter);
  app.post("/request", async (req, res) => {
    let i = 0;
    for (var key in obj) {
      obj[key] = req.body[i];
      ++i;
    }
    if (
      obj.relation == "да" ||
      obj.relation == "обожаю" ||
      obj.relation == "люблю" ||
      obj.relation == "поддерживаю" ||
      obj.relation == "yes"
    ) {
      obj["mark"] = 1;
    } else {
      obj["mark"] = 0;
    }
    console.log(req.body);
    createFile("result.txt");
    appPath += "result.txt";
    fs.appendFileSync(appPath, JSON.stringify(obj), function (err) {
      if (err) throw err;
      console.log("Saved!");
    });
    fs.appendFileSync(appPath, "\n", function (err) {
      if (err) throw err;
    });
    appPath = errase(appPath);
    res.json({ message: "success" }).status(200);
  });
  app.listen(3000, () => {
    console.log("сервер запущен на порте 3000", "http://localhost:3000");
  });
}

main();
