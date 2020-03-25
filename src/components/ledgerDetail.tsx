import React, { useEffect, useState } from "react";
import { Ledger, Posting } from "../types/ledger";
import { putLedger, getPostings } from "../api";
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
import { Card, Button, message } from "antd";
import { useDispatch } from "react-redux";
import {
  UpdateMaster,
  FetchJournal,
  ToggleJournal
} from "../actions/uiActions";
import { Formik, Field, Form } from "formik";
import { Select } from "./styledComp";
import { FetchMasters } from "../actions/masterActions";
import { fetchPosting } from "../actions/postingActions";

interface LedgerProps {
  cust: number;
  handleEsc?(): void;
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
  const dispatch = useDispatch();
  useEffect(() => {
    let sum = 0;
    if (propPostings) {
      propPostings?.all.forEach(id => {
        sum += propPostings.normalized[id].amount;
      });
      setTotal(sum);
    }
  }, [propPostings]);
  const EditMaster = () => {
    dispatch(UpdateMaster(props.cust));
  };
  const InlineLedgerForm = () => {
    const [date, setDate] = useState(moment().format("YYYY-MM-DD"));
    const [toFrom, setToFrom] = useState("From");
    const [type, setType] = useState("Less");
    const [amount, setAmount] = useState("0");
    const dispatch = useDispatch();
    const DateInput = (props: any) => <input type="date" {...props} />;
    return (
      <div style={{ position: "absolute", bottom: 10, zIndex: 99999 }}>
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
              await dispatch(FetchMasters(companyID));
              await dispatch(fetchPosting(props.cust));
            }
          }}
        >
          <Form>
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
            <button type="submit">Save</button>
          </Form>
        </Formik>
      </div>
    );
  };

  const renderItem = (arg: RenderItemProps<Posting>) => {
    return (
      <tr>
        <td>{moment(arg.item.date).format("LL")}</td>
        <td style={{ overflow: "hidden" }}>{arg.item.narration}</td>
        <td>{arg.item.ref_no}</td>
        <td>{arg.item.amount < 0 ? Math.abs(arg.item.amount) : null}</td>
        <td>{arg.item.amount > 0 ? arg.item.amount : null}</td>
      </tr>
    );
  };

  const masterItem = (mstr: Master | undefined, total: number) => {
    if (mstr) {
      return (
        <Card title={mstr.name} bordered={false} style={{ marginTop: 10 }}>
          {/* <p>{mstr.cust_id.Int64}</p> */}
          <p>
            Outstanding: {Math.abs(total)} {total < 0 ? "debit" : "credit"}{" "}
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
        </Card>
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

  return (
    <div style={{ padding: "2px 2px" }}>
      <p>
        <Button
          type="danger"
          size="small"
          onClick={() => {
            if (props.handleEsc) {
              props.handleEsc();
            }
          }}
        >
          Close
        </Button>
        &nbsp;
      </p>
      {masterItem(masters?.normalized[props.cust], total)}
      <div style={{ overflow: "hidden", height: 800, overflowY: "scroll" }}>
        {propPostings && (
          <KeyList
            columns={["date", "narration", "refno", "debit", "credit"]}
            cursor={0}
            data={propPostings}
            maxHeight={400}
            rowHeight={20}
            numberOfRows={7}
            handleEnter={handleEnter}
            renderItem={renderItem}
            handleEscape={props.handleEsc}
          />
        )}
        {InlineLedgerForm()}
      </div>
    </div>
  );
};

export default LedgerDetail;
