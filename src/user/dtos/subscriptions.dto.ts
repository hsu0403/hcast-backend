import { Field, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Podcast } from 'src/podcast/entities/podcast.entity';

@ObjectType()
export class SubscriptionsOutput extends CoreOutput {
  @Field(() => [Podcast], { nullable: true })
  subscriptions?: Podcast[];
}
