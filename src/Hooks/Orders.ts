import useSwr from "swr";
import {GeneralResponse} from "../types/response";
import {fetcher} from "../api/base";
interface orderStatus{
    orderPending: number
}

export const usePendingOrders = () =>{
    const { data, error, revalidate } = useSwr<GeneralResponse<number>>("/order/pending", fetcher);
    console.log({ data });
    return{
        orders: data,
        hasFailed: error,
        isLoading: !error && !data,
        retry: revalidate
    }
}