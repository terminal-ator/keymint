import React, {FC, useEffect, useState} from "react";
import {normalize, normalize_id, NormalizedCache, RenderItemProps} from "../types/generic";
import {Posting} from "../types/ledger";
import {getCheques, getPostings, postToggleCheque} from "../api";
import {AxiosResponse} from "axios";
import {Button, Checkbox, DatePicker, message} from 'antd';
import {Cheque} from "../pages/cheque";
import {useDispatch} from "react-redux";
import {FetchJournal, ToggleJournal, ToggleMasterForm} from "../actions/uiActions";
import {stateSelector} from "../reducers";
import {SimTd} from "./sttmntTR";
import moment from "moment";
import {Master} from "../types/master";
import {fetchCheques} from "../actions/postingActions";
import KeyList from "./keylist";

interface LedgerProps {
    id: number;
    handleEsc?(): void;
    hasFocus?: boolean;
}

interface LedgerResponse{
    master_id: number;
    opening_balance: number;
    start_date: string;
    end_date: string;
    closing_balance: number;
    journals: Posting[];
}

const { RangePicker } = DatePicker;

const LedgerDetails:FC<LedgerProps> = (props)=>{

    const masters = stateSelector(state => state.master.masters);

    const [ ledgers, setLedgers ] = useState<NormalizedCache<Posting>>();
    const [ opening, setOpening ] = useState(0);
    const [ closing, setClosing ] = useState(0);
    const [ startDate, setStartDate ] = useState("")
    const [ endDate, setEndDate ] = useState("");
    const [ loading, setLoading ] = useState(false);
    const [ chqs, setChqs ] = useState<Array<Cheque>>();
    const dispatch = useDispatch();

    const fetchDetails = ()=>{
        setLoading(true)
        getPostings(props.id).then((res:AxiosResponse<LedgerResponse>)=>{
            updateState(res.data)
        }).catch((err)=>{
            message.error("Failed to retrieve ledgers "+err)
        }).finally(()=>{
            setLoading(true)
        })

        getCheques(props.id).then((res)=>{
            setChqs(res.data);
        })
    }

    const fetchCheques = async ()=>{
        const res = await getCheques(props.id);
        setChqs(res.data);
    }


    useEffect(()=>{
        fetchDetails();
    }, [props.id])

    const updateState = ( nextState: LedgerResponse )=>{
        setLedgers(normalize(nextState.journals))
        setOpening(nextState.opening_balance)
        setClosing(nextState.closing_balance)
        setStartDate(nextState.start_date)
        setEndDate(nextState.end_date)
    }

    const EditMaster = () => {
        dispatch(ToggleMasterForm(true, masters.normalized[props.id]));
    };

    const renderItem = (arg: RenderItemProps<Posting>) => {
        return (
            <tr>
                <SimTd>{moment(arg.item.date).format("MMM DD")}</SimTd>
                <SimTd style={{ overflow: "hidden" }}>{arg.item.narration}</SimTd>
                <SimTd>{arg.item.ref_no}</SimTd>
                <SimTd align={"right"} >{arg.item.amount < 0 ?`₹ ${Math.abs(arg.item.amount)}` : null}</SimTd>
                <SimTd align={"right"}>{arg.item.amount >= 0 ? `₹ ${arg.item.amount}` : null}</SimTd>
            </tr>
        );
    };

    const masterItem = (mstr: Master | undefined, total: number) => {
        if (mstr) {
            return (
                <div
                    style={{ marginTop: 5,padding:5 }}
                >
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
                            // dispatch(ToggleJournal(true, false, 0));
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
        if (ledgers) {
            const post = ledgers?.normalized[cursor];
            dispatch(FetchJournal(post.journal_id));
        }
    };

    const ToggleCheck = async (id: number) => {
        await postToggleCheque(id);
        await fetchCheques()
    }

    return (
        <div style={{ backgroundColor: "white", color:"black", height:"100%"}}>
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
            {masterItem(masters?.normalized[props.id], closing)}
            <div style={{ marginLeft: 5 }}>
                <RangePicker />
            </div>
            <div style={{ overflow: "hidden", overflowY: "scroll" }}>
                <div style={{ display: "flex", flexWrap: "wrap" }}>
                    <div style={{ flex: 2 }}>
                        {ledgers && (
                            <KeyList
                                columns={["Date", "Narration", "Reference", "Debit", "Credit"]}
                                cursor={0}
                                data={ledgers}
                                maxHeight={700}
                                rowHeight={50}
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
                            <ul style={{ listStyle: "none", color: "white", height: 500, overflow: "scroll" }}>
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
            </div>
        </div>
    );

}

export default LedgerDetails;