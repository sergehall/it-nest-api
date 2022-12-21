import { PartialType } from '@nestjs/mapped-types';
import { CreateBlogsDto } from '../dto/create-blogs.dto';
import { IsNotEmpty, Matches, MaxLength, MinLength } from 'class-validator';

export class BlogsEntity extends PartialType(CreateBlogsDto) {
  @IsNotEmpty()
  @MinLength(0)
  @MaxLength(100)
  id: string;
  @IsNotEmpty()
  @MinLength(0)
  @MaxLength(100)
  @Matches(
    '/\\d{4}-[01]\\d-[0-3]\\dT[0-2]\\d:[0-5]\\d:[0-5]\\d\\.\\d+([+-][0-2]\\d:[0-5]\\d|Z)/',
  )
  createdAt: string;
}
