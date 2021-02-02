import React, { useState } from "react";
import styled from "styled-components";
import {AppState, stateSelector} from "../reducers";
import { connect, ConnectedProps, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { Modal, Button } from "antd";
import {
  ToggleMaster,
  ToggleJournal,
  ToggleMasterForm, ToggleProduct
} from "../actions/uiActions";
import { Master } from "../types/master";

const NavItem = styled.div`
  margin-left: 10px;
  display: flex;
  justify-content: center;
  flex-direction: column;
  width: 100px;
`;

const mapState = (state: AppState) => {
  return {
    companies: state.sys.Companies,
    selected: state.sys.SelectedCompany
  };
};

const connector = connect(mapState, {});
type PropsFromRedux = ConnectedProps<typeof connector>;

const Nav = (props: PropsFromRedux) => {

  const selectedCompany = props.companies?.normalized[props.selected];
  const [mstr, setmst] = useState(false);
  const dispatch = useDispatch();
  const year = stateSelector( stt => stt.years.year );
  const years = stateSelector( stt => stt.years.years);

  return (
    <div
      style={{
        backgroundColor: "rgba(244,245,247)",
        display: "flex",
        flexDirection: "row",
        alignContent: "center",
        paddingTop: 5,
        paddingLeft: 10,
        marginBottom: 5,
        borderRadius: 2,
          width: "100%",
          justifyContent: "space-between"
      }}
    >
      <div style={{ display:"flex", alignItems:"center" }}>
        <Link style={{ fontWeight: "bold" }} to="/menu">
          <h4 style={{ fontWeight: "bolder", color:"#0074D9" }}>{selectedCompany?.name}</h4>
        </Link>
          <span>{year && years.normalized[year]?.year_string}</span>
      </div>
        <div style={{ display:"flex"}}>
      <NavItem>
        <a
          onClick={() => {
            dispatch(ToggleMasterForm(true, undefined));
          }}
        >
          +Master
        </a>
      </NavItem>
      <NavItem>
        <a onClick={() => {dispatch(ToggleJournal(true, false, 0, ()=>{}))}}>+Journal</a>
      </NavItem>
      <NavItem>
        <a onClick={()=>{dispatch(ToggleProduct(true, null))}}>+Product</a>
      </NavItem>
      <NavItem>
        <Link to="/">Quit</Link>
      </NavItem>
        </div>
    </div>
  );
};

export default connector(Nav);
