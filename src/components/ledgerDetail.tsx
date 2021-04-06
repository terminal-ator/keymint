import React, {FC, useEffect, useState} from "react";
import {Ledger, Posting} from "../types/ledger";
import {putLedger, getPostings, postToggleCheque, getPostingsWithDate} from "../api";
import {Master} from "../types/master";
import {
    NullInt,
    NormalizedCache,
    normalize,
    RenderItemProps, DeNormalize
} from "../types/generic";
import moment from "moment";
import EditStatement from "./editStatement";
import withPop from "./popup";
import {DialogWrapper, DialogContent} from "../pages/stmt";
import KeyList from "./keylist";
import {stateSelector} from "../reducers";
import {Card, Button, message, Input, Checkbox, DatePicker} from "antd";
import {useDispatch} from "react-redux";
import {
    UpdateMaster,
    FetchJournal,
    ToggleJournal,
    ToggleMasterForm
} from "../actions/uiActions";
import {Formik, Field, Form} from "formik";
import {PageDiv, Select} from "./styledComp";
import {FetchMasters} from "../actions/masterActions";
import {fetchCheques, fetchPosting, fetchPostingWithDate} from "../actions/postingActions";
import {DetailTd} from "./sttmntTR";
import TouchList from "./TouchList";
import {NewCheque} from "../pages/cheque";
import ImKeyList from "./ImprovedKeyList";
import {DownloadLedgerVouchers} from "../api/downloads";
import FileDownload from 'js-file-download';

interface LedgerProps {
    cust: number;

    handleEsc?(): void;

    hasFocus?: boolean;
}

export interface QuickForm {
    cust_id: number;
    toFrom: string;
    type: string;
    date: string;
    amount: number;
}

const {RangePicker} = DatePicker;

