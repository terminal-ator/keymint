import React, { useState, useEffect } from "react";
import ReceiptForm from "../components/receiptForm";
import {AppState, stateSelector} from "../reducers";
import { connect, ConnectedProps, useDispatch } from "react-redux";
import { NormalizedCache, normalize, DeNormalize } from "../types/generic";
import moment from "moment";
import ChequeForm from "../components/chqForm";
// @ts-ignore
import numWords from "num-words";
import { PageDiv } from "../components/styledComp";
import Nav from "../components/nav";
import {addCheques, newPostReceipt, postLedger, postReceipt, ReceiptRequest} from "../api";
import { FetchMasters } from "../actions/masterActions";
import {Button, Checkbox, message, Select} from "antd";
import LedgerDetail from "../components/ledgerDetail";
import {fetchCheques, fetchPosting} from "../actions/postingActions";
import {Master} from "../types/master";
import {Journal} from "../types/ledger";
import VoucherRow from "./VoucherRow";

export interface Cheque {
    id: number;
    master_id: number;
    amount: number;
    date?: string;
    passed?: boolean;
}

const mapState = (state: AppState) => {
    return {
        masters: state.master.masters,
        companyID: state.sys.SelectedCompany
    };
};

const connector = connect(mapState, {});

type PropType = ConnectedProps<typeof connector>;
var ID = function() {
    // Math.random should be unique because of its seeding algorithm.
    // Convert it to base 36 (numbers + letters), and grab the first 9 characters
    // after the decimal.
    return Math.random() * 1000;
};

const genChq = (): Cheque => {
    return {
        id: ID(),
        master_id: 0,
        amount: 0
    };
};

