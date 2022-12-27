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
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { CommentsService } from '../comments/comments.service';
import { ParseQuery } from '../infrastructure/common/parse-query/parse-query';
import { PaginationDto } from '../infrastructure/common/pagination/dto/pagination.dto';
import { BlogsService } from '../blogs/blogs.service';
import { BlogsEntity } from '../blogs/entities/blogs.entity';
import { PostsEntity } from './entities/posts.entity';
import { OrgIdEnums } from '../infrastructure/database/enums/org-id.enums';
import { Role } from '../auth/roles/role.enum';
import { UsersEntity } from '../users/entities/users.entity';
import { CreateCommentDto } from '../comments/dto/create-comment.dto';

@Controller('posts')
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly commentsService: CommentsService,
    private readonly blogsService: BlogsService,
  ) {}

  @Get()
  async findPosts(@Query() query: any) {
    const paginationData = ParseQuery.getPaginationData(query);
    const searchFilters = {};
    const queryPagination: PaginationDto = {
      pageNumber: paginationData.pageNumber,
      pageSize: paginationData.pageSize,
      sortBy: paginationData.sortBy,
      sortDirection: paginationData.sortDirection,
    };
    return this.postsService.findPosts(queryPagination, [searchFilters]);
  }
  @Post()
  async createPost(@Body() createPostDto: CreatePostDto) {
    const blog: BlogsEntity | null = await this.blogsService.findOne(
      createPostDto.blogId,
    );
    if (!blog) {
      throw new HttpException({ message: ['Not found blogger'] }, 404);
    }
    return this.postsService.createPost(createPostDto, blog.name);
  }
  @HttpCode(201)
  @Post(':postId/comments')
  async createComment(
    @Param('postId') postId: string,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    const user: UsersEntity = {
      id: 'c2b18894-8747-402e-9974-45fa4c7b41a4',
      login: 'Bob',
      email: 'bob@gmail.com',
      passwordHash:
        '$2b$11$.c.q/grUpeeU.SQM.NnOseR1vm.uQpniujrppjuvW/DNnMQ06Lv1C',
      createdAt: '2022-12-04T10:41:52.374Z',
      orgId: OrgIdEnums.INCUBATOR,
      roles: Role.User,
      emailConfirmation: {
        confirmationCode: 'a35ec071-d9cc-4866-b881-a4bc7f3383e9',
        expirationDate: '2022-12-04T11:46:52.374Z',
        isConfirmed: false,
        isConfirmedDate: 'None',
        sentEmail: [],
      },
      registrationData: { ip: '::1', userAgent: 'PostmanRuntime/7.29.2' },
    };
    const post = await this.postsService.findPostById(postId);
    if (!post) {
      throw new HttpException({ message: ['Not found post'] }, 404);
    }
    return await this.commentsService.createComment(
      postId,
      createCommentDto,
      user,
    );
  }
  @Get(':postId/comments')
  async findComments(@Param('postId') postId: string, @Query() query: any) {
    const user: UsersEntity | null = {
      id: 'c2b18894-8747-402e-9974-45fa4c7b41a4',
      login: 'Bob',
      email: 'bob@gmail.com',
      passwordHash:
        '$2b$11$.c.q/grUpeeU.SQM.NnOseR1vm.uQpniujrppjuvW/DNnMQ06Lv1C',
      createdAt: '2022-12-04T10:41:52.374Z',
      orgId: OrgIdEnums.INCUBATOR,
      roles: Role.User,
      emailConfirmation: {
        confirmationCode: 'a35ec071-d9cc-4866-b881-a4bc7f3383e9',
        expirationDate: '2022-12-04T11:46:52.374Z',
        isConfirmed: false,
        isConfirmedDate: 'None',
        sentEmail: [],
      },
      registrationData: { ip: '::1', userAgent: 'PostmanRuntime/7.29.2' },
    };
    const paginationData = ParseQuery.getPaginationData(query);
    const queryPagination: PaginationDto = {
      pageNumber: paginationData.pageNumber,
      pageSize: paginationData.pageSize,
      sortBy: paginationData.sortBy,
      sortDirection: paginationData.sortDirection,
    };
    const post = await this.postsService.findPostById(postId);
    if (!post) {
      throw new HttpException({ message: ['Not found post'] }, 404);
    }
    return await this.commentsService.findCommentsByPostId(
      queryPagination,
      postId,
      user,
    );
  }
  @Get(':postId')
  async findPostById(@Param('postId') postId: string): Promise<PostsEntity> {
    const post = await this.postsService.findPostById(postId);
    if (!post) throw new HttpException({ message: ['Not found post'] }, 404);
    return post;
  }
  @HttpCode(204)
  @Put(':id')
  async updatePost(
    @Param('id') id: string,
    @Body() updatePostDto: CreatePostDto,
  ) {
    const post = await this.postsService.updatePost(id, updatePostDto);
    if (!post) throw new HttpException({ message: ['Not found post'] }, 404);
    return post;
  }
  @HttpCode(204)
  @Delete(':id')
  async removePost(@Param('id') id: string) {
    return await this.postsService.removePost(id);
  }
}
