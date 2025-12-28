import type { BillDto } from "@/dtos/bill.dto";
import { useEffect, useState } from "react";
import loadingGif from "@/assets/icons8-loading.png";


export function Dashboard(){

    const [isLoading , setLoading] = useState<boolean>(true);
    const [currentData , setData] = useState<BillDto[] | null>(null)
    const [userNames , setName] = useState<string[]>(['' , 'Phương' , 'Pha' , 'Thịnh' , 'Tuấn'])

    useEffect(() => {
        fetch('https://trebt-iou-api.onrender.com/v1/bills/query')
            .then(data => data.json())
            .then(data => {
                setLoading(false);
                setData(data);    
            })
    } , [] )

    const idsToNames = (input : string): string => {
        const ids = input.split(',')
        let names: string = ""
        let first: boolean = true;
        for(const id of ids){
            if(!first) names += ','
            names += userNames[parseInt(id)]
            first = false;
        }
        return names;
    }

    return (<>
        
        {isLoading && 
        <div className="dashboard-wrapper w-auto rounded-xl bg-(--btn) min-w-[50vw] min-h-[calc(max(500px,50vh))] flex flex-col justify-center items-center">
            <img src={loadingGif} alt="Computer man" style={{width: '50px', height: '50px'}} className="animate-spin text-center content-center"/>
            <p>Fetching data from server</p>
        </div>
        }

        {currentData && 
            <div className="table-wrapper rounded-xl bg-(--btn) min-h-[calc(max(500px,50vh))] flex flex-col border">
                <table className="table-fixed w-full">
                    <colgroup>
                        <col className="w-1/5" />
                        <col className="w-1/5" />
                        <col className="w-1/5" />
                        <col className="w-1/5" />
                        <col className="w-1/5" />
                    </colgroup>
                    <thead>
                        <tr>
                            <th className="p-2.5">Chủ nợ</th>
                            <th className="p-2.5">Người nợ</th>
                            <th className="p-2.5">Số Tiền</th>
                            <th className="p-2.5">Ghi chú</th>
                            <th className="p-2.5">Settings</th>
                        </tr>
                    </thead>

                    <tbody>
                    {currentData.map(data => 
                        <tr key={data.id}>
                            <td className="p-2.5">{idsToNames(data.creditorId)}</td>
                            <td className="p-2.5">{idsToNames(data.debtorIDs)}</td>
                            <td className="p-2.5">{data.totalAmount}</td>
                            <td className="p-2.5">{data.description}</td>
                            <td className="p-2.5">...</td>
                        </tr>
                    )}
                    </tbody>
                </table>
                    
            </div>
        }
    </>);
}