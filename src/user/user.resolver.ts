import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { Role } from 'src/auth/role.decorator';
import { Podcast } from 'src/podcast/entities/podcast.entity';
import {
  CreateAccountInput,
  CreateAccountOutput,
} from './dtos/create-account.dto';
import { EditProfileInput, EditProfileOutput } from './dtos/edit-profile.dto';
import {
  ForgotPasswordInput,
  ForgotPasswordOutput,
} from './dtos/forgot-password.dto';
import { LoginInput, LoginOutput } from './dtos/login.dto';
import {
  MarkEpisodePlayedInput,
  MarkEpisodePlayedOutput,
} from './dtos/mark-episode-played.dto';
import {
  ToggleSubscribeInput,
  ToggleSubscribeOutput,
} from './dtos/subscribe.dto';
import { UserProfileInput, UserProfileOutput } from './dtos/user-profile.dto';
import { VerifyEmailInput, VerifyEmailOutput } from './dtos/verify-email.dto';
import { User } from './entities/user.entity';
import { UserService } from './user.service';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Mutation(() => CreateAccountOutput)
  createAccount(
    @Args('input') createAccountInput: CreateAccountInput,
  ): Promise<CreateAccountOutput> {
    return this.userService.createAccount(createAccountInput);
  }

  @Mutation(() => LoginOutput)
  login(@Args('input') loginInput: LoginInput): Promise<LoginOutput> {
    return this.userService.login(loginInput);
  }

  @Mutation(() => ForgotPasswordOutput)
  forgotPassword(
    @Args('input') forgotPasswordInput: ForgotPasswordInput,
  ): Promise<ForgotPasswordOutput> {
    return this.userService.forgotPassword(forgotPasswordInput);
  }

  @Query(() => User)
  @Role(['Any'])
  me(@AuthUser() user: User) {
    return user;
  }

  @Query(() => UserProfileOutput)
  @Role(['Any'])
  seeProfile(
    @Args('input') userProfileInput: UserProfileInput,
  ): Promise<UserProfileOutput> {
    return this.userService.findById(userProfileInput);
  }

  @Mutation(() => EditProfileOutput)
  @Role(['Any'])
  editProfile(
    @AuthUser() user: User,
    @Args('input') editProfileInput: EditProfileInput,
  ): Promise<EditProfileOutput> {
    return this.userService.editProfile(user.id, editProfileInput);
  }

  @Mutation(() => VerifyEmailOutput)
  verifyEmail(
    @Args('input') verifyEmailInput: VerifyEmailInput,
  ): Promise<VerifyEmailOutput> {
    return this.userService.verifyEmail(verifyEmailInput);
  }

  @Mutation(() => ToggleSubscribeOutput)
  @Role(['Listener'])
  toggleSubscribe(
    @AuthUser() user: User,
    @Args('input') toggleSubscribeInput: ToggleSubscribeInput,
  ): Promise<ToggleSubscribeOutput> {
    return this.userService.toggleSubscribe(user, toggleSubscribeInput);
  }

  @Query(() => [Podcast])
  @Role(['Listener'])
  subscriptions(@AuthUser() user: User): Podcast[] {
    return user.subscriptions;
  }

  @Mutation(() => MarkEpisodePlayedOutput)
  @Role(['Listener'])
  markEpisodeAsPlayed(
    @AuthUser() user: User,
    @Args('input') markEpisodePlayedInput: MarkEpisodePlayedInput,
  ): Promise<MarkEpisodePlayedOutput> {
    return this.userService.markEpisodeAsPlayed(user, markEpisodePlayedInput);
  }
}
