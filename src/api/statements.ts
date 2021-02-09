import {ax} from "./base";
import {AuthHeader} from "./auth";

interface StatementMaster {
    statement_id: number;
    cust_id: number;
    company_id: number;
}
export const PostStatementMaster = async (arg: StatementMaster) => {
    return ax.post("/statements", arg);
};

export const GetBankWiseStatements = async (bankID: number, startDate:string, endDate:string) => {
    return ax.get(`/statements/${bankID}?sd=${startDate}&ed=${endDate}`,{
        headers: AuthHeader() });
};