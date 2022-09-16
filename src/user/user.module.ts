import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Episode } from 'src/podcast/entities/episode.entity';
import { Podcast } from 'src/podcast/entities/podcast.entity';
import { User } from './entities/user.entity';
import { Verification } from './entities/verification';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Podcast, Episode, Verification])],
  providers: [UserService, UserResolver],
  exports: [UserService],
})
export class UserModule {}
