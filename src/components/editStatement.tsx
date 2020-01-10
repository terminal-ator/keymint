import React from 'react';
import { AppState } from '../reducers';
import { Statement } from '../types/statements';
import { connect, ConnectedProps } from 'react-redux';
import { DeNormalize } from '../types/generic';

const mapState = (state:AppState)=>{
  return {
    masters: state.master.masters,
  }
}

interface EditProps{
  statement: number;
  cust_id: number;
}

const connector = connect(mapState,{});

type connectedProps = ConnectedProps<typeof connector>

type PropTypes = connectedProps & EditProps;

const EditStatement = (props:PropTypes)=>{
  let masters =[];
  if(props.masters){
   masters = DeNormalize(props.masters);
  return(<div style={{ height: 400, width: 400}}>
        <select defaultValue={props.cust_id}>
          {masters.map((master)=>{
          return <option value={master.cust_id.Int64}>{master.name}</option>
          })}
        </select>
  </div>)
  }
  return null;
}

export default connector(EditStatement);