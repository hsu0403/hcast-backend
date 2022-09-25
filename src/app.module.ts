import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { PodcastModule } from './podcast/podcast.module';
import * as Joi from 'joi';
import { Podcast } from './podcast/entities/podcast.entity';
import { Episode } from './podcast/entities/episode.entity';
import { Review } from './podcast/entities/review.entity';
import { User } from './user/entities/user.entity';
import { Verification } from './user/entities/verification';
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';
import { MailerModule } from '@nestjs-modules/mailer';
import { EmailModule } from './email/email.module';
import { JwtModule } from './jwt/jwt.module';
import { JwtMiddleware } from './jwt/jwt.middleware';
import { AuthModule } from './auth/auth.module';
import { UploadsModule } from './uploads/uploads.module';

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: () => ({
        transport: {
          host: process.env.EMAIL_HOST,
          port: 587,
          auth: {
            user: process.env.EMAIL_AUTH_EMAIL,
            pass: process.env.EMAIL_AUTH_PASSWORD,
          },
        },
        defaults: {
          from: `"${process.env.EMAIL_FROM_USER_NAME}" <${process.env.EMAIL_AUTH_EMAIL}>`,
        },
        preview: true,
        template: {
          dir: __dirname + '/templates',
          adapter: new PugAdapter(),
          options: {
            strict: true,
          },
        },
      }),
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'dev' ? '.env.dev' : '.env.prod',
      ignoreEnvFile: process.env.NODE_ENV === 'production',
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid('dev', 'production').required(),
        DB_HOST: Joi.string(),
        DB_PORT: Joi.string(),
        DB_USERNAME: Joi.string(),
        DB_PASSWORD: Joi.string(),
        DB_NAME: Joi.string(),
        TOKEN_SECRET: Joi.string().required(),
        EMAIL_AUTH_EMAIL: Joi.string().required(),
        EMAIL_AUTH_PASSWORD: Joi.string().required(),
        EMAIL_HOST: Joi.string().required(),
        EMAIL_FROM_USER_NAME: Joi.string().required(),
        AWS_ACCESS_KEY_ID: Joi.string().required(),
        AWS_SECRET_ACCESS_KEY: Joi.string().required(),
      }),
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      sortSchema: true,
      context: ({ req }) => ({ user: req['user'] }),
      playground: process.env.NODE_ENV !== 'production',
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      ...(process.env.DATABASE_URL
        ? { url: process.env.DATABASE_URL }
        : {
            host: process.env.DB_HOST,
            port: +process.env.DB_PORT,
            username: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
          }),
      synchronize: true,
      logging: process.env.NODE_ENV !== 'production',
      entities: [Podcast, Episode, Review, User, Verification],
    }),
    UserModule,
    PodcastModule,
    JwtModule.forRoot({
      privateKey: process.env.TOKEN_SECRET,
    }),
    EmailModule,
    AuthModule,
    UploadsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(JwtMiddleware).forRoutes({
      path: '/graphql',
      method: RequestMethod.POST,
    });
  }
}
