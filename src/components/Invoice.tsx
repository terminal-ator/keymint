import React, {FC, useEffect, useState} from 'react';
import {Master} from "../types/master";
import {SkuFromServer} from "./ProductFormV2";
import {stateSelector} from "../reducers";
import moment from "moment";
import {DeNormalize} from "../types/generic";
import NameSelect from "./nameSelect";
import {Button, DatePicker} from "antd";
import SkuSelect from "./SkuSelect";
import dotPropImmutable from "dot-prop-immutable";
import {SaveInvoice} from "../api/invoice";
import {setIn} from "formik";
import {AxiosResponse} from "axios";
import {GeneralResponse} from "../types/response";


export interface InvoiceInput {
    id: number;
    master: Master | null;
    is_gst: boolean;
    date: string;
    to_party: number | null;
    items: ItemInput[] | null;
    company: number;
    from_party: number;
    invoice_no?: string
}

interface ItemInput {
    key: number;
    sku: SkuFromServer | undefined;
    sku_id: number | null;
    rate: number;
    discount: number;
    quantity: number;
}

export interface TaxCategory {
    id: number;
    account_id: number;
    account_name: number;
    taxes: Tax[];
}

interface Tax {
    id: number;
    account_id: number;
    type: string;
    percentage: number;
}

const ID = (): number => {
    return Math.random() * 1000;
}

const generateItemsTemplate = (): ItemInput =>
    ({key: ID(), sku_id: null, discount: 0, quantity: 0, rate: 0.0, sku: undefined})

const Invoice = () => {
    const company = stateSelector(stt => stt.sys.SelectedCompany);
    const masters = stateSelector(stt => stt.master.masters);
    let invoiceTemplate: InvoiceInput = {
        id: ID(),
        date: moment().format("YYYY-MM-DD"),
        is_gst: false,
        items: [],
        master: null,
        to_party: null,
        company: company,
        from_party: company,
        invoice_no: "",
    }
    const [invoice, setInvoice] = useState(invoiceTemplate);
    const [netAmount, setNetAmount] = useState(0);
    const [items, setItems] = useState([generateItemsTemplate()]);
    const normalMasters = DeNormalize<Master>(masters);

    const handleItemChange = (index: number, item: ItemInput) => {
        console.log("Item to be updated,", item)
        const n = dotPropImmutable.set(items, `${index}`, item)
        console.log("Updated items:", n)
        setItems(n);
    }

    useEffect(() => {
        const total = items.reduce((a, b) => {
            return a + b.rate * b.quantity +
                (b.sku?.igst ? b.sku?.igst * b.rate / 100 * b.quantity : 0) +
                (b.sku?.cess ? b.sku?.cess * b.rate / 100 * b.quantity : 0) - b.quantity * b.rate * b.discount / 100
        }, 0)
        setNetAmount(total);
    }, [items])

    const deleteRow = (index: number) => {
        const n = [...items.slice(0, index), ...items.slice(index + 1)]
        setItems(n);
    }

    const saveInvoice = async () => {
        const invoiceOutput = invoice
        invoiceOutput.items = items.filter((itm) => {
            return itm.sku != undefined && itm.quantity > 0 && itm.sku_id != null
        })
        invoiceOutput.id = 0
        console.log({ invoice: invoiceOutput });
        const data  = await SaveInvoice(invoiceOutput);
        if(data.status == 200){
            console.log("Found the invoice", { data })
            setInvoice(data.data.data);
        }
    }
    // get invoice print
    

    // todo: calculate net amount and others hook will come here
    return (
        <div className={"voucherGrid"} style={{display: "flex", flexDirection: "column",}}>
            <div className={"invoice-header"}>
                <div
                    style={{
                        width: "100%",
                        padding: 5,
                        borderRadius: 4,
                        backgroundColor: "#bd3c5f",
                        marginBottom: 5,
                        display: "flex",
                        flexDirection: "row"
                    }}
                ><h4 style={{fontWeight: 900, marginRight: "20px"}}>Sales</h4>
                    <div>
                        <DatePicker value={moment(invoice.date)} onChange={(date) => {
                            const n = dotPropImmutable.set(invoice, 'date', date);
                            setInvoice(n);
                        }}/>
                    </div>
                </div>
            </div>
            <div className={"party-row"} style={{
                display: "flex", alignItems: "center",
                justifyContent: "space-between", width: "100%"
            }}>
                <div style={{display: "flex", alignItems: "center", minWidth: "600px"}}>
                    <span style={{marginRight: "10px"}}>Party</span>
                    <NameSelect onSelect={(cursor: number) => {
                        // select the master and set to invoice
                        const mst = masters.normalized[cursor]
                        const n = dotPropImmutable.set(invoice, 'to_party', mst.cust_id.Int64)
                        console.log({invoice: n});
                        setInvoice(n);
                    }}/></div>
                <div>
                    <span>Invoice No { invoice.invoice_no } </span>

                </div>
            </div>
            <table>
                <thead>
                <tr>
                    <td></td>
                    <td>Product Name</td>
                    <td>Quantity</td>
                    <td>Rate b/f tax</td>
                    <td>Discount %</td>
                    <td>Taxable</td>
                    <td>Net Amount</td>
                </tr>
                </thead>
                <tbody>
                {
                    items.map((item, i) =>
                        <ItemRow key={item.key} deleteRow={deleteRow} handleChange={handleItemChange} index={i}
                                 item={item}/>)
                }
                </tbody>
            </table>
            <div>
                <Button onClick={() => {
                    const newItems = [...items, generateItemsTemplate()];
                    setItems(newItems);
                }}>Add</Button>
                <Button onClick={async () => {
                    await saveInvoice();
                }}>Save</Button>
            </div>
            <div className={"final-section"}>
                Net Amount : {netAmount}
            </div>
            <div>
                {
                    invoice.invoice_no!==""?<div style={{ width: "100%", color:"white",
                        borderRadius: 6, minHeight: "80px", backgroundColor:"#9722e0"}}>
                       <div>
                           <h4> Invoice saved</h4>
                       </div>
                        <div>
                            <Button>Print</Button>
                        </div>
                    </div>:null
                }
            </div>
        </div>
    )
}

