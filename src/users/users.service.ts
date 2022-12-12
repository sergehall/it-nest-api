import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationDto } from '../infrastructure/common/dto/pagination.dto';
import { DtoQueryType, UserType } from '../types/types';
import { ConvertFiltersForDB } from '../infrastructure/common/convertFiltersForDB';
import * as process from 'process';
import * as bcrypt from 'bcrypt';
import * as uuid4 from 'uuid4';
import { Pagination } from '../infrastructure/common/pagination';

@Injectable()
export class UsersService {
  constructor(
    protected convertFiltersForDB: ConvertFiltersForDB,
    protected pagination: Pagination,
  ) {}
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

  async update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
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
      accountData: {
        id: id,
        login: createUserDto.login,
        email: createUserDto.email,
        passwordHash: passwordHash,
        createdAt: currentTime,
      },
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
