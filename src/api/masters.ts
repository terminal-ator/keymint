import {ax} from "./base";
import {AuthHeader} from "./auth";


export const GetMasters = async ()=> {
    const req = await ax.get(`/master/`, {
        headers: AuthHeader() } );
    return req.data;
};

export const GetUploadCompanies = async (companyID: number) => {
    return ax.get(`/uplcompany/${companyID}`);
};