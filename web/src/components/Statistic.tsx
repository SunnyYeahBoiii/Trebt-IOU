import { useEffect, useState } from "react";
import { addDotsToMoney } from "@/helper/amountDots.helper";
import { apiFetch } from "@/lib/api";
import { showToast } from "@/lib/toast";
import { getUserEntries } from "@/config/users";
import { Card, Spinner, Table, TableCell, TableHeader } from "@/ui";

type StatisticRow = {
    creditorId: string;
    debtorId: string;
    totalOwed: number;
    totalLent: number;
};

const USERS = getUserEntries();
const createMatrix = () =>
    Array.from({ length: USERS.length + 1 }, () => Array(USERS.length + 1).fill(0));

export function Statistic() {
    const [isLoading, setLoading] = useState<boolean>(true);
    const [hasData, setHasData] = useState<boolean>(false);
    const [debt, setDebt] = useState<number[][]>(createMatrix);

    useEffect(() => {
        apiFetch('/statistic')
            .then(data => data.json())
            .then((data: StatisticRow[]) => {
                const nextDebt = createMatrix();
                data.forEach((stat) => {
                    const creditorIdx = parseInt(stat.creditorId, 10);
                    const debtorIdx = parseInt(stat.debtorId, 10);
                    if (!Number.isFinite(creditorIdx) || !Number.isFinite(debtorIdx)) return;
                    if (!nextDebt[creditorIdx] || nextDebt[creditorIdx][debtorIdx] === undefined) return;
                    nextDebt[creditorIdx][debtorIdx] += Math.max(0, Math.round(stat.totalOwed - stat.totalLent));
                });
                setDebt(nextDebt);
                setLoading(false);
                setHasData(true);
            })
            .catch((err) => {
                console.error("Failed to fetch statistics:", err);
                showToast("Không thể tải thống kê", "error");
                setLoading(false);
            });
    }, []);

    if (isLoading) {
        return (
            <Card className="flex min-h-[320px] items-center justify-center">
                <div className="flex flex-col items-center gap-3 text-(--text-muted)">
                    <Spinner />
                    <p className="text-sm font-medium">Đang tải thống kê</p>
                </div>
            </Card>
        );
    }

    if (!hasData) {
        return (
            <Card className="border-(--err) bg-(--err-state)">
                <p className="font-semibold text-(--err)">Không thể tải thống kê.</p>
            </Card>
        );
    }

    return (
        <Card className="overflow-hidden p-0">
            <div className="overflow-auto">
                <Table className="min-w-[680px]">
                    <caption className="sr-only">Ma trận thống kê nợ giữa các thành viên</caption>
                    <thead>
                        <tr>
                            <TableHeader className="sticky left-0 top-0 z-20">Người nợ</TableHeader>
                            {USERS.map(([, name]) => (
                                <TableHeader key={name} className="sticky top-0 z-10 text-right">
                                    {name}
                                </TableHeader>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {USERS.map(([rowId, rowName]) => (
                            <tr key={rowId} className="transition-colors hover:bg-(--surface-raised)">
                                <TableCell className="sticky left-0 z-10 bg-(--surface) font-semibold">
                                    {rowName}
                                </TableCell>
                                {USERS.map(([colId]) => {
                                    const value = debt[Number(rowId)]?.[Number(colId)] ?? 0;
                                    return (
                                        <TableCell
                                            key={colId}
                                            className={`text-right tabular-nums ${
                                                value > 0 ? "font-semibold text-(--text)" : "text-(--text-muted)"
                                            }`}
                                        >
                                            {addDotsToMoney(value)}
                                        </TableCell>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>
        </Card>
    );
}
