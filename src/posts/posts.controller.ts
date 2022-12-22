import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpException,
  Put,
  Query,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { CommentsService } from '../comments/comments.service';
import { ParseQuery } from '../infrastructure/common/parse-query';
import { PaginationDto } from '../infrastructure/common/dto/pagination.dto';
import { BlogsService } from '../blogs/blogs.service';
import { BlogsEntity } from '../blogs/entities/blogs.entity';
import { PostsEntity } from './entities/posts.entity';

@Controller('posts')
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly commentsService: CommentsService,
    private readonly blogsService: BlogsService,
  ) {}

  @Get()
  async findAll(@Query() query: any) {
    const paginationData = ParseQuery.getPaginationData(query);
    const searchFilters = {};
    const queryPagination: PaginationDto = {
      pageNumber: paginationData.pageNumber,
      pageSize: paginationData.pageSize,
      sortBy: paginationData.sortBy,
      sortDirection: paginationData.sortDirection,
    };
    return this.postsService.findAll(queryPagination, [searchFilters]);
  }

  @Post()
  async create(@Body() createPostDto: CreatePostDto) {
    const blog: BlogsEntity | null = await this.blogsService.findOne(
      createPostDto.blogId,
    );
    if (!blog) {
      throw new HttpException({ message: ['Not found blogger'] }, 404);
    }
    return this.postsService.create(createPostDto, blog.name);
  }

  @Get(':postId')
  async findPostById(@Param('postId') postId: string): Promise<PostsEntity> {
    const post = await this.postsService.findPostById(postId);
    if (!post) throw new HttpException({ message: ['Not found post'] }, 404);
    return post;
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    const post = this.postsService.update(id, updatePostDto);
    if (!post) throw new HttpException('Not found', 404);
    return post;
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const post = this.postsService.remove(id);
    if (!post) throw new HttpException('Not found', 404);
    return post;
  }
}
