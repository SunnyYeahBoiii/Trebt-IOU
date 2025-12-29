import type { BillDto } from "@/dtos/bill.dto";
import axios from "axios";
import React, { useRef, useState } from "react";

interface DialogProps {
    setLoading: (state: boolean) => void;
    closeEditBill: () => void;
    closeDialog: () => void;
    data: BillDto,
}

export function EditDialog({  setLoading, closeEditBill , closeDialog , data } : DialogProps){
    const [totalAmount , setTotalAmount] = useState<number>(data.totalAmount);
    const [creditorId , setCreditorId] = useState<number>(0);
    const submitButtonRef = useRef<HTMLButtonElement>(null)

    const handleChangeAmount = (e : React.ChangeEvent<HTMLInputElement>) => {
        setTotalAmount(parseInt(e.target.value));
    } 

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        console.log(submitButtonRef)
        if(submitButtonRef.current){
            submitButtonRef.current.disabled = true;
        }

        const formData = new FormData(e.currentTarget);

        const creditorId: FormDataEntryValue | null = formData.get('creditor');
        const debtors: FormDataEntryValue[] = formData.getAll('debtor');
        const debtorIDs: string = debtors.join(',');
        const totalAmount: FormDataEntryValue | null = formData.get('totalAmount');
        const description: FormDataEntryValue | null = formData.get('description');

        console.log(data.id);
        console.log(creditorId);
        console.log(debtorIDs);
        console.log(totalAmount);
        console.log(description);

        if(!creditorId || !debtorIDs || !totalAmount || totalAmount === "0"){
            if(submitButtonRef.current){
                submitButtonRef.current.disabled = false;
            }
            const message = `${!creditorId ? "Chủ nợ không được phép rỗng!\n" : ""}${!debtorIDs ? "Người nợ bắt buộc phải có 1 người!\n" : ""}${!totalAmount || totalAmount === "0" ? "Bắt buộc phải có số tiền và khác không!\n" : ""}`;
            alert(message);
            return;
        }

        const Bill = {
            id: data.id,
            description: description,
            creditorId: creditorId,
            debtorIDs: debtorIDs,
            totalAmount: parseInt(totalAmount as string),
            billType: "SPLITTING",
        }        

        setLoading(true);
        axios.post('https://trebt-iou-api.onrender.com/v1/bills/edit' , Bill)
            .then(() => {
                alert('Cập nhật thành công!'); 
                if(submitButtonRef.current){
                    submitButtonRef.current.disabled = false;
                }
                setLoading(false);
                closeDialog();
            })
            .catch(error => {
                alert(error)
                if(submitButtonRef.current){
                    submitButtonRef.current.disabled = false;
                }
                setLoading(false);
            })
    }

    return (<>
        <div className="dialog-wrapper fixed bg-(--btn) left-1/2 top-1/2 z-10 -translate-1/2 rounded-2xl">
            <div className="dialog h-full w-full text-center p-[20px]">

                <form className="h-full flex flex-col justify-between" onSubmit={(e) => handleSubmit(e)}>
                <h2>Chỉnh sửa Bill</h2>
                <ul className="wrap-break-word text-left h-[80%] flex flex-col justify-around">
                    <li className="flex flex-row justify-between pb-1">Chủ nợ: 
                        <span>
                            <input onClick={() => setCreditorId(1)} type="radio" id="creditor-Phuong" value="1" name = "creditor" />
                            <label htmlFor="creditor-Phuong">Phương</label>
                        </span>

                        <span>
                            <input onClick={() => setCreditorId(2)} type="radio" id="creditor-Pha" value="2" name = "creditor" />
                            <label htmlFor="creditor-Pha">Pha</label>
                        </span>
                            
                        <span>
                            <input onClick={() => setCreditorId(3)} type="radio" id="creditor-Thinh" value="3" name = "creditor" />
                            <label htmlFor="creditor-Thinh">Thịnh</label>
                        </span>

                        <span>
                            <input onClick={() => setCreditorId(4)} type="radio" id="creditor-Tuan" value="4" name = "creditor" />
                            <label htmlFor="creditor-Tuan">Tuấn</label>
                        </span>
                    </li>
                    
                    <li className="flex flex-row justify-between pb-1">Người nợ: 
                        <span>
                            <input disabled={creditorId === 1} type="checkbox" id="debtor-Phuong" name="debtor" value="1"/>
                            <label htmlFor="debtor-Phuong">Phương</label>
                        </span>

                        <span>
                            <input disabled={creditorId === 2}  type="checkbox" id="debtor-Pha" name="debtor" value="2"/>
                            <label htmlFor="debtor-Pha">Pha</label>
                        </span>
                            
                        <span>
                            <input disabled={creditorId === 3}  type="checkbox" id="debtor-Thinh" name="debtor" value="3"/>
                            <label htmlFor="debtor-Thinh">Thịnh</label>
                        </span>

                        <span>
                            <input disabled={creditorId ===4}  type="checkbox" id="debtor-Tuan" name="debtor" value="4"/>
                            <label htmlFor="debtor-Tuan">Tuấn</label>
                        </span>
                    </li>

                    <li className="flex flex-row justify-between pb-1">
                        Số tiền: 
                        <input min={0} name="totalAmount" type="number" onChange={(e) => handleChangeAmount(e)}  className="text-right bg-(--clr) rounded-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" value={totalAmount} />
                    </li>
                    <li className="pb-1">
                        Ghi chú: <br></br>
                        <textarea name = "description" className="h-[100px] w-full bg-(--clr) rounded-sm resize-none" defaultValue={data?.description}></textarea>
                    </li>
                </ul>
                
                <ul className = "flex flex-row justify-around">
                    <li><button ref={submitButtonRef} type="submit" className="pl-5 pr-5 pt-2 pb-2 bg-(--clr) rounded-xl hover:scale-105">Cập nhật</button></li>
                    <li><div className="pl-5 pr-5 pt-2 pb-2 bg-(--clr) rounded-xl hover:scale-105" onClick={() => closeEditBill()}>Quay lại</div></li>
                </ul>
                </form>

                
            </div>
        </div>
    </>)
}