const RecForm = (props: PropType) => {
    const [total, setTotal] = useState(0);
    const cheque: Cheque[] = [genChq()];
    const [cheques, setCheques] = useState<Array<Cheque>>(cheque);
    const companyID = stateSelector(state=>state.sys.SelectedCompany);
    const [currentDate, setCurrentDate] = useState(moment().format("YYYY-MM-DD"));
    const [ areCheques, setAreCheques ] = useState(false);
    const [ selectedCust, setSelectedCust ] = useState(0);
    const dispatch = useDispatch();

    const stateJournal = stateSelector(state => state.ui.journal );

    let journal: Journal = {
        id: 0,
        company_id: companyID,
        date: moment().format("YYYY-MM-DD"),
        ref_no: "",
        sttmt_id: undefined,
        type: "Receipt",
        narration: "",
        postings: []
    }

    const normalizedMaster = DeNormalize<Master>(props.masters);

    const filteredMaster = normalizedMaster.filter((mstr)=> mstr.group_id == 6 );

    useEffect(()=>{
        if(stateJournal){
            const filteredState = stateJournal.postings?.filter((po)=>po.amount>=0);
            if(filteredState){
                console.log({ filteredState })
                setCheques(filteredState);
            }else{
                setCheques([genChq()]);
            }
            const cashMaster = stateJournal.postings?.filter((po)=> props.masters.normalized[po?.master_id]?.group_id == 6);
            if(cashMaster && cashMaster.length>0){
                setCashAccount(cashMaster[0].master_id);
            }else{
                setCashAccount(filteredMaster[0].cust_id.Int64)
            }
        }
    }, [stateJournal]);

    const [ cashAccount, setCashAccount ] = useState(filteredMaster[0]?.cust_id.Int64 || 0);

    let saveReceipts = async (rec: Cheque) => {
        let newR = [...cheques.slice(0, cheques.length - 1), rec];
        newR.push(genChq());
        await setCheques(newR);
        await localStorage.setItem("chqs", JSON.stringify(newR));
        console.log({ newR });
    };

    useEffect(() => {
        let nTotal = 0;
        cheques.forEach(rec => {
            let sum = rec && rec.amount ? rec.amount : 0;
            nTotal = nTotal + sum;
        });
        setTotal(nTotal);
        console.log({ cheques });
    }, [cheques]);

    const saveReceipt = async () => {

        const confirm = window.confirm("Save?");
        if(!confirm) return ;

        try {
            const postCheques = cheques.reduce((result, temp) => {
                if (temp.amount != 0 && temp.master_id != 0) {
                    const nChq = {
                        ...temp,
                        id: 0,
                        date: currentDate
                    };
                    // @ts-ignore
                    result.push(nChq);
                }
                return result;
            }, []);
            if(areCheques){
                await addCheques(postCheques);
            }else{
                const data: ReceiptRequest = { date : currentDate, receipt_entry: postCheques, receipt_id: cashAccount};
                await newPostReceipt(data);
            }
            // const res = await addCheques(postCheques);
            // dispatch(FetchMasters);
            alert(JSON.stringify(postCheques));
            setCheques([genChq()]);
            //
            // setCurrentDate(moment().format("YYYY-MM-DD"));
            dispatch(FetchMasters());
        } catch (err) {
            message.error("Failed to save, please try again.");
            console.log(err);
        }
    };

    const add = async () => {
        const chqs = [...cheques, genChq()];
        await setCheques(chqs);
    };

    const handleUpdate = async (
        id: number,
        master_id: number,
        amount: number
    ) => {
        console.log(`Updating the cheques: ${master_id} // ${amount}`);
        const chqs = cheques.map(chq => {
            if (chq.id == id) {
                return {
                    id,
                    master_id,
                    amount
                };
            } else return chq;
        });
        await setCheques(chqs);
    };

    const clear = () => {
        const clearBool = window.confirm("Are you sure, all data will be lost ?");
        if (clearBool) {
            setCheques([genChq()]);
        }
    };

    const fetchDetails =async (id: number)=>{
        // await dispatch(fetchPosting(id));
        // await dispatch(fetchCheques());
        // setSelectedCust(id);
    }

    return (
            <div style={{ padding: 10, display:"flex",
                justifyContent:"center", overflow:"hidden", maxHeight:"100%", height: "100%", backgroundColor:"inherit" }}>
                <div style={{ flex: 1, maxHeight:"100%", overflowY:"scroll"}}>
                    <div
                        style={{
                            width: "100%",
                            padding: 5,
                            borderRadius: 4,
                            backgroundColor: areCheques ?"#0ffaa8":"#FFDE03",
                            marginBottom: 5,
                        }}
                    ><h4 style={{ fontWeight:900}}>Receipts</h4></div>
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            width: "100%",
                            justifyContent: "space-between",
                        }}
                    >
                        <div>
                            <Button
                                className="btn"
                                disabled={cheques.length === 1}
                                type={"danger"}
                                style={{ marginLeft: 0 }}
                                onClick={() => {
                                    clear();
                                }}
                            >
                                Clear
                            </Button>
                            <span
                                style={{ marginLeft: 6}}
                            ><Checkbox checked={areCheques} onChange={(e => {setAreCheques(e.target.checked)})} style={{ marginRight: "10px"}} />
              Are Cheques?
              </span>
                        </div>
                        <input
                            type="date"
                            style={{ float: "right",  outline: "none", border:"none" }}
                            onChange={e => {
                                setCurrentDate(e.target.value);
                            }}
                            defaultValue={currentDate}
                        />
                    </div>
                    {
                        !areCheques?<Select onChange={(e)=>{setCashAccount(e)}} value={cashAccount} style={{width: "200px", marginTop: 10}}>
                            {
                                filteredMaster.map((master) => <Select.Option key={master.cust_id?.Int64}
                                                                              value={master.cust_id?.Int64}>{master.name}</Select.Option>)
                            }
                        </Select>:null
                    }

                    {cheques.map((chq, idx) => {
                        if (props.masters) {
                            return (
                                <VoucherRow
                                    key={chq.id}
                                    MasterList={props.masters}
                                    add={add}
                                    handleModify={handleUpdate}
                                    Chq={chq}
                                    showAdd={idx === cheques.length - 1}
                                    fetchDetails={fetchDetails}

                                />
                            );
                        }
                    })}

                    <Button
                        onClick={() => {
                            saveReceipt();
                        }}
                        style={{ marginTop: 10 }}
                    >
                        Save
                    </Button>
                    <p
                        style={{
                            width: "100%",
                            borderTop: "1px solid #3e3e3e",
                            marginTop: 5
                        }}
                    >
            <span>
              {`Total: `}{" "}
                <span style={{ float: "right" }}>{`Rs. ${Math.abs(total)}`}</span>
            </span>
                        <span>{numWords(Math.abs(total)).toUpperCase()}</span>
                    </p>
                </div>
                {/*<div style={{ flex: 1, overflow:"hidden", maxWidth: "100vh"}} >*/}
                {/*    <LedgerDetail cust={selectedCust} hasFocus={false}  />*/}
                {/*</div>*/}
            </div>
    );
};

export default connect(mapState, {})(RecForm);
