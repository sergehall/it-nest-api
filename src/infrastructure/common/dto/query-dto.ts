import {
  IsInt,
  IsNotEmpty,
  IsNumberString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class QueryDto {
  @IsNotEmpty()
  @IsInt()
  pageNumber: number;
  @IsNotEmpty()
  @IsInt()
  pageSize: number;
  @IsNotEmpty()
  @MinLength(0)
  @MaxLength(100)
  sortBy: string;
  @IsNotEmpty()
  @MinLength(0)
  @MaxLength(100)
  @IsNumberString()
  sortDirection: -1 | 1 | 'descending' | 'desc' | 'ascending' | 'asc';
}
