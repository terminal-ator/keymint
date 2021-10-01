import React, {useState, useRef, useEffect, FC} from 'react'
import {stateSelector} from "../reducers";
import {Modal} from "antd";
import MasterList from "./mstrlist";
import './VoucherRow.css';
import SkuList from "./SkuList";
import {SkuFromServer} from "./ProductFormV2";

interface Props{
    onSelect(sku: SkuFromServer):void;
    name?: string;
    cursor?:number;
}

const SkuSelect:FC<Props> = (props)=>{

    const [ showList, setShowList ] = useState(false);
    const [ curKey, setCurKey ] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);
    const masters = stateSelector( state => state.master.masters );
    const initialName = props.cursor? masters.normalized[props.cursor]?.name || "" :""
    const [ selectedMaster, setSelectedMaster ] = useState( props.name || initialName);
    const { onSelect } = props;
    const focus = ()=>{
        if(inputRef.current){
            inputRef.current.focus();
            inputRef.current.scrollIntoView();
        }
    }

    const toggleList = ()=>{
        setShowList(!showList);
        focus();
    }

    useEffect(()=>{
        focus();
    },[]);

    const setSku = async (sku: SkuFromServer)=>{
        setSelectedMaster(sku.name);
        await onSelect(sku);
        toggleList();
    }

    return(
        <div style={{ display: "inline", width:"100%", minWidth: "300px"}}>
            <input
                onKeyPress={(e)=>{ if(e.keyCode!==13){setCurKey(e.key);} toggleList()}}
                value = {selectedMaster}
                placeholder={"Press any key to enter"}
                ref={inputRef}
                style={{ "width": "100%"}}
                className={"covert-input"}
            />
            <Modal
                title={"Skus"}
                visible={showList}
                onCancel={toggleList}
                footer={null}
                destroyOnClose
                style={{ zIndex: 99, minWidth: 800, top: 5, animationDuration:"0s !important"}}
                transitionName="none"
                maskTransitionName="none"
            >
                <SkuList initFilter={curKey} handleEnter={setSku} />
            </Modal>
        </div>
    )

}

export default SkuSelect;