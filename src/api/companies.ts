import axios from "axios";
import {ax} from "./base";
import {message} from "antd";
import {AuthHeader} from "./auth";
import {CreateCompanyType, FullCompany} from "../types/company";

export const GetCompanies = async () => {
    try{
        let req = await ax.get(`/company/all`, { headers: AuthHeader() });
        return req.data.companies;
    }catch (e) {
        message.error("Failed to fetch companies")
    }

};

export const SelectCompanyApi = async (companyID: number)=>{
    return ax.post(`/company/select/${companyID}`, {},{ headers: AuthHeader() });
}


export const createCompany = async (item: CreateCompanyType)=>{
    return ax.post(`/company/`, item, { headers: AuthHeader() } );
}

export const FetchCompany = async ()=>{
    return ax.get(`/company/`)
}

export const UpdateCompany = async ( company: FullCompany) => {
    return ax.put('/company/', company);
}