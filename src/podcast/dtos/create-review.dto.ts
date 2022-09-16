import { Field, InputType, Int, ObjectType, PickType } from '@nestjs/graphql';
import { IsNumber } from 'class-validator';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Review } from '../entities/review.entity';

@InputType()
export class CreateReviewInput extends PickType(Review, ['text']) {
  @Field(() => Number)
  @IsNumber()
  podcastId: number;

  @Field(() => Number, { nullable: true })
  @IsNumber()
  parentReviewId: number;
}

@ObjectType()
export class CreateReviewOutput extends CoreOutput {
  @Field(() => Int, { nullable: true })
  id?: number;
}
