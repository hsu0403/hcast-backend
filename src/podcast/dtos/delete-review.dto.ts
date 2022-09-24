import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsNumber } from 'class-validator';
import { CoreOutput } from 'src/common/dtos/output.dto';

@InputType()
export class DeleteReviewInput {
  @Field(() => Number)
  @IsNumber()
  reviewId: number;
}

@ObjectType()
export class DeleteReviewOutput extends CoreOutput {}
