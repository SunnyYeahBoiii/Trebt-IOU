import { useEffect } from "react";


export function Dashboard(){

    useEffect(() => {
        const data = fetch('https://trebt-iou-api.onrender.com/v1/bills/query').then()
        console.log(data);
    } , [] )

    return (<>
        <div className="dashboard-wrapper rounded-xl bg-(--btn) min-w-[50vw] min-h-[50vh]">

        </div>
    </>);
}