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
} from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { CreateBlogsDto } from './dto/create-blogs.dto';
import { ParseQuery } from '../infrastructure/common/parse-query';
import { QueryPaginationType } from '../types/types';
import { PostsService } from '../posts/posts.service';
import { CreatePostDto } from '../posts/dto/create-post.dto';
import { PaginationDto } from '../infrastructure/common/dto/pagination.dto';
import { PaginationWithItems } from '../infrastructure/common/types/paginationWithItems';
import { BlogsEntity } from './entities/blogs.entity';
import { UsersEntity } from '../users/entities/users.entity';

@Controller('blogs')
export class BlogsController {
  constructor(
    protected blogsService: BlogsService,
    protected postsService: PostsService,
  ) {}

  @Get()
  async findAll(@Query() query: any): Promise<PaginationWithItems> {
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
    const currentUser: UsersEntity | null = null;
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
  async createPostByBlogId(
    @Param('blogId') blogId: string,
    @Body() createPostDto: CreatePostDto,
  ) {
    const blog: BlogsEntity | null = await this.blogsService.findOne(
      createPostDto.blogId,
    );
    if (!blog) {
      throw new HttpException({ message: ['Not found blogger'] }, 404);
    }
    return await this.postsService.create(createPostDto, blog.name);
  }
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<BlogsEntity | null> {
    const blog = await this.blogsService.findOne(id);
    if (!blog) throw new HttpException({ message: ['Not found blogger'] }, 404);
    return blog;
  }
  @HttpCode(204)
  @Put(':id')
  async updateBlog(
    @Param('id') id: string,
    @Body() updateBlogDto: CreateBlogsDto,
  ) {
    return this.blogsService.updateBlog(id, updateBlogDto);
  }
  @HttpCode(204)
  @Delete(':id')
  async removeBlogById(@Param('id') id: string) {
    return this.blogsService.removeBlogById(id);
  }
}
