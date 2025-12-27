import { type BillDto } from '@/dtos/bill.dto';
import { Bill } from '@generated/prisma';
import { Injectable } from '@nestjs/common';
import { Command } from '@nestjs/cqrs';

@Injectable()
export class AddBillCommand extends Command<Bill> {
  constructor(public billInfo: BillDto) {
    super();
  }
}
