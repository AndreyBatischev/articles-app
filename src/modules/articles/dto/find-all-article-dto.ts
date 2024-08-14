import { IsNumber, IsOptional, IsString } from 'class-validator';

export class FindAllDto {
  @IsOptional()
  @IsNumber()
  page?: number;

  @IsOptional()
  @IsNumber()
  limit?: number;

  @IsOptional()
  @IsString()
  author?: string;

  @IsOptional()
  @IsString()
  publicationDate?: string;
}
