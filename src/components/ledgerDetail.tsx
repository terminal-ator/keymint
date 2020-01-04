import React, { useEffect, useState } from 'react';
import { Ledger } from '../types/ledger';
import { fetchLedger } from '../api';
import { Master } from '../types/master';
import { NullInt } from '../types/generic';
import moment from 'moment';

interface LedgerProps {
  cust: Master;
  company_id: number ;
}

const LedgerDetail = (props: LedgerProps)=>{

  const [ ledgers, setLedgers ] = useState<Array<Ledger>>()

  useEffect(()=>{
    fetchLedger(props.cust.cust_id.Int64 ,props.company_id);
  })
  
  useEffect(()=>{
    fetchLedgers(props.cust.cust_id,props.company_id)
  },[props.cust.cust_id, props.company_id])

  const fetchLedgers = async(cust_id: NullInt, company_id: number)=>{
    try{
      if(cust_id.Valid){
        const resp = await fetchLedger(cust_id.Int64,company_id);
        setLedgers(resp.data);
      }
      
    }catch(err){
      console.log(`Error while fetching ledgers: ${err}`)
    }
  }

  const LedgerItem = (ledger: Ledger)=>{
    return(
      <div style={{ alignSelf: ledger.from_cust.Valid?'flex-start':'flex-end', boxShadow:'0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)', padding: '10px 5px', borderRadius: 4}}>
        <span><b>{ledger.ledger_type}</b></span>
        <p>{ (ledger.to_cust.Valid && ledger.to_cust.Int64) || (ledger.from_cust.Valid && ledger.from_cust.Int64)}</p>
        <div>
          <span style={{ fontSize: 11}}>On { moment(ledger.ledger_date).format('LL') }</span>
        </div>
      </div>
    )
  }

  return(
    <div style={{padding: '5px 10px', marginTop: 10 ,flex: 2, height: 500, overflowY:'scroll'}}>
      <h3>Ledger Details for {props.cust.name}</h3>
      <div style={{display: 'flex', flexDirection:'column-reverse' ,flex:2, justifyContent:'flex-end'}} >
        {
          ledgers && ledgers.map((ledger)=>LedgerItem(ledger))
        }
      </div>
    </div>
  )
}

export default LedgerDetail;