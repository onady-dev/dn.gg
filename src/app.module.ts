import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupModule } from './modules/group/group.module';
import { LoggerMiddleware } from './middlewares/logger.middleware';
import { WinstonModule } from 'nest-winston';
import { GameModule } from './modules/game/game.module';
import { LogitemModule } from './modules/logitem/logitem.module';
import { PlayerModule } from './modules/player/player.module';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from './httpExceptionFilter';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // true 지정 시 다른 모듈에서 import 하지 않고 바로 사용 가능
      envFilePath: ".env", // 접근 가능한 환경변수 목록
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'dngg',
      entities: ['dist/entities/*.entity.js'],
      autoLoadEntities: true,
      synchronize: true,
      logging: false,
    }),
    WinstonModule.forRoot({
      level: 'info',
    }),
    GroupModule,
    GameModule,
    LogitemModule,
    PlayerModule,
  ],
  controllers: [],
  providers: [    
    // {
    //   provide: APP_FILTER,
    //   useClass: HttpExceptionFilter,
    // },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    // 로깅
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}