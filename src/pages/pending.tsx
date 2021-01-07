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
import {Modal} from "antd";
import LedgerDetail from "../components/ledgerDetail";
import {stateSelector} from "../reducers";
import {useDispatch} from "react-redux";
import {fetchCheques, fetchPosting} from "../actions/postingActions";

const PendingPage = ()=>{
  const [ cheques, setCheques ] = useState<Array<Recommended>>([]);

  const [ custid, setCustID ] = useState(0);
  const [ modalVisible, setModalVisible ] = useState(false);

  const masters = stateSelector(stt=>stt.master.masters);

  const dispatch = useDispatch();


  const handleCursor = async ( c_id: number)=>{
    console.log({ c_id });
    const selectedChq = cheques[c_id];
    console.log({ selectedChq });
    console.log({ cheques });
    const cheque = cheques.filter((chq)=> chq.id == c_id);
    console.log({ cheque });
    setCustID(c_id);
      await dispatch(
        fetchPosting(cheque[0].master_id
        )
      );
    await dispatch(fetchCheques());
    setModalVisible(true);
  };

  const cModal = ()=>{
    setModalVisible(false);
  };

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
      <h2>Pending Cheques</h2>
      <KeyList cursor={0} data={normalize(cheques)}
               handleEnter={handleCursor}
               renderItem={render} columns={['Date','Name','Amount']}
               rowHeight={20} numberOfRows={14} maxHeight={500} />
      <Modal visible={modalVisible} style={{ zIndex: 2 }}  destroyOnClose width={"80%"}>
        <LedgerDetail cust={custid} hasFocus={true} handleEsc={cModal}  />
      </Modal>
    </PageDiv>
  )
}

export default PendingPage;