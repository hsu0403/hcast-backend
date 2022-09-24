import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Episode } from './entities/episode.entity';
import { Podcast } from './entities/podcast.entity';
import { Review } from './entities/review.entity';
import {
  EpisodeResolver,
  PodacstResolver,
  ReviewResolver,
} from './podcast.resolver';
import { PodcastService } from './podcast.service';

@Module({
  imports: [TypeOrmModule.forFeature([Podcast, Episode, Review])],
  providers: [PodacstResolver, PodcastService, EpisodeResolver, ReviewResolver],
})
export class PodcastModule {}
