import React, { useState } from "react";
import styled from "styled-components";
import { AppState } from "../reducers";
import { connect, ConnectedProps, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { Modal, Button } from "antd";
import Master from '../components/master';
import { ToggleMaster, ToggleJournal } from "../actions/uiActions";

const NavBar = styled.nav`
  width: 100%;
  height: 60px;
  ul {
    display: flex;
    justify-content: flex-start;
    padding: 4px 16px;
    li {
      display: flex;
      padding: 6px 8px;
    }
  }
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


  // return <div className='' style={{ display: 'flex', flexDirection: 'row',padding:'10px 5px', position:'relative', top:0, left:0, width:"100%", borderBottom:'1px solid black'}}><h4>
  //   {selectedCompany?.name}
  //   </h4></div>;
  return (
    <div className="nav navbar navbar-expand navbar-dark flex-column flex-md-row bd-navbar  " style={{ backgroundColor: '#00416a' }}>
      <li className="nav-item">
        <Link className="nav-link navbar-brand" to="/menu">
          {selectedCompany?.name}</Link></li>
      <li className="nav-item">
        <Button onClick={() => { dispatch(ToggleMaster(true)) }}>Add Master</Button>
      </li>
      <li className="nav-item">
        <Button onClick={() => { dispatch(ToggleJournal(true, false, 0)) }}>Add Journal</Button>
      </li>
      <li className="nav-item" style={{ float: 'right' }}>
        <Link to="/" className="nav-link">Change Company</Link>
      </li>

    </div>)


};

export default connector(Nav);
