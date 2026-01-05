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

  debtorIds: string | null;

  @IsOptional()
  @IsNumber()
  lowerAmount: number | null;

  @IsOptional()
  @IsNumber()
  upperAmount: number | null;

  amountAsc: boolean | null;

  @IsOptional()
  @IsBoolean()
  timeAsc: boolean | null;
}
