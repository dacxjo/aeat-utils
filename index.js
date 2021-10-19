const aeatUtils = require("./utils/index");

const file111 = `${process.cwd()}/models/dr111e16v18.xlsx`;

async function bootstrap() {
  await aeatUtils.model111(file111);
}

bootstrap();
