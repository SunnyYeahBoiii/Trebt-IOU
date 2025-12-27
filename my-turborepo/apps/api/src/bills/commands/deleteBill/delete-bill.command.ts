import { Injectable } from "@nestjs/common";
import { Command } from "@nestjs/cqrs";



@Injectable()
export class DeleteBillCommand extends Command<void>{
    constructor(public billId : string){
        super();
    }
}