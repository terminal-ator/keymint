import React, {FormEvent, useEffect, useState} from 'react';
import {PageDiv} from "../components/styledComp";
import Nav from "../components/nav";
import {FetchCompany, UpdateCompany} from "../api/companies";
import {AxiosResponse} from "axios";
import {Company, FullCompany} from "../types/company";
import {GeneralResponse} from "../types/response";
import {Input, TextField} from "@material-ui/core";
import {Button, message} from "antd";
import dotPropImmutable from "dot-prop-immutable";

const  EditCompanyPage = ()=>{
    const [ company, setCompany] = useState<FullCompany>();
    const [ fetchMessage, setFetchMessage] = useState("");
    useEffect(()=>{
        try {
            FetchCompany().then((res: AxiosResponse<GeneralResponse<FullCompany>>) => {
                setCompany(res.data.data)
            })
        }catch (e) {
            setFetchMessage("Failed to retrieve company data, retry")
            return
        }
    }, [])

    const handleSubmit = async (e: FormEvent)=>{
        e.preventDefault();
        try {
            if(company!=undefined) {
                await UpdateCompany(company);
            }
            message.success("Updated Company detail")
        }catch (e) {
            if(e.request){
                message.error("Failed to connect to server")
            }else{
                message.error("Failed to update ")
            }
        }
    }

    return (<PageDiv>
        <Nav/>
        <div style={{ padding : 10}}>
            <h3>Edit Company Details</h3>
            {
                fetchMessage==""?null:fetchMessage
            }
            {
                company && <form onSubmit={handleSubmit}  style={{ display: "flex", flexDirection: "column", maxWidth:"50%",gap:12 }}>
                    <TextField variant={"outlined"}
                               onChange={(e)=>{
                                   const n = dotPropImmutable.set(company,'gstin', e.target.value)
                                   setCompany(n);
                               }}
                               label={'gstin'} defaultValue={company.gstin} />
                    <TextField label={"Address"}
                               onChange={(e)=>{
                                   const n = dotPropImmutable.set(company,'address1', e.target.value)
                                   setCompany(n);
                               }}
                               value={company.address1} />
                    <TextField label={"Street"}
                               onChange={(e)=>{
                                   const n = dotPropImmutable.set(company, 'address2', e.target.value)
                                   setCompany(n);
                               }}
                               value={company.address2}/>
                    <TextField label={"City"} onChange={(e)=>{
                        const n = dotPropImmutable.set(company,'city', e.target.value)
                        setCompany(n); }} value={company.city}/>
                    <TextField onChange={(e)=>{
                        const n = dotPropImmutable.set(company, 'state', e.target.value);
                        setCompany(n);
                    }} label={"State"} value={company.state}/>
                    <TextField label={"Mobile"} onChange={(e)=>{
                        const n = dotPropImmutable.set(company, 'mobile', e.target.value);
                        setCompany(n);
                    }} value={company.mobile}/>
                    <Button htmlType={"submit"} type={"primary"} style={{ width: "20%", padding: 5}}>Save</Button>
                </form>
            }
        </div>
    </PageDiv>)
}

export default  EditCompanyPage;