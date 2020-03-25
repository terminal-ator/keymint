import React, { useState } from "react";
import styled from "styled-components";
import { AppState } from "../reducers";
import { connect, ConnectedProps, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { Modal, Button } from "antd";
import Master from "../components/master";
import { ToggleMaster, ToggleJournal } from "../actions/uiActions";

const NavItem = styled.div`
  margin-left: 10px;
  display: flex;
  justify-content: center;
  flex-direction: column;
  width: 100px;
`

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
      <div style={{ width: "100%"}}>
        <Link
          style={{ fontWeight: "bold", }}
          to="/menu"
        >
          <h4 style={{ fontWeight: "bolder" }}>{selectedCompany?.name}</h4>
        </Link>
      </div>
      <NavItem>
        <a
          onClick={() => {
            dispatch(ToggleMaster(true));
          }}
        >
          Master
        </a>
      </NavItem>
      <NavItem>
        <a
          onClick={() => {
            dispatch(ToggleJournal(true, false, 0));
          }}
        >
          Journal
        </a>
      </NavItem>
      <NavItem >
        <Link to="/">
          logout
        </Link>
      </NavItem>
    </div>
  );
};

export default connector(Nav);
