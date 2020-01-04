import React, { useState } from 'react';
import { AppState } from '../reducers';
import { connect, ConnectedProps } from 'react-redux';
import { PageDiv } from '../components/styledComp';
import Nav from '../components/nav';
import MasterList from '../components/mstrlist';
import LedgerDetail from '../components/ledgerDetail';
import { Master } from '../types/master';

const mapState = (state: AppState) => {
  return {
    masters: state.master.masters,
    companyID: state.sys.SelectedCompany
  };
};

const connector = connect(mapState, {});

type PropType = ConnectedProps<typeof connector>;


const LedgerPage = (props:PropType)=>{

  const [ cust ,setCust ] = useState<Master>();

  const selectMaster = (masterID: number)=>{
    if(props.masters)
      setCust(props.masters.normalized[masterID]);
  }

  return(
    <PageDiv>
      <Nav />
      <div style={{ display: 'flex', marginTop: 5}}>
      <div style={{ flex: 1}}>
      <div style={{border:'1px solid black', padding:'5px'}}>
      { props.masters && <MasterList masters={props.masters} handleEnter={selectMaster} /> }
      </div>
      </div>
      { cust && <LedgerDetail cust={cust} company_id={props.companyID} /> }
      </div>
    </PageDiv>
  )
}

export default connector(LedgerPage);