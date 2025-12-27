import {
  IsString,
  IsNumber,
  IsNotEmpty,
  Min,
  MinLength,
  MaxLength,
} from 'class-validator';

export class DebtDto {
  id?: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(1)
  creditorId: string;

  @IsString()
  @IsNotEmpty()
  debtorId: string;

  @IsNumber()
  @Min(0)
  amount: number;

  @IsString()
  @IsNotEmpty()
  billId: string;
}
