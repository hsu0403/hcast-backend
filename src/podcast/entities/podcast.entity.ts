import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsNumber, IsString, Max, Min } from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';
import { User } from 'src/user/entities/user.entity';
import { Column, Entity, ManyToOne, OneToMany, RelationId } from 'typeorm';
import { Episode } from './episode.entity';
import { Review } from './review.entity';

@InputType('PodcastInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Podcast extends CoreEntity {
  @Column()
  @Field(() => String)
  @IsString()
  title: string;

  @Column()
  @Field(() => String)
  @IsString()
  category: string;

  @Column()
  @Field(() => String)
  @IsString()
  coverImg: string;

  @Column({ default: 0 })
  @Field(() => Number)
  @IsNumber()
  @Min(0)
  @Max(5)
  rating: number;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.podcasts, {
    onDelete: 'CASCADE',
  })
  creator: User;

  @RelationId((podcast: Podcast) => podcast.creator)
  creatorId: number;

  @Field(() => [Episode])
  @OneToMany(() => Episode, (episode) => episode.podcast)
  episodes: Episode[];

  @Field(() => [Review])
  @OneToMany(() => Review, (review) => review.podcast)
  reviews: Review[];
}
