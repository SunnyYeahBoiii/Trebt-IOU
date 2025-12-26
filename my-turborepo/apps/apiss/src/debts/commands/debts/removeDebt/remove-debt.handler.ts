import { ConflictException, Injectable } from "@nestjs/common";
import { ICommandHandler } from "@nestjs/cqrs";
import { RemoveDebtCommand } from "./remove-debt.command";
import { Debt } from "@generated/prisma";
import { PrismaService } from "@/prisma/prisma.service";
import { StatisticService } from "@/statistics/statistic.service";



@Injectable()
export class RemoveDebtHandler implements ICommandHandler<RemoveDebtCommand> {
    constructor(
        private prisma: PrismaService,
        private statistics : StatisticService,
    ){}

    async execute(command: RemoveDebtCommand): Promise<boolean | null> {
        const newDebtDto = command.debtDto;

        const trans = this.prisma.$transaction(async (prisma) => {
            const newDebt = await prisma.debt.findUnique({
                where: {
                    id : newDebtDto.id,
                    creditorId: newDebtDto.creditorId,
                    debtorId: newDebtDto.debtorId,
                }
            });

            if(!newDebt) {
                throw new ConflictException("Debt not found");
            }

            this.statistics.addLent(newDebt.debtorId, newDebt.creditorId, -newDebt.amount);
            this.statistics.addOwed(newDebt.creditorId, newDebt.debtorId, -newDebt.amount);
        
            return true;
        })

        return await trans;
    }
}