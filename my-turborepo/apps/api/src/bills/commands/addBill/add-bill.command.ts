import { type BillDto } from "@/dtos/bill.dto";
import { Injectable } from "@nestjs/common";
import { Command } from "@nestjs/cqrs";


@Injectable()
export class AddBillCommand extends Command<void>{
    constructor(public billInfo: BillDto){
        super();
    }
}