import express from "express";
webPreferences: {
  nodeIntegration: true;
}
import * as fs from "fs";
import * as readline from "readline";
import { data } from "./data/index.js";
let appPath = process.argv[1];
const auth = false; // флаг отвечающий за авторизацию
const admin = false; // флаг отвечающий за наличие прав администратора

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
async function main(params) {
  app.use(express.json());
  app.use(express.urlencoded());
  app.set("view engine", "pug");
  app.get("/", async (req, res) => {
    res.render("login");
  });
  app.get("/main", async (req, res) => {
    res.render("main", { array: data });
  });
  app.get("/register", async (req, res) => {
    res.render("register");
  });
  app.get("/result", function (req, res) {
    res.render("result", { array: array });
  });
  app.post("/register/request", function (req, res) {
    const obj = {};
    try {
      obj.email = req.body.email;
      obj.password = req.body.password;
      obj.admin = false;
      const data = fs.readFileSync("information.txt");
      if (data === undefined) {
        fs.appendFileSync("information.txt", JSON.stringify(obj));
        fs.appendFileSync("information.txt", "\n", function (err) {
          if (err) throw err;
        });
      } else {
        if (data.toString().includes(obj.email) === false) {
          fs.appendFileSync("information.txt", JSON.stringify(obj));
          fs.appendFileSync("information.txt", "\n", function (err) {
            if (err) throw err;
          });
        }
      }
      appPath = errase(appPath);
      res.json({ message: "success" }).status(200);
    } catch (e) {
      console.log(e);
    }
  }); // есть проверка, которая не позваоляет зарегистрароваться ещё одному пользователю по одному и тому же email
  app.post("/login/request", function (req, res) {
    console.log(req.body);
    try {
      var lineReaderS = readline.createInterface({
        input: fs.createReadStream(`information.txt`),
        crlfDelay: Infinity,
      });
      lineReaderS.on("line", (line) => console.log(line));
    } catch (e) {
      console.log(e);
    }
    res.json({ message: "success" }).status(200);
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
    fs.appendFile(appPath, JSON.stringify(obj), function (err) {
      if (err) throw err;
      console.log("Saved!");
    });
    fs.appendFile(appPath, "\n", function (err) {
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
