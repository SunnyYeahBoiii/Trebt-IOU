import type { BillDto } from "@/dtos/bill.dto";
import { addDotsToMoney } from "@/helper/amountDots.helper";
import { idsToNames } from "@/helper/idToName.helper";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { EditDialog } from "./EditDialog";
import loadingGif from "@/assets/icons8-loading.png"

interface DialogProps {
    openEditBill: (data: BillDto) => void;
    closeDialog: () => void;
    data: BillDto,
}

export function Options({closeDialog , data } : DialogProps){

    const [isLoading , setLoading] = useState<boolean>(false);
    const [showingEditBil , toggleEditBill] = useState<boolean>(false);
    const [redeemDialog , toggleRedeem] = useState<boolean>(false);
    const deleteBillRef = useRef<HTMLButtonElement | null>(null);
    const dialogRef = useRef<HTMLDivElement | null>(null);

    const deleteBill = async (id: string) => {
        if(deleteBillRef.current){
            deleteBillRef.current.disabled = true;
        }
        const data = {
            billId : id,
        }

        setLoading(true);
        axios.post('https://trebt-iou-api.onrender.com/v1/bills/remove' , data)
            .then(() => {alert('Nợ đã được xóa'); closeDialog(); setLoading(false)})
            .catch(err => {alert(err)
                if(deleteBillRef.current){
                    deleteBillRef.current.disabled = false;
                }
                setLoading(false);
            })
    }

    useEffect(() => {
        console.log(1);
        if(showingEditBil){
            if(dialogRef.current) dialogRef.current.style.display = "none";
        }else if(dialogRef.current) dialogRef.current.style.display = "flex";
    } , [showingEditBil ])

    return (<>
        <div className="fixed top-0 left-0 w-screen h-screen bg-(--bg) opacity-70 backdrop-blur-3xl cursor-not-allowed "></div>
        {/* 1. Đảm bảo không có dấu $ ở đây */}
{isLoading && (
  <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center">
    {/* Lớp phủ tối riêng cho Loading để ngăn user bấm vào bên dưới */}
    <div className="absolute inset-0 bg-(--bg) opacity-70 backdrop-blur-md"></div>
    
    {/* Nội dung Loading - Dùng flexbox để căn giữa thay vì top-1/2 left-1/2 */}
        <div className="relative flex flex-col items-center z-[101]">
        <img 
            src={loadingGif} 
            alt="loading"
            style={{ width: '50px', height: '50px' }} 
            className="animate-spin mb-2"
        />
        <p className="font-medium text-white">Sending data to server</p>
        </div>
    </div>
    )}
        <div ref={dialogRef} className="dialog-wrapper fixed bg-(--btn) max-w-[70vw] left-1/2 top-1/2 z-10 -translate-1/2 rounded-2xl">
            <div className="dialog h-full w-full text-center p-[20px] flex flex-col justify-between">
                <h2>More Options</h2>

                <ul className="wrap-break-word text-left">
                    <li>Chủ nợ: {idsToNames(data?.creditorId)}</li>
                    <li>Người nợ: {idsToNames(data?.debtorIDs)}</li>
                    <li>Số tiền: {addDotsToMoney(data?.totalAmount)}</li>
                    <li>Ghi chú: {data?.description}</li>
                    <li>Ngày tạo: {new Date(data.createdAt as Date).toLocaleDateString('vi-VN')}</li>
                    <li>Lần cập nhật gần nhất: {new Date(data.updatedAt as Date).toLocaleDateString('vi-VN')}</li>
                </ul>

                <ul className = "flex flex-row justify-between">
                    <li><div className={`cursor-pointer pl-5 pr-5 pt-2 pb-2 bg-(--clr) rounded-xl hover:scale-105`} onClick={() => {if(!redeemDialog){toggleEditBill(true)}}}>Chỉnh nợ</div></li>
                    <li><div className="cursor-pointer pl-5 pr-5 pt-2 pb-2 ml-2 mr-2 bg-(--clr) rounded-xl hover:scale-105" onClick={() => toggleRedeem(true)}>Xóa nợ</div></li>
                    <li><div className="cursor-pointer pl-5 pr-5 pt-2 pb-2 bg-(--clr) rounded-xl hover:scale-105" onClick={() => {if(!redeemDialog){closeDialog()}}}>Tắt Dialog</div></li>
                </ul>
                
            </div>
        </div>

        { showingEditBil && 
            <EditDialog setLoading={setLoading} closeEditBill={() => toggleEditBill(false)} closeDialog={closeDialog} data={data} />
        }

        {redeemDialog &&
        <>
            <div className="dialog-wrapper fixed bg-(--clr) left-1/2 top-1/2 z-10 -translate-1/2 rounded-2xl">
                <div className="p-2">
                <h3 className="text-center">Hỏi lại</h3>
                <p>Bạn có chắc chắn muốn xóa nợ?</p>
                <ul className = "flex flex-row justify-around">
                    <li><button ref={deleteBillRef} className="cursor-pointer min-w-[100px] pl-5 pr-5 pt-2 pb-2 bg-(--btn) rounded-xl hover:scale-105 text-center" onClick={async () => {await deleteBill(data.id as string)}}>Có</button></li>
                    <li><div className="cursor-pointer pl-5 pr-5 pt-2 pb-2 ml-2 mr-2 bg-(--btn) rounded-xl hover:scale-105" onClick={() => toggleRedeem(false)}>Không</div></li>
                    </ul>
                </div>
            </div>
        </>
        }
    </>)
}