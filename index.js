const models = require("./models");

const file111 = `${process.cwd()}/specs/dr111e16v18.xlsx`;
const file115 = `${process.cwd()}/specs/DR115e15v13.xlsx`;

async function bootstrap() {
  await models.model111(file111);
  await models.model115(file115);
}

bootstrap();
