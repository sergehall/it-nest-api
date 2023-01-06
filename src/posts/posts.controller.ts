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
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { CommentsService } from '../comments/comments.service';
import { ParseQuery } from '../infrastructure/common/parse-query/parse-query';
import { PaginationDto } from '../infrastructure/common/pagination/dto/pagination.dto';
import { BlogsService } from '../blogs/blogs.service';
import { BlogsEntity } from '../blogs/entities/blogs.entity';
import { PostsEntity } from './entities/posts.entity';
import { UsersEntity } from '../users/entities/users.entity';
import { CreateCommentDto } from '../comments/dto/create-comment.dto';
import { currentUserInst } from '../current-user/current-user';
import { AbilitiesGuard } from '../ability/abilities.guard';
import { CheckAbilities } from '../ability/abilities.decorator';
import { Action } from '../ability/roles/action.enum';
import { User } from '../users/infrastructure/schemas/user.schema';
import { LikeStatusDto } from './dto/like-status.dto';
import { BaseAuthGuard } from '../auth/guards/base-auth.guard';
import { statusCode } from '../logger/status-code.enum';

@Controller('posts')
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly commentsService: CommentsService,
    private readonly blogsService: BlogsService,
  ) {}

  @Get()
  @UseGuards(AbilitiesGuard)
  @CheckAbilities({ action: Action.READ, subject: User })
  async findPosts(@Query() query: any) {
    const currentUser: UsersEntity = currentUserInst;
    const paginationData = ParseQuery.getPaginationData(query);
    const searchFilters = {};
    const queryPagination: PaginationDto = {
      pageNumber: paginationData.pageNumber,
      pageSize: paginationData.pageSize,
      sortBy: paginationData.sortBy,
      sortDirection: paginationData.sortDirection,
    };
    return this.postsService.findPosts(
      queryPagination,
      [searchFilters],
      currentUser,
    );
  }
  @Post()
  @UseGuards(BaseAuthGuard)
  @UseGuards(AbilitiesGuard)
  @CheckAbilities({ action: Action.READ, subject: User })
  async createPost(@Body() createPostDto: CreatePostDto) {
    const blog: BlogsEntity | null = await this.blogsService.findOne(
      createPostDto.blogId,
    );
    if (!blog) {
      throw new HttpException({ message: ['Not found blogger'] }, 404);
    }
    return this.postsService.createPost(createPostDto, blog.name);
  }
  @Post(':postId/comments')
  async createComment(
    @Param('postId') postId: string,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    const currentUser: UsersEntity = currentUserInst;
    const post = await this.postsService.checkPostInDB(postId);
    if (!post)
      throw new HttpException(
        { message: ['Not found post'] },
        statusCode.NOT_FOUND,
      );
    return await this.commentsService.createComment(
      postId,
      createCommentDto,
      currentUser,
    );
  }
  @Get(':postId/comments')
  @UseGuards(AbilitiesGuard)
  @CheckAbilities({ action: Action.READ, subject: User })
  async findComments(@Param('postId') postId: string, @Query() query: any) {
    const currentUser: UsersEntity | null = currentUserInst;
    const paginationData = ParseQuery.getPaginationData(query);
    const queryPagination: PaginationDto = {
      pageNumber: paginationData.pageNumber,
      pageSize: paginationData.pageSize,
      sortBy: paginationData.sortBy,
      sortDirection: paginationData.sortDirection,
    };
    const post = await this.postsService.checkPostInDB(postId);
    if (!post)
      throw new HttpException(
        { message: ['Not found post'] },
        statusCode.NOT_FOUND,
      );
    return await this.commentsService.findCommentsByPostId(
      queryPagination,
      postId,
      currentUser,
    );
  }
  @Get(':postId')
  @UseGuards(AbilitiesGuard)
  @CheckAbilities({ action: Action.READ, subject: User })
  async findPostById(@Param('postId') postId: string): Promise<PostsEntity> {
    const currentUser: User | null = new User();
    const post = await this.postsService.findPostById(postId, currentUser);
    if (!post)
      throw new HttpException(
        { message: ['Not found post'] },
        statusCode.NOT_FOUND,
      );
    return post;
  }
  @HttpCode(statusCode.NO_CONTENT)
  @UseGuards(BaseAuthGuard)
  @Put(':id')
  async updatePost(
    @Param('id') id: string,
    @Body() updatePostDto: CreatePostDto,
  ) {
    const post = await this.postsService.updatePost(id, updatePostDto);
    if (!post)
      throw new HttpException(
        { message: ['Not found post'] },
        statusCode.NOT_FOUND,
      );
    return post;
  }
  @HttpCode(statusCode.NO_CONTENT)
  @UseGuards(BaseAuthGuard)
  @Delete(':id')
  async removePost(@Param('id') id: string) {
    return await this.postsService.removePost(id);
  }
  @HttpCode(statusCode.NO_CONTENT)
  @Put(':postId/like-status')
  async changeLikeStatusComment(
    @Param('postId') postId: string,
    @Body() likeStatusDto: LikeStatusDto,
  ) {
    const currentUser = currentUserInst;
    return this.postsService.changeLikeStatusPost(
      postId,
      likeStatusDto,
      currentUser,
    );
  }
}
