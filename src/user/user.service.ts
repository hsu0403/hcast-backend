import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Episode } from 'src/podcast/entities/episode.entity';
import { Podcast } from 'src/podcast/entities/podcast.entity';
import { Repository } from 'typeorm';
import {
  CreateAccountInput,
  CreateAccountOutput,
} from './dtos/create-account.dto';
import { LoginInput, LoginOutput } from './dtos/login.dto';
import { User } from './entities/user.entity';
import { UserProfileInput, UserProfileOutput } from './dtos/user-profile.dto';
import { EditProfileInput, EditProfileOutput } from './dtos/edit-profile.dto';
import { Verification } from './entities/verification';
import { VerifyEmailInput, VerifyEmailOutput } from './dtos/verify-email.dto';
import { EmailService } from 'src/email/email.service';
import {
  ToggleSubscribeInput,
  ToggleSubscribeOutput,
} from './dtos/subscribe.dto';
import {
  MarkEpisodePlayedInput,
  MarkEpisodePlayedOutput,
} from './dtos/mark-episode-played.dto';
import {
  ForgotPasswordInput,
  ForgotPasswordOutput,
} from './dtos/forgot-password.dto';
import { JwtService } from 'src/jwt/jwt.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
    @InjectRepository(Podcast) private readonly podcasts: Repository<Podcast>,
    @InjectRepository(Episode) private readonly episodes: Repository<Episode>,
    @InjectRepository(Verification)
    private readonly verification: Repository<Verification>,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
  ) {}

  private readonly InternalServerErrorOutput = {
    ok: false,
    error: 'Internal server error occurred.',
  };

  async createAccount({
    email,
    password,
    role,
  }: CreateAccountInput): Promise<CreateAccountOutput> {
    try {
      const exist = await this.users.findOne({ where: { email } });
      if (exist) {
        return {
          ok: false,
          error: 'There is a user with that email already',
        };
      }
      const newUser = await this.users.save(
        this.users.create({
          email,
          password,
          role,
        }),
      );

      const verify = await this.verification.save(
        this.verification.create({ user: newUser }),
      );

      this.emailService.sendVerificationEmail(newUser.email, verify.code);

      return {
        ok: true,
      };
    } catch (e) {
      return {
        ok: false,
        error: 'Could not create account',
      };
    }
  }

  async login({ email, password }: LoginInput): Promise<LoginOutput> {
    try {
      const user = await this.users.findOne({
        where: { email },
        select: ['id', 'password'],
      });
      if (!user) {
        return { ok: false, error: 'User not found.' };
      }
      const passwordCheck = await user.checkPassword(password);
      if (!passwordCheck) {
        return {
          ok: false,
          error: 'Wrong password',
        };
      }
      const token = this.jwtService.sign(user.id);
      return { ok: true, token };
    } catch (e) {
      return this.InternalServerErrorOutput;
    }
  }

  async findById({ userId }: UserProfileInput): Promise<UserProfileOutput> {
    try {
      const user = await this.users.findOneOrFail({ where: { id: userId } });
      if (!user) {
        return {
          ok: false,
          error: 'User not found.',
        };
      }
      return {
        ok: true,
        user,
      };
    } catch (e) {
      return this.InternalServerErrorOutput;
    }
  }

  async editProfile(
    userId: number,
    { email, password }: EditProfileInput,
  ): Promise<EditProfileOutput> {
    try {
      const user = await this.users.findOne({ where: { id: userId } });
      const existEmail = await this.users.findOne({ where: { email } });
      if (existEmail && user.email !== email) {
        return {
          ok: false,
          error: 'This email already exists.',
        };
      }
      if (email) {
        user.email = email;
        user.emailVerified = false;
        await this.verification.delete({ user: { id: user.id } });
        const verify = await this.verification.save(
          this.verification.create({ user }),
        );
        this.emailService.sendVerificationEmail(user.email, verify.code);
      }
      if (password) user.password = password;
      await this.users.save(user);
      return {
        ok: true,
      };
    } catch (e) {
      return this.InternalServerErrorOutput;
    }
  }

  async forgotPassword({
    email,
  }: ForgotPasswordInput): Promise<ForgotPasswordOutput> {
    try {
      const findAccount = await this.users.findOne({ where: { email } });
      if (!findAccount) {
        return {
          ok: false,
          error: 'Not found account',
        };
      }
      const randomPassword = Math.random().toString(36).substring(2, 12);
      findAccount.password = randomPassword;
      await this.users.save(findAccount);
      this.emailService.sendForgotPassword(email, randomPassword);
      return { ok: true };
    } catch (e) {
      return this.InternalServerErrorOutput;
    }
  }

  async verifyEmail({ code }: VerifyEmailInput): Promise<VerifyEmailOutput> {
    try {
      const verification = await this.verification.findOne({
        where: { code },
        relations: ['user'],
      });
      if (!verification) {
        throw new Error();
      }
      verification.user.emailVerified = true;
      await this.users.save(verification.user);
      await this.verification.delete(verification.id);
      return {
        ok: true,
      };
    } catch (e) {
      return this.InternalServerErrorOutput;
    }
  }

  async toggleSubscribe(
    user: User,
    { podcastId }: ToggleSubscribeInput,
  ): Promise<ToggleSubscribeOutput> {
    try {
      const podcast = await this.podcasts.findOne({ where: { id: podcastId } });
      if (!podcast) {
        return { ok: false, error: 'Podcast not found' };
      }
      if (user.subscriptions.some((sub) => sub.id === podcast.id)) {
        user.subscriptions = user.subscriptions.filter(
          (sub) => sub.id !== podcast.id,
        );
      } else {
        user.subscriptions = [...user.subscriptions, podcast];
      }
      await this.users.save(user);
      return { ok: true };
    } catch (e) {
      return this.InternalServerErrorOutput;
    }
  }

  async markEpisodeAsPlayed(
    user: User,
    { id }: MarkEpisodePlayedInput,
  ): Promise<MarkEpisodePlayedOutput> {
    try {
      const episode = await this.episodes.findOne({
        where: { id },
      });
      if (!episode) {
        return { ok: false, error: 'Episode not found' };
      }
      if (!user.playedEpisodes.some((episode) => episode.id === episode.id)) {
        user.playedEpisodes = [...user.playedEpisodes, episode];
        await this.users.save(user);
      }
      return { ok: true };
    } catch (e) {
      return this.InternalServerErrorOutput;
    }
  }
}
