import { InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Episode } from 'src/podcast/entities/episode.entity';

@InputType()
export class MarkEpisodePlayedInput extends PickType(Episode, ['id']) {}

@ObjectType()
export class MarkEpisodePlayedOutput extends CoreOutput {}
