import { IsNotEmpty, Matches, MaxLength, MinLength } from 'class-validator';

export class CreateBlogDto {
  @IsNotEmpty()
  @MinLength(0)
  @MaxLength(15)
  name: string;
  @IsNotEmpty()
  @MinLength(0)
  @MaxLength(500)
  description: string;
  @IsNotEmpty()
  @MinLength(0)
  @MaxLength(100)
  @Matches(
    '^https://([a-zA-Z0-9_-]+\\.)+[a-zA-Z0-9_-]+(\\/[a-zA-Z0-9_-]+)*\\/?$',
  )
  websiteUrl: string;
}
