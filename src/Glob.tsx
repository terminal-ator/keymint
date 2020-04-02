import React from 'react';
import { stateSelector } from './reducers';
import { Modal } from 'antd';
import Master from './components/master';
import { useDispatch } from 'react-redux';
import {ToggleMaster, ToggleJournal, ToggleMasterForm} from './actions/uiActions';
import JournalForm from './components/journalForm';


const Glob = () => {
    const masterToggle = stateSelector(state => state.ui.masterFormToggle);
    const journalToggle = stateSelector(state => state.ui.journalToggle);
    const dispatch = useDispatch();

    return (
        <div>
            <Modal visible={masterToggle}
                title={'Create User'}
                footer={null}
                onCancel={() => { dispatch(ToggleMasterForm(false, undefined)) }}
                destroyOnClose={true}
            >
                <Master />
            </Modal>
            <Modal visible={journalToggle} destroyOnClose onCancel={() => { dispatch(ToggleJournal(false, false, 0)) }} footer={null} style={{ minWidth: 900, top: 10 }} bodyStyle={{ minHeight: "500px", minWidth: "700px" }}>
                <JournalForm />
            </Modal>
        </div>
    )
}

export default Glob;