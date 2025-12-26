import { ConflictException, Injectable } from "@nestjs/common";
import { ICommandHandler } from "@nestjs/cqrs";
import { EditDebtCommand } from "./edit-debt.command";
import { PrismaService } from "@/prisma/prisma.service";
import { StatisticService } from "@/statistics/statistic.service";



@Injectable()
export class EditDebtHandler implements ICommandHandler<EditDebtCommand , boolean>{
    constructor(
        private prisma: PrismaService,
        private statistics: StatisticService,
    ){}

    async execute(command: EditDebtCommand): Promise<boolean> {
        const debtInfo = command.debt;

        const trans = this.prisma.$transaction(async (prisma) => {
            const oldDebt = await prisma.debt.findFirst({
                where: {
                    id: debtInfo.id
                },
            })

            if(!oldDebt){
                throw new ConflictException("Debt does not exists");
            }
            
            this.statistics.addLent(oldDebt.debtorId , oldDebt.creditorId, -oldDebt.amount);
            this.statistics.addOwed(oldDebt.creditorId, oldDebt.debtorId, -oldDebt.amount);
            
            const newDebt = await prisma.debt.update({
                where: {
                    id: debtInfo.id
                },
                data: {
                    amount: debtInfo.amount,
                }
            })

            this.statistics.addLent(newDebt.debtorId , newDebt.creditorId, newDebt.amount);
            this.statistics.addOwed(newDebt.creditorId, newDebt.debtorId, newDebt.amount);
            
            return true;
        })

        return await trans;
    }
}