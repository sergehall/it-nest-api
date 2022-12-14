import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationDto } from '../infrastructure/common/dto/pagination.dto';
import { DtoQueryType, User, UserType } from '../types/types';
import { ConvertFiltersForDB } from '../infrastructure/common/convertFiltersForDB';
import * as process from 'process';
import * as bcrypt from 'bcrypt';
import * as uuid4 from 'uuid4';
import { Pagination } from '../infrastructure/common/pagination';
import { Role } from '../auth/roles/role.enum';

@Injectable()
export class UsersService {
  constructor(
    protected convertFiltersForDB: ConvertFiltersForDB,
    protected pagination: Pagination,
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
  async create(createUserDto: CreateUserDto, ip: string, userAgent: string) {
    const user = await this._createNewUser(createUserDto, ip, userAgent);
    return user;
  }

  async findAll(queryPagination: PaginationDto, searchFilters: DtoQueryType) {
    let field = 'createdAt';
    if (
      queryPagination.sortBy === 'login' ||
      queryPagination.sortBy === 'email'
    ) {
      field = queryPagination.sortBy;
    }
    const pagination = await this.pagination.prepare(queryPagination, field);
    const pageNumber = queryPagination.pageNumber;
    const pageSize = pagination.pageSize;
    // const totalCount = await this.postRepository.......
    // const pagesCount = Math.ceil(totalCount / pageSize)
    const totalCount = 0;
    const pagesCount = 0;

    const convertedFilters = await this.convertFiltersForDB.convertForUser(
      searchFilters,
    );
    // const posts = await this.postRepository....
    const posts = [
      {
        id: 'string',
        login: 'string',
        email: 'string',
        createdAt: 'string',
      },
    ];
    return {
      pagesCount: 0,
      page: pageNumber,
      pageSize: pageSize,
      totalCount: 0,
      items: posts,
    };
  }

  async findOne(id: string) {
    return `This action returns a user #${id}`;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = new User();
    user.id = id;
    // user.orgId = 'IT-Incubator';
    user.orgId = '2';
    user.roles = Role.User;
    console.log(user, 'user2');
    return user;
  }

  async remove(id: string) {
    return `This action removes a #${id} user`;
  }

  async _createNewUser(
    createUserDto: CreateUserDto,
    ip: string,
    userAgent: string,
  ): Promise<UserType> {
    const saltRounds = Number(process.env.SALT_FACTOR);
    const saltHash = await bcrypt.genSalt(saltRounds);
    const passwordHash = await this._generateHash(
      createUserDto.password,
      saltHash,
    );
    const id = uuid4().toString();
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
        sentEmail: [],
      },
      registrationData: {
        ip: ip,
        userAgent: userAgent,
      },
    };
  }

  async _generateHash(password: string, salt: string) {
    return await bcrypt.hash(password, salt);
  }
}
