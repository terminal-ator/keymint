import React, { useState } from 'react';
import { AppState } from '../reducers';
import { connect, ConnectedProps } from 'react-redux';
import { PageDiv } from '../components/styledComp';
import Nav from '../components/nav';
import MasterList from '../components/mstrlist';
import LedgerDetail from '../components/ledgerDetail';
import { Master } from '../types/master';
import withPop from '../components/popup';
import { DialogWrapper } from './stmt';
import styled from 'styled-components';
import { BrowserRouterProps, Route, RouteComponentProps } from 'react-router-dom';
import renderDetail from '../components/renderDetails';

const mapState = (state: AppState) => {
  return {
    masters: state.master.masters,
    companyID: state.sys.SelectedCompany
  };
};

const connector = connect(mapState, {});

type PropType = ConnectedProps<typeof connector> & RouteComponentProps;


const LedgerPage = (props:PropType)=>{

  const [ cust ,setCust ] = useState<Master>();
  const [ show, setShow ] = useState(false);

  const selectMaster = (masterID: number)=>{
    if(props.masters)
    {
      props.history.push(`/ledgers/${masterID}`)
      setCust(props.masters.normalized[masterID]);
      setShow(true);
    }
  }



  return(
    <PageDiv>
      <Nav />
      {/* { cust && withPop(
        <DialogWrapper>
        <DialogContent>
        <LedgerDetail handleEsc={()=>{setShow(false)}} cust={cust} company_id={props.companyID} />
        </DialogContent> 
        </DialogWrapper>, show)} */}
      <Route exact path={'/ledgers/:id'} component={renderDetail} />
      <div style={{ display: 'flex', marginTop: 5}}>
      <div style={{ flex: 1}}>
      <div style={{border:'1px solid black', padding:'5px'}}>
      { props.masters && <MasterList masters={props.masters} handleEnter={selectMaster} /> }
      </div>
      </div>
      </div>
    </PageDiv>
  )
}

export default connector(LedgerPage);