import React, { useState } from "react";
import { AppState } from "../reducers";
import { connect, ConnectedProps, useDispatch } from "react-redux";
import { PageDiv } from "../components/styledComp";
import Nav from "../components/nav";
import MasterList from "../components/mstrlist";
import LedgerDetail from "../components/ledgerDetail";
import { Master } from "../types/master";
import withPop from "../components/popup";
import { DialogWrapper } from "./stmt";
import styled from "styled-components";
import {
  BrowserRouterProps,
  Route,
  RouteComponentProps
} from "react-router-dom";
import renderDetail from "../components/renderDetails";
import {fetchCheques, fetchPosting} from "../actions/postingActions";

const mapState = (state: AppState) => {
  return {
    masters: state.master.masters,
    companyID: state.sys.SelectedCompany
  };
};

const connector = connect(mapState, {});

type PropType = ConnectedProps<typeof connector> & RouteComponentProps;

const LedgerPage = (props: PropType) => {
  const [cust, setCust] = useState<Master>();
  const [show, setShow] = useState(false);
  const dispatch = useDispatch();

  const selectMaster = async (masterID: number) => {
    if (props.masters) {

      setCust(props.masters.normalized[masterID]);
      await dispatch(
        fetchPosting(props.masters.normalized[masterID].cust_id.Int64)
      );
      await dispatch(fetchCheques())
      setShow(true);
      props.history.push(`/ledgers/${masterID}`);
    }
  };

  return (
    <PageDiv>
      <Nav />
      <Route exact path={"/ledgers/:id"} component={renderDetail} />
      <div style={{ display: "flex", marginTop: 5 }}>
        <div style={{ flex: 1 }}>
          <div
            style={{padding: "5px", maxWidth: "700px", minWidth:"50%" }}
          >
            {props.masters && (
              <MasterList masters={props.masters} handleEnter={selectMaster} />
            )}
          </div>
        </div>
      </div>
    </PageDiv>
  );
};

export default connector(LedgerPage);
