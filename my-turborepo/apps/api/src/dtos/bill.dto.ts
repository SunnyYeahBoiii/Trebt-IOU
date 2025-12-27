import {
  IsString,
  IsNumber,
  IsOptional,
  IsNotEmpty,
  IsEnum,
  Min,
} from 'class-validator';
import { BillType } from '@generated/prisma';

export class BillDto {
  @IsOptional()
  id?: string;

  @IsString()
  @IsNotEmpty()
  creditorId: string;

  @IsString()
  @IsNotEmpty()
  debtorIDs: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @Min(0)
  totalAmount: number;

  @IsEnum(BillType)
  billType: BillType;
}
