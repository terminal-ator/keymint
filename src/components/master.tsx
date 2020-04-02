import React, { useEffect, useRef, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { AppState, stateSelector } from "../reducers";
import {ConnectedProps, connect, useDispatch} from "react-redux";
import { useQuery, useLazyQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import styled from "styled-components";
import { FetchMasters } from "../actions/masterActions";
import {Button, Input, message, Select} from "antd";
import { postCreateMaster, putUpdateMaster } from "../api";
import { Master } from "../types/master";
import dotPropImmutable from "dot-prop-immutable";
import {ToggleMasterForm} from "../actions/uiActions";

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

const FETCH_FIELDS = gql`
  query fetchCompany($id: Int) {
    getCompany(id: $id) {
      id
      beats {
        id
        name
        addn1
      }
      groups {
        id
        name
      }
    }
  }
`;

interface FetchCompany {
  getCompany: {
    id: number;
    beats: {
      id: number;
      name: string;
      addn1: string;
    }[];
    groups: {
      id: number;
      name: string;
    }[];
  };
}

interface Errors {
  name?: string | undefined;
  [key: string]: string | undefined;
}

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
  const [fetchFields, { data, loading, error }] = useLazyQuery<FetchCompany>(
    FETCH_FIELDS
  );
  const inputR = useRef<Input>(null);

  useEffect(() => {
    console.log(`Got company id : ${props.companyID}`);
    if (props.companyID) {
      fetchFields({ variables: { id: props.companyID } });
    }
  }, [props.companyID]);

  useEffect(()=>{
    if(inputR.current)inputR.current.focus();
  },[props.master])

  // if (loading) return <div>Loading.......</div>
  // if (error) return <div>{error.message}</div>
  console.log(data);

  // get type from state
  const updateMaster = stateSelector(state => state.ui.masterToUpdate);
  const masters = stateSelector(state => state.master.masters);
  const masterID = stateSelector(state => state.ui.masterCustID);
  const master = stateSelector(state => state.ui.master);
  const dispatch = useDispatch();
  let initialValues: Master = {
    name: "",
    beat_id: 1,
    group_id: 1,
    i_code: "GENERIC",
    cust_id: { Int64: 0, Valid: false },
    company_id: props.companyID,
    id: 0
  };

  const [formValues, setValues] = useState(master || initialValues);

  return (
    <form>
      <Input
        value={formValues.name}
        onChange={e => {
          const n = dotPropImmutable.set(formValues, "name", e.target.value);
          setValues(n);
        }}
        placeholder={"Name"}
        ref={inputR}
      />
      <Input
        style={{ marginTop: 10 }}
        value={formValues.i_code}
        onChange={e => {
          const n = dotPropImmutable.set(formValues, "i_code", e.target.value);
          setValues(n);
        }}
        placeholder={"Interface"}
      />
      <Select value={formValues.beat_id} style={{ width: 200, marginTop: 10 }} onChange={(e)=>{
        const n = dotPropImmutable.set(formValues,'beat_id', e);
        setValues(n);
      }} >
        {data &&
          data.getCompany.beats.map(b => (
            <Select.Option key={b.id} value={b.id}>
              {b.name}
            </Select.Option>
          ))}
      </Select>
      <Select value={formValues.group_id} style={{ width: 200, marginTop: 10, marginLeft:5 }} onChange={(e)=>{
        const n = dotPropImmutable.set(formValues,'group_id', e);
        setValues(n);
      }} >
        {data &&
        data.getCompany.groups.map(b => (
          <Select.Option key={b.id} value={b.id}>
            {b.name}
          </Select.Option>
        ))}
      </Select>
      <Button value={"Save"} style={{ display: "block", marginTop: 10}} type={"primary"}  onClick={async (e)=>{
        try {
          console.log("Outputting form values",formValues)
          const resp = await putUpdateMaster(formValues, props.companyID);
          if(resp.status===200){
            message.success("Saved Successfully");
            dispatch(FetchMasters())
            if(formValues.cust_id.Int64!=0){
              dispatch(ToggleMasterForm(false, undefined));
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
