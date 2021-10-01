import React, {useState, useRef, useEffect, FC} from 'react'
import {stateSelector} from "../reducers";
import {Modal} from "antd";
import MasterList from "./mstrlist";
import './VoucherRow.css';

interface Props {
    onSelect(cursor:number):void;
    cursor?:number;
}

const NameSelect:FC<Props> = (props)=>{

    const [ showList, setShowList ] = useState(false);
    const [ curKey, setCurKey ] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);
    const masters = stateSelector( state => state.master.masters );
    const initialName = props.cursor? masters.normalized[props.cursor]?.name || "" :""
    const [ selectedMaster, setSelectedMaster ] = useState(initialName);
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

    const setMaster = async (cursor: number)=>{
        if(masters){
            const name = masters.normalized[cursor].name;
            await setSelectedMaster(name);
            await onSelect(cursor)
            toggleList();
        }
    }

    return(
        <div style={{ display: "inline", width:"100%"}}>
            <input
                onKeyPress={(e)=>{ if(e.keyCode!==13){setCurKey(e.key);} toggleList()}}
                value = {selectedMaster}
                placeholder={"Press any key to enter"}
                ref={inputRef}
                style={{ "width": "100%"}}
                className={"covert-input"}
            />
            <Modal
                title={"Select Master"}
                visible={showList}
                onCancel={toggleList}
                footer={null}
                destroyOnClose
                style={{ zIndex: 99, minWidth: 800, top: 5, animationDuration:"0s !important"}}
                transitionName="none"
                maskTransitionName="none"
            >
                <MasterList masters={masters} initFilter={curKey} handleEnter={setMaster} handleEscape={()=>{}}   />
            </Modal>
        </div>
    )

}

export default NameSelect;