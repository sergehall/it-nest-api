import { Injectable } from '@nestjs/common';
import { CreateEmailDto } from './dto/create-email.dto';
import { UpdateEmailDto } from './dto/update-email.dto';

@Injectable()
export class EmailsService {
  async create(createEmailDto: CreateEmailDto) {
    return 'This action adds a new email';
  }

  async findAll() {
    return `This action returns all emails`;
  }

  async findOne(id: number) {
    return `This action returns a #${id} email`;
  }

  async update(id: number, updateEmailDto: UpdateEmailDto) {
    return `This action updates a #${id} email`;
  }

  async remove(id: number) {
    return `This action removes a #${id} email`;
  }
}
