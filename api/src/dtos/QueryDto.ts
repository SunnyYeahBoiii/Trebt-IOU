import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class QueryDto {
  @IsOptional()
  @IsString()
  creditorIds: string | null;

  @IsOptional()
  @IsString()
  debtorIds: string | null;

  @IsOptional()
  @Transform(({ value }) => (value != null ? Number(value) : null))
  @IsNumber()
  @Min(0)
  lowerAmount: number | null;

  @IsOptional()
  @Transform(({ value }) => (value != null ? Number(value) : null))
  @IsNumber()
  @Min(0)
  upperAmount: number | null;

  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  amountAsc: boolean | null;

  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  timeAsc: boolean | null;
}
