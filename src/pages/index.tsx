import React, { FC, useEffect, useState } from "react";
import {connect, ConnectedProps, useDispatch} from "react-redux";
import { GetCompanies, SelectCompany } from "../actions/systemActions";
import { FetchMasters } from "../actions/masterActions";
import { FetchBeat } from '../actions/beatActions';
import { AppState } from "../reducers";
import { RouteComponentProps } from "react-router";
import KeyList from "../components/keylist";
import {RenderItemProps, DeNormalize, normalize_id, normalize} from "../types/generic";
import { Company } from "../types/company";
import styled from "styled-components";
import { PageDiv } from "../components/styledComp";
import {FetchYears} from "../actions/yearsActions";
import PoppableCreateCompany from "../components/PoppableButton";
import {Button} from "antd";
import {  useHistory } from 'react-router-dom';
import {LogOut} from "../actions/userActions";
import {useCompanies} from "../Hooks/Companies";

const mapState = (state: AppState) => ({
  companies: state.sys.Companies,
  selected: state.sys.SelectedCompany,
  masters: state.master.masters
});

const mapDispatch = {
  GetCompanies,
  SelectCompany,
  FetchMasters,
  FetchBeat,
  FetchYears
};

export interface SELTRPROPS {
  selected: boolean;
}

export const SELTR = styled.tr`
  height: inherit;
  td {
    padding: 5px;
    height: inherit;
    background-color: inherit; 
  }
`;

const connector = connect(mapState, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & RouteComponentProps;

const Index = (props: Props) => {

  const dispatch = useDispatch();
  const history = useHistory();
  const [cursor, setCursor] = useState(0);
  if (!props.companies) console.log("No companies now");
  if (props.companies)
    console.log("companies are here:", props.companies.all.length);
  useEffect(() => {
    props.GetCompanies();
  }, []);
  if (props.masters) {
    console.log(props.masters);
  }

  const normalizedCompanies = props.companies
  const selectCompany = async (cursor: number) => {
    if (normalizedCompanies) {
      // const denorm = DeNormalize<Company>(props.companies);
      // const companyID = denorm[cursor].id;
      await props.SelectCompany(cursor);
      //await props.FetchMasters(cursor);
      await props.FetchBeat(cursor);
      await props.FetchYears();
      props.history.push("/years");
    }
  };

  const LogoutClick = ()=>{
    dispatch(LogOut())
    history.push("/login")
  }

  const renderItems = (arg: RenderItemProps<Company>) => {
    return (
      <SELTR key={arg.item.id.toString()}>
        <td>{arg.item.id}</td>
        <td>{arg.item.name}</td>
      </SELTR>
    );
  };



  return (
    <PageDiv>
      <div style={{ width: "700px", marginLeft: 10 }} >
        <div style={{ display: "flex", flexDirection: "row", alignItems:"center" }}>
          <h1>Select a company</h1>
          <Button onClick={LogoutClick} style={{ marginLeft: 10 }} type={"danger"} >Logout</Button>
        </div>
        <PoppableCreateCompany callback={props.GetCompanies} />
        {normalizedCompanies && (
          <KeyList
            columns={["ID", "Company"]}
            cursor={cursor}
            data={normalizedCompanies}
            maxHeight={500}
            numberOfRows={10}
            rowHeight={20}
            width={"400px"}
            renderItem={renderItems}
            handleEnter={selectCompany}
          />
        )}
      </div>
    </PageDiv>
  );
};

export default connector(Index);
