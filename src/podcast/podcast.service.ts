import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { User } from 'src/user/entities/user.entity';
import { Raw, Repository } from 'typeorm';
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
import {
  EpisodeSearchInput,
  EpisodesOutput,
  GetAllPodcastsOutput,
  GetEpisodeOutput,
  PodcastOutput,
} from './dtos/podcast.dto';
import {
  SearchPodcastsInput,
  SearchPodcastsOutput,
} from './dtos/search-podcasts.dto';
import { UpdateEpisodeInput } from './dtos/update-episode.dto';
import { UpdatePodcastInput } from './dtos/update-podcast.dto';
import { Episode } from './entities/episode.entity';
import { Podcast } from './entities/podcast.entity';
import { Review } from './entities/review.entity';

@Injectable()
export class PodcastService {
  constructor(
    @InjectRepository(Podcast)
    private readonly podcasts: Repository<Podcast>,
    @InjectRepository(Episode)
    private readonly episodes: Repository<Episode>,
    @InjectRepository(Review)
    private readonly reviews: Repository<Review>,
  ) {}

  private readonly InternalServerErrorOutput = {
    ok: false,
    error: 'Internal server error occurred.',
  };

  async getAllPodcasts(): Promise<GetAllPodcastsOutput> {
    try {
      const podcasts = await this.podcasts.find();
      return {
        ok: true,
        podcasts,
      };
    } catch (e) {
      return this.InternalServerErrorOutput;
    }
  }

  async createPodcast(
    creator: User,
    { category, title }: CreatePodcastInput,
  ): Promise<CreatePodcastOutput> {
    try {
      const newCategory = category.trim().toUpperCase();
      const newPodcast = this.podcasts.create({
        title,
        category: newCategory,
      });
      newPodcast.creator = creator;
      const { id } = await this.podcasts.save(newPodcast);
      return {
        ok: true,
        id,
      };
    } catch (e) {
      return this.InternalServerErrorOutput;
    }
  }

  async getPodcast(id: number): Promise<PodcastOutput> {
    try {
      const podcast = await this.podcasts.findOne({
        where: { id },
        relations: ['episodes', 'creator', 'reviews'],
      });
      if (!podcast) {
        return {
          ok: false,
          error: `Podcast with id ${id} not found.`,
        };
      }
      return {
        ok: true,
        podcast,
      };
    } catch (e) {
      return this.InternalServerErrorOutput;
    }
  }

  async deletePodcast(user: User, id: number): Promise<CoreOutput> {
    try {
      const { ok, error, podcast } = await this.getPodcast(id);
      if (!ok) {
        return {
          ok,
          error,
        };
      }
      if (podcast.creator.id !== user.id) {
        return { ok: false, error: 'Not authorized' };
      }
      await this.podcasts.delete({ id });
      return { ok };
    } catch (e) {
      return this.InternalServerErrorOutput;
    }
  }

  async updatePodcast(
    user: User,
    { id, payload }: UpdatePodcastInput,
  ): Promise<CoreOutput> {
    try {
      const { ok, error, podcast } = await this.getPodcast(id);
      if (!ok) {
        return {
          ok,
          error,
        };
      }
      if (podcast.creator.id !== user.id) {
        return { ok: false, error: 'Not authorized' };
      }
      if (
        payload.rating !== null &&
        (payload.rating < 1 || payload.rating > 5)
      ) {
        return {
          ok: false,
          error: 'Rating must be between 1 and 5.',
        };
      } else {
        const updatePodcast: Podcast = { ...podcast, ...payload };
        await this.podcasts.save(updatePodcast);
        return { ok };
      }
    } catch (e) {
      return this.InternalServerErrorOutput;
    }
  }

  async searchPodcasts({
    page,
    titleQuery,
  }: SearchPodcastsInput): Promise<SearchPodcastsOutput> {
    try {
      const [podcasts, totalCount] = await this.podcasts.findAndCount({
        where: { title: Raw((title) => `${title} ILike '%${titleQuery}%'`) },
        take: 25,
        skip: (page - 1) * 25,
      });
      if (!podcasts) {
        return { ok: false, error: 'Could not find podcasts' };
      }
      return {
        ok: true,
        podcasts,
        totalCount,
        totalPages: Math.ceil(totalCount / 25),
      };
    } catch (e) {
      return this.InternalServerErrorOutput;
    }
  }

  async getEpisodes(podcastId: number): Promise<EpisodesOutput> {
    try {
      const { podcast, ok, error } = await this.getPodcast(podcastId);
      if (!ok) {
        return { ok, error };
      }
      return {
        ok,
        episodes: podcast.episodes,
      };
    } catch (e) {
      return this.InternalServerErrorOutput;
    }
  }

