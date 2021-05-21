import React, {useEffect, useState} from 'react';
import {Master} from "../types/master";
import {GeneralResponse} from "../types/response";
import useSWR from "swr";
import {fetcher} from "../api/base";
import moment from "moment";
import {Button, Checkbox, DatePicker, message} from "antd";
import {getBankWiseStatements} from "../api";
import {fetchOrderByID, fetchOrders, toggleOrderLineByID} from "../api/orders";
import {AxiosResponse} from "axios";
import {Link, Route, useParams, useHistory} from 'react-router-dom';
import {Sku} from "./ProductFormV2";
import {stateSelector} from "../reducers";

export interface OrderLine {
    id: number;
    quantity: number;
    asking_rate: number;
    sku: Sku;
    processed: boolean;
}

export interface Order {
    id: number;
    master_id: number;
    master: Master;
    created_at: string;
    updated_at: string;
    order_processed: boolean;
    company_id: number;
    lines?: OrderLine[];
}

export interface OrderResult {
    start_date: string;
    end_date: string;
    orders: Order[]
}

const OrderDetail = () => {
    const {id} = useParams()
    const history = useHistory()
    const [order, setOrder] = useState<Order>();
    const beats = stateSelector(stt => stt.beats.beats)
    
    const fetchOrder = () => {
        if (id !== undefined) {
            try {
                fetchOrderByID(id).then((res) => {
                    setOrder(res.data.data)
                })
            } catch (e) {
                message.error("There was some error processing your request.")
            }
        }
    }

    const toggleOrderID = async (id: number, toggle: boolean)=>{
        try{
            await toggleOrderLineByID({id,toggle});
            await fetchOrder();
        }catch (e) {
            message.error("There was an error toggling the order line")
        }
    }

    useEffect(() => {
        if (id) {
            fetchOrder()
        }
    }, [id])

    return (
        <div style={{
            minHeight: "100%", width: "40%",
            position: "absolute",
            borderLeft: "1px solid #f2f2f2",
            background: "white", right: 0, top: 0,
            display: "flex",
            maxHeight:"100%",
            alignItems: "stretch",
        }}>
            <div style={{display: "grid",gridTemplateRows: "2fr 8fr 1fr", width:"100%" ,position: "relative"}}>
                <div style={{ paddingLeft: "10px"}}>
                    <h2>
                    {
                        order?.master.name
                    }
                </h2>
                    <span style={{ color:"rgb(142,142,147)"}}>
                    {
                       order && beats && beats.normalized[order?.master.beat_id]?.name
                    }
                    </span>
                </div>
                <div style={{ overflowY: "scroll", paddingLeft:10}}>
                    <div>
                        <li style={{ display: "flex",borderBottom:"1px solid #f2f2f2", color:"rgb(142,142,147)"}}>
                            <span style={{flexBasis: "5%"}}/>
                            <span style={{ flexBasis:"10%" }}>S.No.</span>
                            <span style={{ flexBasis: "30%",}}>
                                    Sku Name
                                </span>
                            <span style={{ flexBasis: "15%"}}>
                                Unit
                            </span>
                            <span style={{ flexBasis: "20%"}}>
                                    Quantity
                                </span>
                            <span>
                                Ask. Rate
                            </span>
                        </li>
                        {
                            order && order.lines?.map((ord,idx)=><li
                                key={ord.id}
                                style={{ display: "flex",borderBottom:"1px solid #f2f2f2", paddingTop:5, paddingBottom:5}}
                            >
                                <span style={{ flexBasis:"5%"}}><Checkbox onChange={async (e)=>{
                                    await toggleOrderID(ord.id,e.target.checked);
                                }} defaultChecked={ord.processed} /></span>
                                <span style={{ flexBasis:"10%" }}>{idx+1}.</span>
                                <span style={{ flexBasis: "30%"}}>
                                    { ord.sku.name }
                                </span>
                                <span style={{ flexBasis:"15%"}}>
                                    { ord.sku.unit}
                                </span>
                                <span style={{ flexBasis: "20%"}}>
                                    {ord.quantity}
                                </span>
                                <span>
                                   ₹{ ord.asking_rate }
                                </span>
                            </li>)
                        }
                    </div>
                </div>
                <div style={{ borderTop: "1px solid #f2f2f2", paddingLeft: 10, paddingTop:10}} >
                    <Button onClick={() => {
                        history.replace("/orders")
                    }}>Done</Button>
                </div>
            </div>
        </div>
    )
}

const OrderView = () => {
    type M = GeneralResponse<OrderResult>
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("")
    const [orderResult, setOrderResult] = useState<OrderResult>();

    const getOrder = () => {
        fetchOrders(startDate, endDate).then((res) => {
            setStartDate(res.data.data.start_date)
            setEndDate(res.data.data.end_date)
            console.log([res.data])
            setOrderResult(res.data.data)
        })
    }

    useEffect(() => {
        getOrder()
    }, [])

    useEffect(() => {
        getOrder()
    }, [startDate, endDate])


    return (
        <div style={{paddingRight: 10, paddingLeft: 10, position: "relative", flex: "auto"}}>
            <DatePicker.RangePicker
                defaultValue={[
                    moment(),
                    moment()
                ]}
                onChange={(date, datestring) => {
                    setStartDate(datestring[0]);
                    setEndDate(datestring[1])
                }}
            />
            <ul style={{ maxHeight:"700px", overflowY:"scroll"}}>
                {
                    orderResult && orderResult.orders?.map((ord) =>
                        <Link to={`/orders/${ord.id}`} key={ord.id}>
                            <li key={ord.id} style={{
                                display: "flex",
                                paddingTop: 10, paddingBottom: 10, maxWidth: "80%",
                                borderBottom: "1px solid #f2f2f2"
                            }}>
                         <span style={{flexBasis: "20%"}}>
                            {moment(ord.created_at).format("LL h:mma")}
                        </span>
                                <span style={{flexBasis: "60%"}}>
                            {ord.master.name}
                        </span>
                                <span style={{flexBasis: "10%"}}>
                            {
                                ord.order_processed ? "Processed" : "Pending"
                            }
                        </span>
                            </li>
                        </Link>
                    )
                }
            </ul>
            <Route exact path={"/orders/:id"} component={OrderDetail}/>
        </div>
    )

}

export default OrderView;