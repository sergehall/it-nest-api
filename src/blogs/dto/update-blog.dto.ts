import { PartialType } from '@nestjs/mapped-types';
import { CreateBlogDto } from './create-blog.dto';
import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class UpdateBlogDto extends PartialType(CreateBlogDto) {}

export class FindOneParams {
  @IsNotEmpty()
  @MinLength(0)
  @MaxLength(100)
  id: string;
}
