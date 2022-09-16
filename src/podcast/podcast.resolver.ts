import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { User } from 'src/user/entities/user.entity';
import {
  CreateEpisodeInput,
  CreateEpisodeOutput,
} from './dtos/create-episode.dto';
import {
  CreatePodcastInput,
  CreatePodcastOutput,
} from './dtos/create-podcast.dto';
import {
  CreateReviewInput,
  CreateReviewOutput,
} from './dtos/create-review.dto';
import {
  DeleteReviewInput,
  DeleteReviewOutput,
} from './dtos/delete-review.dto';
import { EditReviewInput, EditReviewOutput } from './dtos/edit-review.dto';
import { CoreOutput } from '../common/dtos/output.dto';
import {
  EpisodeSearchInput,
  EpisodesOutput,
  GetAllPodcastsOutput,
  PodcastOutput,
  PodcastSearchInput,
} from './dtos/podcast.dto';
import {
  SearchPodcastsInput,
  SearchPodcastsOutput,
} from './dtos/search-podcasts.dto';
import { UpdateEpisodeInput } from './dtos/update-episode.dto';
import { UpdatePodcastInput } from './dtos/update-podcast.dto';
import { Episode } from './entities/episode.entity';
import { PodcastService } from './podcast.service';
import { Role } from 'src/auth/role.decorator';
import { AuthUser } from 'src/auth/auth-user.decorator';

@Resolver()
export class PodacstResolver {
  constructor(private readonly podcastService: PodcastService) {}

  @Query(() => GetAllPodcastsOutput)
  @Role(['Any'])
  getAllPodcasts(): Promise<GetAllPodcastsOutput> {
    return this.podcastService.getAllPodcasts();
  }

  @Mutation(() => CreatePodcastOutput)
  @Role(['Host'])
  createPodcast(
    @AuthUser() user: User,
    @Args('input') createPodcastInput: CreatePodcastInput,
  ): Promise<CreatePodcastOutput> {
    return this.podcastService.createPodcast(user, createPodcastInput);
  }

  @Query(() => PodcastOutput)
  @Role(['Any'])
  getPodcast(
    @Args('input') podcastSearchInput: PodcastSearchInput,
  ): Promise<PodcastOutput> {
    return this.podcastService.getPodcast(podcastSearchInput.id);
  }

  @Mutation(() => CoreOutput)
  @Role(['Host'])
  deletePodcast(
    @AuthUser() user: User,
    @Args('input') podcastSearchInput: PodcastSearchInput,
  ): Promise<CoreOutput> {
    return this.podcastService.deletePodcast(user, podcastSearchInput.id);
  }

  @Mutation(() => CoreOutput)
  @Role(['Host'])
  updatePodcast(
    @AuthUser() user: User,
    @Args('input') updatePodcastInput: UpdatePodcastInput,
  ): Promise<CoreOutput> {
    return this.podcastService.updatePodcast(user, updatePodcastInput);
  }

  @Query(() => SearchPodcastsOutput)
  @Role(['Listener'])
  searchPodcasts(
    @Args('input') searchPodcastsInput: SearchPodcastsInput,
  ): Promise<SearchPodcastsOutput> {
    return this.podcastService.searchPodcasts(searchPodcastsInput);
  }
}

@Resolver(() => Episode)
export class EpisodeResolver {
  constructor(private readonly podcastService: PodcastService) {}

  @Query(() => EpisodesOutput)
  @Role(['Any'])
  getEpisodes(
    @Args('input') podcastSearchInput: PodcastSearchInput,
  ): Promise<EpisodesOutput> {
    return this.podcastService.getEpisodes(podcastSearchInput.id);
  }

  @Mutation(() => CreateEpisodeOutput)
  @Role(['Host'])
  createEpisode(
    @AuthUser() user: User,
    @Args('input') createEpisodeInput: CreateEpisodeInput,
  ): Promise<CreateEpisodeOutput> {
    return this.podcastService.createEpisode(user, createEpisodeInput);
  }

  @Mutation(() => CoreOutput)
  @Role(['Host'])
  updateEpisode(
    @AuthUser() user: User,
    @Args('input') updateEpisodeInput: UpdateEpisodeInput,
  ): Promise<CoreOutput> {
    return this.podcastService.updateEpisode(user, updateEpisodeInput);
  }

  @Mutation(() => CoreOutput)
  @Role(['Host'])
  deleteEpisode(
    @AuthUser() user: User,
    @Args('input') episodesSearchInput: EpisodeSearchInput,
  ): Promise<CoreOutput> {
    return this.podcastService.deleteEpisode(user, episodesSearchInput);
  }
}

@Resolver()
export class ReviewResolver {
  constructor(private readonly podcastService: PodcastService) {}

  @Query(() => EpisodesOutput)
  @Role(['Any'])
  getEpisodes(
    @Args('input') podcastSearchInput: PodcastSearchInput,
  ): Promise<EpisodesOutput> {
    return this.podcastService.getEpisodes(podcastSearchInput.id);
  }

  @Mutation(() => CreateReviewOutput)
  @Role(['Any'])
  createReview(
    @AuthUser() user: User,
    @Args('input') createReviewInput: CreateReviewInput,
  ): Promise<CreateReviewOutput> {
    return this.podcastService.createReview(user, createReviewInput);
  }

  @Mutation(() => EditReviewOutput)
  @Role(['Any'])
  editReview(
    @AuthUser() user: User,
    @Args('input') editReviewInput: EditReviewInput,
  ): Promise<EditReviewOutput> {
    return this.podcastService.editReview(user, editReviewInput);
  }

  @Mutation(() => DeleteReviewOutput)
  @Role(['Any'])
  deleteReview(
    @AuthUser() user: User,
    @Args('input') deleteReviewInput: DeleteReviewInput,
  ): Promise<EditReviewOutput> {
    return this.podcastService.deleteReview(user, deleteReviewInput);
  }
}
