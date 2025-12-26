import { Injectable } from "@nestjs/common";
import { ICommandHandler } from "@nestjs/cqrs";
import { EditBillCommand } from "./edit-bill.command";
import { PrismaService } from "@/prisma/prisma.service";
import { BillService } from "@/bills/bill.service";
import { instanceToInstance, plainToClass, plainToInstance } from "class-transformer";
import { BillDto } from "@/dtos/bill.dto";
import { Bill } from "@generated/prisma";
import { DebtsService } from "@/debts/debts.service";


@Injectable()
export class EditBillHandler implements ICommandHandler<EditBillCommand , boolean>{
    constructor(
        private readonly prisma: PrismaService,
        private readonly bill: BillService,
        private readonly debt: DebtsService,
    ){}

    async execute(command: EditBillCommand): Promise<boolean> {
        const bill = command.bill;

        const trans = this.prisma.$transaction(async (prisma) => {
            const id = bill.id;

            const newBill = await prisma.bill.update({
                where: {
                    id: id,
                },
                data: {
                    billType: bill.billType,
                    creditorId: bill.creditorId,
                    debtorIDs: bill.debtorIDs,
                    totalAmount: bill.totalAmount,
                }
            })

            const debts = this.bill.createDebtDtoFromBill(newBill);
            const debtors = [false , false , false , false , false]

            for (let debt of debts){
                debtors[parseInt(debt.id as string)] = true;
                await this.debt.EditDebt(debt);
            }

            for (let i = 1 ; i <= 4 ; i++){
                if(debtors[i] === true) continue;

                await this.debt.EditDebt({
                    creditorId: newBill.creditorId,
                    debtorId: `${i}`,
                    amount: 0,
                    billId: newBill.id,
                })
            }
            return true;
        });

        return await trans;
    }
}
