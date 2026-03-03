import {
  IsString,
  IsNumber,
  IsNotEmpty,
  IsIn,
  Min,
} from 'class-validator';

export class DebtDto {
  id?: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(['1', '2', '3', '4'])
  creditorId: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(['1', '2', '3', '4'])
  debtorId: string;

  @IsNumber()
  @Min(0)
  amount: number;

  @IsString()
  @IsNotEmpty()
  billId: string;
}
