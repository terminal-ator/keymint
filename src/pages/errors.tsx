import React, { useState } from "react";
import { gql } from "apollo-boost";
import { useQuery } from "@apollo/react-hooks";
import { TypedUseSelectorHook, useSelector } from "react-redux";
import { AppState } from "../reducers";
import Nav from "../components/nav";
import { PageDiv } from "../components/styledComp";
import { postErrors } from "../api";
import { message } from 'antd';

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

  if (error) return <div>Error</div>;
  if (loading) return <div>Loading....</div>;


  // handle the error merging with current existing user
  const handleMerge = async (cust_id: number, error_id: number) => {
    const resp = await postErrors(cust_id, error_id);
    if (resp.status == 200) {
      message.success("Successfully merged the masters")
      await refetch({ input: companyID })
    } else {
      message.error("Unable to reach the server, please try again")
    }
  }


  const RenderError = (err: ErrorInterface) => {

    let sel = 0

    const setSel = (val: number) => {
      sel = val;
    }

    const handleSave = () => {
      handleMerge(sel, err.id);
    }
    return (
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">{err.master_name}</h5>
          <h6 className="card-subtitle">
            {err.interfacecode} - {err.to_customer}
          </h6>
          <div>
            <select onChange={(e) => { setSel(parseInt(e.target.value)) }}>
              {masters?.all.map(id => (
                <option value={masters.normalized[id].cust_id.Int64}>
                  {masters.normalized[id].name}
                </option>
              ))}
            </select>
          </div>
          <button onClick={() => { handleSave() }} style={{ marginTop: 10 }} className="btn">Save</button>
        </div>
      </div>
    );
  };

  return (
    <PageDiv>
      <Nav />
      <div className="container-fluid">
        <h1>Errors</h1>
        {data?.getErrors.map(err => RenderError(err))}
      </div>
    </PageDiv>
  );
};

export default Errors;
