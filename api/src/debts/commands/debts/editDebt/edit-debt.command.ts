import { type DebtDto } from '@/dtos/debt.dto';
import { Prisma } from '@generated/prisma';
import { Injectable } from '@nestjs/common';
import { Command } from '@nestjs/cqrs';

@Injectable()
export class EditDebtCommand extends Command<boolean> {
  constructor(
    public readonly debt: DebtDto,
    public readonly tx?: Prisma.TransactionClient,
  ) {
    super();
  }
}
