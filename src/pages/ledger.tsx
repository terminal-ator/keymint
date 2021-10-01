import React, { useState } from "react";
import {AppState, stateSelector} from "../reducers";
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
import {fetchCheques, fetchPosting, fetchPostingWithDate} from "../actions/postingActions";
import {message} from "antd";

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
  const startDate = stateSelector( stt => stt.ui.start_date);
  const endDate = stateSelector( stt => stt.ui.end_date);
  const dispatch = useDispatch();

  const selectMaster = async (masterID: number) => {
    if (props.masters) {
      try {

        setCust(props.masters.normalized[masterID]);
        await dispatch(
            fetchPostingWithDate(props.masters.normalized[masterID].cust_id.Int64, startDate, endDate)
        );
        await dispatch(fetchCheques())
        setShow(true);
        props.history.push(`/ledgers/${masterID}`);
      }catch (e) {
        message.error("Failed to get cheques"+ e,)
      }
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
