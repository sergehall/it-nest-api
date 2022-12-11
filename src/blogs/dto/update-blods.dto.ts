import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';
import { CreateBlogsDto } from './create-blogs.dto';

export class UpdateBlogDto extends PartialType(CreateBlogsDto) {
  @IsNotEmpty()
  @MinLength(0)
  @MaxLength(100)
  id: string;
}
