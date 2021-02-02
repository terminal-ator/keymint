import React from 'react';
import { stateSelector } from './reducers';
import {Modal, Spin} from 'antd';
import Master from './components/master';
import { useDispatch } from 'react-redux';
import {ToggleMaster, ToggleJournal, ToggleMasterForm, ToggleProduct} from './actions/uiActions';
import JournalForm from './components/journalForm';
import ProductForm from "./components/ProductForm";
import ConsolidatedVoucher from "./components/ConsolidatedVoucher";


const Glob = () => {
    const masterToggle = stateSelector(state => state.ui.masterFormToggle);
    const journalToggle = stateSelector(state => state.ui.journalToggle);
    const productToggle = stateSelector(state => state.ui.productToggle);
    const loading =  stateSelector(state=>state.ui.loading);
    const dispatch = useDispatch();

    return (
        <div>
        <div>
            <Modal
                visible={masterToggle}
                title={'Create User'}
                footer={null}
                style={{ zIndex: 1000}}
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

              onCancel={() => {
                  const confirm = window.confirm("Do you want to exit without saving?")
                  if(!confirm) return;
                  dispatch(ToggleJournal(false, false, 0, ()=>{}))
              }}
              footer={null}
              style={{ minWidth: "95%" ,width:"100%",minHeight: "100%", top: 0 }}
              bodyStyle={{ minHeight: "100vh", width:"100%"}}
            >
                <ConsolidatedVoucher />
            </Modal>
          <Modal
            visible={productToggle}
            destroyOnClose
            onCancel={() => { dispatch(ToggleProduct(false)) }}
            footer={null} style={{ minWidth: '100%', minHeight:"100%", top: 0 }}
            bodyStyle={{ minHeight: "100%", minWidth: "100%" }}
            transitionName="none"
            maskTransitionName="none"
            >
            <ProductForm/>
          </Modal>
        </div>
        <div style={{ zIndex: 999999, position:"fixed",top:0, left:0, bottom:0,right:0, display: loading?"flex":"none",
            justifyContent:"center", alignItems:"flex-start"}} >
            <Spin spinning={true} size={"large"} style={{ marginTop: 10 }} />
        </div>
    </div>
    )
}

export default Glob;