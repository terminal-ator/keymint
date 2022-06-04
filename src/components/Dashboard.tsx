import React from 'react';
import PendingOrder from "./PendingOrders";

const Dashboard = ()=>{
    return(
        <div style={{ width: 600, margin:"0px auto"}}>
            <h2>Dashboard</h2>
            <div style={{display: "flex"}}>
                <PendingOrder />
            </div>
        </div>
    )
}

export default Dashboard;