const LedgerDetail = (props: LedgerProps) => {
    const [ledgers, setLedgers] = useState<Array<Posting>>();
    const postingDetail = stateSelector(state => state.posts);
    const postings = postingDetail.postings
    const [total, setTotal] = useState(0);
    // const [postings, setPosting] = useState(propPostings);
    const [show, setShow] = useState(false);
    const masters = stateSelector(state => state.master.masters);
    const companyID = stateSelector(state => state.sys.SelectedCompany);
    const chqs = stateSelector(state => state.posts.cheques);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");


    console.log({chqs});
    const dispatch = useDispatch();
    useEffect(() => {
        let sum = 0;
        if (chqs) {
            chqs.forEach((chq) => {
                if (!chq.passed) {
                    sum += chq.amount;
                }
            });
            setTotal(sum);
        }
    }, [chqs]);

    useEffect(() => {
        setStartDate(postingDetail.start_date);
        setEndDate(postingDetail.end_date);
    }, [postingDetail])

    const EditMaster = () => {
        dispatch(ToggleMasterForm(true, masters.normalized[props.cust]));
    };

    const refetch = async () => {
        await dispatch(fetchPosting(props.cust));
    }

    const downloadVouchers = ()=>{
        DownloadLedgerVouchers(props.cust, startDate, endDate).then((res)=>{
            FileDownload(res.data, "ledger.xlsx");
        })
    }

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
                    color: "black",
                }}
            >
                <Formik
                    initialValues={{date, toFrom, type, amount}}
                    onSubmit={async values => {
                        try {
                            const {date, toFrom, type, amount} = values;
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
                        <Field name="date" as={DateInput}/>
                        <Field name="toFrom" as="select">
                            <option value="From">From</option>
                            <option value="To">To</option>
                        </Field>
                        <Field name="type" as="select">
                            <option value={"Less"}>Less</option>
                            <option value={"Cash"}>Cash</option>
                            <option value={"Bill"}>Bill</option>
                        </Field>
                        <Field name="amount"/>
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
                <DetailTd>{moment(arg.item.date).format("MMM DD YYYY")}</DetailTd>
                <DetailTd colSpan={2} style={{overflow: "hidden"}}>{arg.item.narration}</DetailTd>
                <DetailTd
                    align={"right"}>{arg.item.amount < 0 ? ` ${Math.abs(arg.item.amount).toLocaleString()}` : null}</DetailTd>
                <DetailTd
                    align={"right"}>{arg.item.amount >= 0 ? ` ${arg.item.amount.toLocaleString()}` : null}</DetailTd>
            </tr>
        );
    };

    const masterItem = (mstr: Master | undefined, closing: number, total: number) => {
        if (true) {
            return (
                <div
                    style={{marginTop: 5, padding: 5}}
                >
                    {/* <p>{mstr.cust_id.Int64}</p> */}
                    <p
                        style={{
                            padding: 5,
                            color: "black"
                        }}
                    >
                        <h1> {mstr ? mstr?.name : "Select a name"} </h1>
                        <span> {}</span>
                        <div>
                            <span> Closing Balance: {Math.abs(closing)} {closing <= 0 ? "Dr" : "Cr"} </span>
                            -
                            <span> Pending Cheques: {Math.abs(total)} </span>
                            =
                            <span>{Math.abs(closing + total)} {closing + total <= 0 ? "Dr" : "Cr"}</span>
                        </div>
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
                        style={{marginLeft: 4}}
                        size={"small"}
                        onClick={() => {
                            dispatch(ToggleJournal(true, false, 0, refetch));
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
        if (postings) {
            const post = postings?.normalized[cursor];
            dispatch(FetchJournal(post.journal_id));
        }
    };

    const ToggleCheck = async (id: number) => {
        await postToggleCheque(id);
        dispatch(fetchCheques());
    };

    const Header: FC = () => {
        const opening = postingDetail.opening_balance;

        return <tr>
            <DetailTd colSpan={3}>Opening Balance</DetailTd>
            <DetailTd>{opening <= 0 ? Math.abs(opening).toLocaleString() : null}</DetailTd>
            <DetailTd>{opening > 0 ? opening.toLocaleString() : null}</DetailTd>
        </tr>
    }

    // const
    const RunningFooter: FC = () => {
        const debit = postingDetail.debit_total;
        const credit = postingDetail.credit_total;
        return <tr>
            <DetailTd colSpan={3}>Current Total</DetailTd>
            <DetailTd>{Math.abs(debit).toLocaleString()}</DetailTd>
            <DetailTd>{credit.toLocaleString()}</DetailTd>
        </tr>
    }

    const ClosingFooter: FC = () => {
        const opening = postingDetail.closing_balance;
        return <tr>
            <DetailTd colSpan={3}>Closing</DetailTd>
            <DetailTd>{opening <= 0 ? Math.abs(opening).toLocaleString() : null}</DetailTd>
            <DetailTd>{opening > 0 ? opening.toLocaleString() : null}</DetailTd>
        </tr>
    }

    const getLedgersForDates = async () => {
        await dispatch(fetchPostingWithDate(props.cust, startDate, endDate))
    }


    return (
        <div style={{backgroundColor: "white", color: "black", height: "100%"}}>
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
                    marginTop: 5
                }}
            >
                Close
            </Button>
            &nbsp;
            {masterItem(masters?.normalized[props.cust], postingDetail.closing_balance, total)}
            <div style={{marginLeft: 5, display: "flex", maxWidth:"100%" ,flexDirection: "row", alignItems: "center"}}>
                Start date <DatePicker value={moment(startDate)} onChange={(e) => {
                if (e) setStartDate(e.format("YYYY-MM-DD"))
            }}/>
                End date <DatePicker value={moment(endDate)} onChange={(e) => {
                if (e) setEndDate(e.format('YYYY-MM-DD'))
            }}/>
                <div style={{ marginLeft: "10px"}}>
                <Button type={"primary"} onClick={getLedgersForDates}>Get</Button>
                <Button style={{ marginLeft: "10px"}} type={"ghost"} onClick={downloadVouchers}>Download</Button>
                </div>
            </div>
            <div style={{overflow: "hidden", overflowY: "scroll"}}>
                <div style={{display: "flex", flexWrap: "wrap"}}>
                    <div style={{flex: 2}}>
                        {postings && (
                            <KeyList
                                columns={["Date", "Narration", "", "Debit", "Credit"]}
                                headers={[Header]}
                                footers={[Header, RunningFooter, ClosingFooter]}
                                cursor={0}
                                data={postings}
                                maxHeight={800}
                                rowHeight={10}
                                numberOfRows={7}
                                handleEnter={handleEnter}
                                renderItem={renderItem}
                                handleEscape={props.handleEsc}
                                autoFocus={props.hasFocus}
                            />
                            // <ImKeyList
                            //     cursor={0}
                            //     data={DeNormalize(postings)}
                            //     renderItem={renderItem}
                            //     columns={["Date", "Narration", "", "Debit", "Credit"]}
                            //     rowHeight={20}
                            //     numberOfRows={7}
                            //     maxHeight={400}
                            //     scrollMode={false} />
                        )}

                        {/*{*/}
                        {/*    postings && <TouchList data={postings} headers={[ Header ]} renderItem={renderItem}*/}
                        {/*                           columns={["Date", "Narration","","Debit", "Credit"]} maxHeight={"600px"}*/}
                        {/*                           footers={[ Header, RunningFooter, ClosingFooter ]}*/}
                        {/*    />*/}
                        {/*}*/}

                        {/*<div>*/}
                        {/*    <div>*/}
                        {/*        <div style={{ display: "flex", flexDirection: "row", borderBottom:"1px solid #3e3e3e", justifyContent:"space-between"}}>*/}
                        {/*            <div>Date</div>*/}
                        {/*            <div>Narration</div>*/}
                        {/*            <div>Reference</div>*/}
                        {/*            <div>debit</div>*/}
                        {/*            <div>credit</div>*/}
                        {/*        </div>*/}
                        {/*    </div>*/}
                        {/*    <div>*/}
                        {/*  /!*{ postings && postings.all.map((post)=>{*!/*/}

                        {/*  /!*    const onClick = async ()=>{*!/*/}
                        {/*  /!*        if(post && typeof post === 'number')*!/*/}
                        {/*  /!*          await handleEnter(post)*!/*/}
                        {/*  /!*    }*!/*/}

                        {/*  /!*    const posting = postings.normalized[post]*!/*/}
                        {/*  /!*    return (*!/*/}
                        {/*  /!*        <div style={{borderBottom:"1px solid #3e3e3e", padding: 5}}>*!/*/}
                        {/*  /!*        <div style={{ display: "flex", flexDirection: "row" , justifyContent:"space-between" }} key={post}>*!/*/}
                        {/*  /!*            <div>{moment(posting.date).format("DD/MM/YYYY")}</div>*!/*/}
                        {/*  /!*            <div>{posting.narration}</div>*!/*/}
                        {/*  /!*            <div>{posting.ref_no}</div>*!/*/}
                        {/*  /!*            <div style={{}} >{posting.amount < 0 ?` ${Math.abs(posting.amount)}` : null}</div>*!/*/}
                        {/*  /!*            <div>{posting.amount >= 0 ? ` ${posting.amount}` : null}</div>*!/*/}
                        {/*  /!*        </div>*!/*/}
                        {/*  /!*            <a onClick={onClick}>Edit</a>*!/*/}
                        {/*  /!*        </div>*!/*/}
                        {/*  /!*    )*!/*/}
                        {/*  /!*})}*!/*/}
                        {/*    </div>*/}
                        {/*</div>*/}
                    </div>
                    <div style={{flex: 1, paddingLeft: 5}}>
                        <div>
                            <p>Cheques</p>
                            <ul style={{listStyle: "none", color: "white", height: 500, overflow: "scroll"}}>
                                {chqs?.map((chq) => (
                                    <li
                                        style={{
                                            display: "flex",
                                            flex: 1,
                                            justifyContent: "space-between",
                                            padding: 10,
                                            boxShadow:
                                                "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)",
                                            marginRight: 10,
                                            marginTop: 5,
                                            backgroundColor: chq && chq.type && chq.type == "CHQ" ? "#73917b" : "#2c346e",
                                            borderRadius: 2,
                                        }}
                                        key={chq.id}
                                    >
                                         <span>

                                            <Checkbox checked={chq.passed} style={{display: "inline"}} onChange={async e => {
                                                await ToggleCheck(chq.id);
                                            }}/>
                                            &nbsp; { chq.passed? "Passed" : "Pending" }
                                        </span>
                                        <span>{moment(chq.date).format("MMM DD")}</span>
                                        <span>{chq.name?chq.name:null}</span>
                                        <span>Rs. {chq.amount}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LedgerDetail;
