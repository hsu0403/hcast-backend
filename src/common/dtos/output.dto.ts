import { Field, ObjectType } from '@nestjs/graphql';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

@ObjectType()
export class CoreOutput {
  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  error?: string;

  @Field(() => Boolean)
  @IsBoolean()
  ok: boolean;
}
