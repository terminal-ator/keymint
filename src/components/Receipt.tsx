import {stateSelector} from "../reducers";
import {DeNormalize} from "../types/generic";
import {Journal, TPosting} from "../types/ledger";
import moment from "moment";
import React, {useEffect, useState} from "react";
import {Master} from "../types/master";
import {Button, Checkbox, Input, message, Select} from "antd";
import ChequeForm from "./chqForm";
import {postNewJournal} from "../api";
import {fetchCheques, fetchPosting} from "../actions/postingActions";
import {FetchMasters} from "../actions/masterActions";
import {ToggleJournal} from "../actions/uiActions";
import {useDispatch} from "react-redux";
import dotPropImmutable from "dot-prop-immutable";
import LedgerDetail from "./ledgerDetail";
import VoucherRow from "./VoucherRow";

const ID = (): number => {
    return Math.random() * 1000;
}

const Receipt = () => {

    // get compaany
    const cmpnyId = stateSelector(stt => stt.sys.SelectedCompany);
    const masters = stateSelector(stt => stt.master.masters);
    const selectedID = stateSelector(stt => stt.posts.postId);
    const mstrs = DeNormalize(masters);
    const journalID = stateSelector(state => state.ui.journalID);
    const stateJournal = stateSelector(state => state.ui.journal);
    const [ selectedCust, setSelectedCust ] = useState(0);
    const dispatch = useDispatch();

    let journal: Journal = {
        id: 0,
        company_id: cmpnyId,
        date: moment().format("YYYY-MM-DD"),
        ref_no: "",
        sttmt_id: undefined,
        type: "Receipt",
        narration: "",
        postings: []
    }

    const generateRandomPosting = (): TPosting => {
        return {
            amount: 0,
            id: ID(),
            master_id: 1
        }
    }

    const [jrnl, setJrnl] = useState(journal);
    const [postings, setPostings] = useState([generateRandomPosting()]);
    const [currentDate, setCurrentDate] = useState(moment().format("YYYY-MM-DD"));

    const normalizedMaster = DeNormalize<Master>(masters);

    const filteredMaster = normalizedMaster.filter((mstr) => mstr.group_id ===6 || mstr.group_id===5);
    const [cashAccount, setCashAccount] = useState(filteredMaster[0].cust_id.Int64 || 0);
    const [total, setTotal] = useState(0.0);

    // load a previous journal
    useEffect(() => {
        if (journalID.id !== 0 && stateJournal && stateJournal.postings) {
            setJrnl(stateJournal);
            setPostings(stateJournal.postings)
            setCurrentDate(moment(stateJournal.date).format("YYYY-MM-DD"));
            const filterdState = stateJournal.postings.filter((po) => po.amount >= 0);
            if (filterdState) {
                setPostings(filterdState);
            }
            const cashMaster = stateJournal.postings.filter((po) => masters.normalized[po.master_id].group_id === 6 || masters.normalized[po.master_id].group_id=== 5);
            if (cashMaster && cashMaster.length > 0) {
                setCashAccount(cashMaster[0].master_id);
            }
        }
    }, [journalID])

    // calculate totals
    useEffect(() => {
        let ntotal = 0;
        postings.forEach(post => {
            let sum = post && post.amount ? post.amount : 0;
            ntotal += sum;
        });
        setTotal(ntotal);
    }, [postings]);

    const add = async () => {
        const chqs = [...postings, generateRandomPosting()];
        await setPostings(chqs);
    };

    const handleUpdate = async (
        id: number,
        master_id: number,
        amount: number
    ) => {
        console.log(`Updating the cheques: ${master_id} // ${amount}`);
        const chqs = postings.map(chq => {
            if (chq.id == id) {
                return {
                    id,
                    master_id,
                    amount
                };
            } else return chq;
        });
        await setPostings(chqs);
    };

    const clear = () => {
        const clearBool = window.confirm("Are you sure, all data will be lost ?");
        if (clearBool) {
            setPostings([generateRandomPosting()]);
        }
    };

    const fetchDetails = async (id: number) => {
        await dispatch(fetchPosting(id));
        await dispatch(fetchCheques());
        setSelectedCust(id);
    }

    const SaveReceipt = async () => {
        const confirm = window.confirm("Save?");
        if (!confirm) return;

        // prepare the postings
        const filteredPosting = postings.reduce((result:Array<TPosting>, temp) => {
            if (temp.amount != 0 && temp.master_id != 0) {
                const nChq = {...temp, id: 0};
                result.push(nChq);
            }
            return result;
        }, [])
        const cashPosting: TPosting = {id: 0, master_id: cashAccount, amount: -total};
        const finalPostings = [...filteredPosting, cashPosting];
        const updatedJournal = {...jrnl, date: currentDate, postings: finalPostings};
        console.log({updatedJournal})

        try {
            const resp = await postNewJournal(updatedJournal);
            if (resp.status == 200) {
                message.success("Successfully added journal entry");
                setPostings([generateRandomPosting()]);
                setJrnl(journal);
                await dispatch(fetchPosting(selectedID));
                await dispatch(FetchMasters());
                // await dispatch(ToggleJournal(false, false, 0, ()=>{}));
            } else {
                message.error("Some error occurred, please try again");
            }
        } catch (err) {
            message.error("Failed to make request");
        }

    }

    return (
        <div style={{
            padding: 10, display: "flex",
            justifyContent: "center", overflow: "hidden", maxHeight: "100%", height: "100%", backgroundColor: "inherit"
        }}>
            <div style={{flex: 1, maxHeight: "100%", overflow:"hidden"}}>
                <div
                    style={{
                        width: "100%",
                        padding: 5,
                        borderRadius: 4,
                        backgroundColor: "#FFDE03",
                        marginBottom: 5,
                    }}
                ><h4 style={{fontWeight: 900}}>Receipts</h4></div>
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
                            disabled={postings.length === 1}
                            type={"danger"}
                            style={{marginLeft: 0}}
                            onClick={() => {
                                clear();
                            }}
                        >
                            Clear
                        </Button>
                    </div>
                    <input
                        type="date"
                        style={{float: "right", outline: "none", border: "none"}}
                        onChange={e => {
                            setCurrentDate(e.target.value);
                        }}
                        defaultValue={currentDate}
                        value={currentDate}
                    />
                </div>
                {
                    <Select onChange={(e) => {
                        setCashAccount(e)
                    }} value={cashAccount} style={{width: "200px", marginTop: 10}}>
                        {
                            filteredMaster.map((master) =>
                                <Select.Option key={master.cust_id?.Int64}
                                               value={master.cust_id?.Int64}>{master.name}</Select.Option>)
                        }
                    </Select>
                }
                <div style={{ maxHeight:"350px", height:"350px", overflowY:"scroll"}}>
                {postings.map((chq, idx) => {
                    if (masters) {
                        return (
                            <VoucherRow
                                key={chq.id}
                                MasterList={masters}
                                add={add}
                                handleModify={handleUpdate}
                                Chq={chq}
                                showAdd={idx === postings.length - 1}
                                fetchDetails={fetchDetails}

                            />
                        );
                    }
                })}
                <Button style={{ marginTop: 5  }} onClick={()=>{add()}}>Add</Button>
                </div>
                <Input.TextArea style={{ display: "block", marginTop: 10 }} value={jrnl.narration}
                                onChange={(e)=>{
                                    const n = dotPropImmutable.set(jrnl, 'narration',e.target.value)
                                    setJrnl(n);
                                }} placeholder={"Narration"} />
                <Button
                    onClick={async () => {
                        await SaveReceipt();
                    }}
                    style={{marginTop: 10}}
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
                        <span style={{float: "right"}}>{`Rs. ${Math.abs(total)}`}</span>
                    </span>
                </p>
            </div>
            <div style={{ flex: 1, overflow:"hidden", maxHeight:"600px"}} >
                <LedgerDetail  cust={selectedCust} hasFocus={false}  />
            </div>
        </div>
    );

}

export default Receipt;