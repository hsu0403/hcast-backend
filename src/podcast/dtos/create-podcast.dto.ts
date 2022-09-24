import { Field, InputType, Int, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Podcast } from '../entities/podcast.entity';

@InputType()
export class CreatePodcastInput extends PickType(Podcast, [
  'title',
  'category',
  'coverImg',
]) {}

@ObjectType()
export class CreatePodcastOutput extends CoreOutput {
  @Field(() => Int, { nullable: true })
  id?: number;
}
