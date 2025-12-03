import { Type } from 'class-transformer';
import { IsDate, IsString } from 'class-validator';

export class CreateAuthorDto {
  @IsString()
  name: string;

  @IsString()
  biography: string;

  @Type(() => Date)
  @IsDate()
  birthDate: Date;

  @IsString()
  nationality: string;
}

export class UpdateAuthorDto {
  @IsString()
  name: string;

  @IsString()
  biography: string;

  @Type(() => Date)
  @IsDate()
  birthDate: Date;

  @IsString()
  nationality: string;
}
