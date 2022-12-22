import {
  IsNotEmpty,
  IsNumber,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { StatusLike } from '../enums/posts.enums';

class NewestLikes {
  @IsNotEmpty()
  @MinLength(0)
  @MaxLength(100)
  userId: string;
  @IsNotEmpty()
  @MinLength(0)
  @MaxLength(100)
  login: string;
  @IsNotEmpty()
  @MinLength(0)
  @MaxLength(100)
  @Matches(
    '/\\d{4}-[01]\\d-[0-3]\\dT[0-2]\\d:[0-5]\\d:[0-5]\\d\\.\\d+([+-][0-2]\\d:[0-5]\\d|Z)/',
  )
  addedAt: string;
}

export class ExtendedLikesInfo {
  @IsNotEmpty()
  @MinLength(0)
  @MaxLength(100)
  @IsNumber()
  likesCount: number;
  @IsNotEmpty()
  @MinLength(0)
  @MaxLength(100)
  @IsNumber()
  dislikesCount: number;
  @IsNotEmpty()
  @MinLength(0)
  @MaxLength(100)
  myStatus: StatusLike;
  newestLikes: NewestLikes[];
}

export class PostsEntity {
  @IsNotEmpty()
  @MinLength(0)
  @MaxLength(100)
  id: string;
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
  @IsNotEmpty()
  @MinLength(0)
  @MaxLength(100)
  blogName: string;
  @IsNotEmpty()
  @MinLength(0)
  @MaxLength(100)
  @Matches(
    '/\\d{4}-[01]\\d-[0-3]\\dT[0-2]\\d:[0-5]\\d:[0-5]\\d\\.\\d+([+-][0-2]\\d:[0-5]\\d|Z)/',
  )
  createdAt: string;
  extendedLikesInfo: ExtendedLikesInfo;
}
