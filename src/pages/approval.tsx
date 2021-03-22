import {Button, Checkbox, message} from 'antd';
import React, { FC, useEffect, useState } from 'react';
import useSWR from 'swr';
import { AuthenticatedGet } from '../api/auth';
import { PageDiv } from '../components/styledComp';
import { Journal } from '../types/ledger';
import { GeneralResponse } from '../types/response';
import Nav from '../components/nav';
import moment from 'moment';
import { useDispatch } from 'react-redux';
import { FetchJournal } from '../actions/uiActions';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import {ApproveJournals} from "../api/ledgers";

interface Props{
    approval: Journal
    status: boolean | undefined
    onChange(id: number, status: boolean):void
}
interface Map{
    [name: number] : boolean;
}

const ApprovalRow:FC<Props> = (props)=>{

    const dispatch = useDispatch();

    const { approval, status } = props;
    console.log(`Approval status at ${approval.id} is ${status}`)
    return (
        <div style={{ display: "flex", flexDirection:"row", justifyContent:"space-between", padding: 5}}>
            <div style={{ flexBasis: "5%"}}><Checkbox
                onChange={(e)=>{props.onChange(approval.id, e.target.checked)}}
                checked={status}  /> </div>
            <div style={{ flexBasis:"10%"}}>{ moment(approval.date).format('LL')}</div>
            <div style={{flexBasis:"50%"}}>{ approval.narration }</div>
            <div style={{flexBasis:"30%"}}>₹ {approval.amount?approval.amount.toLocaleString():0}</div>
            <div style={{ flexBasis: "15%"}}><Button onClick={async()=>{await dispatch(FetchJournal(approval.id))}} >View</Button></div>
        </div>
    )
}

const ApprovalPage  = ()=>{
    type  G = GeneralResponse<Array<Journal>>
    const { data, error, revalidate } = useSWR<G>('/journals/unapproved', AuthenticatedGet)
    const [ approved, setApproved ] = useState<Map>({});
    const [ buttonActive, setButtonActive] = useState(false);

    useEffect(()=>{
        if(data && data.data){
            var aMap = {};
            data.data.forEach((journal)=>{
                // @ts-ignore
                aMap[journal.id] = false;
            })
            setApproved(aMap);
        }
    },[data])

    const onApprovalChange = (id: number, status: boolean)=>{
        let copyMap = { ...approved }
        copyMap[id] = status;
        setApproved(copyMap);
        console.log({ approved });
    }

    const Approve = async ()=>{
        // map ids to an array
        let ids:number[] = []
        for(let key in approved){
            if(approved.hasOwnProperty(key) && approved[key]){
                ids.push(parseInt(key));
            }
        }
        try {
            await ApproveJournals(ids);
        }catch (e) {
            console.log(`Failed to approve ids.`)
            console.log({ e })
            message.error("There was an error processing your request.")
        }finally {
            await revalidate()
        }
    }

    const selecAll = (e: CheckboxChangeEvent)=>{
        var copymap = { ...approved };
        for(let key in copymap){
            if(copymap.hasOwnProperty(key))
            copymap[key] = e.target.checked;
        }
        console.log({ copymap })
        setApproved(copymap);

    }

    if(error) return <PageDiv>
        <Nav />
        <p>Failed to fetch unapproved</p>
        <Button type="ghost" onClick={async ()=>{ await revalidate()}}>Retry</Button>
    </PageDiv>

    if(!data) return <PageDiv><Nav/> Loading...</PageDiv>

    

    return <PageDiv>
        <Nav />
        <div style={{ display: "flex", flexDirection:"row"}}>
            <div style={{display:"flex", padding: 5}}><Checkbox onChange={selecAll}/> &nbsp; Select all</div>
            <div><Button type={"primary"} onClick={Approve}>Approve</Button></div>
        </div>
        <div style={{ display: "block", maxHeight:"100%", overflowY:"scroll" }}>
            {
                data.data && approved && data.data?.map((jrnl)=><ApprovalRow 
                                                        onChange={onApprovalChange} 
                                                        status={approved[jrnl.id]}
                                                        key={jrnl.id} 
                                                        approval={jrnl} />)
            }
        </div>
    </PageDiv>
}

export default ApprovalPage;