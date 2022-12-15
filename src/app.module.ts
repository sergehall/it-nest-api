import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
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
import { AuthModule } from './auth/auth.module';
import { CaslModule } from './ability/casl.module';

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
    AuthModule,
    CaslModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes(
        BlogsController,
        CommentsController,
        PostsController,
        UsersController,
        EmailsController,
      );
  }
}
