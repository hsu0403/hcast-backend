import { Field, InputType, Int, ObjectType, PickType } from '@nestjs/graphql';
import { IsInt, IsOptional } from 'class-validator';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Podcast } from '../entities/podcast.entity';

@InputType()
export class RatingPodcastInput extends PickType(Podcast, ['rating']) {
  @Field(() => Int)
  @IsInt()
  podcastId: number;
}

@ObjectType()
export class RatingPodcastOutput extends CoreOutput {
  @Field(() => Int, { nullable: true })
  @IsInt()
  @IsOptional()
  rating?: number;
}
