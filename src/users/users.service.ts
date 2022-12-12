import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { QueryDto } from '../infrastructure/common/manual-parse-queries/dto/query-dto';
import { DtoQueryType, EntityPaginationType, UserType } from '../types/types';
import { ConvertFiltersForDB } from '../infrastructure/common/convertFiltersForDB';
import * as process from 'process';
import * as bcrypt from 'bcrypt';
import * as uuid4 from 'uuid4';

@Injectable()
export class UsersService {
  constructor(protected convertFiltersForDB: ConvertFiltersForDB) {}
  async create(createUserDto: CreateUserDto, ip: string, userAgent: string) {
    const user = await this._createNewUser(createUserDto, ip, userAgent);
    return user;
  }

  async findAll(queryPagination: QueryDto, searchFilters: DtoQueryType) {
    const pageNumber = queryPagination.pageNumber;
    const startIndex =
      (queryPagination.pageNumber - 1) * queryPagination.pageSize;
    const pageSize = queryPagination.pageSize;
    let field = 'createdAt';
    if (
      queryPagination.sortBy === 'login' ||
      queryPagination.sortBy === 'email'
    ) {
      field = queryPagination.sortBy;
    }
    const direction = queryPagination.sortDirection;
    const entityPagination: EntityPaginationType = {
      startIndex,
      pageSize,
      field,
      direction,
    };
    const convertedFilters = await this.convertFiltersForDB.convertForUser(
      searchFilters,
    );
    console.log(convertedFilters);
    return {
      pagesCount: 0,
      page: pageNumber,
      pageSize: pageSize,
      totalCount: 0,
      items: [
        {
          id: 'string',
          login: 'string',
          email: 'string',
          createdAt: 'string',
        },
      ],
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
