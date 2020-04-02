import React, { useState } from "react";
import styled from "styled-components";
import { AppState } from "../reducers";
import { connect, ConnectedProps, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { Modal, Button } from "antd";
import {
  ToggleMaster,
  ToggleJournal,
  ToggleMasterForm
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
  return (
    <div
      style={{
        backgroundColor: "white",
        display: "flex",
        flexDirection: "row",
        alignContent: "center",
        borderBottom: "1px solid #d9d9d9",
        paddingTop: 5,
        paddingLeft: 10,
        marginBottom: 5
      }}
    >
      <div style={{ width: "100%" }}>
        <Link style={{ fontWeight: "bold" }} to="/menu">
          <h4 style={{ fontWeight: "bolder" }}>{selectedCompany?.name}</h4>
        </Link>
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
          Master
        </a>
      </NavItem>
      <NavItem>
        <a onClick={() => {dispatch(ToggleJournal(true,false,0))}}>Journal</a>
      </NavItem>
      <NavItem>
        <Link to="/">logout</Link>
      </NavItem>
    </div>
  );
};

export default connector(Nav);
