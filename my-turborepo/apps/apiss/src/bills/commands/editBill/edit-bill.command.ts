import { type BillDto } from "@/dtos/bill.dto";
import { Injectable } from "@nestjs/common";
import { Command } from "@nestjs/cqrs";

@Injectable()
export class EditBillCommand extends Command<boolean>{
    constructor(public readonly bill: BillDto){
        super();
    }
}