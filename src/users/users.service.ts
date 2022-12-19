import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationDto } from '../infrastructure/common/dto/pagination.dto';
import { QueryArrType, UserType } from '../types/types';
import { ConvertFiltersForDB } from '../infrastructure/common/convertFiltersForDB';
import * as process from 'process';
import * as bcrypt from 'bcrypt';
import * as uuid4 from 'uuid4';
import { Pagination } from '../infrastructure/common/pagination';
import { Role } from '../auth/roles/role.enum';
import { User } from '../current-user/current-user';
import { ForbiddenError } from '@casl/ability';
import { Action } from '../auth/roles/action.enum';
import { CaslAbilityFactory } from '../ability/casl-ability.factory';
import { UsersRepository } from './users.repository';
import { ObjectId } from 'mongodb';
import { RegDataDto } from './dto/reg-data.dto';

@Injectable()
export class UsersService {
  constructor(
    protected convertFiltersForDB: ConvertFiltersForDB,
    protected pagination: Pagination,
    protected caslAbilityFactory: CaslAbilityFactory,
    protected usersRepository: UsersRepository,
  ) {}
  async findOne2(username: string) {
    const users = [
      {
        userId: 1,
        username: 'john',
        password: 'changeme',
      },
      {
        userId: 2,
        username: 'maria',
        password: 'guess',
      },
    ];
    return users.find((user) => user.username === username);
  }

  async create(
    createUserDto: CreateUserDto,
    registrationData: RegDataDto,
  ): Promise<UserType> {
    const user = await this._createNewUser(createUserDto, registrationData);
    return await this.usersRepository.create(user);
  }

  async findAll(queryPagination: PaginationDto, searchFilters: QueryArrType) {
    let field = 'createdAt';
    if (
      queryPagination.sortBy === 'login' ||
      queryPagination.sortBy === 'email'
    ) {
      field = queryPagination.sortBy;
    }
    const pageNumber = queryPagination.pageNumber;
    const pageSize = queryPagination.pageSize;

    const convertedFilters = await this.convertFiltersForDB.convert(
      searchFilters,
    );
    const totalCount = await this.usersRepository.countDocuments(
      convertedFilters,
    );
    const pagesCount = Math.ceil(totalCount / pageSize);
    const pagination = await this.pagination.prepare(queryPagination, field);
    const posts = await this.usersRepository.findUsers(
      pagination,
      convertedFilters,
    );
    return {
      pagesCount: pagesCount,
      page: pageNumber,
      pageSize: pageSize,
      totalCount: totalCount,
      items: posts,
    };
  }

  async findOne(id: ObjectId) {
    return new User();
  }

  async update(id: ObjectId, updateUserDto: UpdateUserDto, currentUser: User) {
    // const userToUpdate = await this.usersService.findOne(id);
    const userToUpdate = await this.findOne(id);
    userToUpdate.id = id;
    userToUpdate.orgId = 'It-Incubator';
    userToUpdate.roles = Role.User;
    console.log(userToUpdate, 'userToUpdate');
    const ability = this.caslAbilityFactory.createForUser(currentUser);
    try {
      ForbiddenError.from(ability).throwUnlessCan(Action.Update, userToUpdate);
      //Update call DB
      return `This action update a #${id} user`;
    } catch (error) {
      if (error instanceof ForbiddenError) {
        throw new ForbiddenException(error.message);
      }
    }
  }

  async remove(id: ObjectId) {
    return `This action removes a #${id} user`;
  }

  async _createNewUser(
    createUserDto: CreateUserDto,
    registrationData: RegDataDto,
  ): Promise<UserType> {
    const passwordHash = await this._generateHash(createUserDto.password);
    const id = new ObjectId();
    const currentTime = new Date().toISOString();
    const confirmationCode = uuid4().toString();
    // expiration date in an 1 hour 5 min
    const expirationDate = new Date(Date.now() + 65 * 60 * 1000).toISOString();
    return {
      id: id,
      login: createUserDto.login,
      email: createUserDto.email,
      passwordHash: passwordHash,
      createdAt: currentTime,
      orgId: 'It-Incubator',
      roles: Role.User,
      emailConfirmation: {
        confirmationCode: confirmationCode,
        expirationDate: expirationDate,
        isConfirmed: false,
        isConfirmedDate: 'None',
        sentEmail: [],
      },
      registrationData: {
        ip: registrationData.ip,
        userAgent: registrationData.userAgent,
      },
    };
  }

  async _generateHash(password: string) {
    const saltRounds = Number(process.env.SALT_FACTOR);
    const saltHash = await bcrypt.genSalt(saltRounds);
    return await bcrypt.hash(password, saltHash);
  }
}
