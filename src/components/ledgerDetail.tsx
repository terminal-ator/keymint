import React, { useEffect, useState } from "react";
import { Ledger, Posting } from "../types/ledger";
import { putLedger, getPostings, postToggleCheque } from "../api";
import { Master } from "../types/master";
import {
  NullInt,
  NormalizedCache,
  normalize,
  RenderItemProps
} from "../types/generic";
import moment from "moment";
import EditStatement from "./editStatement";
import withPop from "./popup";
import { DialogWrapper, DialogContent } from "../pages/stmt";
import KeyList from "./keylist";
import { stateSelector } from "../reducers";
import {Card, Button, message, Input, Checkbox} from "antd";
import { useDispatch } from "react-redux";
import {
  UpdateMaster,
  FetchJournal,
  ToggleJournal,
  ToggleMasterForm
} from "../actions/uiActions";
import { Formik, Field, Form } from "formik";
import {PageDiv, Select} from "./styledComp";
import { FetchMasters } from "../actions/masterActions";
import { fetchCheques, fetchPosting } from "../actions/postingActions";
import {SimTd} from "./sttmntTR";

interface LedgerProps {
  cust: number;
  handleEsc?(): void;
  hasFocus?:boolean;
}
export interface QuickForm {
  cust_id: number;
  toFrom: string;
  type: string;
  date: string;
  amount: number;
}

