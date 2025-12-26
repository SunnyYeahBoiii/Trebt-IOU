import { BillDto } from "@/dtos/bill.dto";
import { DebtDto } from "@/dtos/debt.dto";
import { Bill, BillType } from "@generated/prisma";
import { Injectable } from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";
import { EditBillCommand } from "./commands/editBill/edit-bill.command";
import { AddBillCommand } from "./commands/addBill/add-bill.command";
import { DeleteBillCommand } from "./commands/deleteBill/delete-bill.command";



@Injectable()
export class BillService {
    constructor(
        private commandBus: CommandBus,
    ){}

    async addBill(billInfo: BillDto){
        return this.commandBus.execute(new AddBillCommand(billInfo));
    }

    async editBill(billInfo: BillDto){
        return this.commandBus.execute(new EditBillCommand(billInfo));
    }

    async deleteBill(billId: string){
        return this.commandBus.execute(new DeleteBillCommand(billId));
    }

    createDebtDtoFromBill(bill : Bill) : DebtDto[]{
        const debts : DebtDto[] = []

        const debtors : string[] = bill.debtorIDs.split(',');

        const debtAmount = (
            bill.billType == BillType.EACHONE
            ? bill.totalAmount / (debtors.length)
            : bill.totalAmount
        )

        for (let debtor in debtors){
            debts.push({
                creditorId: bill.creditorId,
                debtorId: debtor,
                amount: debtAmount,
                billId: bill.id as string,
            })
        }

        return debts;
    }
}