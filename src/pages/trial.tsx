import React, {FC, useState} from 'react';
import {PageDiv} from "../components/styledComp";
import Nav from "../components/nav";
import {Button, DatePicker} from "antd";
import moment from "moment";
import {DownloadTrialBalance} from "../api/downloads";
import FileDownload from 'js-file-download';

const TrialPage:FC = ()=>{
    const [ date, setDate ] = useState(moment().format("YYYY-MM-DD"))
    const downloadTrialBalance = ()=>{
        DownloadTrialBalance(date).then((res)=>{
            FileDownload(res.data,"trial.xlsx")
        })
    }
    return(
        <PageDiv>
            <Nav />
            <div>
                <DatePicker value={moment(date)} onChange={(e)=>{if(e)setDate(e.format("YYYY-MM-DD"))}} />
                <Button onClick={downloadTrialBalance}> Download </Button>
            </div>
        </PageDiv>
    )
}

export default TrialPage;