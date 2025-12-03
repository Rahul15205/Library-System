import { Type } from 'class-transformer';
import { IsDate, IsOptional, IsString } from 'class-validator';

export class CreateBookDto {
  @IsString()
  title: string;

  @IsString()
  isbn: string;

  @IsString()
  description: string;

  @Type(() => Date)
  @IsDate()
  publishedAt: Date;

  @IsString()
  genre: string;

  @IsString()
  authorId: string;
}

export class UpdateBookDto {
  @IsString()
  title: string;

  @IsString()
  isbn: string;

  @IsString()
  description: string;

  @Type(() => Date)
  @IsDate()
  publishedAt: Date;

  @IsString()
  genre: string;

  @IsString()
  authorId: string;
}

export class BooksQueryDto {
  @IsOptional()
  @IsString()
  authorId?: string;

  @IsOptional()
  @IsString()
  borrowed?: string;
}
