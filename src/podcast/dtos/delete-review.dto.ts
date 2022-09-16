import { InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Review } from '../entities/review.entity';

@InputType()
export class DeleteReviewInput extends PickType(Review, ['id']) {}

@ObjectType()
export class DeleteReviewOutput extends CoreOutput {}
