import {
  Controller,
  Get,
  Body,
  Param,
  Delete,
  Put,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { LikeStatusDto } from './dto/like-status.dto';
import { User } from '../users/infrastructure/schemas/user.schema';
import { AbilitiesGuard } from '../ability/abilities.guard';
import { CheckAbilities } from '../ability/abilities.decorator';
import { Action } from '../ability/roles/action.enum';
import { OrgIdEnums } from '../infrastructure/database/enums/org-id.enums';
import { Role } from '../ability/roles/role.enum';
import { HttpStatus } from '../logger/status-code.enum';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get(':id')
  @UseGuards(AbilitiesGuard)
  @CheckAbilities({ action: Action.CREATE, subject: User })
  async findComment(@Param('id') id: string) {
    const currentUser = null;
    return this.commentsService.findCommentById(id, currentUser);
  }
  @HttpCode(HttpStatus.NO_CONTENT)
  @Put(':commentId')
  async updateComment(
    @Param('commentId') commentId: string,
    @Body() updateCommentDto: UpdateCommentDto,
  ) {
    const currentUser = new User();
    return this.commentsService.updateComment(
      commentId,
      updateCommentDto,
      currentUser,
    );
  }
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':commentId')
  async removeComment(@Param('commentId') commentId: string) {
    const currentUser = new User();
    currentUser.id = 'c2b18894-8747-402e-9974-45fa4c7b41a40';
    currentUser.orgId = OrgIdEnums.INCUBATOR;
    currentUser.roles = Role.User;
    return this.commentsService.removeComment(commentId, currentUser);
  }
  @HttpCode(HttpStatus.NO_CONTENT)
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
}
