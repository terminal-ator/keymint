import React from 'react';
import styled from 'styled-components';
import { RouteComponentProps } from 'react-router-dom';
import { DialogWrapper } from '../pages/stmt';
import LedgerDetail from './ledgerDetail';

interface RouteParams{
  id: string;
}

export const DialogContent = styled.div`
  background-color: #fff;
  height: 100%;
  overflow: hidden;
  opacity: 1;
  width: 69%;
  margin-left:20px;
  padding: 10px;
  background-color:white;
  postion:absolute;
  float:right;
  right:10px;
  top: 10px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23);
`;

  const renderDetail = (props:RouteComponentProps<RouteParams>)=>{
    
    const id = parseInt(props.match.params.id)
    if(id)
    return <DialogWrapper>
        <DialogContent>
        <LedgerDetail handleEsc={()=>{props.history.goBack()}} cust={id} />
        </DialogContent>
        </DialogWrapper>
    return <div>Error not found</div>
  }
  export default renderDetail;
