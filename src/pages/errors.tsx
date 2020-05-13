import React, { useState } from "react";
import { gql } from "apollo-boost";
import { useQuery } from "@apollo/react-hooks";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { AppState } from "../reducers";
import Nav from "../components/nav";
import { PageDiv } from "../components/styledComp";
import { postErrors } from "../api";
import { Button, message } from "antd";
import { ToggleMasterForm } from "../actions/uiActions";
import { Master } from "../types/master";
import Loading from "../components/loading";

interface ErrorInterface {
  id: number;
  master_name: string;
  ledger_type: string;
  associated_id: number;
  to_customer: number;
  legder_no: string;
  interfacecode: string;
}

interface Query {
  getErrors: ErrorInterface[];
}

const FETCH_ERRORS = gql`
  query fetch($input: Int) {
    getErrors(companyID: $input) {
      id
      master_name
      to_customer
      interfacecode
    }
  }
`;

const Errors = () => {
  // fetch companyID
  const companySelector: TypedUseSelectorHook<AppState> = useSelector;
  const companyID = companySelector(state => state.sys.SelectedCompany);
  const masters = companySelector(state => state.master.masters);
  // fetch data

  const { data, loading, error, refetch } = useQuery<Query>(FETCH_ERRORS, {
    variables: { input: companyID }
  });


  // handle the error merging with current existing user
  const handleMerge = async (cust_id: number, error_id: number) => {
    const resp = await postErrors(cust_id, error_id);
    if (resp.status == 200) {
      message.success("Successfully merged the masters");
      await refetch({ input: companyID });
    } else {
      message.error("Unable to reach the server, please try again");
    }
  };

  interface ErrorProps {
    err: ErrorInterface;
  }

  const RenderError = (props: ErrorProps) => {
    const dispatch = useDispatch();
    const { err } = props;
    let sel = 0;

    const setSel = (val: number) => {
      sel = val;
    };

    const handleSave = () => {
      handleMerge(sel, err.id);
    };
    return (
      <div className="card bg-dark text-light">
        <div className="card-body">
          <h5 className="card-title text-light">{err.master_name}</h5>
          <h6 className="card-subtitle text-light">
            {err.interfacecode} - {err.to_customer}
          </h6>
          <div>
            <select
              onChange={e => {
                setSel(parseInt(e.target.value));
              }}
              style={{
                backgroundColor: "black",
                color: "white"
              }}
            >
              {masters?.all.map(id => (
                <option key={id} value={masters.normalized[id].cust_id.Int64}>
                  {masters.normalized[id].name}
                </option>
              ))}
            </select>
          </div>
          <div style={{ display: "flex" }}>
            <Button
              type={"dashed"}
              onClick={() => {
                handleSave();
              }}
              style={{ marginTop: 10 }}
              className="btn"
            >
              Save
            </Button>
            <Button
              type={"primary"}
              onClick={() => {
                const master: Master = {
                  id:0,
                  cust_id: { Int64: 0, Valid: false },
                  i_code: err.interfacecode,
                  beat_id: 1,
                  group_id: 1,
                  name: err.master_name,
                  company_id: companyID
                };
                dispatch(ToggleMasterForm(true, master));
              }}
              style={{ marginTop: 10, marginLeft: 5 }}
            >
              Create New
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <PageDiv>
      <Nav />
      <div className="container-fluid" style={{ overflowY: "scroll", maxHeight: "100%"}}>
        <h1 style={{ color: "white"}}>Errors</h1>
        { !loading? data?.getErrors.map(err => (
          <RenderError err={err} />
        )):<Loading />}
      </div>
    </PageDiv>
  );
};

export default Errors;
