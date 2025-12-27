import { ConflictException, Injectable } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RemoveDebtCommand } from './remove-debt.command';
import { PrismaService } from '@/prisma/prisma.service';
import { StatisticService } from '@/statistics/statistic.service';

@Injectable()
@CommandHandler(RemoveDebtCommand)
export class RemoveDebtHandler implements ICommandHandler<RemoveDebtCommand> {
  constructor(
    private prisma: PrismaService,
    private statistics: StatisticService,
  ) {}

  async execute(command: RemoveDebtCommand): Promise<boolean | null> {
    const newDebtDto = command.debtDto;
    const prisma = command.tx ?? this.prisma;

    const newDebt = await prisma.debt.delete({
      where: {
        billId_debtorId: {
          billId: newDebtDto.billId,
          debtorId: newDebtDto.debtorId,
        },
      },
    });

    if (!newDebt) {
      throw new ConflictException('Debt not found');
    }

    await this.statistics.addLent(
      newDebt.debtorId,
      newDebt.creditorId,
      -newDebt.amount,
      prisma,
    );
    await this.statistics.addOwed(
      newDebt.creditorId,
      newDebt.debtorId,
      -newDebt.amount,
      prisma,
    );

    return true;
  }
}
