import React from "react";
import { gql } from "apollo-boost";
import { useQuery } from "@apollo/react-hooks";
import { TypedUseSelectorHook, useSelector } from "react-redux";
import { AppState } from "../reducers";
import Nav from "../components/nav";
import { PageDiv } from "../components/styledComp";

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

  const { data, loading, error } = useQuery<Query>(FETCH_ERRORS, {
    variables: { input: companyID }
  });

  if (error) return <div>Error</div>;
  if (loading) return <div>Loading....</div>;

  const renderError = (err: ErrorInterface) => {
    return (
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">{err.master_name}</h5>
          <h6 className="card-subtitle">
            {err.interfacecode} - {err.to_customer}
          </h6>
          <div>
            <select>
              {masters?.all.map(id => (
                <option value={masters.normalized[id].cust_id.Int64}>
                  {masters.normalized[id].name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    );
  };

  return (
    <PageDiv>
      <Nav />
      <div className="container-fluid">
        <h1>Errors</h1>
        {data?.getErrors.map(err => renderError(err))}
      </div>
    </PageDiv>
  );
};

export default Errors;
