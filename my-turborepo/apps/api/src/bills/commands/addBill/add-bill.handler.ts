import { PrismaService } from "@/prisma/prisma.service";
import { Injectable } from "@nestjs/common";
import { AddBillCommand } from "./add-bill.command";
import { ICommandHandler } from "@nestjs/cqrs";
import { DebtsService } from "@/debts/debts.service";
import { BillService } from "@/bills/bill.service";
import { DebtDto } from "@/dtos/debt.dto";
import { Debt } from "@generated/prisma";



@Injectable()
export class AddBillHandler implements ICommandHandler<AddBillCommand, true> {
    constructor(
        private readonly prisma: PrismaService,
        private readonly debt: DebtsService,
        private readonly bill: BillService,
    ){}

    async execute(command: AddBillCommand): Promise<void> {
        const billInfo = command.billInfo;
        
        const transaction = this.prisma.$transaction(async (prisma) => {
            const newBill = await prisma.bill.create({
                data: {
                    creditorId: billInfo.creditorId,
                    debtorIDs: billInfo.debtorIDs,
                    description: billInfo.description ?? "",
                    totalAmount: billInfo.amount,
                    billType: billInfo.billType,
                }
            });

            const debts: DebtDto[] = this.bill.createDebtDtoFromBill(newBill);

            for (let debt of debts){
                await this.debt.AddDebt(debt);
            }
        });

        return await transaction;
    }
}