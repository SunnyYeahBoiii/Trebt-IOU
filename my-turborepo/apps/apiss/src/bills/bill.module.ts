import { DebtsService } from "@/debts/debts.service";
import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { BillService } from "./bill.service";
import { DebtsModule } from "@/debts/debts.module";



@Module({
    imports: [
        CqrsModule,
        DebtsModule,
    ],
    exports: [ BillService ]
})
export class BillModule{}