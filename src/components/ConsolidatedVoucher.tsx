import React, {useEffect, useState} from "react";
import ChequePage from "../pages/cheque";
import JournalForm from "./journalForm";
import RecForm from "./recForm";
import {Affix, Button, message, Select} from "antd";
import {stateSelector} from "../reducers";
import {Journal} from "../types/ledger";
import moment from "moment";
import ReceiptForm from "./Receipt";
import Payment from "./Payment";
import {DeleteVoucherById} from "../api";
import {useDispatch} from "react-redux";
import {ToggleJournal} from "../actions/uiActions";
import {FetchMasters} from "../actions/masterActions";
import {fetchPosting, fetchPostingWithDate} from "../actions/postingActions";

enum Voucher {
    Receipt,
    Payment,
    Journal
}

const VoucherSwitch = ( voucher: Voucher )=>{
    switch (voucher) {
        case Voucher.Receipt:
            return <ReceiptForm />
        case Voucher.Payment:
            return <Payment />
        case Voucher.Journal:
            return <JournalForm />
        default:
            return <JournalForm />
    }
}

const ConsolidatedVoucher = ()=>{

    const [ voucherState, setVoucherState ] = useState<Voucher>(Voucher.Receipt);
    const  journalID = stateSelector(stt => stt.ui.journalID);
    const stateJournal = stateSelector( stt => stt.ui.journal);
    const postingID = stateSelector(state=>state.posts.postId)
    const dispatch = useDispatch();
    const [ total, setTotal ] = useState()

    useEffect(()=>{
        if(journalID.id!==0 && stateJournal && journalID.valid){
            if(stateJournal.type=="Receipt"){
                setVoucherState(Voucher.Receipt);
            }else if (stateJournal.type == "Payment"){
                setVoucherState(Voucher.Payment);
            }else{
                setVoucherState(Voucher.Journal);
            }
        }
    },[journalID])

    const handleDelete = async ()=> {
        const confirm = window.confirm("Are you sure you want to delete this voucher?")
        if (!confirm) return;

        if (journalID.valid && journalID.id !== 0) {
            try {
                await DeleteVoucherById(journalID.id)
                message.success("Voucher deleted successfully");
                await dispatch(ToggleJournal(false, false, 0, () => {
                }));
                await dispatch(FetchMasters());
                await dispatch(fetchPostingWithDate(postingID,"",""));

            } catch (e) {
                message.error("Failed to delete the voucher");
            } finally {

            }
        }else{
            message.error("This voucher cannot be deleted")
        }
    }

    return(
        <div>
               <div style={{ display: "flex", flexDirection: "row", gap:"10px", width:"70%"}}>
                   <Select value={voucherState} onChange={(e)=>{setVoucherState(e)}}>
                       <Select.Option value={Voucher.Receipt}>Receipt</Select.Option>
                       <Select.Option value={Voucher.Payment}>Payment</Select.Option>
                       <Select.Option value={Voucher.Journal}>Journal</Select.Option>
                   </Select>
                   <div>
                       <Button onClick={handleDelete} disabled={!journalID.valid} type={"danger"}>Delete</Button>
                   </div>
               </div>
            {
                VoucherSwitch(voucherState)
            }
        </div>
    )


}

export default ConsolidatedVoucher;