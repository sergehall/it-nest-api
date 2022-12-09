import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { BlogsModule } from './blogs/blogs.module';
import { PostsModule } from './posts/posts.module';
import { CommentsModule } from './comments/comments.module';
import { TestingModule } from './testing/testing.module';
import { EmailsModule } from './emails/emails.module';
import { ConfigModule } from './config/config.module';
import { LoggerMiddleware } from './logger/middleware';
import { BlogsController } from './blogs/blogs.controller';
import { CommentsController } from './comments/comments.controller';
import { EmailsController } from './emails/emails.controller';
import { PostsController } from './posts/posts.controller';
import { UsersController } from './users/users.controller';

@Module({
  imports: [
    ConfigModule.forRootAsync({
      useFactory: () => {
        return {
          folder: './config',
        };
      },
      inject: [],
    }),
    UsersModule,
    BlogsModule,
    PostsModule,
    CommentsModule,
    TestingModule,
    EmailsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .exclude({ path: '/(.*)', method: RequestMethod.GET })
      .forRoutes(
        BlogsController,
        CommentsController,
        PostsController,
        UsersController,
        EmailsController,
      );
  }
}
