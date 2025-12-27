import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class QueryDto {
  @IsOptional()
  @IsString()
  @MaxLength(1)
  creditorId: string | null;

  @IsOptional()
  @IsNumber()
  lowerAmount: number | null;

  @IsOptional()
  @IsNumber()
  upperAmount: number | null;

  @IsOptional()
  @IsBoolean()
  timeDesc: boolean | null;
}
