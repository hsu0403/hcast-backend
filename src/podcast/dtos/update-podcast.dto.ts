import { Field, InputType, PartialType, PickType } from '@nestjs/graphql';
import { Podcast } from '../entities/podcast.entity';

@InputType()
export class UpdatePodcastPayload extends PartialType(
  PickType(Podcast, ['title', 'category', 'rating']),
) {}

@InputType()
export class UpdatePodcastInput extends PickType(Podcast, ['id']) {
  @Field(() => UpdatePodcastPayload)
  payload: UpdatePodcastPayload;
}
