import { PrismaService } from '@/prisma/prisma.service';
import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { AddBillCommand } from './add-bill.command';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DebtsService } from '@/debts/debts.service';
import { BillService } from '@/bills/bill.service';
import { DebtDto } from '@/dtos/debt.dto';
import { Bill } from '@generated/prisma';

@Injectable()
@CommandHandler(AddBillCommand)
export class AddBillHandler implements ICommandHandler<AddBillCommand, Bill> {
  private readonly logger = new Logger(AddBillHandler.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly debt: DebtsService,
    private readonly bill: BillService,
  ) {}

  async execute(command: AddBillCommand): Promise<Bill> {
    const billInfo = command.billInfo;

    try {
      const transaction = this.prisma.$transaction(async (prisma) => {
        const newBill = await prisma.bill.create({
          data: {
            creditorId: billInfo.creditorId,
            debtorIDs: billInfo.debtorIDs,
            description: billInfo.description ?? '',
            totalAmount: billInfo.totalAmount,
            billType: billInfo.billType,
          },
        });

        const debts: DebtDto[] = this.bill.createDebtDtoFromBill(newBill);

        for (const debt of debts) {
          await this.debt.AddDebt(debt, prisma);
        }

        return newBill;
      });

      return await transaction;
    } catch (error) {
      this.logger.error('Failed to execute AddBillCommand', error instanceof Error ? error.stack : String(error));
      throw new InternalServerErrorException('Operation failed');
    }
  }
}
