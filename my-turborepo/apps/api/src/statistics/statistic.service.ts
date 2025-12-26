import { Injectable } from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";
import { AddLentCommand } from "./commands/addLent/add-lent.command";
import { AddOwedCommand } from "./commands/addOwed/add-owed.command";


@Injectable()
export class StatisticService {
    constructor(
        private commandBus: CommandBus,
    ){}

    async addLent(debtorId: string, creditorId: string, amount: number): Promise<void> {
        return this.commandBus.execute( new AddLentCommand(debtorId, creditorId, amount) );
    }

    async addOwed(creditorId: string, debtorId: string, amount: number): Promise<void> {
        return this.commandBus.execute( new AddOwedCommand(creditorId, debtorId, amount) );
    }
}