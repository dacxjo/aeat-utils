import { model111, model115 } from './models';
const file111 = `${process.cwd()}/specs/dr111e16v18.xlsx`;
async function bootstrap() {
  await model111(file111);
  await model115(file111);
}
bootstrap();
