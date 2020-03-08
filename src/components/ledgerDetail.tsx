import React, { useEffect, useState } from 'react';
import { Ledger, Posting } from '../types/ledger';
import { putLedger, getPostings } from '../api';
import { Master } from '../types/master';
import { NullInt, NormalizedCache, normalize, RenderItemProps } from '../types/generic';
import moment from 'moment';
import EditStatement from './editStatement';
import withPop from './popup';
import { DialogWrapper, DialogContent } from '../pages/stmt';
import KeyList from './keylist';
import { stateSelector } from '../reducers';
import { Card } from 'antd';

interface LedgerProps {
  cust: number;
  handleEsc?(): void;
}
export interface QuickForm {
  cust_id: number;
  toFrom: string;
  type: string;
  date: string;
  amount: number;
}

const LedgerDetail = (props: LedgerProps) => {

  const [ledgers, setLedgers] = useState<Array<Posting>>()
  const [total, setTotal] = useState(0);
  const [postings, setPosting] = useState<NormalizedCache<Posting>>();
  const [show, setShow] = useState(false);
  const masters = stateSelector(state => state.master.masters);
  // useEffect(()=>{
  //   fetchLedgers(props.cust.cust_id.Int64);
  // })

  useEffect(() => {
    setPosting(undefined);
    fetchLedgers(props.cust)
    setTotal(0);
  }, [props.cust])

  useEffect(() => {
    let sum = 0;
    postings?.all.forEach((id) => {
      sum = sum + postings.normalized[id].amount;
    })
    setTotal(sum);
  }, [postings])

  const fetchLedgers = async (cust_id: number) => {
    try {
      {
        const resp = await getPostings(cust_id);
        // setLedgers(resp.data);
        setPosting(normalize<Posting>(resp.data));
      }
    } catch (err) {
      console.log(`Error while fetching ledgers: ${err}`);
    }
  }


  const InlineLedgerForm = () => {

    const [date, setDate] = useState(moment().format('YYYY-MM-DD'));
    const [toFrom, setToFrom] = useState('From');
    const [type, setType] = useState('Less');
    const [amount, setAmount] = useState();

    const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      try {
        // await putLedger({date, toFrom, type, amount, cust_id:props.cust.cust_id.Int64}, props.company_id);
      } catch (err) {
        console.log(err);
      } finally {
        const resp = await getPostings(props.cust);
        setLedgers(resp.data);
      }

    }

    return (
      <div>
        <form onSubmit={handleAdd} style={{ padding: 5 }}>
          <input onChange={(e) => { setDate(e.target.value) }} type="date" value={date} />
          <select onChange={(e) => { setToFrom(e.target.value) }} value={toFrom} style={{ marginLeft: 5 }}>
            <option value={'From'}>From</option>
            <option value={'To'}>To</option>
          </select>
          <select onChange={(e) => { setType(e.target.value) }} value={type} style={{ marginLeft: 5 }}>
            <option value={'Less'}>Less</option>
            <option value={'Cash'}>Cash</option>
            <option value={'Bill'}>Bill</option>
          </select>
          <input onChange={(e) => { setAmount(parseInt(e.target.value)) }} defaultValue={''} value={amount} style={{ marginLeft: 5 }} type="number" placeholder="amount" />
          <input type="submit" value="Add" />
        </form>
      </div>
    )
  }

  const renderItem = (arg: RenderItemProps<Posting>) => {
    return (
      <tr>
        <td>{moment(arg.item.date).format('LL')}</td>
        <td style={{ overflow: "hidden" }}>{arg.item.narration}</td>
        <td>{arg.item.ref_no}</td>
        <td>{arg.item.amount < 0 ? Math.abs(arg.item.amount) : null}</td>
        <td>{arg.item.amount > 0 ? arg.item.amount : null}</td>
      </tr>
    )
  }

  const masterItem = (mstr: Master | undefined, total: number) => {
    if (mstr) {
      return <Card title={mstr.name} bordered={false} style={{ marginTop: 10 }}  >
        <p>{mstr.cust_id.Int64}</p>
        <p>Outstanding: {Math.abs(total)} {total < 0 ? "debit" : "credit"} </p>
      </Card>
    }
    return null
  }

  return (
    <div style={{ padding: '5px 10px', marginTop: 10, flex: 2 }}>
      <h3><button className="btn btn-danger" onClick={() => { if (props.handleEsc) { props.handleEsc() } }}>Close</button>&nbsp;</h3>
      {masterItem(masters?.normalized[props.cust], total)}
      <div style={{ overflow: 'hidden', height: 800, overflowY: "hidden" }}>
        {withPop(<DialogWrapper> <DialogContent> <EditStatement cust_id={props.cust} statement={2} /></DialogContent></DialogWrapper>, show)}
        {
          postings &&
          <KeyList
            columns={['date', 'narration', 'refno', 'debit', 'credit']}
            cursor={0}
            data={postings}
            maxHeight={400}
            rowHeight={20}
            numberOfRows={7}

            renderItem={renderItem}
            handleEscape={props.handleEsc}
          />
        }
      </div>
      {InlineLedgerForm()}
    </div>
  )
}

export default LedgerDetail;
