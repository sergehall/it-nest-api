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
import { ParseQuery } from '../infrastructure/common/manual-parse-queries/parse-query';
import { QueryDto } from '../infrastructure/common/manual-parse-queries/dto/query-dto';

@Controller('posts')
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly commentsService: CommentsService,
  ) {}

  @Get()
  async findAll(@Query() query: any) {
    const paginationData = ParseQuery.getPaginationData(query);
    const queryPagination: QueryDto = {
      pageNumber: paginationData.pageNumber,
      pageSize: paginationData.pageSize,
      sortBy: paginationData.sortBy,
      sortDirection: paginationData.sortDirection,
    };
    return this.postsService.findAll(queryPagination);
  }

  @Post()
  async create(@Body() createPostDto: CreatePostDto) {
    const blogName = 'Volt';
    return this.postsService.create(createPostDto, blogName);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const post = this.postsService.findOne(id);
    if (!post) throw new HttpException('Not found', 404);
    return post;
  }

  @Get(':postId')
  async findPostById(@Param('postId') postId: string) {
    const post = this.commentsService.findOne(postId);
    if (!post) throw new HttpException('Not found', 404);
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
