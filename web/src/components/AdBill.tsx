import { useRef, useState } from "react";
import axios from "axios";

export function AddBill(){
    const [totalAmount , setTotalAmount] = useState<number>(0);
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

        if(!formData.get('creditor')) return;

        const creditorId: FormDataEntryValue | null = formData.get('creditor');
        const debtors: FormDataEntryValue[] = formData.getAll('debtor');
        const debtorIDs: string = debtors.join(',');
        const totalAmount: FormDataEntryValue | null = formData.get('totalAmount');
        const description: FormDataEntryValue | null = formData.get('description');

        console.log(creditorId);
        console.log(debtorIDs);
        console.log(totalAmount);
        console.log(description);

        if(!creditorId || !debtorIDs || !totalAmount || totalAmount === "0"){
            const message = `${!creditorId ? "Chủ nợ không được phép rỗng!\n" : ""}${!debtorIDs ? "Người nợ bắt buộc phải có 1 người!\n" : ""}${!totalAmount || totalAmount === "0" ? "Bắt buộc phải có số tiền và khác không!\n" : ""}`;
            alert(message);
            return;
        }

        const Bill = {
            description: description,
            creditorId: creditorId,
            debtorIDs: debtorIDs,
            totalAmount: parseInt(totalAmount as string),
            billType: "SPLITTING",
        }        

        axios.post('https://trebt-iou-api.onrender.com/v1/bills/add' , Bill)
            .then(() => {
                alert('Thêm nợ thành công!'); 
                if(submitButtonRef.current){
                    submitButtonRef.current.disabled = false;
                }
            })
            .catch(error => {
                alert(error)
                if(submitButtonRef.current){
                    submitButtonRef.current.disabled = false;
                }
            })
    }

    return (<>
        <div className="table-wrapper rounded-xl bg-(--btn) flex flex-col overflow-auto [&::-webkit-scrollbar]:w-0">
            <div className="table p-2">
                <h2 className="text-center">Thêm Nợ</h2>
                <form onSubmit={handleSubmit}>
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
                            <input type="checkbox" id="debtor-Phuong" name="debtor" value="1"/>
                            <label htmlFor="debtor-Phuong">Phương</label>
                        </span>

                        <span>
                            <input type="checkbox" id="debtor-Pha" name="debtor" value="2"/>
                            <label htmlFor="debtor-Pha">Pha</label>
                        </span>
                            
                        <span>
                            <input type="checkbox" id="debtor-Thinh" name="debtor" value="3"/>
                            <label htmlFor="debtor-Thinh">Thịnh</label>
                        </span>

                        <span>
                            <input type="checkbox" id="debtor-Tuan" name="debtor" value="4"/>
                            <label htmlFor="debtor-Tuan">Tuấn</label>
                        </span>
                    </li>

                    <li className="flex flex-row justify-between pb-1">
                        Số tiền: 
                        <input min={0} name="totalAmount" type="number" onChange={(e) => handleChangeAmount(e)}  className="text-right bg-(--clr) rounded-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" value={totalAmount} />
                    </li>
                    <li className="pb-1">
                        Ghi chú: <br></br>
                        <textarea name = "description" className="h-[100px] w-full bg-(--clr) rounded-sm resize-none" placeholder="Nhập ghi chú ở đây"></textarea>
                    </li>
                </ul>
                
                <ul className = "flex flex-row justify-around">
                    <li><button ref={submitButtonRef} type="submit" className="pl-5 pr-5 pt-2 pb-2 bg-(--clr) rounded-xl hover:scale-105">Cập nhật</button></li>
                </ul>
                </form>
            </div>
        </div>
    </>);
}