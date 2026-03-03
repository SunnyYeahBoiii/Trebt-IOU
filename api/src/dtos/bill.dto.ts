import {
  IsString,
  IsNumber,
  IsOptional,
  IsNotEmpty,
  IsEnum,
  IsIn,
  Matches,
  Min,
} from 'class-validator';
import { BillType } from '@generated/prisma';

export class BillDto {
  @IsOptional()
  @IsString()
  id?: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(['1', '2', '3', '4'])
  creditorId: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^[1-4](,[1-4])*$/, {
    message: 'debtorIDs must be comma-separated values of 1-4',
  })
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
