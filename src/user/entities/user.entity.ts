import { InternalServerErrorException } from '@nestjs/common';
import {
  Field,
  InputType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { IsEmail, IsEnum, IsString } from 'class-validator';

import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Podcast } from 'src/podcast/entities/podcast.entity';
import { Review } from 'src/podcast/entities/review.entity';
import { Episode } from 'src/podcast/entities/episode.entity';

export enum UserRole {
  Host = 'Host',
  Listener = 'Listener',
}

registerEnumType(UserRole, { name: 'UserRole' });

@InputType('UserInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class User extends CoreEntity {
  @Column()
  @Field(() => String)
  @IsEmail()
  email: string;

  @Column({ select: false })
  @Field(() => String)
  @IsString()
  password: string;

  @Column({ type: 'simple-enum', enum: UserRole })
  @Field(() => UserRole)
  @IsEnum(UserRole)
  role: UserRole;

  @Column({ default: false })
  @Field(() => Boolean)
  emailVerified: boolean;

  @OneToMany(() => Podcast, (podcast) => podcast.creator, { eager: true })
  @Field(() => [Podcast])
  podcasts: Podcast[];

  @OneToMany(() => Review, (review) => review.creator, { eager: true })
  @Field(() => [Review])
  reviews: Review[];

  @ManyToMany(() => Episode, { eager: true })
  @Field(() => [Episode])
  @JoinTable()
  playedEpisodes: Episode[];

  @ManyToMany(() => Podcast, { eager: true })
  @Field(() => [Podcast])
  @JoinTable()
  subscriptions: Podcast[];

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword(): Promise<void> {
    if (!this.password) {
      return;
    }
    try {
      this.password = await bcrypt.hash(this.password, 10);
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException();
    }
  }

  async checkPassword(aPassword: string): Promise<boolean> {
    try {
      const ok = await bcrypt.compare(aPassword, this.password);
      return ok;
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException();
    }
  }
}
