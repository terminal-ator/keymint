import React from 'react';
import {usePendingOrders} from "../Hooks/Orders";
import {Link} from "react-router-dom";
import {Button} from "antd";

const PendingOrder = ()=>{

    const { orders, hasFailed, isLoading, retry } = usePendingOrders();

    return(
        <div style={{ padding: 15,
            display: "flex",
            flexDirection: "column",
            boxShadow: " 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)", width: "200px",
            height: "200px",
            marginTop: 10, marginLeft: 10, borderRadius: 5}} >
            <h6>Pending Orders</h6>
            {
                isLoading ? "Loading": null
            }
            {
                hasFailed ? "Failed to fetch orders" : null
            }
            {
               !hasFailed && !isLoading && orders && orders.data ?
                    `${orders.data} Orders`:"No orders pending"
            }
            <Link to={"/orders"} ><a>View all</a></Link>
            <Button style={{ alignSelf: "flex-end   "}} onClick={async ()=>{
                await retry();
            }} type="ghost">Refresh</Button>
        </div>
    )
}

export default PendingOrder;