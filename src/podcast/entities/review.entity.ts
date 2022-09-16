import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsString } from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';
import { User } from 'src/user/entities/user.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { Podcast } from './podcast.entity';

@InputType('ReviewInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Review extends CoreEntity {
  @Column()
  @Field(() => String)
  @IsString()
  text: string;

  @ManyToOne(() => Review, (review) => review.childReview, {
    onDelete: 'CASCADE',
  })
  @Field(() => Review, { nullable: true })
  parentReview?: Review;

  @OneToMany(() => Review, (review) => review.parentReview)
  @Field(() => [Review], { nullable: true })
  childReview?: Review[];

  @ManyToOne(() => Podcast, (podcast) => podcast.reviews, {
    onDelete: 'CASCADE',
  })
  @Field(() => Podcast)
  podcast: Podcast;

  @ManyToOne(() => User, (user) => user.reviews, {
    onDelete: 'CASCADE',
  })
  @Field(() => User)
  creator: User;
}
