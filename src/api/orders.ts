import {ax} from "./base";
import { GeneralResponse } from "../types/response";
import {Order, OrderResult} from "../components/orderView";
import {AuthHeader} from "./auth";

export const fetchOrders = (sd: string, ed: string)=> ax.get<GeneralResponse<OrderResult>>(
    `/order?start_date=${sd}&end_date=${ed}`,
    {
        headers: AuthHeader()
    }
)

export const fetchOrderByID = (id: string)=> ax.get<GeneralResponse<Order>>(
    `/order/byID/${id}`,
    {
        headers: AuthHeader()
    }
)

export const toggleOrderLineByID = (packet:{ id: number, toggle: boolean }) => ax.post<GeneralResponse<Boolean>>(
    `/order/toggle`,
    packet,
    {
        headers: AuthHeader()
    }
)

export const toggleOrderStatus = (id: number)=> ax.post(
    `/order/byID/${id}`,{},{
        headers: AuthHeader()
    }
)