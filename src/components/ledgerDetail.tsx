import React, { useEffect, useState } from 'react';
import { Ledger } from '../types/ledger';
import { fetchLedger, putLedger } from '../api';
import { Master } from '../types/master';
import { NullInt } from '../types/generic';
import moment from 'moment';
import EditStatement from './editStatement';
import withPop from './popup';
import { DialogWrapper, DialogContent } from '../pages/stmt';

interface LedgerProps {
  cust: Master;
  company_id: number ;
}
export interface QuickForm{
  cust_id: number;
  toFrom: string;
  type: string;
  date: string;
  amount: number;
}

const LedgerDetail = (props: LedgerProps)=>{

  const [ ledgers, setLedgers ] = useState<Array<Ledger>>()
  const [total, setTotal ] = useState(0);

  const [show, setShow ] = useState(false);

  useEffect(()=>{
    fetchLedger(props.cust.cust_id.Int64 ,props.company_id);
  })
  
  useEffect(()=>{
    fetchLedgers(props.cust.cust_id,props.company_id)
    setTotal(0);
  },[props.cust.cust_id, props.company_id])

  useEffect(()=>{
    let sum = 0;
    ledgers?.forEach((ledger)=>{
      if(ledger.from_cust.Valid &&  ledger.from_cust.Int64!=0){
        sum = sum - ledger.from_cust.Int64
      }else if(ledger.to_cust.Valid){
          sum = sum + ledger.to_cust.Int64
      }else{
        sum = 0;
      }
      setTotal(sum);
    })
  },[ledgers])

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
      <div style={{ alignSelf: (ledger.from_cust.Valid && ledger.from_cust.Int64!=0)?'flex-start':'flex-end',
      boxShadow:'0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)',  padding: '10px 5px', borderRadius: 4, display:'flex', flexDirection:"column"}}>
      <div style={{ display:'flex', flexDirection: 'row', width:'400px',
       justifyContent: 'space-around', marginTop: 5,
       }} key={ledger.id}>
         <div>
          <span style={{ fontSize: 11}}>{ moment(ledger.ledger_date).format('LL') }</span>
        </div>
        <span><b>{ledger.ledger_no.Valid && ledger.ledger_no.String || ledger.ledger_type}</b></span>
      <span style={{ alignSelf: 'flex-end'}}>₹ {(ledger.to_cust.Valid && ledger.to_cust.Int64) || (ledger.from_cust.Valid && ledger.from_cust.Int64)}</span>
      </div>
      <div>
       <button onClick={()=>{setShow(true)}}>Edit</button>
      </div>
      </div>
   )
  }

  const InlineLedgerForm = ()=>{

    const [ date, setDate ] = useState(moment().format('YYYY-MM-DD'));
    const [ toFrom , setToFrom ] = useState('From');
    const [ type, setType ] = useState('Less');
    const [amount, setAmount ] = useState();

    const handleAdd = async (e:React.FormEvent<HTMLFormElement>)=>{
      e.preventDefault();
      try{
        await putLedger({date, toFrom, type, amount, cust_id:props.cust.cust_id.Int64}, props.company_id);
      }catch(err){
        console.log(err);
      }finally{
        const resp = await fetchLedger(props.cust.cust_id.Int64,props.company_id);
        setLedgers(resp.data);
      }
      
    }

      return(
        <div>
          <form onSubmit={handleAdd} style={{ padding: 5}}>
            <input onChange={(e)=>{setDate(e.target.value)}} type="date" value={date} />
            <select onChange={(e)=>{setToFrom(e.target.value)}} value={toFrom} style={{ marginLeft: 5}}>
              <option value={'From'}>From</option>
              <option value={'To'}>To</option>
            </select>
            <select onChange={(e)=>{setType(e.target.value)}} value={type} style={{ marginLeft: 5}}>
              <option value={'Less'}>Less</option>
              <option value={'Cash'}>Cash</option>
              <option value={'Bill'}>Bill</option>
            </select>
            <input onChange={(e)=>{setAmount(parseInt(e.target.value))}} defaultValue={''} value={amount} style={{ marginLeft: 5}} type="number" placeholder="amount" />
            <input  type="submit" value="Add" />
          </form>
        </div>        
      )
  }

  return(
    <div style={{padding: '5px 10px', marginTop: 10 ,flex: 2}}> 
      {withPop(<DialogWrapper> <DialogContent> <EditStatement cust_id={props.cust.cust_id.Int64} statement={2}/></DialogContent></DialogWrapper>, show )}
      <h3>Ledger Details for {props.cust.name} Outstanding: {total}</h3>
      <div style={{display: 'flex', flexDirection:'column-reverse' ,flex:2, height: 400,overflowY:'scroll', justifyContent:'flex-end'}} >
        {
          ledgers && ledgers.map((ledger)=>LedgerItem(ledger))
        }
      </div>
      {InlineLedgerForm()}
    </div>
  )
}

export default LedgerDetail;