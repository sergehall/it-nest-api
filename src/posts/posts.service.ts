import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import {
  ArrayEmptyObjects,
  QueryArrType,
  QueryPaginationType,
} from '../types/types';
import * as uuid4 from 'uuid4';
import { PaginationDto } from '../infrastructure/common/dto/pagination.dto';
import { Pagination } from '../infrastructure/common/pagination';
import { UsersEntity } from '../users/entities/users.entity';
import { PostsRepository } from './posts.repository';
import { StatusLike } from './enums/posts.enums';
import { BlogsEntity } from '../blogs/entities/blogs.entity';
import { PostsEntity } from './entities/posts.entity';

@Injectable()
export class PostsService {
  constructor(
    protected pagination: Pagination,
    protected postsRepository: PostsRepository,
  ) {}

  async create(createPostDto: CreatePostDto, blogName: string) {
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
        myStatus: StatusLike.NONE,
        newestLikes: [],
      },
    };

    const result = await this.postsRepository.createPost(newPost);
    return {
      id: result.id,
      title: result.title,
      shortDescription: result.shortDescription,
      content: result.content,
      blogId: result.blogId,
      blogName: result.blogName,
      createdAt: result.createdAt,
      extendedLikesInfo: {
        likesCount: result.extendedLikesInfo.likesCount,
        dislikesCount: result.extendedLikesInfo.dislikesCount,
        myStatus: result.extendedLikesInfo.myStatus,
        newestLikes: result.extendedLikesInfo.newestLikes,
      },
    };
  }

  async findAll(queryPagination: PaginationDto, searchFilters: QueryArrType) {
    let field = 'createdAt';
    if (
      queryPagination.sortBy === 'title' ||
      queryPagination.sortBy === 'shortDescription' ||
      queryPagination.sortBy === 'blogName' ||
      queryPagination.sortBy === 'content'
    ) {
      field = queryPagination.sortBy;
    }
    const pagination = await this.pagination.convert(queryPagination, field);
    const totalCount = await this.postsRepository.countDocuments([{}]);
    const pagesCount = Math.ceil(totalCount / queryPagination.pageSize);
    const posts: PostsEntity[] = await this.postsRepository.findPosts(
      pagination,
      searchFilters,
    );
    const pageNumber = queryPagination.pageNumber;
    const pageSize = pagination.pageSize;
    return {
      pagesCount: pagesCount,
      page: pageNumber,
      pageSize: pageSize,
      totalCount: totalCount,
      items: posts,
    };
  }

  async findPostById(postId: string): Promise<PostsEntity | null> {
    return await this.postsRepository.findPostById(postId);
  }

  async findPosts(
    dtoPagination: QueryPaginationType,
    filterBlogId: ArrayEmptyObjects,
    currentUser: UsersEntity | null,
  ) {
    return `This action returns posts`;
  }

  async update(id: string, updatePostDto: UpdatePostDto) {
    return updatePostDto;
  }

  async remove(id: string) {
    return `This action removes a #${id} post`;
  }
}
