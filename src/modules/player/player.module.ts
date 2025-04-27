import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Game } from 'src/entities/Game.entity';
import { Group } from 'src/entities/Group.entity';
import { Player } from 'src/entities/Player.entity';
import { PlayerService } from './player.service';
import { PlayerController } from './player.controller';
import { PlayerRepository } from 'src/repository/player.repository';
import { InGamePlayersRepository } from 'src/repository/inGamePlayers.repository';
import { InGamePlayers } from 'src/entities/InGamePlayers.entity';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forFeature([Game, Player, Group, InGamePlayers]),
  ],
  controllers: [PlayerController],
  providers: [PlayerService, PlayerRepository, InGamePlayersRepository],
})
export class PlayerModule {}
