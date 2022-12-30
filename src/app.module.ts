import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { BlogsModule } from './blogs/blogs.module';
import { PostsModule } from './posts/posts.module';
import { CommentsModule } from './comments/comments.module';
import { TestingModule } from './testing/testing.module';
import { EmailsModule } from './emails/emails.module';
import { LoggerMiddleware } from './logger/middleware';
import { BlogsController } from './blogs/blogs.controller';
import { CommentsController } from './comments/comments.controller';
import { EmailsController } from './emails/emails.controller';
import { PostsController } from './posts/posts.controller';
import { UsersController } from './users/users.controller';
import { CaslModule } from './ability/casl.module';
import { ConfigModule } from '@nestjs/config';
import { SecurityDevicesModule } from './security-devices/security-devices.module';
import { SecurityDevicesController } from './security-devices/security-devices.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [],
    }),
    UsersModule,
    BlogsModule,
    PostsModule,
    CommentsModule,
    TestingModule,
    EmailsModule,
    AuthModule,
    CaslModule,
    SecurityDevicesModule,
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
        SecurityDevicesController,
      );
  }
}
