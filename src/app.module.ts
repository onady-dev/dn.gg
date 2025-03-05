import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './configs/typeorm.config';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // true 지정 시 다른 모듈에서 import 하지 않고 바로 사용 가능
      envFilePath: ".env", // 접근 가능한 환경변수 목록
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'db',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'dngg',
      entities: ['dist/entities/*.entity.js'],
      synchronize: true,
      logging: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}