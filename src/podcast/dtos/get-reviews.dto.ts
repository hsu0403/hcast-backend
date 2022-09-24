import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { Review } from '../entities/review.entity';
import { PaginationInput, PaginationOutput } from './pagination.dto';

@InputType()
export class GetReviewsInput extends PaginationInput {
  @Field(() => Number)
  podcastId: number;
}

@ObjectType()
export class GetReviewsOutput extends PaginationOutput {
  @Field(() => [Review], { nullable: true })
  reviews?: Review[];
}
