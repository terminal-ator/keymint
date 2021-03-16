
import React, { useState, useEffect, useRef } from "react";
import { NormalizedCache, DeNormalize } from "../types/generic";
import { Master } from "../types/master";
import { Receipt } from "../pages/receipt";
//import { Select } from "./styledComp";
import { Button, Input, Select } from "antd";
import "./rForm.css";
import {Cheque, genChq, NewCheque} from "../pages/cheque";
import NameSelect from "./nameSelect";
import './chqForm.css';
interface ChequeFormProps {
    MasterList: NormalizedCache<Master>;
    Chq: Cheque;
    handleModify(id: number, master_id: number, amount: number): void;
    add(): void;
    showAdd: boolean;
    fetchDetails (cursor: number):void;
}

const VoucherRow = (props: ChequeFormProps) => {
    const masters = DeNormalize<Master>(props.MasterList);
    const selectRef = useRef<HTMLSelectElement>(null);
    const { Chq, handleModify, add, fetchDetails } = props;


    useEffect(() => {
        if (selectRef.current) {
            selectRef.current.focus();
            selectRef.current.scrollIntoView();
        }
    }, [Chq.master_id]);

    const onSelect = async (cursor: number) => {
        handleModify( Chq.id,cursor, Chq.amount);
        await fetchDetails(cursor);
    };

    return (
        <div style={{ display:"flex", alignContent:"center", alignItems:"center", justifyContent:"space-between",marginTop:5}}>
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignContent: "center",
                    width:"100%"
                }}
            >
                <NameSelect cursor={props.Chq.master_id} onSelect={onSelect} />
                <input
                    style={{ width: 300, flex: 1, marginLeft:10, padding:2, borderRadius: 2, border: "1px solid #3e3e3e"}}
                    onBlur={async e => {
                        const val = Math.abs(parseFloat(e.target.value));
                        await handleModify(Chq.id, Chq.master_id, val );
                        // setTimeout(()=>{}, 200);
                    }}
                    // onPressEnter={()=>{if(props.showAdd)add();}}
                    onKeyDown={(e)=>{if(e.keyCode===13){e.preventDefault();add();}}}
                    type="number"
                    placeholder="amount"
                    defaultValue={ Math.abs(Chq.amount)}
                />
            </div>
        </div>
    );
};

export default VoucherRow;
