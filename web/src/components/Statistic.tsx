import { useEffect, useState } from "react";
import loadingGif from "@/assets/icons8-loading.png";
import { addDotsToMoney } from "@/helper/amountDots.helper";
import { apiFetch } from "@/lib/api";
import { showToast } from "../../lib/toast";


export function Statistic(){
    const [isLoading , setLoading] = useState<boolean>(true);
    const [currentData , setData] = useState<boolean>(false);
    const [debt , setDebt] = useState<number[][]>([[0 , 0 , 0 , 0 , 0 ] ,
                                                    [0 , 0 , 0 , 0 , 0 ] ,
                                                    [0 , 0 , 0 , 0 , 0 ] ,
                                                    [0 , 0 , 0 , 0 , 0 ] ,
                                                    [0 , 0 , 0 , 0 , 0 ]]);
    useEffect(() => {
        apiFetch('/statistic')
            .then(data => data.json())
            .then((data: Array<{ creditorId: string; debtorId: string; totalOwed: number; totalLent: number }>) => {
                setDebt(oldDebt => {
                    return oldDebt.map((row, creditorIdx) => {
                        const stat = data.find(s => parseInt(s.creditorId) === creditorIdx);
                        if (!stat) return row;
                        return row.map((cell, debtorIdx) => {
                            if (parseInt(stat.debtorId) === debtorIdx) {
                                return Math.max(0, Math.round(stat.totalOwed - stat.totalLent));
                            }
                            return cell;
                        });
                    });
                });
                setLoading(false);
                setData(true);
            })
            .catch((err) => {
                console.error("Failed to fetch statistics:", err);
                showToast("Không thể tải thống kê", "error");
                setLoading(false);
            });
    } , [] )

    return (<>
        {isLoading &&
        <div className="dashboard-wrapper w-auto rounded-xl bg-(--btn) min-w-[50vw] min-h-[calc(max(500px,50vh))] flex flex-col justify-center items-center">
            <img src={loadingGif} alt="Computer man" style={{width: '50px', height: '50px'}} className="animate-spin text-center content-center"/>
            <p>Fetching data from server</p>
        </div>
        }

        {currentData &&
            <div className="table-wrapper rounded-xl bg-(--btn) h-auto flex flex-col overflow-auto [&::-webkit-scrollbar]:w-0">
                <table className="table-fixed w-full">
                    <colgroup>
                        <col className="w-[20%]" />
                        <col className="w-[20%]" />
                        <col className="w-[20%]" />
                        <col className="w-[20%]" />
                        <col className="w-[20%]" />
                    </colgroup>
                    <thead>
                        <tr>
                            <th className="p-2.5 relative border-white border-3 border-t-0 border-l-0 text-center">
                            </th>
                            <th className="p-2.5 border-white border-3 border-t-0 text-center truncate">Phương</th>
                            <th className="p-2.5 border-white border-3 border-t-0 text-center truncate">Pha</th>
                            <th className="p-2.5 border-white border-3 border-t-0 text-center truncate">Thịnh</th>
                            <th className="p-2.5 border-white border-3 border-t-0 border-r-0 text-center truncate">Tuấn</th>
                        </tr>
                    </thead>

                    <tbody>
                        <tr>
                            <th className="p-2.5 border-white border-3 border-t-0 border-l-0 text-center truncate">Phương</th>
                            <th className="p-1 border-white border-3 border-t-0 text-center align-middle truncate">{addDotsToMoney(debt[1][1])}</th>
                            <th className="p-1 border-white border-3 border-t-0 text-center align-middle truncate">{addDotsToMoney(debt[1][2])}</th>
                            <th className="p-1 border-white border-3 border-t-0 text-center align-middle truncate">{addDotsToMoney(debt[1][3])}</th>
                            <th className="p-1 border-white border-3 border-t-0 border-r-0 text-center align-middle truncate">{addDotsToMoney(debt[1][4])}</th>
                        </tr>
                        <tr>
                            <th className="p-2.5 border-white border-3 border-t-0 border-l-0 text-center truncate">Pha</th>
                            <th className="p-1 border-white border-3 border-t-0 text-center truncate">{addDotsToMoney(debt[2][1])}</th>
                            <th className="p-1 border-white border-3 border-t-0 text-center truncate">{addDotsToMoney(debt[2][2])}</th>
                            <th className="p-1 border-white border-3 border-t-0 text-center truncate">{addDotsToMoney(debt[2][3])}</th>
                            <th className="p-1 border-white border-3 border-t-0 border-r-0 text-center truncate">{addDotsToMoney(debt[2][4])}</th>
                        </tr>
                        <tr>
                            <th className="p-2.5 border-white border-3 border-t-0 border-l-0 text-center truncate">Thịnh</th>
                            <th className="p-1 border-white border-3 border-t-0 text-center truncate">{addDotsToMoney(debt[3][1])}</th>
                            <th className="p-1 border-white border-3 border-t-0 text-center truncate">{addDotsToMoney(debt[3][2])}</th>
                            <th className="p-1 border-white border-3 border-t-0 text-center truncate">{addDotsToMoney(debt[3][3])}</th>
                            <th className="p-1 border-white border-3 border-t-0 border-r-0 text-center truncate">{addDotsToMoney(debt[3][4])}</th>
                        </tr>
                        <tr>
                            <th className="p-2.5 border-white border-3 border-t-0 border-l-0 text-center truncate border-b-0">Tuấn</th>
                            <th className="p-1 border-white border-3 border-t-0 text-center truncate border-b-0">{addDotsToMoney(debt[4][1])}</th>
                            <th className="p-1 border-white border-3 border-t-0 text-center truncate border-b-0">{addDotsToMoney(debt[4][2])}</th>
                            <th className="p-1 border-white border-3 border-t-0 text-center truncate border-b-0">{addDotsToMoney(debt[4][3])}</th>
                            <th className="p-1 border-white border-3 border-t-0 border-r-0 text-center truncate border-b-0">{addDotsToMoney(debt[4][4])}</th>
                        </tr>
                    </tbody>
                </table>
            </div>
        }
    </>)
}
