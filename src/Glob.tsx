import React from 'react';
import { stateSelector } from './reducers';
import {Modal, Spin} from 'antd';
import Master from './components/master';
import { useDispatch } from 'react-redux';
import {ToggleMaster, ToggleJournal, ToggleMasterForm, ToggleProduct} from './actions/uiActions';
import JournalForm from './components/journalForm';
import ProductForm from "./components/ProductForm";
import ConsolidatedVoucher from "./components/ConsolidatedVoucher";
import ProductFormV2 from "./components/ProductFormV2";


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
                title={'Create/Edit master'}
                footer={null}
                zIndex={1001}
                onCancel={() => { dispatch(ToggleMasterForm(false, undefined)) }}
                destroyOnClose={true}

                style={{ minWidth: "100%" ,width:"100%", height:"100%",minHeight: "100vh", top: 0 }}
                bodyStyle={{ maxHeight: "100%", width:"100%", minHeight:"100vh"}}
            >
                <Master />
            </Modal>
            <Modal
              visible={journalToggle}
              destroyOnClose
              title={"Add/Edit Voucher"}
              onCancel={() => {
                  const confirm = window.confirm("Do you want to exit without saving?")
                  if(!confirm) return;
                  dispatch(ToggleJournal(false, false, 0, ()=>{}))
              }}
              footer={null}
              style={{ minWidth: "100%" ,width:"100%", height:"100%",minHeight: "100vh", top: 0 }}
              bodyStyle={{ maxHeight: "100%", width:"100%", minHeight:"100vh"}}
              zIndex={1000}
            >
                <ConsolidatedVoucher />
            </Modal>
          <Modal
            visible={productToggle}
            destroyOnClose
            onCancel={() => { dispatch(ToggleProduct(false)) }}
            title={"Create/Edit Product"}
            footer={null}
            style={{ minWidth: "100%" ,width:"100%", height:"100%",minHeight: "100vh", top: 0 }}
            bodyStyle={{ maxHeight: "100%", width:"100%", minHeight:"100vh"}}

            >
            <ProductFormV2 />
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