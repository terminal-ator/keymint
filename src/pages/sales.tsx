import React, { useState, useEffect } from "react";
import FileUpload from "../components/fileupload";
import { Select, PageDiv } from "../components/styledComp";
import { UplCompany } from "../types/company";
import { AppState } from "../reducers";
import { connect, ConnectedProps } from "react-redux";
import { getUploadCompanies, postFileUpload } from "../api";
import Nav from '../components/nav';
import { Master } from "../types/master";
import { DeNormalize } from "../types/generic";
import { useHistory } from "react-router-dom";
import {message, Result} from "antd";

const mapState = (state: AppState) => {
  return {
    companyID: state.sys.SelectedCompany,
    masters: state.master.masters
  };
};

const connector = connect(mapState, {});

type TypeFromRedux = ConnectedProps<typeof connector>;

const SalesImportPage = (props: TypeFromRedux) => {
  const [companies, setCompanies] = useState<Array<UplCompany>>();
  const [salesAccount, setSalesAccount] = useState<Array<Master>>();

  const [company, setCompany] = useState("");
  const [file, setFile] = useState<File>();
  const [selSale, setSelSale] = useState<number>();
  const [ sCnt, setScnt ] = useState(0);
  const [ eCnt, setEcnt ] = useState(0);

  const history = useHistory()

  const fetchCompanies = async () => {
    const req = await getUploadCompanies(props.companyID);
    setCompanies(req.data.data);
  };

  const sendFile = async (formdata: FormData) => {
    console.log("sending file 1")
    if (selSale) {
      console.log("Sending file")
      const data = await postFileUpload(props.companyID, company, selSale, formdata);
      if(data.status==200){
        setFile(undefined);
        setSelSale(undefined);
        setCompany("");
        setScnt(data.data.success);
        setEcnt(data.data.error);
        message.success(data.data.success)
        message.error(data.data.error)
      }
      else{
        message.error("Failed to post files")
      }
      //history.goBack()
    }

  };

  const OnSubmit = async() => {
    let formData = new FormData();
    if (file) {
      formData.append("upload", file);
      await sendFile(formData);
    }
  };

  const fileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  useEffect(() => {
    fetchCompanies();

    // set sales account
    if (props.masters) {
      const mstrs = DeNormalize<Master>(props.masters);
      const sales = mstrs.filter(mstr => mstr.group_id == 7)

      setSalesAccount(sales);
    }

  }, []);

  return (
    <PageDiv>
      <Nav />
      <div style={{ display: 'flex', flexDirection: 'column',
        width: 400, padding: 10, backgroundColor:"rgb(33,33,33)",
        margin:10,borderRadius: 4
      }}>
        <h4 className={'text-light'}>Import</h4>
        <Select onChange={e => {
          setSelSale(parseInt(e.target.value));
        }}
          value={selSale}
                className={"form-control bg-dark text-light mt-4"}
        >
          <option value="" disabled selected>
            Select Sales
        </option>
          {
            salesAccount?.map((sa) => {
              return <option key={sa.cust_id?.Int64} value={sa.cust_id?.Int64}>{sa.name}</option>
            })
          }
        </Select>
        <Select
          onChange={e => {
            setCompany(e.target.value);
          }}
          value={company}
          className={"form-control bg-dark text-light mt-4"}
        >
          <option value="" disabled selected>
            Select Company
        </option>
          {companies &&
            companies.map(company => (
              <option key={company.name} value={company.name}>
                {company.name}
              </option>
            ))}
        </Select>
        <FileUpload onChange={fileChange} />
        <button
          className={'btn btn-dark mt-4'}
          onClick={async () => {
            await OnSubmit();
          }}
          disabled={file == undefined}
        >
          Import
      </button>
      </div>
      {sCnt !== 0 || eCnt !== 0 && <div>
          <Result
              status={"success"}
              title={`Total Successful submissions: ${sCnt}`}
          />
          <Result
              status={"error"}
              title={`Total errors : ${eCnt}`}
              subTitle={`Correct errors by visiting /errors`}
          />
      </div>
      }
    </PageDiv>
  );
};

export default connector(SalesImportPage);
