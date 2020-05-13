import React, {useEffect, useState} from 'react';
import {ax} from "../api";
import {Journal} from "../types/ledger";
import {stateSelector} from "../reducers";
import {PageDiv} from "../components/styledComp";
import Nav from "../components/nav";
import KeyList from "../components/keylist";
import {normalize, RenderItemProps} from "../types/generic";
import {SELTR} from "./index";
import moment from "moment";
import {SimTd} from "../components/sttmntTR";
import {useDispatch} from "react-redux";
import {FetchJournal} from "../actions/uiActions";
import {DatePicker} from "antd";

const { RangePicker }  = DatePicker

const DayBook = ()=>{
  const [ journals, setJournals ] = useState<Array<Journal> >([]);
  const companyID = stateSelector( s => s.sys.SelectedCompany)
  const [ sd, setSd ] = useState("");
  const [ ed, setEd ] = useState("");
  const dispatch = useDispatch();
  useEffect(()=>{
    ax.get(`/journals?sd=${sd}&ed=${ed}`,{
      headers:{
        "authorization":companyID
      }
    }).then((res)=>{
      setJournals(res.data)
    })
  },[sd, ed])

  const cols = ['Date', 'Narration', 'Reference','Type','Debit','Credit']


  const handleEnter = (cursor: number)=>{
    // const journal =
    dispatch(FetchJournal(cursor));
  }

  const render = (args:RenderItemProps<Journal>) =>{
    const amount = args.item.amount;
    return(
      <SELTR>
        <SimTd>{moment(args.item.date).format("MMM Do")}</SimTd>
        <SimTd>{args.item.narration}</SimTd>
        <SimTd>{args.item.ref_no}</SimTd>
        <SimTd>{args.item.type}</SimTd>
        <SimTd>{amount && amount<=0?Math.abs(amount):null}</SimTd>
        <SimTd>{ amount && amount>0?Math.abs(amount):null}</SimTd>
      </SELTR>
    )
  }

  return(
    <PageDiv>
      <Nav/>
      <div>
        <h2 className={"text-light"}>Day Book</h2>
        <RangePicker  onChange={(date,dateString)=>{
          console.log("Datestrings: ", { dateString })
          setSd(dateString[0]); setEd(dateString[1]) }} />
        <div>
         <KeyList handleEnter={handleEnter} cursor={0} data={normalize(journals)} renderItem={render} columns={cols} rowHeight={20} numberOfRows={14} maxHeight={500} />
        </div>
      </div>
    </PageDiv>
  )

}

export default DayBook;