interface ItemRowProps {
    index: number
    item: ItemInput

    handleChange(index: number, item: ItemInput): void

    deleteRow(index: number): void
}

const ItemRow: FC<ItemRowProps> = ({index, item, handleChange, deleteRow}) => {
    const [rate, setRate] = useState<number>(item.rate);
    const [quantity, setQuantity] = useState<number>(item.quantity);
    const [finalRate, setFinalRate] = useState<string>();
    const [fRate, setFRate] = useState(0);
    const [rateAfterTax, setRateAfterTax] = useState<string>()
    const [discount, setDiscount] = useState<number>(item.discount)
    const [selected, setSelected] = useState(item.sku)

    useEffect(() => {
        if (rate != null && quantity != null && discount != null && selected) {
            const calculatedRate = rate * quantity - (discount / 100 * rate * quantity);
            setFinalRate(calculatedRate.toFixed(2));
            setFRate(calculatedRate);
            const itm: ItemInput = {
                sku_id: selected.id,
                rate,
                quantity,
                discount,
                key: item.key,
                sku: selected,
            }
            handleChange(index, itm);
        }
    }, [rate, quantity, discount])

    useEffect(() => {
        if (fRate && selected) {
            const finalFinalRate = fRate + fRate * (selected?.igst ? selected.igst / 100 : 0)
            setRateAfterTax(finalFinalRate.toFixed(2));
        }
    }, [fRate])

    return (
        <tr
        >
            <td>
                <Button type={"danger"} onClick={() => {
                    deleteRow(index)
                }}>
                    delete
                </Button>
            </td>
            <td><SkuSelect
                name={selected?.name}
                onSelect={(sku) => {
                    // log set rate
                    console.log("Setting Rate:", sku.rate)
                    setRate(sku.rate);
                    setSelected(sku);
                }}/></td>
            <td><input className={"covert-input"}
                       placeholder={"Quantity"}
                       onBlur={(e) => {
                           const val = parseFloat(e.target.value);
                           if (val) setQuantity(val);
                       }}
                       defaultValue={quantity}
            /></td>
            <td><input className={"covert-input"}
                       onBlur={(e) => {
                           const val = parseFloat(e.target.value);
                           setRate(val);
                       }}
                       key={rate}
                       defaultValue={rate} placeholder={"Rate b/f tax"}/></td>
            <td><input
                defaultValue={discount}
                onBlur={(e) => {
                    const val = parseFloat(e.target.value);
                    setDiscount(val);
                }}
                className={"covert-input"} placeholder={"Discount"}/></td>
            <td><input disabled className={"covert-input"} value={finalRate}/></td>
            <td><input disabled value={rateAfterTax} className={"covert-input"}/></td>
        </tr>
    )
}

export default Invoice;