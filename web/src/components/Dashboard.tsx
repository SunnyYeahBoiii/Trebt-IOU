import type { BillDto } from "@/dtos/bill.dto";
import { useState, useCallback } from "react";
import { Options } from "./dialogs/Options";
import { idsToNames } from "@/helper/idToName.helper";
import { addDotsToMoney } from "@/helper/amountDots.helper";
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import { Button, Card, Spinner, Table, TableHeader, TableCell } from "@/ui";

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

    const bills = query.data ?? [];
    const total = bills.reduce((sum, bill) => sum + bill.totalAmount, 0);

    return (
        <>
            {query.isLoading && (
                <Card className="flex min-h-[320px] items-center justify-center">
                    <div className="flex flex-col items-center gap-3 text-(--text-muted)">
                        <Spinner />
                        <p className="text-sm font-medium">Đang tải dữ liệu</p>
                    </div>
                </Card>
            )}

            {query.isError && (
                <Card className="border-(--err) bg-(--err-state)">
                    <p className="font-semibold text-(--err)">Không thể tải danh sách nợ.</p>
                </Card>
            )}

            {!query.isLoading && !query.isError && (
                <Card className="overflow-hidden p-0">
                    <div className="flex flex-col gap-1 border-b border-(--border) bg-(--surface) px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-sm font-semibold text-(--text-muted)">
                            {bills.length} giao dịch
                        </p>
                        <p className="text-sm font-semibold text-(--text-muted)">
                            Tổng: <span className="text-(--text)">{addDotsToMoney(total)}</span>
                        </p>
                    </div>

                    {bills.length === 0 ? (
                        <div className="px-4 py-12 text-center text-sm text-(--text-muted)">
                            Chưa có khoản nợ nào phù hợp.
                        </div>
                    ) : (
                    <>
                    <div className="divide-y divide-(--border) sm:hidden">
                        {bills.map((data) => (
                            <div key={data.id} className="px-4 py-4">
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <p className="font-semibold text-(--text)">{idsToNames(data.creditorId)}</p>
                                        <p className="mt-1 text-sm text-(--text-muted)">{idsToNames(data.debtorIDs)}</p>
                                    </div>
                                    <p className="shrink-0 font-semibold tabular-nums text-(--text)">
                                        {addDotsToMoney(data.totalAmount)}
                                    </p>
                                </div>
                                <p className="mt-3 text-sm text-(--text-muted)">{data.description}</p>
                                <div className="mt-3 flex justify-end">
                                    <Button type="button" variant="secondary" className="min-h-8 px-3 py-1.5" onClick={() => openOptions(data)}>
                                        Mở
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="hidden max-h-[62vh] overflow-auto sm:block">
                        <Table className="min-w-[760px]">
                            <caption className="sr-only">Danh sách khoản nợ</caption>
                            <colgroup>
                                <col className="w-[18%]" />
                                <col className="w-[24%]" />
                                <col className="w-[18%]" />
                                <col className="w-[30%]" />
                                <col className="w-[10%]" />
                            </colgroup>
                            <thead>
                                <tr>
                                    <TableHeader className="sticky top-0 z-10">Chủ nợ</TableHeader>
                                    <TableHeader className="sticky top-0 z-10">Người nợ</TableHeader>
                                    <TableHeader className="sticky top-0 z-10 text-right">Số tiền</TableHeader>
                                    <TableHeader className="sticky top-0 z-10">Ghi chú</TableHeader>
                                    <TableHeader className="sticky top-0 z-10 text-right">Thao tác</TableHeader>
                                </tr>
                            </thead>
                            <tbody>
                                {bills.map(data => (
                                    <tr key={data.id} className="transition-colors hover:bg-(--surface-raised)">
                                        <TableCell className="font-semibold">
                                            {idsToNames(data.creditorId)}
                                        </TableCell>
                                        <TableCell className="text-(--text-muted)">
                                            {idsToNames(data.debtorIDs)}
                                        </TableCell>
                                        <TableCell className="text-right font-semibold tabular-nums">
                                            {addDotsToMoney(data.totalAmount)}
                                        </TableCell>
                                        <TableCell className="max-w-[260px] truncate text-(--text-muted)" title={data.description}>
                                            {data.description}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button type="button" variant="secondary" className="min-h-8 px-3 py-1.5" onClick={() => openOptions(data)}>
                                                Mở
                                            </Button>
                                        </TableCell>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                    </>
                    )}
                </Card>
            )}

            {showingOptions && (
                <Options openEditBill={openEditBill} closeDialog={closeOptions} data={dialogData} />
            )}
        </>
    );
}
