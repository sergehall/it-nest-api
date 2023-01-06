import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Query,
  HttpException,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { CreateBlogsDto } from './dto/create-blogs.dto';
import { ParseQuery } from '../infrastructure/common/parse-query/parse-query';
import { QueryPaginationType } from '../types/types';
import { PostsService } from '../posts/posts.service';
import { PaginationDto } from '../infrastructure/common/pagination/dto/pagination.dto';
import { PaginationTypes } from '../infrastructure/common/pagination/types/pagination.types';
import { BlogsEntity } from './entities/blogs.entity';
import { UsersEntity } from '../users/entities/users.entity';
import { CreatePostByBlogIdDto } from '../posts/dto/create-post-blogid.dto';
import { currentUserInst } from '../current-user/current-user';
import { BaseAuthGuard } from '../auth/guards/base-auth.guard';
import { statusCode } from '../logger/status-code.enum';

@Controller('blogs')
export class BlogsController {
  constructor(
    protected blogsService: BlogsService,
    protected postsService: PostsService,
  ) {}

  @Get()
  async findAll(@Query() query: any): Promise<PaginationTypes> {
    const paginationData = ParseQuery.getPaginationData(query);
    const searchFilters = { searchNameTerm: paginationData.searchNameTerm };
    const queryPagination: PaginationDto = {
      pageNumber: paginationData.pageNumber,
      pageSize: paginationData.pageSize,
      sortBy: paginationData.sortBy,
      sortDirection: paginationData.sortDirection,
    };
    return await this.blogsService.findAll(queryPagination, [searchFilters]);
  }

  @Post()
  @UseGuards(BaseAuthGuard)
  async createBlog(@Body() createBlogDto: CreateBlogsDto) {
    const blogDto = {
      name: createBlogDto.name,
      description: createBlogDto.description,
      websiteUrl: createBlogDto.websiteUrl,
    };
    return this.blogsService.createBlog(blogDto);
  }

  @Get(':blogId/posts')
  async getPostsByBlogId(@Query() query: any, @Param('blogId') blogId: string) {
    const currentUser: UsersEntity | null = currentUserInst;
    const blog = await this.blogsService.findOne(blogId);
    if (!blog) {
      throw new HttpException(
        { message: ['Not found blogger'] },
        statusCode.NOT_FOUND,
      );
    }
    const paginationData = ParseQuery.getPaginationData(query);
    const dtoPagination: QueryPaginationType = {
      pageNumber: paginationData.pageNumber,
      pageSize: paginationData.pageSize,
      sortBy: paginationData.sortBy,
      sortDirection: paginationData.sortDirection,
    };
    const filterBlogId = { blogId: blogId };
    return await this.postsService.findPosts(
      dtoPagination,
      [filterBlogId],
      currentUser,
    );
  }
  @Post(':blogId/posts')
  @UseGuards(BaseAuthGuard)
  async createPostByBlogId(
    @Param('blogId') blogId: string,
    @Body() createPostByBlogIdDto: CreatePostByBlogIdDto,
  ) {
    const blog = await this.blogsService.findOne(blogId);
    if (!blog) {
      throw new HttpException(
        { message: ['Not found blogger'] },
        statusCode.NOT_FOUND,
      );
    }
    const createPostDto = {
      title: createPostByBlogIdDto.title,
      shortDescription: createPostByBlogIdDto.shortDescription,
      content: createPostByBlogIdDto.content,
      blogId: blogId,
    };
    return await this.postsService.createPost(createPostDto, blog.name);
  }
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<BlogsEntity | null> {
    const blog = await this.blogsService.findOne(id);
    if (!blog)
      throw new HttpException(
        { message: ['Not found blogger'] },
        statusCode.NOT_FOUND,
      );
    return blog;
  }
  @HttpCode(statusCode.NO_CONTENT)
  @UseGuards(BaseAuthGuard)
  @Put(':id')
  async updateBlog(
    @Param('id') id: string,
    @Body() updateBlogDto: CreateBlogsDto,
  ) {
    return this.blogsService.updateBlog(id, updateBlogDto);
  }
  @HttpCode(statusCode.NO_CONTENT)
  @UseGuards(BaseAuthGuard)
  @Delete(':id')
  async removeBlog(@Param('id') id: string) {
    return await this.blogsService.removeBlog(id);
  }
}