  async getEpisode({
    episodeId,
    podcastId,
  }: EpisodeSearchInput): Promise<GetEpisodeOutput> {
    try {
      const { episodes, ok, error } = await this.getEpisodes(podcastId);
      if (!ok) {
        return { ok, error };
      }
      const episode = episodes.find((episode) => episode.id === episodeId);
      if (!episode) {
        return {
          ok: false,
          error: `Episode with id ${episodeId} not found in podcast with id ${podcastId}`,
        };
      }
      return {
        ok: true,
        episode,
      };
    } catch (e) {
      return this.InternalServerErrorOutput;
    }
  }

  async createEpisode(
    user: User,
    { category, podcastId, title }: CreateEpisodeInput,
  ): Promise<CreateEpisodeOutput> {
    try {
      const { ok, error, podcast } = await this.getPodcast(podcastId);
      if (!ok) {
        return { ok, error };
      }
      if (podcast.creator.id !== user.id) {
        return { ok: false, error: 'Not authorized' };
      }
      const newCategory = category.trim().toUpperCase();
      const newEpisode = this.episodes.create({
        title,
        category: newCategory,
      });
      newEpisode.podcast = podcast;
      const { id } = await this.episodes.save(newEpisode);
      return {
        ok: true,
        id,
      };
    } catch (e) {
      return this.InternalServerErrorOutput;
    }
  }

  async deleteEpisode(
    user: User,
    { episodeId, podcastId }: EpisodeSearchInput,
  ): Promise<CoreOutput> {
    try {
      const { ok, episode, error } = await this.getEpisode({
        episodeId,
        podcastId,
      });
      if (!ok) {
        return { ok, error };
      }
      if (episode.podcast.creator.id !== user.id) {
        return { ok: false, error: 'Not authorized' };
      }
      await this.episodes.delete({ id: episode.id });
      return { ok };
    } catch (e) {
      return this.InternalServerErrorOutput;
    }
  }

  async updateEpisode(
    user: User,
    { episodeId, podcastId, ...rest }: UpdateEpisodeInput,
  ): Promise<CoreOutput> {
    try {
      const { ok, episode, error } = await this.getEpisode({
        episodeId,
        podcastId,
      });
      if (!ok) {
        return { ok, error };
      }
      if (episode.podcast.creator.id !== user.id) {
        return { ok: false, error: 'Not authorized' };
      }
      const updatedEpisode = { ...episode, ...rest };
      await this.episodes.save(updatedEpisode);
      return { ok };
    } catch (e) {
      return this.InternalServerErrorOutput;
    }
  }

  async createReview(
    user: User,
    { podcastId, text, parentReviewId }: CreateReviewInput,
  ): Promise<CreateReviewOutput> {
    try {
      const {
        ok,
        error: podcastFindErr,
        podcast,
      } = await this.getPodcast(podcastId);
      if (!ok || podcastFindErr) {
        return { ok: false, error: podcastFindErr };
      }
      const review = this.reviews.create({ text });
      if (parentReviewId) {
        const parentReview = await this.reviews.findOne({
          where: { id: parentReviewId },
        });
        review.parentReview = parentReview;
      }
      review.podcast = podcast;
      review.creator = user;
      const { id } = await this.reviews.save(review);
      return { ok: true, id };
    } catch (e) {
      return this.InternalServerErrorOutput;
    }
  }

  async editReview(
    user: User,
    { reviewId, text }: EditReviewInput,
  ): Promise<EditReviewOutput> {
    try {
      const review = await this.reviews.findOne({
        where: { id: reviewId },
        relations: ['creator'],
      });
      if (!review) {
        return {
          ok: false,
          error: 'Not found review.',
        };
      }
      if (review.creator.id !== user.id) {
        return {
          ok: false,
          error: 'Not allowed',
        };
      }
      const editReview = { ...review, text };
      await this.reviews.save(editReview);
      return {
        ok: true,
      };
    } catch (e) {
      return this.InternalServerErrorOutput;
    }
  }

  async deleteReview(
    user: User,
    { id }: DeleteReviewInput,
  ): Promise<DeleteReviewOutput> {
    try {
      const review = await this.reviews.findOne({
        where: { id },
      });
      if (!review) {
        return {
          ok: false,
          error: 'Not found review.',
        };
      }
      if (review.creator.id !== user.id) {
        return {
          ok: false,
          error: 'Not allowed',
        };
      }
      await this.reviews.delete({ id });
      return { ok: true };
    } catch (e) {
      return this.InternalServerErrorOutput;
    }
  }
}
