import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
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
import { User } from '../current-user/current-user';

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
    let userAgent = req.header('User-Agent');
    if (!userAgent) {
      userAgent = 'None';
    }
    return this.usersService.create(createUserDto, ip, userAgent);
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
    return this.usersService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    // const currentUser = req.user;
    // const userToUpdate = await this.usersService.findOne(id);
    const currentUser = new User();
    currentUser.id = '1';
    currentUser.orgId = 'It-Incubator';
    currentUser.roles = Role.Admin;
    console.log(currentUser, 'currentUser');
    const userToUpdate = await this.findOne(id);
    userToUpdate.id = id;
    userToUpdate.orgId = 'It-Incubator';
    userToUpdate.roles = Role.User;
    console.log(userToUpdate, 'userToUpdate');
    const ability = this.caslAbilityFactory.createForUser(currentUser);
    try {
      ForbiddenError.from(ability).throwUnlessCan(Action.Update, userToUpdate);
      //Update call DB for update
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
    user.roles = Role.User;
    // const user = req.user ? req.user | null;
    const userToDelete = await this.usersService.findOne(id);
    const ability = this.caslAbilityFactory.createForUser(user);
    try {
      ForbiddenError.from(ability).throwUnlessCan(Action.Delete, userToDelete);
      return this.usersService.remove(id);
    } catch (error) {
      if (error instanceof ForbiddenError) {
        throw new ForbiddenException(error.message);
      }
    }
  }
}
