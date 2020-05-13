import React, { useState, useEffect, useRef } from "react";
import { NormalizedCache, DeNormalize } from "../types/generic";
import { Master } from "../types/master";
import { Receipt } from "../pages/receipt";
//import { Select } from "./styledComp";
import { Button, Input, Select } from "antd";
import "./rForm.css";
import { Cheque } from "../pages/cheque";
import NameSelect from "./nameSelect";
import './chqForm.css';
interface ChequeFormProps {
  MasterList: NormalizedCache<Master>;
  Chq: Cheque;
  handleModify(id: number, master_id: number, cash: number): void;
  add(): void;
  showAdd: boolean;
  fetchDetails(cursor: number):void;
}

const ChequeForm = (props: ChequeFormProps) => {
  const masters = DeNormalize<Master>(props.MasterList);
  const selectRef = useRef<HTMLSelectElement>(null);
  const { Chq, handleModify, add, fetchDetails } = props;


  useEffect(() => {
    if (selectRef.current) {
      selectRef.current.focus();
      selectRef.current.scrollIntoView();
    }
  }, [Chq.master_id]);

  const onSelect = (cursor: number) => {
    handleModify(Chq.id, cursor, Chq.amount);
    fetchDetails(cursor);
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
        <NameSelect onSelect={onSelect} />
        <input
          className={"form-control bg-dark text-light"}
          style={{ width: 300, flex: 1, marginLeft:10 }}
          onBlur={async e => {
            const val = parseInt(e.target.value);
            await handleModify(Chq.id, Chq.master_id, val);
            // setTimeout(()=>{}, 200);
          }}
          // onPressEnter={()=>{if(props.showAdd)add();}}
          onKeyDown={(e)=>{if(e.keyCode===13){e.preventDefault();add();}}}
          type="number"
          placeholder="amount"
          defaultValue={Chq.amount}
        />
      </div>
    </div>
  );
};

export default ChequeForm;
