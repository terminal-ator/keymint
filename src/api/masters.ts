import {ax} from "./base";
import {AuthHeader} from "./auth";
import {GeneralResponse} from "../types/response";
import {Account} from "../types/ledger";


export const GetMasters = async ()=> {
    const req = await ax.get(`/master/`, {
        headers: AuthHeader() } );
    return req.data;
};

export const GetUploadCompanies = async (companyID: number) => {
    return ax.get(`/uplcompany/${companyID}`);
};

export const GetAccountsForMaster = async (masterID: number)=>{
    return ax.get<GeneralResponse<Array<Account>>>(`/master/${masterID}`, { headers: AuthHeader()})
}

export const PostUpdateAccountName = async (accountID: number, name: string)=>{
    return ax.post<GeneralResponse<null>>(`/master/account/${accountID}?name=${name}`,{},{headers: AuthHeader()});
}