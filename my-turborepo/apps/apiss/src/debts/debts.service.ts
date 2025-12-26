import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@generated/prisma';
import { CommandBus } from '@nestjs/cqrs';
import { AddDebtCommand } from './commands/debts/addDebt/add-debt.command';
import { DebtDto } from '@/dtos/debt.dto';
import { RemoveDebtCommand } from './commands/debts/removeDebt/remove-debt.command';

@Injectable()
export class DebtsService {
  constructor(
    private prisma: PrismaService,
    private commandBus: CommandBus,
  ) {}

  async seed() {
    const userIds = ['1', '2', '3', '4'];
    const names = ['' , 'Phương' , 'Pha' , 'Thịnh' , 'Tuấn']

    const users : User[] = [];

    for (const userId of userIds){
      const existingUser = await this.prisma.user.create({
        data: {
          id: userId,
          name: names[userId],
        },
      }); 
      
      users.push(existingUser);
    }

    for (const creditorId of userIds) {
      for (const debtorId of userIds) {
        console.log(creditorId , debtorId)

        await this.prisma.statistic.create(
            {
                data: {
                    creditorId,
                    debtorId,
                    totalLent: 0,
                    totalOwed: 0,
                },
            }
        );
      }
    }
  }

  async AddDebt(debt: DebtDto){
    return this.commandBus.execute(new AddDebtCommand(debt));
  }

  async RemoveDebt(debt: DebtDto){
    return this.commandBus.execute(new RemoveDebtCommand(debt));
  }

  async EditDebt(debt: DebtDto){
    return this.commandBus.execute(new RemoveDebtCommand(debt));
  }
}
