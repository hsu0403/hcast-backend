import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { IsNumber } from 'class-validator';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Review } from '../entities/review.entity';

@InputType()
export class EditReviewInput extends PickType(Review, ['text']) {
  @Field(() => Number)
  @IsNumber()
  reviewId: number;
}

@ObjectType()
export class EditReviewOutput extends CoreOutput {}
