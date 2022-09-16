import { Field, InputType, Int, ObjectType, PickType } from '@nestjs/graphql';
import { IsInt } from 'class-validator';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Episode } from '../entities/episode.entity';
import { Podcast } from '../entities/podcast.entity';

@ObjectType()
export class GetAllPodcastsOutput extends CoreOutput {
  @Field(() => [Podcast], { nullable: true })
  podcasts?: Podcast[];
}

@InputType()
export class PodcastSearchInput extends PickType(Podcast, ['id']) {}

@ObjectType()
export class PodcastOutput extends CoreOutput {
  @Field(() => Podcast, { nullable: true })
  podcast?: Podcast;
}

@ObjectType()
export class EpisodesOutput extends CoreOutput {
  @Field(() => [Episode], { nullable: true })
  episodes?: Episode[];
}

@InputType()
export class EpisodeSearchInput {
  @Field(() => Int)
  @IsInt()
  podcastId: number;

  @Field(() => Int)
  @IsInt()
  episodeId: number;
}

@ObjectType()
export class GetEpisodeOutput extends CoreOutput {
  @Field(() => Episode, { nullable: true })
  episode?: Episode;
}
