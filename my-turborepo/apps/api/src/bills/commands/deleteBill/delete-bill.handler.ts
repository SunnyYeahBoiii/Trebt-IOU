import { BeforeApplicationShutdown, Injectable } from "@nestjs/common";
import { ICommand, ICommandHandler } from "@nestjs/cqrs";
import { DeleteBillCommand } from "./delete-bill.command";
import { PrismaService } from "@/prisma/prisma.service";
import { DebtsService } from "@/debts/debts.service";
import { DebtDto } from "@/dtos/debt.dto";
import { instanceToInstance } from 'class-transformer'
import { Debt } from "@generated/prisma";
import { BillService } from "@/bills/bill.service";


@Injectable()
export class DeleteBillHandler implements ICommandHandler<DeleteBillCommand , boolean>{
    constructor(
        private prisma: PrismaService,
        private debt: DebtsService,
        private bill: BillService,
    ){}

    async execute(command: DeleteBillCommand): Promise<boolean> {
        const billId = command.billId;

        const transaction = this.prisma.$transaction(async (prisma) => {
            const bill = await prisma.bill.delete({    
                where:{
                    id: billId,
                }
            })

            const debts = this.bill.createDebtDtoFromBill(bill);

            for (let debt of debts){
                await this.debt.RemoveDebt(debt);
            }

            return true;
        })

        return await transaction;
    }
}