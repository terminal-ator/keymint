import React from 'react';
import { stateSelector } from './reducers';
import { Modal } from 'antd';
import Master from './components/master';
import { useDispatch } from 'react-redux';
import {ToggleMaster, ToggleJournal, ToggleMasterForm, ToggleProduct} from './actions/uiActions';
import JournalForm from './components/journalForm';
import ProductForm from "./components/ProductForm";


const Glob = () => {
    const masterToggle = stateSelector(state => state.ui.masterFormToggle);
    const journalToggle = stateSelector(state => state.ui.journalToggle);
    const productToggle = stateSelector(state => state.ui.productToggle);
    const dispatch = useDispatch();

    return (
        <div>
            <Modal
                visible={masterToggle}
                title={'Create User'}
                footer={null}
                onCancel={() => { dispatch(ToggleMasterForm(false, undefined)) }}
                destroyOnClose={true}
                transitionName="none"
                maskTransitionName="none"
            >
                <Master />
            </Modal>
            <Modal
              visible={journalToggle}
              destroyOnClose
              onCancel={() => { dispatch(ToggleJournal(false, false, 0)) }}
              footer={null} style={{ minWidth: '95%', minHeight:"95%", top: 10 }}
              bodyStyle={{ minHeight: "99%", minWidth: "95%" }}
              transitionName="none"
              maskTransitionName="none"
                
            >
                <JournalForm />
            </Modal>
          <Modal
            visible={productToggle}
            destroyOnClose
            onCancel={() => { dispatch(ToggleProduct(false)) }}
            footer={null} style={{ minWidth: '95%', minHeight:"95%", top: 10 }}
            bodyStyle={{ minHeight: "99%", minWidth: "95%" }}
            transitionName="none"
            maskTransitionName="none"
            >
            <ProductForm/>
          </Modal>
        </div>
    )
}

export default Glob;