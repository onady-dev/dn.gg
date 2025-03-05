import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  console.log(process.env.NODE_ENV, 'NODE_ENV');
  console.log(process.env.PG_DATABASE, 'PG_DATABASE');
  console.log(process.env.PG_HOST, 'PG_HOST');
  console.log(process.env.PG_PORT, 'PG_PORT');
  console.log(process.env.PG_USERNAME, 'PG_USERNAME');
  console.log(process.env.PG_PASSWORD, 'PG_PASSWORD');
  console.log(process.env.PORT, 'PORT');
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT || 3010);
}
bootstrap();
