import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { ArrayEmptyObjects, QueryPaginationType } from '../types/types';
import * as uuid4 from 'uuid4';
import { PaginationDto } from '../infrastructure/common/dto/pagination.dto';
import { Pagination } from '../infrastructure/common/pagination';
import { UsersEntity } from '../users/entities/users.entity';
import { PostsRepository } from './posts.repository';
import { StatusLike } from './enums/posts.enums';

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
    const createPost = await this.postsRepository.createPost(newPost);
    return newPost;
  }

  async findAll(queryPagination: PaginationDto) {
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
    const pageNumber = queryPagination.pageNumber;
    const pageSize = pagination.pageSize;
    // const totalCount = await this.postsRepository.countDocuments([{}])
    // const pagesCount = Math.ceil(totalCount / pageSize)
    const totalCount = 0;
    const pagesCount = 0;
    return {
      pagesCount: pagesCount,
      page: pageNumber,
      pageSize: pageSize,
      totalCount: totalCount,
      items: [],
    };
  }

  async findOne(id: string) {
    return `This action returns a #${id} post`;
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
