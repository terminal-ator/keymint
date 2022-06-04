import {InvoiceInput} from "../components/Invoice";
import {ax} from "./base";
import { GeneralResponse } from "../types/response";


export const SaveInvoice = (invoice: InvoiceInput) => {
    return ax.post<GeneralResponse<InvoiceInput>>("/invoice/", invoice)
}