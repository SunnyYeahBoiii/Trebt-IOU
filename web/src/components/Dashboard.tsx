import type { BillDto } from "@/dtos/bill.dto";
import { useEffect, useState } from "react";
import loadingGif from "@/assets/icons8-loading.png";
import { Options } from "./dialogs/Options";
import { idsToNames } from "@/helper/idToName.helper";
import { addDotsToMoney } from "@/helper/amountDots.helper";
import { useQuery } from "@tanstack/react-query"

export interface DashboardInputProps{
    linkQuery: string;
}

export function Dashboard({ linkQuery } : DashboardInputProps){
    const fetchData = async () => {
        const data = await fetch(`https://trebt-iou-api.onrender.com/v1/bills/query?${linkQuery}`)
            .then(data => data.json())
        return data
    }

    const query = useQuery<BillDto[]>({
        queryKey: ['data' , linkQuery],
        queryFn: fetchData,
    })

    const [dialogData , setDialogData] = useState<BillDto>({
        id:"1" ,
        creditorId:"1" ,
        debtorIDs:"1" ,
        createdAt:new Date() ,
        updatedAt:new Date() ,
        totalAmount: 0 ,
        billType: "SPLITTING",
        description: "none"
    });
    
    const [showingOptions , toggleOptions] = useState<boolean>(false);
    const [showingEditBil , toggleEditBill] = useState<boolean>(false);

    useEffect(() => {
    } , [] )

    useEffect(() => {
        if (showingOptions || showingEditBil) {
        // Disable scrolling
            document.body.style.overflow = 'hidden';
        } else {
        // Re-enable scrolling
            document.body.style.overflow = 'unset';
        }

        // Cleanup function to ensure scroll is restored if component unmounts
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [showingOptions , showingEditBil]);

    

    const openOptions = (data: BillDto) => {
        setDialogData(data);
        toggleOptions(true)
    }

    const closeOptions = () => {
        toggleOptions(false);
    }
    
    const openEditBill = (data: BillDto) => {
        setDialogData(data);
        toggleEditBill(true)
    }


    return (<>
        
        {query.isLoading && 
        <div className="dashboard-wrapper w-auto rounded-xl bg-(--btn) min-w-[50vw] min-h-[calc(max(500px,50vh))] flex flex-col justify-center items-center">
            <img src={loadingGif} alt="Computer man" style={{width: '50px', height: '50px'}} className="animate-spin text-center content-center"/>
            <p>Fetching data from server</p>
        </div>
        }

        {query.data && 
            <>
                <div className="table-wrapper rounded-xl bg-(--btn) h-[calc(max(500px,55vh))] flex flex-col overflow-auto [&::-webkit-scrollbar]:w-0">
                    {/* <div className="w-[50px] h-[50px] bg-black"></div> */}
                    <table className="table-fixed w-full">
                        <colgroup>
                            <col className="w-[15%]" />
                            <col className="w-[30%]" />
                            <col className="w-[15%]" />
                            <col className="w-[30%]" />
                            <col className="w-[10%]" />
                        </colgroup>
                        <thead>
                            <tr>
                                <th className="p-2.5 border-white border-3 border-t-0 border-l-0 text-center">Chủ nợ</th>
                                <th className="p-2.5 border-white border-3 border-t-0 text-center">Người nợ</th>
                                <th className="p-2.5 border-white border-3 border-t-0 text-center">Số Tiền</th>
                                <th className="p-2.5 border-white border-3 border-t-0 text-center">Ghi chú</th>
                                <th className="p-2.5 border-white border-3 border-t-0 border-r-0 text-center"></th>
                            </tr>
                        </thead>

                        <tbody>
                        {query.data.map(data => 
                            <tr key={data.id}>
                                <td className="p-2.5 border-white border-3 border-l-0 text-center truncate">{idsToNames(data.creditorId)}</td>
                                <td className="p-2.5 border-white border-3 text-center truncate">{idsToNames(data.debtorIDs)}</td>
                                <td className="p-2.5 border-white border-3 text-center truncate">{addDotsToMoney(data.totalAmount)}</td>
                                <td className="p-2.5 border-white border-3 text-center truncate">{data.description}</td>
                                <td className="p-2.5 border-white border-3 border-r-0 text-center truncate cursor-pointer" onClick={() => openOptions(data)}>...</td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            </>
        }

        { showingOptions &&
            <Options openEditBill={openEditBill} closeDialog={closeOptions} data = {dialogData}/>
        }

        
    </>);
}