import React, {FC, useEffect, useRef, useState} from "react";
import { AppState, stateSelector } from "../reducers";
import {ConnectedProps, connect, useDispatch} from "react-redux";

import styled from "styled-components";
import { FetchMasters } from "../actions/masterActions";
import {Button, Input, message, Select} from "antd";
import {fetchBeats, GetGroupsAndBeats, PostCreateBeats, postCreateMaster, putUpdateMaster} from "../api";
import { Master } from "../types/master";
import dotPropImmutable from "dot-prop-immutable";
import {FetchJournal, LOADING_END, LOADING_START, ToggleMasterForm} from "../actions/uiActions";
import {Beat, FetchBeat} from "../actions/beatActions";
import {Group} from "../types/group";
import {AxiosResponse} from "axios";
import {fetchPosting, fetchPostingWithDate} from "../actions/postingActions";
import QuickCreate from "./QuickCreate";
import {GeneralResponse} from "../types/response";
import {Account} from "../types/ledger";
import useSWR from "swr";
import {GetAccountsForMaster, PostUpdateAccountName} from "../api/masters";


interface fetchResult {
  beats: Beat[]
  groups: Group[]
}

const mapState = (state: AppState) => {
  return {
    companyID: state.sys.SelectedCompany
  };
};
interface XProps {
  master?: Master;
}
const connector = connect(mapState, { FetchMasters });

type Props = ConnectedProps<typeof connector> & XProps;

export interface FormValues {
  name: string;
  beat_id: string;
  group_id: string;
  i_code: string;
}

const MasterContent = styled.div`
  width: 500px;
  float: clear;
  margin: 0px auto;
  position: relative;
`;

const BeautifyName = (txt: string): string=>{
    const splitStr = txt.split(' ');
    for (let i = 0; i < splitStr.length; i++) {
    // You do not need to check if i is larger than splitStr length, as your for does that for you
    // Assign it back to the array
        console.log(splitStr[i], splitStr[i].substr(1));
    splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substr(1);
    console.log(splitStr[i]);
  }
  // Directly return the joined string
  return splitStr.join(' '); 
}

interface AccountProps {
    account: Account;
    update(id: number, name: string):void;
}
const AccountRow: FC<AccountProps> = ({ account, update }) =>{
    const [ heldName, setHeldName ] = useState();
    useEffect(()=>{
        setHeldName(account.name);
    }, [account])
    return(
        <div style={{ display:"flex", flexDirection: "row"}} key={account.id.toString()}>
            <Input value={heldName} style={{ flex: 7}} onChange={(e)=>{setHeldName(e.target.value)}} />
            {
                heldName!==account.name? <Button style={{ flex: 2 }} onClick={()=>{update(account.id, heldName)}}> Update</Button> : null
            }
        </div>
    )
}

