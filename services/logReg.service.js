import * as readline from "readline";
import * as fs from "fs";
export class LogRegService {
  errase(appPath) {
    for (let i = appPath.length - 1; i >= 0; i--) {
      if (appPath[i] == "\\") {
        appPath = appPath.slice(0, i + 1);
        break;
      }
    }
    return appPath;
  }
  async createFile(dir) {
    fs.appendFile(dir, "", function (err) {
      if (err) throw err;
      console.log("Saved!");
    });
  }

  async readLines() {
    const lineReader = readline.createInterface({
      input: fs.createReadStream("result.txt"),
      crlfDelay: Infinity,
    });

    for await (const line of lineReader) {
      this.array.push(line);
    }
  }

  constructor() {
    this.auth = false; // флаг отвечающий за авторизацию
    this.admin = false; // флаг отвечающий за наличие прав администратора
    this.appPath = process.argv[1];
    this.appPath = this.errase(this.appPath);
    this.array = [];
    this.obj = {
      name: "",
      genger: "",
      age: "",
      address: "",
      slyzil: "",
      category: "",
      relation: "",
      mark: 0,
    };
    this.lineReader = readline.createInterface({
      input: fs.createReadStream(`result.txt`),
      crlfDelay: Infinity,
    });
    this.readLines();
  }
}
