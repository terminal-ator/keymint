import React, {useState, useEffect, FC} from "react";
import { Formik, FieldArray, Form, Field } from "formik";
import { Journal, TPosting } from "../types/ledger";
import moment from "moment";
import { stateSelector } from "../reducers";
import { Input, DatePicker, message, Button } from "antd";
import { Select } from "./styledComp";
import { DeNormalize, NormalizedCache } from "../types/generic";
import PostingForm from "./postingForm";
import dotProp from "dot-prop-immutable";
import { postNewJournal } from "../api";
import { useDispatch } from "react-redux";
import {ToggleJournal} from "../actions/uiActions";
import {fetchPosting} from "../actions/postingActions";
import {FetchMasters} from "../actions/masterActions";


interface JournalProps {
  onComplete?: ()=>void
}

const JournalForm:FC<JournalProps> = (props) => {
  const cmpnyID = stateSelector(stt => stt.sys.SelectedCompany);
  const masters = stateSelector(stt => stt.master.masters);
  const selectedID = stateSelector(stt => stt.posts.postId);
  const mstrs = DeNormalize(masters);
  const ui = stateSelector(state => state.ui.journalID);
  const stateJournal = stateSelector(state => state.ui.journal);
  const dispatch = useDispatch();

  let journal: Journal = {
    id:0,
    company_id: cmpnyID,
    date: moment().format("YYYY-MM-DD"),
    ref_no: "",
    sttmt_id: undefined,
    type: "Journal",
    narration: "",
    postings: []
  };

  const newPosting: TPosting = { amount: 0, id: 0, master_id: 1 };

  let postings: TPosting[] = [
    { amount: 0, id: 0, master_id: 1 },
    { amount: 0, id: 0, master_id: 1 }
  ];
  if (ui.valid && stateJournal && stateJournal.postings) {
    journal = stateJournal;
    postings = stateJournal.postings;
  }

  const [jrnl, setJrnl] = useState(journal);
  const [psting, setPsting] = useState(postings);
  const [debit, setDebit] = useState(0);
  const [credit, setCredit] = useState(0);

  useEffect(() => {
    let deb = 0,
      cred = 0;
    psting.forEach(pst => {
      if (pst.amount < 0) {
        deb += Math.abs(pst.amount);
      } else {
        cred += Math.abs(pst.amount);
      }
    });
    setDebit(deb);
    setCredit(cred);
  }, [psting]);

  const handleMasterChange = (postid: number, custid: number) => {
    // console.log(`PostId: ${postid} MasterID: ${custid}`)
    const posting = dotProp.set(psting, `${postid}.master_id`, custid);
    setPsting(posting);
  };

  const handleAmount = (postid: number, amount: number) => {
    // console.log(`PostId: ${postid} amount:${amount}`)
    const posting = psting[postid];
    // const nPost = { ...posting, amount };
    // const newPosting = [...psting.slice(0, postid - 1), nPost, ...psting.slice(postid)]
    const nPosting = dotProp.set(psting, `${postid}.amount`, amount);
    setPsting(nPosting);
  };

  const handleAdd = () => {
    const posts = [...psting, newPosting];
    setPsting(posts);
  };

  const handleDateChange = (date: any, dateString: any) => {
    const jrnls = dotProp.set(jrnl, `date`, date.format("YYYY-MM-DD"));
    setJrnl(jrnls);
  };

  const handleNarrationChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const jrnls = dotProp.set(jrnl, `narration`, e.target.value);
    setJrnl(jrnls);
  };

  const handleRefChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const jrnls = dotProp.set(jrnl, `ref_no`, e.target.value);
    setJrnl(jrnls);
  };

  const handleSave = async () => {

    const postJournals = { ...jrnl, postings: psting };
    // if(postJournals.id==1){
    //   delete postJournals.id
    // }
    console.log({ postJournals })
    try {
      const resp = await postNewJournal(postJournals);
      if (resp.status == 200 && !ui.valid) {
        message.success("Successfully added journal entry");
        setPsting(postings);
        setJrnl(journal);
      } else if (resp.status == 200 && ui.valid) {
        message.success("Update Success");
        await dispatch(fetchPosting(selectedID));
        if(props.onComplete){
          await props.onComplete();
        }
        await dispatch(FetchMasters());
        await dispatch(ToggleJournal(false, false, 0, ()=>{}));

      } else {
        message.error("Some error occurred, please try again");
      }
    } catch (err) {
      message.error("Failed to make request");
    }
  };

  return (
    <div style={{}}>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 20 }}>
      <div style={{ width: "50%"}}>
        Ref No:
        <Input value={jrnl.ref_no} onChange={handleRefChange}   />
      </div>
        <DatePicker onChange={handleDateChange} value={moment(jrnl.date)} />
      </div>


      {psting.map((pID, idx) => (
        <PostingForm
          key={idx}
          posting={pID}
          pKey={idx}
          masters={mstrs}
          handleMasterChange={handleMasterChange}
          handleAmount={handleAmount}
        />
      ))}
      <p>
        Debit: {debit} | Credit: {credit}
      </p>
      <Button
        onClick={() => {
          handleAdd();
        }}
      >
        Add
      </Button>
      <div>
        <textarea
          onChange={handleNarrationChange}
          placeholder="Narration"
          value={jrnl.narration}
          style={{ marginTop: 5, width: "40%"}}
        />
      </div>
      <Button
        onClick={async () => {
          await handleSave();
        }}
      >
        Save
      </Button>
    </div>
  );
};

export default JournalForm;
