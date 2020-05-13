import React, {useEffect, useState} from 'react';
import {Recommended} from "./stmt";
import {getPendingCheques} from "../api";
import {PageDiv} from "../components/styledComp";
import Nav from "../components/nav";
import KeyList from "../components/keylist";
import {normalize, RenderItemProps} from "../types/generic";
import {SELTR} from "./index";
import {SimTd} from "../components/sttmntTR";
import moment from "moment";

const PendingPage = ()=>{
  const [ cheques, setCheques ] = useState<Array<Recommended>>([]);

  useEffect(()=>{
    getPendingCheques().then(res =>{
      setCheques(res.data)
    })
  }, [])

  const render = (args: RenderItemProps<Recommended>) =>{
    return(
      <SELTR>
        <SimTd>{moment(args.item.date).format("MMM Do")}</SimTd>
        <SimTd>{args.item.name}</SimTd>
        <SimTd>{args.item.amount}</SimTd>
      </SELTR>
    )
  }

  return(
    <PageDiv>
      <Nav />
      <h2 className={"text-light"}>Pending Cheques</h2>
      <KeyList cursor={0} data={normalize(cheques)}
               renderItem={render} columns={['Date','Name','Amount']}
               rowHeight={20} numberOfRows={14} maxHeight={500} />
    </PageDiv>
  )
}

export default PendingPage;