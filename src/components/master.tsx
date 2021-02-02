import React, { useEffect, useRef, useState } from "react";
import { AppState, stateSelector } from "../reducers";
import {ConnectedProps, connect, useDispatch} from "react-redux";

import styled from "styled-components";
import { FetchMasters } from "../actions/masterActions";
import {Button, Input, message, Select} from "antd";
import {GetGroupsAndBeats, PostCreateBeats, postCreateMaster, putUpdateMaster} from "../api";
import { Master } from "../types/master";
import dotPropImmutable from "dot-prop-immutable";
import {FetchJournal, ToggleMasterForm} from "../actions/uiActions";
import {Beat} from "../actions/beatActions";
import {Group} from "../types/group";
import {AxiosResponse} from "axios";
import {fetchPosting} from "../actions/postingActions";
import QuickCreate from "./QuickCreate";


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

const MasterForm = (props: Props) => {

  const [ data, setData ] = useState<fetchResult>();
  const [ drCr, setDrCr ] = useState(-1);

  const inputR = useRef<Input>(null);

  useEffect(() => {
    console.log(`Got company id : ${props.companyID}`);
    if (props.companyID) {
      GetGroupsAndBeats(props.companyID).then((res:AxiosResponse<fetchResult>)=>{
        setData(res.data);
        if(!master && data){
            const n = dotPropImmutable.set(formValues, "beat_id", data.beats[0]?.id);
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
  console.log(data);

  // get type from state

  const master = stateSelector(state => state.ui.master);
  const ledgerID = stateSelector( state => state.posts.postId);
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
      if(data && !master) {
        const n = dotPropImmutable.set(formValues, "beat_id", data.beats[0]?.id)
        const g = dotPropImmutable.set(n,"group_id", data.groups[0]?.id)
        setValues(g);
      }
    },[data])

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

   const createrBeat = ( name: string )=>{
        PostCreateBeats(name).then((res: AxiosResponse<fetchResult>)=>{
            setData(res.data);
        })
   }

  return (
    <form>
      <Select value={formValues.group_id} style={{ width: 200, marginBottom: 10}} onChange={(e)=>{
        const n = dotPropImmutable.set(formValues,'group_id', e);
        setValues(n);
      }} >
        {data &&
        data.groups.map(b => (
            <Select.Option key={b.id} value={b.id}>
              {b.name}
            </Select.Option>
        ))}
      </Select>
      <Input
        value={formValues.name}
        onChange={e => {
          const n = dotPropImmutable.set(formValues, "name", e.target.value);
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
        {data &&
          data.beats.map(b => (
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
      <Button value={"Save"} style={{ display: "block", marginTop: 10}} type={"primary"}  onClick={async (e)=>{
        try {
          console.log("Outputting form values",formValues)
          const n = dotPropImmutable.set(formValues, 'opening_balance', drCr * formValues.opening_balance)
          const resp = await putUpdateMaster(n, props.companyID);
          if(resp.status===200){
            message.success("Saved Successfully");
            await dispatch(FetchMasters());
            await dispatch(fetchPosting(ledgerID));
            if(formValues.cust_id.Int64!=0){
              await dispatch(ToggleMasterForm(false, undefined));
              return;
            }
            setValues(initialValues);
            if(inputR.current) inputR.current.focus();
          }else{
            message.error("Saving failed. Please try again.")
          }
        }catch (e) {
          message.error("Failed to save")
        }
      }}>Save</Button>
    </form>
  );
};

export default connector(MasterForm);
