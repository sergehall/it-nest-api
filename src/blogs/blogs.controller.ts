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
} from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { FindOneParams, UpdateBlogDto } from './dto/update-blog.dto';
import { ParseQuery } from '../infrastructure/common/parse-query';
import { QueryPaginationType, UserType } from '../types/types';
import { PostsService } from '../posts/posts.service';
import { CreatePostDto } from '../posts/dto/create-post.dto';
import { QueryDto } from '../infrastructure/common/dto/query-dto';

@Controller('blogs')
export class BlogsController {
  constructor(
    private readonly blogsService: BlogsService,
    protected postsService: PostsService,
  ) {}

  @Get()
  async findAll(@Query() query: any) {
    const paginationData = ParseQuery.getPaginationData(query);
    const searchFilters = { searchNameTerm: paginationData.searchNameTerm };
    const queryPagination: QueryDto = {
      pageNumber: paginationData.pageNumber,
      pageSize: paginationData.pageSize,
      sortBy: paginationData.sortBy,
      sortDirection: paginationData.sortDirection,
    };
    return await this.blogsService.findAll(queryPagination, [searchFilters]);
  }

  @Post()
  async create(@Body() createBlogDto: CreateBlogDto) {
    const blogDTO = {
      name: createBlogDto.name,
      description: createBlogDto.description,
      websiteUrl: createBlogDto.websiteUrl,
    };
    return this.blogsService.create(blogDTO);
  }

  @Get(':blogId/posts')
  async getPostsByBlogId(@Query() query: any, @Param('blogId') blogId: string) {
    const currentUser: UserType | null = null;
    const paginationData = ParseQuery.getPaginationData(query);
    const dtoPagination: QueryPaginationType = {
      pageNumber: paginationData.pageNumber,
      pageSize: paginationData.pageSize,
      sortBy: paginationData.sortBy,
      sortDirection: paginationData.sortDirection,
    };
    const filterBlogId = [{ blogId: blogId }];
    return await this.postsService.findPosts(
      dtoPagination,
      filterBlogId,
      currentUser,
    );
  }
  @Post(':blogId/posts')
  async createPostByBlogId(
    @Param('blogId') blogId: string,
    @Body() createPostDto: CreatePostDto,
  ) {
    // find blogger in DB if not exist return 404; CreatePostBlogInputModelType
    const blogName = 'Volt';
    return await this.postsService.create(createPostDto, blogName);
  }
  @Get(':id')
  async findOne(@Param() params: FindOneParams) {
    const blog = this.blogsService.findOne(params.id);
    if (!blog) throw new HttpException('Not found', 404);
    return blog;
  }

  @Put(':id')
  async update(
    @Param() params: FindOneParams,
    @Body() updateBlogDto: UpdateBlogDto,
  ) {
    const blog = this.blogsService.update(params.id, updateBlogDto);
    if (!blog) throw new HttpException('Not found', 404);
    return blog;
  }

  @Delete(':id')
  async remove(@Param() params: FindOneParams) {
    const deletedPost = this.blogsService.remove(params.id);
    if (!deletedPost) throw new HttpException('Not found', 404);
    return deletedPost;
  }
}
