import React from 'react';
import { stateSelector } from './reducers';
import { Modal } from 'antd';
import Master from './components/master';
import { useDispatch } from 'react-redux';
import { ToggleMaster } from './actions/uiActions';


const Glob = () => {
    const masterToggle = stateSelector(state => state.ui.masterToggle);
    const cust_id = stateSelector(state => state.ui.masterCustID);
    const to_update = stateSelector(state => state.ui.masterToUpdate);
    const masters = stateSelector(state => state.master.masters)
    const dispatch = useDispatch();

    return (
        <Modal visible={masterToggle}
            title={'Create User'}
            footer={null}
            onCancel={() => { dispatch(ToggleMaster(false)) }}
        >
            <Master />
        </Modal>
    )
}

export default Glob;