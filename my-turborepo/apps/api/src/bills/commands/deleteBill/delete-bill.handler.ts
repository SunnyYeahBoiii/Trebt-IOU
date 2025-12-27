import { BeforeApplicationShutdown, Injectable } from "@nestjs/common";
import { CommandHandler, ICommand, ICommandHandler } from "@nestjs/cqrs";
import { DeleteBillCommand } from "./delete-bill.command";
import { PrismaService } from "@/prisma/prisma.service";
import { DebtsService } from "@/debts/debts.service";
import { DebtDto } from "@/dtos/debt.dto";
import { instanceToInstance } from 'class-transformer'
import { Debt } from "@generated/prisma";
import { BillService } from "@/bills/bill.service";


@Injectable()
@CommandHandler(DeleteBillCommand)
export class DeleteBillHandler implements ICommandHandler<DeleteBillCommand , void>{
    constructor(
        private prisma: PrismaService,
        private debt: DebtsService,
        private bill: BillService,
    ){}

    async execute(command: DeleteBillCommand): Promise<void> {
        const billId = command.billId;

        const transaction = this.prisma.$transaction(async (prisma) => {
            const bill = await prisma.bill.findUnique({    
                where:{
                    id: billId,
                }
            })

            if(!bill) throw new Error('Bill no longer exists')
            
            const debts = this.bill.createDebtDtoFromBill(bill);

            for (let debt of debts){
                await this.debt.RemoveDebt(debt , prisma);
            }

            await prisma.bill.delete({    
                where:{
                    id: billId,
                }
            })
        })

        return await transaction;
    }
}