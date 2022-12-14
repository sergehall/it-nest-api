import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Delete,
  Query,
  Ip,
  Req,
  ForbiddenException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ParseQuery } from '../infrastructure/common/parse-query';
import { PaginationDto } from '../infrastructure/common/dto/pagination.dto';
import { Request } from 'express';
import { CaslAbilityFactory } from '../casl/casl-ability.factory/casl-ability.factory';
import { Role } from '../auth/roles/role.enum';
import { Action } from '../auth/roles/action.enum';
import { ForbiddenError } from '@casl/ability';
import { User } from '../types/types';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private caslAbilityFactory: CaslAbilityFactory,
  ) {}

  @Post()
  async create(
    @Req() req: Request,
    @Body() createUserDto: CreateUserDto,
    @Ip() ip: string,
  ) {
    let userAgent = req.header('User-Agent');
    if (!userAgent) {
      userAgent = 'None';
    }
    return this.usersService.create(createUserDto, ip, userAgent);
  }

  @Get()
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
  async findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const user = new User();
    user.id = '123';
    user.orgId = '3';
    user.roles = Role.Admin;
    console.log(user, 'user1');
    // const user = req.user ? req.user | null;
    const userToUpdate = this.usersService.findOne(id);
    const ability = this.caslAbilityFactory.createForUser(user);
    console.log(ability, '-------------------');
    try {
      ForbiddenError.from(ability).throwUnlessCan(Action.Update, userToUpdate);
      return this.usersService.update(id, updateUserDto);
    } catch (error) {
      if (error instanceof ForbiddenError) {
        throw new ForbiddenException(error.message);
      }
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const user = new User();
    user.id = '123';
    user.orgId = '3';
    user.roles = Role.Admin;
    // const user = req.user ? req.user | null;
    const ability = this.caslAbilityFactory.createForUser(user);
    try {
      ForbiddenError.from(ability).throwUnlessCan(Action.Delete, user);
      return this.usersService.remove(id);
    } catch (error) {
      if (error instanceof ForbiddenError) {
        throw new ForbiddenException(error.message);
      }
    }
  }
}
