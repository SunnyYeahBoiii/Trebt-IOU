export class DebtDto {
    id?: string;
    creditorId: string;
    debtorId: string;
    amount: number;
    billId: string;
}