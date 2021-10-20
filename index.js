const models = require("./models");

const file111 = `${process.cwd()}/specs/dr111e16v18.xlsx`;

async function bootstrap() {
  await models.model111(file111);
}

bootstrap();
