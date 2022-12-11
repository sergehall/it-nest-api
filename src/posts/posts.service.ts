import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import {
  ArrayEmptyObjects,
  QueryPaginationType,
  UserType,
} from '../types/types';
import * as uuid4 from 'uuid4';

@Injectable()
export class PostsService {
  async create(createPostDto: CreatePostDto, blogName: string) {
    console.log(createPostDto, blogName);
    const newPost = {
      id: uuid4().toString(),
      title: createPostDto.title,
      shortDescription: createPostDto.shortDescription,
      content: createPostDto.content,
      blogId: createPostDto.blogId,
      blogName: blogName,
      createdAt: new Date().toISOString(),
      extendedLikesInfo: {
        likesCount: 0,
        dislikesCount: 0,
        myStatus: 'None',
        newestLikes: [],
      },
    };
    return newPost;
  }

  async findAll() {
    return `This action returns all posts`;
  }

  async findOne(id: number) {
    return `This action returns a #${id} post`;
  }

  async findPosts(
    dtoPagination: QueryPaginationType,
    filterBlogId: ArrayEmptyObjects,
    currentUser: UserType | null,
  ) {
    return `This action returns posts`;
  }

  async update(id: number, updatePostDto: UpdatePostDto) {
    return `This action updates a #${id} post`;
  }

  async remove(id: number) {
    return `This action removes a #${id} post`;
  }
}
