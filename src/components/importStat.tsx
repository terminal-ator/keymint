import React, {useState} from "react";
import { stateSelector } from "../reducers";
import { DeNormalize } from "../types/generic";
import {Button, Card, message, Select} from "antd";
import Nav from "./nav";
import FileUpload from "./fileupload";
import {postStatementUpload} from "../api";
import {Master} from "../types/master";

const ImportStatement = () => {
  const companyID = stateSelector( (state) => state.sys.SelectedCompany)
  const masters = stateSelector(state => state.master.masters);
  const masterArray = DeNormalize(masters);
  const banks = masterArray.filter( mstr=> mstr.group_id === 5);
  const [ file, setFile  ] = useState<File>();
  const [ bank, setBank ] = useState<number>();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if(e.target.files && e.target.files.length > 0 ){
      setFile(e.target.files[0]);
    };
  };
  const uploadForm = async()=>{
    if(bank && file){
      let form = new FormData();
      form.append("upload", file);
      try{
        const response = await postStatementUpload(companyID, bank, form);
        if (response.status==200){
          message.success("Upload Successful");
          setBank(undefined);
          setFile(undefined);
        }else{
          message.error("Request failed, please try again.")
        }
      }catch (e) {
        message.error(e.toString());
      }

    }else{
      message.error("All fields are required");
    }
  }
  return (
    <div>
      <Nav />
      <Card>
        <h3>Import Statements</h3>
        <Select
          placeholder={"Select Bank"}
          style={{ width: 200 }}
          onChange={(e)=>{ setBank(parseInt(e.toString())); }}
          value={bank}
        >
          {banks.map(bank => (
            <Select.Option key={bank.cust_id.Int64} value={bank.cust_id.Int64}>
              {bank.name}
            </Select.Option>
          ))}
        </Select>
        <FileUpload onChange={handleChange} key={"handleFileUpload"} />
        <Button onClick={async ()=>{await uploadForm();}} disabled={file===undefined} type={"primary"} style={{ marginTop: 10 }}>Upload</Button>
      </Card>
    </div>
  );
};

export default ImportStatement;
