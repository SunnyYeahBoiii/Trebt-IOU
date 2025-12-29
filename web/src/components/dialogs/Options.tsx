import type { BillDto } from "@/dtos/bill.dto";
import { addDotsToMoney } from "@/helper/amountDots.helper";
import { idsToNames } from "@/helper/idToName.helper";

interface DialogProps {
    openEditBill: (data: BillDto) => void;
    closeDialog: () => void;
    data: BillDto,
}

export function Options({ openEditBill ,closeDialog , data } : DialogProps){

    return (<>
        <div className="fixed top-0 left-0 w-screen h-screen bg-(--bg) opacity-70 backdrop-blur-3xl cursor-not-allowed "></div>
        <div className="dialog-wrapper fixed bg-(--btn) left-1/2 top-1/2 z-10 -translate-1/2 rounded-2xl">
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
                    <li><div className="pl-5 pr-5 pt-2 pb-2 bg-(--clr) rounded-xl hover:scale-105" onClick={() => {openEditBill(data) , closeDialog()}}>Chỉnh nợ</div></li>
                    <li><div className="pl-5 pr-5 pt-2 pb-2 ml-2 mr-2 bg-(--clr) rounded-xl hover:scale-105">Xóa nợ</div></li>
                    <li><div className="pl-5 pr-5 pt-2 pb-2 bg-(--clr) rounded-xl hover:scale-105" onClick={() => closeDialog()}>Tắt Dialog</div></li>
                </ul>
                
            </div>
        </div>
    </>)
}