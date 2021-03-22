import {ax} from "./base";
import {AuthHeader} from "./auth";

export const ApproveJournals = (jID: number[])=>{
    return ax.post("/journals/approve", jID, { headers: AuthHeader()});
}