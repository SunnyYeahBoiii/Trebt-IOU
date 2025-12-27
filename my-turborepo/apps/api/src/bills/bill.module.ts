import { DebtsService } from "@/debts/debts.service";
import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { BillService } from "./bill.service";
import { DebtsModule } from "@/debts/debts.module";
import { AddBillHandler } from "./commands/addBill/add-bill.handler";
import { EditBillHandler } from "./commands/editBill/edit-bill.handler";
import { DeleteBillHandler } from "./commands/deleteBill/delete-bill.handler";
import { PrismaModule } from "@/prisma/prisma.module";

const Handlers = [AddBillHandler , EditBillHandler , DeleteBillHandler];

@Module({
    imports: [
        CqrsModule,
        DebtsModule,
        PrismaModule,
    ],
    providers: [BillService , ...Handlers],
    exports: [BillService]
})
export class BillModule{}