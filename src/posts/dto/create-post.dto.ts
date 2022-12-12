import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreatePostDto {
  @IsNotEmpty()
  @MinLength(0)
  @MaxLength(30)
  title: string;
  @IsNotEmpty()
  @MinLength(0)
  @MaxLength(100)
  shortDescription: string;
  @IsNotEmpty()
  @MinLength(0)
  @MaxLength(1000)
  content: string;
  @IsNotEmpty()
  @IsString()
  blogId: string;
}
