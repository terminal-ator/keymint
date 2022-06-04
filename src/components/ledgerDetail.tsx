import React, {FC, useEffect, useState} from "react";
import {Ledger, Posting} from "../types/ledger";
import {putLedger, getPostings, postToggleCheque, getPostingsWithDate, deleteCheque} from "../api";
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
    ToggleMasterForm, setStartDateX, setEndDateX
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
    hideTopBar?: boolean;
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
    const dispatch = useDispatch();
    const postingDetail = stateSelector(state => state.posts);
    const startDate = stateSelector(state => state.ui.start_date);
    const endDate = stateSelector(state => state.ui.end_date);
    const postings = postingDetail.postings
    const [total, setTotal] = useState(0);
    // const [postings, setPosting] = useState(propPostings);
    const [show, setShow] = useState(false);
    const masters = stateSelector(state => state.master.masters);
    const companyID = stateSelector(state => state.sys.SelectedCompany);
    const chqs = stateSelector(state => state.posts.cheques);
    const [_startDate, _setStartDate] = useState("");
    const [_endDate, _setEndDate] = useState("");

    const setStartDate = (date: string) => {
        if (date != startDate) {
            dispatch(setStartDateX(date))
        }
    }

    const setEndDate = (date: string) => {
        if (date != endDate)
            dispatch(setEndDateX(date))
    }

    console.log({chqs});

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
        await dispatch(fetchPostingWithDate(props.cust, startDate, endDate));
    }

    const downloadVouchers = () => {
        DownloadLedgerVouchers(props.cust, startDate, endDate).then((res) => {
            FileDownload(res.data, "ledger.xlsx");
        })
    }

    const renderItem = (arg: RenderItemProps<Posting>) => {
        return (
            <tr>
                <DetailTd>{moment(arg.item.date).format("MMM DD YYYY")}</DetailTd>
                <DetailTd colSpan={2} style={{overflow: "hidden"}}>{arg.item.narration}</DetailTd>
                <DetailTd
                    align={"right"}>{arg.item.amount < 0 ? ` ${Math.abs(arg.item.amount).toLocaleString()}` : null}</DetailTd>
                <DetailTd
                    align={"right"}>{arg.item.amount >= 0 ? ` ${arg.item.amount.toLocaleString()}` : null}</DetailTd>
                <DetailTd>
                    {arg.item.running && `${(Math.round(Math.abs(arg.item.running) * 100) / 100).toFixed(2)} ${arg.item.running < 0 ? "DR" : "CR"}`}
                </DetailTd>
            </tr>
        );
    };

    const masterItem = (mstr: Master | undefined, closing: number, total: number) => {
        if (true) {
            return (
                <div
                    style={{marginTop: 5, padding: 5, paddingBottom:0}}
                >
                    {/* <p>{mstr.cust_id.Int64}</p> */}
                    <p
                        style={{
                            color: "black"
                        }}
                    >
                        <h3> {mstr ? mstr?.name : "Select a name"} </h3>

                        <span> {}</span>
                        {mstr ? <div>
                            <span style={{ color:"rgb(152,152,157)"}}> Closing Balance: <span style={{color:"black"}}>{Math.abs(closing)} {closing <= 0 ? "Dr" : "Cr"}</span>  </span>
                            -
                            <span> Pending Cheques: {Math.abs(total)} </span>
                            =
                            <span>{Math.abs(closing + total)} {closing + total <= 0 ? "Dr" : "Cr"}</span>
                        </div> : null}
                    </p>
                    {mstr ? <div>

                    </div> : null}
                </div>
            );
        }
        return null;
    };

    const handleEnter = (cursor: number) => {
        if (postings) {
            const post = postings?.normalized[cursor];
            dispatch(FetchJournal(post.journal_id, refetch));
        }
    };

    const ToggleCheck = async (id: number) => {
        await postToggleCheque(id);
        dispatch(fetchCheques());
    };

    const DeleteCheque = async (id: number)=>{
        try{
            await deleteCheque(id);
            dispatch(fetchCheques());

        }catch (e) {
            message.error("Failed to delete cheque");
        }

    }

    const Header: FC = () => {
        const opening = postingDetail.opening_balance;

        return <tr>
            <DetailTd colSpan={3}>Opening Balance</DetailTd>
            <DetailTd>{opening <= 0 ? Math.abs(opening).toLocaleString() : null}</DetailTd>
            <DetailTd>{opening > 0 ? opening.toLocaleString() : null}</DetailTd>
            <DetailTd/>
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
            <DetailTd/>
        </tr>
    }

    const ClosingFooter: FC = () => {
        const opening = postingDetail.closing_balance;
        return <tr>
            <DetailTd colSpan={3}>Closing</DetailTd>
            <DetailTd>{opening <= 0 ? Math.abs(opening).toLocaleString() : null}</DetailTd>
            <DetailTd>{opening > 0 ? opening.toLocaleString() : null}</DetailTd>
            <DetailTd/>
        </tr>
    }

    const getLedgersForDates = async () => {
        await dispatch(fetchPostingWithDate(props.cust, startDate, endDate))
    }


    return (
        <div style={{backgroundColor: "white", color: "black", height: "100%", display:"flex"}}>
            { !props.hideTopBar?<div style={{ padding: 5, borderRight: "1px solid #f2f2f2", height: "100%", display:"flex", minWidth:"5%", flexDirection:"column"}}>
                {props.hideTopBar ? null : <Button
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
                }
                <Button
                    style={{ marginLeft: 4, marginTop: 5}}
                    size="small"
                    onClick={() => {
                        EditMaster();
                    }}
                >
                    Edit
                </Button>
                <Button
                    style={{marginLeft: 4, marginTop: 5}}
                    size={"small"}
                    onClick={() => {
                        dispatch(ToggleJournal(true, false, 0, refetch));
                    }}
                >
                    +
                </Button>
            </div>:null }
            <div style={{ flex: 1}}>
            <div style={{display: "flex"}}>
                {masterItem(masters?.normalized[props.cust], postingDetail.closing_balance, total)}
            </div>
            {
                props.hideTopBar && !masters?.normalized[props.cust] ? null :
                    <div>
                        <div style={{
                            marginLeft: 5,
                            display: "flex",
                            maxWidth: "100%",
                            flexDirection: "row",
                            alignItems: "center"
                        }}>
                           From <DatePicker value={moment(startDate)} onChange={(e) => {
                            if (e) setStartDate(e.format("YYYY-MM-DD"))
                        }}/>
                            to <DatePicker value={moment(endDate)} onChange={(e) => {
                            if (e) setEndDate(e.format('YYYY-MM-DD'))
                        }}/>
                            <div style={{marginLeft: "10px"}}>
                                <Button type={"primary"} onClick={getLedgersForDates}>Get</Button>
                                <Button style={{marginLeft: "10px"}} type={"ghost"}
                                        onClick={downloadVouchers}>Download</Button>
                            </div>
                        </div>
                        <div style={{overflow: "hidden", overflowY: "scroll"}}>
                            <div style={{display: "flex", flexWrap: "wrap"}}>
                                <div style={{flex: 2}}>
                                    {postings && (
                                        <KeyList
                                            columns={["Date", "Narration", "", "Debit", "Credit", "Running"]}
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
                                        <ul style={{
                                            listStyle: "none",
                                            color: "white",
                                            height: 500,
                                            overflow: "scroll"
                                        }}>
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
                                            <Checkbox checked={chq.passed} style={{display: "inline"}}
                                                      onChange={async e => {
                                                          await ToggleCheck(chq.id);
                                                      }}/>
                                             &nbsp; {chq.passed ? "Passed" : "Pending"}
                                        </span>
                                                    <span>{moment(chq.date).format("MMM DD")}</span>
                                                    <span>{chq.name ? chq.name : null}</span>
                                                    <span>Rs. {chq.amount}</span>
                                                    <span>{chq.type}</span>
                                                    <span onClick={async()=>{ await DeleteCheque(chq.id)}}>Delete</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>}
            </div>
        </div>
    );
};

export default LedgerDetail;
