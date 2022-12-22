import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  Ip,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ParseQuery } from '../infrastructure/common/parse-query/parse-query';
import { PaginationDto } from '../infrastructure/common/pagination/dto/pagination.dto';
import { Request } from 'express';
import { Role } from '../auth/roles/role.enum';
import { Action } from '../auth/roles/action.enum';
import { CheckAbilities } from '../ability/abilities.decorator';
import { AbilitiesGuard } from '../ability/abilities.guard';
import * as uuid4 from 'uuid4';
import { User } from './schemas/user.schema';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UseGuards(AbilitiesGuard)
  @CheckAbilities({ action: Action.CREATE, subject: User })
  async createUser(
    @Req() req: Request,
    @Body() createUserDto: CreateUserDto,
    @Ip() ip: string,
  ) {
    let userAgent = req.header('User-Agent')
      ? req.header('User-Agent')
      : 'None';
    if (!userAgent) {
      userAgent = 'None';
    }
    const registrationData = {
      ip: ip,
      userAgent: userAgent,
    };
    const newUser = await this.usersService.createUser(
      createUserDto,
      registrationData,
    );
    return {
      id: newUser.id,
      login: newUser.login,
      email: newUser.email,
      createdAt: newUser.createdAt,
    };
  }

  @Get()
  @UseGuards(AbilitiesGuard)
  @CheckAbilities({ action: Action.READ, subject: User })
  async findAll(@Query() query: any) {
    const queryData = ParseQuery.getPaginationData(query);
    const searchLoginTerm = { searchLoginTerm: queryData.searchLoginTerm };
    const searchEmailTerm = { searchEmailTerm: queryData.searchEmailTerm };
    const queryPagination: PaginationDto = {
      pageNumber: queryData.pageNumber,
      pageSize: queryData.pageSize,
      sortBy: queryData.sortBy,
      sortDirection: queryData.sortDirection,
    };
    return this.usersService.findAll(queryPagination, [
      searchLoginTerm,
      searchEmailTerm,
    ]);
  }

  @Get(':id')
  @UseGuards(AbilitiesGuard)
  @CheckAbilities({ action: Action.READ, subject: User })
  async findOne(@Param('id') id: string) {
    return this.usersService.findUserByUserId(id);
  }

  @Put(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    // const currentUser = req.user;
    const newCurrentUser = new User();
    newCurrentUser.id = uuid4().toString();
    newCurrentUser.orgId = 'It-Incubator';
    newCurrentUser.roles = Role.User;
    const result = this.usersService.updateUser(
      id,
      updateUserDto,
      newCurrentUser,
    );
    if (!result) throw new HttpException({ message: ['Not found user'] }, 404);
    return result;
  }
  @HttpCode(204)
  @Delete(':id')
  async removeUserById(@Param('id') id: string) {
    // const currentUser = req.user;
    // const currentUser = constUser;
    const currentUser = new User();
    currentUser.id = id;
    currentUser.orgId = 'It-Incubator';
    currentUser.roles = Role.User;
    return await this.usersService.removeUserById(id, currentUser);
  }
}
