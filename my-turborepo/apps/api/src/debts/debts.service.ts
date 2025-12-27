import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, User } from '@generated/prisma';
import { CommandBus } from '@nestjs/cqrs';
import { AddDebtCommand } from './commands/debts/addDebt/add-debt.command';
import { DebtDto } from '@/dtos/debt.dto';
import { RemoveDebtCommand } from './commands/debts/removeDebt/remove-debt.command';
import { EditDebtCommand } from './commands/debts/editDebt/edit-debt.command';

@Injectable()
export class DebtsService {
  constructor(
    private prisma: PrismaService,
    private commandBus: CommandBus,
  ) {}

  async seed() {
    const userIds = ['1', '2', '3', '4'];
    const names = ['', 'Phương', 'Pha', 'Thịnh', 'Tuấn'];

    const users: User[] = [];

    for (const userId of userIds) {
      const existingUser = await this.prisma.user.create({
        data: {
          id: userId,
          name: names[parseInt(userId)],
        },
      });

      users.push(existingUser);
    }

    for (const creditorId of userIds) {
      for (const debtorId of userIds) {
        await this.prisma.statistic.create({
          data: {
            creditorId,
            debtorId,
            totalLent: 0,
            totalOwed: 0,
          },
        });
      }
    }
  }

  async AddDebt(debt: DebtDto, tx?: Prisma.TransactionClient) {
    return this.commandBus.execute(new AddDebtCommand(debt, tx));
  }

  async RemoveDebt(debt: DebtDto, tx?: Prisma.TransactionClient) {
    return this.commandBus.execute(new RemoveDebtCommand(debt, tx));
  }

  async EditDebt(debt: DebtDto, tx?: Prisma.TransactionClient) {
    return this.commandBus.execute(new EditDebtCommand(debt, tx));
  }
}
