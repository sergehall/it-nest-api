import { MaxLength, MinLength } from 'class-validator';

export class Params {
  @MinLength(0)
  @MaxLength(100)
  id: string;
  @MinLength(0)
  @MaxLength(100)
  blogId: string;
}
