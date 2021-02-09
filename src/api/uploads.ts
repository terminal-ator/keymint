import {ax} from "./base";
import {AuthHeader} from "./auth";

export const PostFileUpload = async (
    companyName: string,
    saleId: number,
    formdata: FormData
) => {
    return ax.post(
        `/upload/sales?company=${companyName}&sales=${saleId}`,
        formdata,
        {
            headers: AuthHeader()
        }
    );
};