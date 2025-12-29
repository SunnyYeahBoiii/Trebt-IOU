import type { DebtDto } from "@/dtos/debt.dto";
import { useEffect, useState } from "react";
import loadingGif from "@/assets/icons8-loading.png";
import { idsToNames } from "@/helper/idToName.helper";
import { addDotsToMoney } from "@/helper/amountDots.helper";


export function Statistic(){
    const [isLoading , setLoading] = useState<boolean>(true);
    const [currentData , setData] = useState<boolean>(false);
    const [debt , setDebt] = useState<number[][]>([[0 , 0 , 0 , 0 , 0 ] ,
                                                    [0 , 0 , 0 , 0 , 0 ] ,
                                                    [0 , 0 , 0 , 0 , 0 ] ,
                                                    [0 , 0 , 0 , 0 , 0 ] , 
                                                    [0 , 0 , 0 , 0 , 0 ]]); 
    useEffect(() => {
        fetch('https://trebt-iou-api.onrender.com/v1/statistic')
            .then(data => data.json())
            .then(data => {
                for(let stat of data){
                    console.log(stat.creditorId);
                    console.log(stat.debtorId);
                    console.log(stat.totalOwed - stat.totalLent)
                    console.log("DEBUG" , debt[parseInt(stat.creditorId)][parseInt(stat.debtorId)].toString() , parseInt(stat.creditorId) , parseInt(stat.debtorId))
                    setDebt(oldDebt => {
                        oldDebt[parseInt(stat.creditorId)][parseInt(stat.debtorId)] = Math.max(0 , Math.round(stat.totalOwed - stat.totalLent)) + 10000000;
                        return oldDebt
                    })
                }
                setLoading(false);    
                setData(true);
            })
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
                            <th className="p-2.5  border-white border-3 border-t-0 border-l-0 text-center"></th>
                            <th className="p-2.5 border-white border-3 border-t-0 text-center">Phương</th>
                            <th className="p-2.5 border-white border-3 border-t-0 text-center">Pha</th>
                            <th className="p-2.5 border-white border-3 border-t-0 text-center">Thịnh</th>
                            <th className="p-2.5 border-white border-3 border-t-0 border-r-0 text-center">Tuấn</th>
                        </tr>
                    </thead>

                    <tbody>
                        <tr>
                            <th className="p-2.5 border-white border-3 border-t-0 border-l-0 text-center">Phương</th>
                            <th className="p-1 border-white border-3 border-t-0 text-center align-middle">{addDotsToMoney(debt[1][1])}</th>
                            <th className="p-1 border-white border-3 border-t-0 text-center align-middle">{addDotsToMoney(debt[1][2])}</th>
                            <th className="p-1 border-white border-3 border-t-0 text-center align-middle">{addDotsToMoney(debt[1][3])}</th>
                            <th className="p-1 border-white border-3 border-t-0 border-r-0 text-center align-middle">{addDotsToMoney(debt[1][4])}</th>
                        </tr>
                        <tr>
                            <th className="p-2.5 border-white border-3 border-t-0 border-l-0 text-center">Pha</th>
                            <th className="p-1 border-white border-3 border-t-0 text-center">{addDotsToMoney(debt[2][1])}</th>
                            <th className="p-1 border-white border-3 border-t-0 text-center">{addDotsToMoney(debt[2][2])}</th>
                            <th className="p-1 border-white border-3 border-t-0 text-center">{addDotsToMoney(debt[2][3])}</th>
                            <th className="p-1 border-white border-3 border-t-0 border-r-0 text-center">{addDotsToMoney(debt[2][4])}</th>
                        </tr>
                        <tr>
                            <th className="p-2.5 border-white border-3 border-t-0 border-l-0 text-center">Thịnh</th>
                            <th className="p-1 border-white border-3 border-t-0 text-center">{addDotsToMoney(debt[3][1])}</th>
                            <th className="p-1 border-white border-3 border-t-0 text-center">{addDotsToMoney(debt[3][2])}</th>
                            <th className="p-1 border-white border-3 border-t-0 text-center">{addDotsToMoney(debt[3][3])}</th>
                            <th className="p-1 border-white border-3 border-t-0 border-r-0 text-center">{addDotsToMoney(debt[3][4])}</th>
                        </tr>
                        <tr>
                            <th className="p-2.5 border-white border-3 border-t-0 border-l-0 text-center">Tuấn</th>
                            <th className="p-1 border-white border-3 border-t-0 text-center">{addDotsToMoney(debt[4][1])}</th>
                            <th className="p-1 border-white border-3 border-t-0 text-center">{addDotsToMoney(debt[4][2])}</th>
                            <th className="p-1 border-white border-3 border-t-0 text-center">{addDotsToMoney(debt[4][3])}</th>
                            <th className="p-1 border-white border-3 border-t-0 border-r-0 text-center">{addDotsToMoney(debt[4][4])}</th>
                        </tr>
                    </tbody>
                </table>
            </div>
        }
    </>)
}