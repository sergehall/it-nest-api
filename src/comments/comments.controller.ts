import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  HttpCode,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { LikeStatusDto } from './dto/like-status.dto';
import { User } from '../users/schemas/user.schema';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const currentUser = null;
    return this.commentsService.getCommentById(id, currentUser);
  }
  @HttpCode(204)
  @Put(':commentId/like-status')
  async changeLikeStatusComment(
    @Param('commentId') commentId: string,
    @Body() likeStatusDto: LikeStatusDto,
  ) {
    const currentUser = new User();
    return this.commentsService.changeLikeStatusComment(
      commentId,
      likeStatusDto,
      currentUser,
    );
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCommentDto: UpdateCommentDto,
  ) {
    return this.commentsService.update(id, updateCommentDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.commentsService.remove(id);
  }
}
