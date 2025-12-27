import { Injectable } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { EditBillCommand } from './edit-bill.command';
import { PrismaService } from '@/prisma/prisma.service';
import { BillService } from '@/bills/bill.service';
import {
  instanceToInstance,
  plainToClass,
  plainToInstance,
} from 'class-transformer';
import { BillDto } from '@/dtos/bill.dto';
import { Bill } from '@generated/prisma';
import { DebtsService } from '@/debts/debts.service';

@Injectable()
@CommandHandler(EditBillCommand)
export class EditBillHandler implements ICommandHandler<EditBillCommand, Bill> {
  constructor(
    private readonly prisma: PrismaService,
    private readonly bill: BillService,
    private readonly debt: DebtsService,
  ) {}

  async execute(command: EditBillCommand): Promise<Bill> {
    const bill = command.bill;

    const trans = this.prisma.$transaction(async (prisma) => {
      const id = bill.id;

      const newBill = await prisma.bill.update({
        where: {
          id: id,
        },
        data: {
          billType: bill.billType,
          creditorId: bill.creditorId,
          debtorIDs: bill.debtorIDs,
          totalAmount: bill.totalAmount,
          updatedAt: new Date(),
          description: bill.description,
        },
      });

      const debts = this.bill.createDebtDtoFromBill(newBill);
      const debtors = [false, false, false, false, false];

      for (const debt of debts) {
        console.log(debts);
        debtors[parseInt(debt.debtorId)] = true;
        await this.debt.EditDebt(debt, prisma);
      }

      for (let i = 1; i <= 4; i++) {
        if (debtors[i] === true) continue;

        await this.debt.EditDebt(
          {
            creditorId: newBill.creditorId,
            debtorId: `${i}`,
            amount: 0,
            billId: newBill.id,
          },
          prisma,
        );
      }
      return newBill;
    });

    return await trans;
  }
}
