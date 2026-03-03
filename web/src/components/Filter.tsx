import { useRef, useState } from "react";
import { Dashboard } from "./Dashboard";

export function Filter(){
    const submitButtonRef = useRef<HTMLButtonElement>(null)
    const [queryLink , setQueryLink] = useState<string>("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if(submitButtonRef.current){
            submitButtonRef.current.disabled = true;
        }

        const formData = new FormData(e.currentTarget);

        const creditorId: FormDataEntryValue[] = formData.getAll('creditor') ?? "";
        const creditorIds: string = creditorId.join(','); 
        const debtors: FormDataEntryValue[] = formData.getAll('debtor') ?? "";
        const debtorIDs: string = debtors.join(',');   

        setQueryLink(`creditorIds=${creditorId}&debtorIds=${debtorIDs}`)
        if(submitButtonRef.current){
            submitButtonRef.current.disabled = false;
        }
    }

    return (<>
        <div className="table-wrapper mb-4 rounded-xl bg-(--btn) flex flex-col overflow-auto [&::-webkit-scrollbar]:w-0">
            <div className="table p-2">
                <h2 className="text-center">Filter</h2>
                <form onSubmit={handleSubmit}>
                    <ul className="wrap-break-word text-left h-[80%] flex flex-col justify-around">
                    <li className="flex flex-row justify-between pb-1">Filter theo Chủ nợ: 
                        <span>
                            <input type="checkbox" id="creditor-Phuong" value="1" name = "creditor" />
                            <label htmlFor="creditor-Phuong">Phương</label>
                        </span>

                        <span>
                            <input type="checkbox" id="creditor-Pha" value="2" name = "creditor" />
                            <label htmlFor="creditor-Pha">Pha</label>
                        </span>
                            
                        <span>
                            <input type="checkbox" id="creditor-Thinh" value="3" name = "creditor" />
                            <label htmlFor="creditor-Thinh">Thịnh</label>
                        </span>

                        <span>
                            <input type="checkbox" id="creditor-Tuan" value="4" name = "creditor" />
                            <label htmlFor="creditor-Tuan">Tuấn</label>
                        </span>
                    </li>
                    
                    <li className="flex flex-row justify-between pb-1">Filter theo Người nợ: 
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
                </ul>
                
                <ul className = "flex flex-row justify-around">
                    <li><button ref={submitButtonRef} type="submit" className="pl-5 pr-5 pt-2 pb-2 bg-(--clr) rounded-xl hover:scale-105">Filter</button></li>
                </ul>
                </form>
            </div>
        </div>

        {queryLink && 
            <Dashboard linkQuery={queryLink} />
        }
    </>);
}