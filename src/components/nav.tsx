import React from "react";
import styled from "styled-components";
import { AppState } from "../reducers";
import { connect, ConnectedProps } from "react-redux";

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

const connector = connect(mapState,{});
type PropsFromRedux = ConnectedProps<typeof connector>;

const Nav = (props: PropsFromRedux) => {

  const selectedCompany = props.companies?.normalized[props.selected];


  return <div style={{ display: 'flex', flexDirection: 'row',padding:'10px 5px', position:'relative', top:0, left:0, width:"100%", borderBottom:'1px solid black'}}><h4>
    {selectedCompany?.name}
    </h4></div>;
};

export default connector(Nav);
