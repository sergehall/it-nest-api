import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Query,
  HttpCode,
  UseGuards,
  HttpStatus,
  Request,
  NotFoundException,
} from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { CreateBlogsDto } from './dto/create-blogs.dto';
import { ParseQuery } from '../infrastructure/common/parse-query/parse-query';
import { PostsService } from '../posts/posts.service';
import { PaginationDto } from '../infrastructure/common/pagination/dto/pagination.dto';
import { PaginationTypes } from '../infrastructure/common/pagination/types/pagination.types';
import { BlogsEntity } from './entities/blogs.entity';
import { UsersEntity } from '../users/entities/users.entity';
import { CreatePostByBlogIdDto } from '../posts/dto/create-post-blogid.dto';
import { BaseAuthGuard } from '../auth/guards/base-auth.guard';
import { NoneStatusGuard } from '../auth/guards/none-status.guard';
import { SkipThrottle } from '@nestjs/throttler';

@SkipThrottle()
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
  @UseGuards(NoneStatusGuard)
  async getPostsByBlogId(
    @Request() req: any,
    @Query() query: any,
    @Param('blogId') blogId: string,
  ) {
    const currentUser: UsersEntity | null = req.user;
    const blog = await this.blogsService.findOne(blogId);
    if (!blog) {
      throw new NotFoundException();
    }
    const paginationData = ParseQuery.getPaginationData(query);
    const dtoPagination: PaginationDto = {
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
      throw new NotFoundException();
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
    if (!blog) {
      throw new NotFoundException();
    }
    return blog;
  }
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(BaseAuthGuard)
  @Put(':id')
  async updateBlog(
    @Param('id') id: string,
    @Body() updateBlogDto: CreateBlogsDto,
  ) {
    return this.blogsService.updateBlog(id, updateBlogDto);
  }
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(BaseAuthGuard)
  @Delete(':id')
  async removeBlog(@Param('id') id: string) {
    return await this.blogsService.removeBlog(id);
  }
}
