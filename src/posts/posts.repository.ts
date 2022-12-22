import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { PostsEntity } from './entities/posts.entity';
import { Model } from 'mongoose';
import { PostDocument } from './schemas/posts.schema';

@Injectable()
export class PostsRepository {
  constructor(
    @Inject('POST_MODEL')
    private postsModel: Model<PostDocument>,
  ) {}
  async createPost(postsEntity: PostsEntity): Promise<PostsEntity> {
    try {
      return await this.postsModel.create(postsEntity);
    } catch (error) {
      throw new ForbiddenException(error.message);
    }
  }
}
