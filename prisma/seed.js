import { logRegService } from "../services/logReg.service.js";

async function main() {
  await logRegService.prisma.test.deleteMany({});
  await logRegService.prisma.test.createMany({
    data: [
      { text: "ваше имя", answer: "" },
      { text: "ваш пол", answer: "" },
      { text: "ваш возраст", answer: "" },
      { text: "ваш адрес", answer: "" },
      { text: "служил ?", answer: "да" },
      { text: "категория годности", answer: "" },
    ],
  });
}
main()
  .catch((e) => console.error(e))
  .finally(() => logRegService.prisma.$disconnect());
