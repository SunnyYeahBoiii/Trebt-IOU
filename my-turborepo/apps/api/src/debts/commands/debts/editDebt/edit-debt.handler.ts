import { ConflictException, Injectable } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { EditDebtCommand } from "./edit-debt.command";
import { PrismaService } from "@/prisma/prisma.service";
import { StatisticService } from "@/statistics/statistic.service";



@Injectable()
@CommandHandler(EditDebtCommand)
export class EditDebtHandler implements ICommandHandler<EditDebtCommand , boolean>{
    constructor(
        private prisma: PrismaService,
        private statistics: StatisticService,
    ){}

    async execute(command: EditDebtCommand): Promise<boolean> {
        const debtInfo = command.debt;
        const prisma = command.tx ?? this.prisma

        console.log("DEBUGGG")
        console.log(debtInfo)
        const oldDebt = await prisma.debt.findFirst({
            where: {
                creditorId: debtInfo.creditorId,
                debtorId: debtInfo.debtorId,
                billId: debtInfo.billId,
            },
        })

        if(!oldDebt){
            throw new ConflictException("Debt does not exists");
        }
        
        await this.statistics.addLent(oldDebt.debtorId , oldDebt.creditorId, -oldDebt.amount, prisma);
        await this.statistics.addOwed(oldDebt.creditorId, oldDebt.debtorId, -oldDebt.amount, prisma);
        
        const newDebt = await prisma.debt.update({
            where: {
                ...oldDebt
            },
            data: {
                amount: debtInfo.amount,
            }
        })

        console.log(newDebt)

        await this.statistics.addLent(newDebt.debtorId , newDebt.creditorId, newDebt.amount, prisma);
        await this.statistics.addOwed(newDebt.creditorId, newDebt.debtorId, newDebt.amount, prisma);
        
        return true;

    }
}