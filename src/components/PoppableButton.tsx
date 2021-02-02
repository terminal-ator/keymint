import {useState} from "react";
import {Button, DatePicker} from "antd";
import React from "react";
import {useDispatch} from "react-redux";
import {CreateCompany} from "../api";
import {GetCompanies} from "../actions/systemActions";

const PoppableCreateCompany = ()=>{

    const dispatch = useDispatch();
    const [ show, setShow ] = useState(false)
    const [ company, setCompany ] = useState("")
    const [ startDate, setSD ] = useState("")
    const [endDate, setED ] = useState("")
    const [ yearString, setYear ] = useState("")

    const onSave = async ()=>{

        try {
            await CreateCompany({
                name: company,
                startdate: startDate,
                enddate: endDate,
                year: yearString
            });
            dispatch(GetCompanies());
            setShow(false);
        }catch (e) {
            if (e.req){

            }
        }

    }

    return <div>
        <Button onClick={()=>{
            setShow(!show)
        }} >{ !show?"Create Company": "Hide" }</Button>
        {
            show?<div style={{ display: "flex", flexDirection:"column", padding:"2px", }}>
                <input placeholder={"Company Name"} value={company} onChange={(e)=>{setCompany(e.target.value)}} />
                <span>Start date</span>
                <DatePicker  onChange={(e)=>{ if(e) setSD(e.format("YYYY-MM-DD"))}}   />
                <span>End Date</span>
                <DatePicker onChange={(e)=>{if(e) setED(e.format("YYYY-MM-DD"))}} />
                <span>Year String</span>
                <input value={yearString} onChange={(e)=>{setYear(e.target.value)}} />
                <Button onClick={async ()=>{ await onSave();}} >Add</Button>
            </div>:null
        }
    </div>
}

export default PoppableCreateCompany;


