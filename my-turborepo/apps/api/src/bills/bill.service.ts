import { BillDto } from '@/dtos/bill.dto';
import { DebtDto } from '@/dtos/debt.dto';
import { Bill, BillType } from '@generated/prisma';
import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { EditBillCommand } from './commands/editBill/edit-bill.command';
import { AddBillCommand } from './commands/addBill/add-bill.command';
import { DeleteBillCommand } from './commands/deleteBill/delete-bill.command';

@Injectable()
export class BillService {
  constructor(private commandBus: CommandBus) {}

  async addBill(billInfo: BillDto) {
    return this.commandBus.execute(new AddBillCommand(billInfo));
  }

  async editBill(billInfo: BillDto) {
    return this.commandBus.execute(new EditBillCommand(billInfo));
  }

  async deleteBill(billId: string) {
    return this.commandBus.execute(new DeleteBillCommand(billId));
  }

  createDebtDtoFromBill(bill: Bill): DebtDto[] {
    const debts: DebtDto[] = [];

    const debtors: string[] = bill.debtorIDs.split(',');
    const debtorIn: boolean[] = [false, false, false, false, false];

    const debtAmount =
      bill.billType == BillType.SPLITTING
        ? bill.totalAmount / debtors.length
        : bill.totalAmount;

    for (const debtor of debtors) {
      debts.push({
        creditorId: bill.creditorId,
        debtorId: debtor,
        amount: debtAmount,
        billId: bill.id,
      });
      debtorIn[parseInt(debtor)] = true;
    }

    for (let i = 1; i <= 4; i++) {
      if (debtorIn[i] === true) continue;
      debts.push({
        creditorId: bill.creditorId,
        debtorId: `${i}`,
        amount: 0,
        billId: bill.id,
      });
    }

    return debts;
  }
}