const MasterForm = (props: Props) => {
    type M = GeneralResponse<Array<Account>>
  const [ fetched, setData ] = useState<fetchResult>();
  const [ drCr, setDrCr ] = useState(-1);
  const [ loading, setLoading ] = useState(false);
  const [ accounts, setAccounts ] = useState<Array<Account>>([]);
  const [ selectedGroup, setSelectedGroup ] = useState<Group>();

  const inputR = useRef<Input>(null);

  useEffect(() => {
    // console.log(`Got company id : ${props.companyID}`);
    if (props.companyID) {
      GetGroupsAndBeats(props.companyID).then((res:AxiosResponse<fetchResult>)=>{
        setData(res.data);
        if(!master && fetched){
            const n = dotPropImmutable.set(formValues, "beat_id", fetched.beats[0]?.id);
            setValues(n);
        }
      })
    }
  }, [props.companyID]);




  useEffect(()=>{
    if(inputR.current)inputR.current.focus();
  },[props.master])

  // if (loading) return <div>Loading.......</div>
  // if (error) return <div>{error.message}</div>
  // console.log(data);

  // get type from state

  const master = stateSelector(state => state.ui.master);
  const ledgerID = stateSelector( state => state.posts.postId);
  const companyID = stateSelector(state => state.sys.SelectedCompany);
  const dispatch = useDispatch();
  let initialValues: Master;
    initialValues = {
      name: "",
      beat_id:1,
      group_id: 1,
      i_code: "MARG",
      cust_id: {Int64: 0, Valid: false},
      company_id: props.companyID,
      id: 0,
      opening_balance: 0
    }

  const [formValues, setValues] = useState(master || initialValues);
    useEffect(()=>{
      if(fetched && !master) {
        const n = dotPropImmutable.set(formValues, "beat_id", fetched.beats[0]?.id)
        const g = dotPropImmutable.set(n,"group_id", fetched.groups[0]?.id)
        setValues(g);
      }
    },[fetched])

    useEffect(()=>{
        if(master){
            const n = dotPropImmutable.set(formValues, "opening_balance", Math.abs(master.opening_balance));
            setValues(n);
            if(master.opening_balance <=0){
                setDrCr(-1);
            }else{
                setDrCr(1);
            }
        }
    }, [master])

    useEffect(()=>{
        if(master){
            GetAccountsForMaster(master.cust_id.Int64).then((res)=>{
                if(res.data.data) {
                    console.log({ nae:  [res.data.data]});
                    setAccounts(res?.data?.data)

                }
            })
        }
    }, [master])

    useEffect(()=>{
        console.log("We are here")
        if(formValues && formValues.group_id && fetched?.groups){
            for( let i=0; i<fetched.groups.length;i++){
                console.log("This Works?")
                if(fetched.groups[i].id == formValues?.group_id){
                    setSelectedGroup(fetched.groups[i])
                }
            }
        }
    }, [formValues.group_id])

   const createrBeat = async ( name: string )=>{
        PostCreateBeats(name).then((res: AxiosResponse<fetchResult>)=>{
            setData(res.data);
            dispatch(FetchBeat(companyID));
        })

   }

   const UpdateAccountName = async ( id: number, name: string)=>{
       try{
           dispatch({ type: LOADING_START});
           PostUpdateAccountName(id, name).then(()=>{
               if(master){
                   GetAccountsForMaster(master.cust_id.Int64).then((res)=>{
                       if(res.data.data){
                           setAccounts(res.data.data)
                       }
                   })
               }
           })
       }catch (e) {
           message.error("Failed to update account name");
       }finally {
           dispatch({ type: LOADING_END });
       }
   }

  return (
    <form style={{ minWidth: "0.5em", maxWidth:"400px", margin:"0px auto"}}>
      <Select value={formValues.group_id} style={{ width: 200, marginBottom: 10}} onChange={(e)=>{
        const n = dotPropImmutable.set(formValues,'group_id', e);
        setValues(n);
      }} >
        {fetched &&
        fetched.groups.map(b => (
            <Select.Option key={b.id} value={b.id}>
              {b.name}
            </Select.Option>
        ))}
      </Select>
      <Input
        value={formValues.name}
        onChange={e => {
          let str = e.target.value;
          const n = dotPropImmutable.set(formValues, "name", BeautifyName(str));
          setValues(n);
        }}
        placeholder={"Name"}
        ref={inputR}
      />
      <div style={{ display: "flex", alignItems: "center" }}>
      <Select value={formValues.beat_id}
              style={{ width: 200, marginTop: 10 }} onChange={(e)=>{
        const n = dotPropImmutable.set(formValues,'beat_id', e);
        setValues(n);
      }} >
        {fetched &&
          fetched.beats.map(b => (
            <Select.Option key={b.id} value={b.id}>
              {b.name}
            </Select.Option>
          ))}
      </Select>
          <QuickCreate onCreate={createrBeat} placeholder={"Enter beat name"} />
      </div>
      <div style={{ display: "flex", marginTop: 10}}>
      <Select value={drCr} onChange={(e)=>{setDrCr(e)}} >
        <Select.Option value={-1}>Dr.</Select.Option>
        <Select.Option value={1}>Cr.</Select.Option>
      </Select>
      <Input value={formValues.opening_balance} onChange={(e)=>{
        const n = dotPropImmutable.set(formValues, 'opening_balance', parseFloat(e.target.value))
        setValues(n)
      }} placeholder={"Opening Balance"} type={"number"} />
      </div>
        <div style={{ padding: 15, backgroundColor:"rgb(244, 245, 247)", marginTop:5, borderRadius: 10, maxHeight:" 300px", overflowY:"scroll"}} >
            <p>Accounts Mapped</p>
            { accounts.map((account)=> <AccountRow account={account} update={UpdateAccountName} /> )}
        </div>
        <div>
            {
                selectedGroup && selectedGroup.has_addn && "Has Additional details"
            }
        </div>
      <Button value={"Save"} disabled={loading} style={{ display: "block", marginTop: 10}} type={"primary"}  onClick={async (e)=>{
        setLoading(true);
          try {
          // console.log("Outputting form values",formValues)
          const n = dotPropImmutable.set(formValues, 'opening_balance', drCr * formValues.opening_balance)
          const resp = await putUpdateMaster(n, props.companyID);
          if(resp.status===200){
            message.success("Saved Successfully");
            await dispatch(FetchMasters());
            await dispatch(fetchPostingWithDate(ledgerID,"",""));
            if(formValues.cust_id.Int64!=0){
              await dispatch(ToggleMasterForm(false, undefined));
              return;
            }
            const n = dotPropImmutable.set(formValues, "name", "");
            const c = dotPropImmutable.set(n, "opening_balance", 0);
            setValues(c);
            if(inputR.current) inputR.current.focus();
          }else{
            message.error("Saving failed. Please try again.")
          }
        }catch (e) {
          message.error("Failed to save")
        }finally {
              setLoading(false);
          }
      }}>Save</Button>
    </form>
  );
};

export default connector(MasterForm);
