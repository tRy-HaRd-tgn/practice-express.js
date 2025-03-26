import express from "express";
webPreferences: {
  nodeIntegration: true;
}
import * as fs from "fs";
import * as readline from "readline";
import { data } from "./data/index.js";
let appPath = process.argv[1];
var auth = false; // флаг отвечающий за авторизацию
var admin = false; // флаг отвечающий за наличие прав администратора

function errase(appPath) {
  for (let i = appPath.length - 1; i >= 0; i--) {
    if (appPath[i] == "\\") {
      appPath = appPath.slice(0, i + 1);
      break;
    }
  }
  return appPath;
}
appPath = errase(appPath);
async function createFile(dir) {
  fs.appendFile(dir, "", function (err) {
    if (err) throw err;
    console.log("Saved!");
  });
}
var lineReader = readline.createInterface({
  input: fs.createReadStream(`result.txt`),
  crlfDelay: Infinity,
});
const app = express();
var array = [];
let obj = {
  name: "",
  genger: "",
  age: "",
  address: "",
  slyzil: "",
  category: "",
  relation: "",
  mark: 0,
};
for await (const line of lineReader) {
  array.push(line);
}
async function authF() {
  auth = true;
}
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
  }); // есть проверка, которая не позваоляет зарегистрароваться ещё одному пользователю по одному и тому же email
  app.post("/login/request", async function (req, res) {
    try {
      var lineReaderS = readline.createInterface({
        input: fs.createReadStream(`information.txt`),
        crlfDelay: Infinity,
      });
      lineReaderS.on("line", (line) => {
        const str = JSON.parse(line);

        if (
          str.email === req.body.email &&
          str.password === req.body.password
        ) {
          auth = true;
          admin = str.admin;
          res.json({ message: "success" }).status(200);
        }
      });
      lineReaderS.on("close", () => {
        if (auth === false) {
          auth = false;
          admin = false;
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
  app.post("/request", async (req, res) => {
    console.log(req);
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
