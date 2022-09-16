import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';

@InputType()
export class ToggleSubscribeInput {
  @Field(() => Number)
  podcastId: number;
}

@ObjectType()
export class ToggleSubscribeOutput extends CoreOutput {}
