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
        backgroundColor: "#262a2d",
        display: "flex",
        flexDirection: "row",
        alignContent: "center",
        paddingTop: 5,
        paddingLeft: 10,
        marginBottom: 5,
        borderRadius: 2
      }}
    >
      <div style={{ width: "100%", display:"flex", alignItems:"center" }}>
        <Link style={{ fontWeight: "bold" }} to="/menu">
          <h4 style={{ fontWeight: "bolder", color:"#FFCA28" }}>{selectedCompany?.name}</h4>
        </Link>
          <span>{year && years.normalized[year]?.year_string}</span>
      </div>
      <NavItem>
        <a
          onClick={() => {
            const master: Master = {
              cust_id: { Int64: 0, Valid: false },
              company_id: 2,
              i_code: "GENERIC",
              name: "",
              beat_id: 1,
              group_id: 1,
              id: 0
            };
            dispatch(ToggleMasterForm(true, master));
          }}
        >
          +Master
        </a>
      </NavItem>
      <NavItem>
        <a onClick={() => {dispatch(ToggleJournal(true,false,0))}}>+Journal</a>
      </NavItem>
      <NavItem>
        <a onClick={()=>{dispatch(ToggleProduct(true, null))}}>+Product</a>
      </NavItem>
      <NavItem>
        <Link to="/">logout</Link>
      </NavItem>
    </div>
  );
};

export default connector(Nav);
