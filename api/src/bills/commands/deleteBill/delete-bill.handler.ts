import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteBillCommand } from './delete-bill.command';
import { PrismaService } from '@/prisma/prisma.service';
import { DebtsService } from '@/debts/debts.service';
import { BillService } from '@/bills/bill.service';

@Injectable()
@CommandHandler(DeleteBillCommand)
export class DeleteBillHandler implements ICommandHandler<
  DeleteBillCommand,
  void
> {
  private readonly logger = new Logger(DeleteBillHandler.name);

  constructor(
    private prisma: PrismaService,
    private debt: DebtsService,
    private bill: BillService,
  ) {}

  async execute(command: DeleteBillCommand): Promise<void> {
    const billId = command.billId;

    try {
      const transaction = this.prisma.$transaction(async (prisma) => {
        const bill = await prisma.bill.findUnique({
          where: {
            id: billId,
          },
        });

        if (!bill) throw new Error('Bill no longer exists');

        const debts = this.bill.createDebtDtoFromBill(bill);

        for (const debt of debts) {
          await this.debt.RemoveDebt(debt, prisma);
        }

        await prisma.bill.delete({
          where: {
            id: billId,
          },
        });
      });

      return await transaction;
    } catch (error) {
      this.logger.error('Failed to execute DeleteBillCommand', error instanceof Error ? error.stack : String(error));
      throw new InternalServerErrorException('Operation failed');
    }
  }
}
