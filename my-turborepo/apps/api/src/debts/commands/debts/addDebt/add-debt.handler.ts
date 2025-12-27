import { Injectable } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { AddDebtCommand } from "./add-debt.command";
import { Debt } from "@generated/prisma";
import { PrismaService } from "@/prisma/prisma.service";
import { StatisticService } from "@/statistics/statistic.service";



@Injectable()
@CommandHandler(AddDebtCommand)
export class AddDebtHandler implements ICommandHandler<AddDebtCommand> {
    constructor(
        private prisma: PrismaService,
        private statistics : StatisticService,
    ){}

    async execute(command: AddDebtCommand): Promise<Debt | null> {
        const newDebtDto = command.debtDto;
        const prisma = command.tx ?? this.prisma

        const newDebt = await prisma.debt.create({
            data: {
                amount: newDebtDto.amount,
                creditorId: newDebtDto.creditorId,
                debtorId: newDebtDto.debtorId,
                billId: newDebtDto.billId,
            }
        });

        await this.statistics.addLent(newDebt.debtorId, newDebt.creditorId, newDebt.amount, prisma);
        await this.statistics.addOwed(newDebt.creditorId, newDebt.debtorId, newDebt.amount, prisma);
        
        return newDebt;
        
    }
}