import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Review } from '../entities/review.entity';

@InputType()
export class GetChildReviewsInput {
  @Field(() => Number)
  podcastId: number;
}

@ObjectType()
export class GetChildReviewsOutput extends CoreOutput {
  @Field(() => [Review], { nullable: true })
  reviews?: Review[];

  @Field(() => Number, { nullable: true })
  totalCount?: number;
}
