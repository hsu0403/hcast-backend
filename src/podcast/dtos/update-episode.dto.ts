import { Field, InputType } from '@nestjs/graphql';
import { IsOptional, IsString } from 'class-validator';
import { EpisodeSearchInput } from './podcast.dto';

@InputType()
export class UpdateEpisodeInput extends EpisodeSearchInput {
  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  readonly title?: string;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  readonly category?: string;
}
