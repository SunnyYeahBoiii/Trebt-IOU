import { IsString, IsNotEmpty } from 'class-validator';

export class RemoveBillDto {
  @IsString()
  @IsNotEmpty()
  billId: string;
}
