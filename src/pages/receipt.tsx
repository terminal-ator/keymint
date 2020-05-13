import React, { useState, useEffect } from "react";
import ReceiptForm from "../components/receiptForm";
import { AppState } from "../reducers";
import { connect, ConnectedProps, useDispatch } from "react-redux";
import { NormalizedCache, normalize, DeNormalize } from "../types/generic";
import moment from "moment";
// @ts-ignore
import numWords from "num-words";
import { PageDiv } from "../components/styledComp";
import Nav from "../components/nav";
import { postLedger } from "../api";
import { FetchMasters } from "../actions/masterActions";

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
  const [currentDate, setCurrentDate] = useState(moment().format("YYYY-MM-DD"));
  const dispatch = useDispatch();

  let saveReceipts = async (rec: Receipt) => {
    let newR = [...receipt.slice(0, receipt.length - 1), rec];
    newR.push(newReciept[0]);
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

  const saveReceipt = async () => {
    try {
      await postLedger(
        currentDate,
        receipt.slice(0, receipt.length - 1),
        props.companyID
      );
      dispatch(FetchMasters);
      setReceipt(newReciept);
      setCurrentDate(moment().format("YYYY-MM-DD"));
    } catch (err) {
      console.log(err);
    }
  };

  const clear = () => {
    const clearBool = window.confirm("Are you sure, all data will be lost ?");
    if (clearBool) {
      setReceipt(newReciept);
    }
  };

  return (
    <PageDiv>
      <Nav />
      <div style={{ padding: 10 }}>
        <div style={{ width: 700}}>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center"
            }}
          >
            <h1>Reciepts</h1>
            <button
              className="btn"
              disabled={receipt.length === 1}
              style={{ height: 20, background: "white" }}
              onClick={() => {
                clear();
              }}
            >
              Clear
            </button>
          </div>
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

          <button
            onClick={() => {
              saveReceipt();
            }}
          >
            Save
          </button>
          <p style={{ width: "100%" , borderTop: "1px solid #3e3e3e", marginTop: 5 }}>
            <h2>
              {`Total`} <span style={{ float: "right" }}>{`Rs. ${total}`}</span>
            </h2>
            <h4>{numWords(total)}</h4>
          </p>
        </div>
      </div>
    </PageDiv>
  );
};

export default connect(mapState, {})(Receipt);
