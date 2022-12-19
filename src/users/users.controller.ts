import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
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
import { ParseQuery } from '../infrastructure/common/parse-query';
import { PaginationDto } from '../infrastructure/common/dto/pagination.dto';
import { Request } from 'express';
import { CaslAbilityFactory } from '../ability/casl-ability.factory';
import { Role } from '../auth/roles/role.enum';
import { Action } from '../auth/roles/action.enum';
import { ForbiddenError } from '@casl/ability';
import { CheckAbilities } from '../ability/abilities.decorator';
import { AbilitiesGuard } from '../ability/abilities.guard';
import * as uuid4 from 'uuid4';
import { User } from './schemas/user.schema';
import { UserType } from '../types/types';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private caslAbilityFactory: CaslAbilityFactory,
  ) {}

  @Post()
  @UseGuards(AbilitiesGuard)
  @CheckAbilities({ action: Action.Create, subject: User })
  async create(
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
    const user = await this.usersService.create(
      createUserDto,
      registrationData,
    );
    return {
      id: user.id,
      login: user.login,
      email: user.email,
      createdAt: user.createdAt,
    };
  }

  @Get()
  @UseGuards(AbilitiesGuard)
  @CheckAbilities({ action: Action.Read, subject: User })
  async findAll(@Query() query: any) {
    const paginationData = ParseQuery.getPaginationData(query);
    const searchLoginTerm = { searchLoginTerm: paginationData.searchLoginTerm };
    const searchEmailTerm = { searchEmailTerm: paginationData.searchEmailTerm };
    const queryPagination: PaginationDto = {
      pageNumber: paginationData.pageNumber,
      pageSize: paginationData.pageSize,
      sortBy: paginationData.sortBy,
      sortDirection: paginationData.sortDirection,
    };
    return this.usersService.findAll(queryPagination, [
      searchLoginTerm,
      searchEmailTerm,
    ]);
  }

  @Get(':id')
  @UseGuards(AbilitiesGuard)
  @CheckAbilities({ action: Action.Read, subject: User })
  async findOne(@Param('id') id: string) {
    return this.usersService.findUserByUserId(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    // const currentUser = req.user;
    const currentUser = new User();
    currentUser.id = uuid4().toString();
    currentUser.orgId = 'It-Incubator';
    currentUser.roles = Role.User;
    const result = this.usersService.update(id, updateUserDto, currentUser);
    if (!result) throw new HttpException('Not found', 404);
    return result;
  }

  @Delete(':id')
  async deleteUserById(@Param('id') id: string) {
    // const currentUser = req.user;
    const currentUser = new User();
    currentUser.id = id;
    currentUser.orgId = 'It-Incubator';
    currentUser.roles = Role.User;
    return this.usersService.deleteUserById(id, currentUser);
  }
}