const LedgerDetail = (props: LedgerProps) => {
  const [ledgers, setLedgers] = useState<Array<Posting>>();
  const propPostings = stateSelector(state => state.posts.postings);
  const [total, setTotal] = useState(0);
  const [postings, setPosting] = useState<NormalizedCache<Posting>>();
  const [show, setShow] = useState(false);
  const masters = stateSelector(state => state.master.masters);
  const companyID = stateSelector(state => state.sys.SelectedCompany);
  const chqs = stateSelector(state => state.posts.cheques);
  console.log({ chqs });
  const dispatch = useDispatch();
  useEffect(() => {
    let sum = 0;
    if (propPostings) {
      propPostings?.all.forEach(id => {
        sum += propPostings.normalized[id].amount;
      });
      if (chqs) {
        chqs.forEach(chq => {
          if (!chq.passed) {
            sum -= chq.amount;
          }
        });
      }
      setTotal(sum);
    }
  }, [propPostings, chqs]);
  const EditMaster = () => {
    dispatch(ToggleMasterForm(true, masters.normalized[props.cust]));
  };
  const InlineLedgerForm = () => {
    const [date, setDate] = useState(moment().format("YYYY-MM-DD"));
    const [toFrom, setToFrom] = useState("To");
    const [type, setType] = useState("Bill");
    const [amount, setAmount] = useState("");
    const dispatch = useDispatch();
    const DateInput = (props: any) => <input type="date" {...props} />;
    return (
      <div
        style={{
          position: "fixed",
          bottom: 0,
          zIndex: 99999,
          width: "100%",
          backgroundColor: "#4d4848",
          color:"black",
        }}
      >
        <Formik
          initialValues={{ date, toFrom, type, amount }}
          onSubmit={async values => {
            try {
              const { date, toFrom, type, amount } = values;
              const resp = await putLedger(
                {
                  date,
                  toFrom,
                  type,
                  amount: parseFloat(amount),
                  cust_id: props.cust
                },
                companyID
              );
              if (resp.status == 200) {
                message.success("Successfully added ledger");
              } else {
                message.error("Failed! Try Again.");
              }
            } catch (err) {
              console.log(err);
            } finally {
              // await fetchLedgers(props.cust)
              await dispatch(FetchMasters());
              await dispatch(fetchPosting(props.cust));
            }
          }}
        >
          <Form
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: 550,
              padding: 10
            }}
          >
            <Field name="date" as={DateInput} />
            <Field name="toFrom" as="select">
              <option value="From">From</option>
              <option value="To">To</option>
            </Field>
            <Field name="type" as="select">
              <option value={"Less"}>Less</option>
              <option value={"Cash"}>Cash</option>
              <option value={"Bill"}>Bill</option>
            </Field>
            <Field name="amount" />
            <Button type="primary" htmlType={"submit"}>
              Save
            </Button>
          </Form>
        </Formik>
      </div>
    );
  };

  const renderItem = (arg: RenderItemProps<Posting>) => {
    return (
      <tr>
        <SimTd>{moment(arg.item.date).format("MMM DD")}</SimTd>
        <SimTd style={{ overflow: "hidden" }}>{arg.item.narration}</SimTd>
        <SimTd>{arg.item.ref_no}</SimTd>
        <SimTd align={"right"} >{arg.item.amount < 0 ?`₹ ${Math.abs(arg.item.amount)}` : null}</SimTd>
        <SimTd align={"right"}>{arg.item.amount > 0 ? `₹ ${arg.item.amount}` : null}</SimTd>
      </tr>
    );
  };

  const masterItem = (mstr: Master | undefined, total: number) => {
    if (mstr) {
      return (
        <div
          style={{ marginTop: 5,padding:5 }}
        >
          {/* <p>{mstr.cust_id.Int64}</p> */}
          <p
            style={{
              padding: 5,
              backgroundColor: total <= 0 ? "#36e392" : "red",
              color: "white"
            }}
          >
            {mstr?.name}
            <span style={{ marginLeft:20 }} >{Math.abs(total)} {total < 0 ? "debit" : "credit"}{" "}</span>
          </p>

          <Button
            size="small"
            onClick={() => {
              EditMaster();
            }}
          >
            Edit
          </Button>
          <Button
            style={{ marginLeft: 4 }}
            size={"small"}
            onClick={() => {
              dispatch(ToggleJournal(true, false, 0));
            }}
          >
            Add
          </Button>
        </div>
      );
    }
    return null;
  };

  const handleEnter = (cursor: number) => {
    if (propPostings) {
      const post = propPostings?.normalized[cursor];
      dispatch(FetchJournal(post.journal_id));
    }
  };

  const ToggleCheck = async (id: number) => {
    await postToggleCheque(id);
    dispatch(fetchCheques());
  };

  return (
    <div style={{ backgroundColor: "black", color:"white", height:"100%"}}>
      <Button
        type="danger"
        size="small"
        onClick={() => {
          if (props.handleEsc) {
            props.handleEsc();
          }
        }}
        style={{
          zIndex: 10,
          marginLeft: 5,
          marginTop:5
        }}
      >
        Close
      </Button>
      &nbsp;
      {masterItem(masters?.normalized[props.cust], total)}
      <div style={{ overflow: "hidden", overflowY: "scroll" }}>
        <div style={{ display: "flex", flexWrap: "wrap" }}>
          <div style={{ flex: 2 }}>
            {propPostings && (
              <KeyList
                columns={["Date", "Narration", "Reference", "Payments", "Bills"]}
                cursor={0}
                data={propPostings}
                maxHeight={400}
                rowHeight={20}
                numberOfRows={7}
                handleEnter={handleEnter}
                renderItem={renderItem}
                handleEscape={props.handleEsc}
                autoFocus={props.hasFocus}
              />
            )}
          </div>
          <div style={{ flex: 1, paddingLeft: 5 }}>
            <div>
              <p>Cheques</p>
              <ul style={{ listStyle: "none" }}>
                {chqs?.map(chq => (
                  <li
                    style={{
                      display: "flex",
                      flex: 1,
                      justifyContent: "space-between",
                      padding: 5,
                      boxShadow:
                        "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)",
                      marginRight: 10,
                      marginTop: 5,
                      backgroundColor:"rgb(33, 33, 33)",
                      borderRadius: 2,
                    }}
                    key={chq.id}
                  >

                    <Checkbox checked={chq.passed} style={{ display: "inline"}} onChange={async e => {
                      await ToggleCheck(chq.id);
                    }} />
                    <span>{moment(chq.date).format("MMM DD")}</span> Rs.
                    {chq.amount}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        {InlineLedgerForm()}
      </div>
    </div>
  );
};

export default LedgerDetail;
