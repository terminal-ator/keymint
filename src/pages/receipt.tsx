import React, { useState, useEffect } from "react";
import ReceiptForm from "../components/receiptForm";
import { AppState } from "../reducers";
import { connect, ConnectedProps } from "react-redux";
import { NormalizedCache, normalize, DeNormalize } from "../types/generic";
import moment from "moment";
import { PageDiv } from "../components/styledComp";
import Nav from '../components/nav';
import { postLedger } from "../api";

export interface Receipt {
  id: number;
  cust_id: number;
  cash: number;
}

const mapState = (state: AppState) => {
  return {
    masters: state.master.masters,
    companyID: state.sys.SelectedCompany
  };
};

const connector = connect(mapState, {});

type PropType = ConnectedProps<typeof connector>;

const Receipt = (props: PropType) => {
  const [total, setTotal] = useState(0);
  const newReciept = [{ id: 1, cust_id: 0, cash: 0 }];
  const [receipt, setReceipt] = useState<Array<Receipt>>(newReciept);
  const [currentDate, setCurrentDate] = useState(moment().format('YYYY-MM-DD'));


  let saveReceipts = async (rec: Receipt) => {
    let newR = [...receipt.slice(0,receipt.length-1), rec];
    newR.push(newReciept[0])
    await setReceipt(newR);
    console.log({ newR });
  };

  const updateCash = (id: number, cash: number) => {
    console.log({ cash });
    const newRec = receipt.map(rec => {
      if (rec.id == id) {
        const Rec = {
          id: id,
          cust_id: rec.cust_id,
          cash: cash
        };
        return Rec;
      }
      return rec;
    });
    console.log({ newRec });
    setReceipt(newRec);
  };

  useEffect(() => {
    let nTotal = 0;
    receipt.forEach(rec => {
      nTotal = nTotal + rec.cash;
    });
    setTotal(nTotal);
  });

  const saveReceipt = async ()=>{
    try{
      await postLedger(currentDate, receipt.slice(0,receipt.length-1), props.companyID);
      setReceipt(newReciept);
      setCurrentDate(moment().format('YYYY-MM-DD'));
    }catch(err){
      console.log(err);
    }
    

  }

  return (
    <PageDiv>
      <Nav />
      <h1>Reciepts</h1>
      <input
        type="date"
        onChange={e => {
          setCurrentDate(e.target.value);
        }}
        defaultValue={currentDate}
      />
      {receipt.map(receipt => {
        if (props.masters) {
          return (
            <ReceiptForm
              key={receipt.id}
              MasterList={props.masters}
              Receipt={receipt}
              Save={saveReceipts}
              UpdateReceiptCash={updateCash}
            />
          );
        }
      })}
      <button>Save</button>
      <h2>{`Total: ${total}`}</h2>
    </PageDiv>
  );
};

export default connect(mapState, {})(Receipt);
