import type { BillDto } from "@/dtos/bill.dto";
import { useState, useCallback } from "react";
import loadingGif from "@/assets/icons8-loading.png";
import { Options } from "./dialogs/Options";
import { idsToNames } from "@/helper/idToName.helper";
import { addDotsToMoney } from "@/helper/amountDots.helper";
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import { Card, Table, Stack } from "../../ui";
import { TableHeader } from "../../ui/layouts/TableHeader";
import { TableCell } from "../../ui/layouts/TableCell";

export interface DashboardInputProps {
    linkQuery: string;
}

export function Dashboard({ linkQuery }: DashboardInputProps) {
    const fetchData = useCallback(async () => {
        const data = await apiFetch(`/bills/query?${linkQuery}`).then(data => data.json());
        return data;
    }, [linkQuery]);

    const query = useQuery<BillDto[]>({
        queryKey: ['data', linkQuery],
        queryFn: fetchData,
    });

    const [dialogData, setDialogData] = useState<BillDto>({
        id: "1",
        creditorId: "1",
        debtorIDs: "1",
        createdAt: new Date(),
        updatedAt: new Date(),
        totalAmount: 0,
        billType: "SPLITTING",
        description: "none"
    });

    const [showingOptions, toggleOptions] = useState<boolean>(false);

    const openOptions = (data: BillDto) => {
        setDialogData(data);
        toggleOptions(true);
    };

    const closeOptions = () => {
        toggleOptions(false);
    };

    const openEditBill = (data: BillDto) => {
        setDialogData(data);
    };

    return (
        <>
            {query.isLoading && (
                <Card className="w-auto rounded-xl min-w-[50vw] min-h-[calc(max(500px,50vh))] flex flex-col justify-center items-center">
                    <img src={loadingGif} alt="Computer man" style={{ width: '50px', height: '50px' }} className="animate-spin text-center content-center" />
                    <p>Fetching data from server</p>
                </Card>
            )}

            {query.data && (
                <Card className="p-0 overflow-hidden h-[calc(max(500px,55vh))] [&::-webkit-scrollbar]:w-0">
                    <div className="overflow-auto h-full">
                        <Table>
                            <colgroup>
                                <col className="w-[15%]" />
                                <col className="w-[30%]" />
                                <col className="w-[15%]" />
                                <col className="w-[30%]" />
                                <col className="w-[10%]" />
                            </colgroup>
                            <thead>
                                <tr>
                                    <TableHeader className="border-white border-3 border-t-0 border-l-0 text-center">Chủ nợ</TableHeader>
                                    <TableHeader className="border-white border-3 border-t-0 text-center">Người nợ</TableHeader>
                                    <TableHeader className="border-white border-3 border-t-0 text-center">Số Tiền</TableHeader>
                                    <TableHeader className="border-white border-3 border-t-0 text-center">Ghi chú</TableHeader>
                                    <TableHeader className="border-white border-3 border-t-0 border-r-0 text-center"></TableHeader>
                                </tr>
                            </thead>
                            <tbody>
                                {query.data.map(data => (
                                    <tr key={data.id}>
                                        <TableCell className="border-white border-3 border-l-0 text-center truncate">
                                            {idsToNames(data.creditorId)}
                                        </TableCell>
                                        <TableCell className="border-white border-3 text-center truncate">
                                            {idsToNames(data.debtorIDs)}
                                        </TableCell>
                                        <TableCell className="border-white border-3 text-center truncate">
                                            {addDotsToMoney(data.totalAmount)}
                                        </TableCell>
                                        <TableCell className="border-white border-3 text-center truncate">
                                            {data.description}
                                        </TableCell>
                                        <TableCell className="border-white border-3 border-r-0 text-center truncate cursor-pointer" onClick={() => openOptions(data)}>
                                            ...
                                        </TableCell>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                </Card>
            )}

            {showingOptions && (
                <Options openEditBill={openEditBill} closeDialog={closeOptions} data={dialogData} />
            )}
        </>
    );
}
