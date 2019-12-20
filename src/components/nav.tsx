import React from "react";
import styled from "styled-components";
import { AppState } from "../reducers";

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

const Nav = () => {
  return <div>Nav Bar</div>;
};

export default Nav;
