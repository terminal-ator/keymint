import {ax, fetcher} from "./base";
import {AuthHeader} from "./auth";


export const DownloadLedgerVouchers = async (ledgerID: number, startDate:string, endDate:string)=>{
    return ax.get(`/journals/download/${ledgerID}?start=${startDate}&end=${endDate}`, { headers : AuthHeader(), responseType:"blob"});
}

export const DownloadTrialBalance = async (date: string)=>{
    return ax.get(`/journals/trial?date=${date}`, { headers: AuthHeader(), responseType:"blob" },)
}