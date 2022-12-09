import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { BlogsModule } from './blogs/blogs.module';
import { PostsModule } from './posts/posts.module';
import { CommentsModule } from './comments/comments.module';
import { TestingModule } from './testing/testing.module';
import { EmailsModule } from './emails/emails.module';
import { ConfigModule } from './config/config.module';

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
export class AppModule {}
