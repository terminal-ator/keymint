import React, { FC, useEffect, useState } from "react";
import { connect, ConnectedProps } from "react-redux";
import { GetCompanies, SelectCompany } from "../actions/systemActions";
import { FetchMasters } from "../actions/masterActions";
import { FetchStats } from "../actions/stmtActions";
import { AppState } from "../reducers";
import { RouteComponentProps } from "react-router";
import KeyList from "../components/keylist";
import { RenderItemProps, DeNormalize } from "../types/generic";
import { Company } from "../types/company";
import styled from "styled-components";
import { PageDiv } from "../components/styledComp";

const mapState = (state: AppState) => ({
  companies: state.sys.Companies,
  selected: state.sys.SelectedCompany,
  masters: state.master.masters
});

const mapDispatch = {
  GetCompanies,
  SelectCompany,
  FetchMasters,
  FetchStats
};

export interface SELTRPROPS {
  selected: boolean;
}

export const SELTR = styled.tr`
  height: inherit;
  td {
    padding: 10px;
    height: inherit;
    
  }
`;

const connector = connect(mapState, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & RouteComponentProps;

const Index = (props: Props) => {
  if (!props.companies) console.log("No companies now");
  if (props.companies)
    console.log("companies are here:", props.companies.all.length);
  useEffect(() => {
    props.GetCompanies();
  }, []);
  if (props.masters) {
    console.log(props.masters);
  }

  const selectCompany = (cursor: number) => {
    if (props.companies) {
      const denorm = DeNormalize<Company>(props.companies);
      const companyID = denorm[cursor].id;
      props.SelectCompany(companyID);
      props.FetchMasters(companyID);
      props.history.push("/menu");
    }
  };

  const renderItems = (arg: RenderItemProps<Company>) => {
    return (
      <SELTR key={arg.item.id.toString()}>
        <td>{arg.item.id}</td>
        <td>{arg.item.name}</td>
      </SELTR>
    );
  };

  const [cursor, setCursor] = useState(0);

  return (
    <PageDiv>
      {props.companies && (
        <KeyList
          columns={["ID", "Company"]}
          cursor={cursor}
          data={props.companies}
          maxHeight={500}
          numberOfRows={10}
          rowHeight={30}
          width={"400px"}
          renderItem={renderItems}
          handleEnter={selectCompany}
        />
      )}
    </PageDiv>
  );
};

export default connector(Index);
