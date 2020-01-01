import React, { useState, useEffect } from "react";
import ReceiptForm from "../components/receiptForm";
import { AppState } from "../reducers";
import { connect, ConnectedProps } from "react-redux";
import { NormalizedCache, normalize, DeNormalize } from "../types/generic";
import moment from "moment";

export interface Receipt {
  id: number;
  CustID: number;
  Cash: number;
}

const mapState = (state: AppState) => {
  return {
    masters: state.master.masters
  };
};

const connector = connect(mapState, {});

type PropType = ConnectedProps<typeof connector>;

const Receipt = (props: PropType) => {
  const [total, setTotal] = useState(0);
  const newReciept = [{ id: 1, CustID: 0, Cash: 0 }];
  const [receipt, setReceipt] = useState<Array<Receipt>>(newReciept);
  const [currentDate, setCurrentDate] = useState(moment().format());

  let saveReceipts = async (rec: Receipt) => {
    let newR = [rec, ...receipt];
    await setReceipt(newR);
    console.log({ newR });
  };

  const updateCash = (id: number, cash: number) => {
    console.log({ cash });
    const newRec = receipt.map(rec => {
      if (rec.id == id) {
        const Rec = {
          id: id,
          CustID: rec.CustID,
          Cash: cash
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
      nTotal = nTotal + rec.Cash;
    });
    setTotal(nTotal);
  });

  return (
    <div>
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
      <h2>{`Total: ${total}`}</h2>
    </div>
  );
};

export default connect(mapState, {})(Receipt);
