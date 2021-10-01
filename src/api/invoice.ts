import {InvoiceInput} from "../components/Invoice";
import {ax} from "./base";


export const SaveInvoice = (invoice: InvoiceInput) => {
    return ax.post("/invoice/", invoice)
}