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

  const history = useHistory()

  const fetchCompanies = async () => {
    const req = await getUploadCompanies(props.companyID);
    setCompanies(req.data.data);
  };

  const sendFile = async (formdata: FormData) => {
    console.log("sending file 1")
    if (selSale) {
      console.log("Sending file")
      await postFileUpload(props.companyID, company, selSale, formdata);
      history.goBack()
    }

  };

  const OnSubmit = () => {
    let formData = new FormData();
    if (file) {
      formData.append("upload", file);
      sendFile(formData);
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
      <div style={{ display: 'flex', flexDirection: 'column', width: 400, padding: 10 }}>
        <p>Import</p>
        <p>Choose the sales account</p>
        <Select onChange={e => {
          setSelSale(parseInt(e.target.value));
        }}
          value={selSale}
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
        <p>Choose a software</p>
        <Select
          onChange={e => {
            setCompany(e.target.value);
          }}
          value={company}
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

          onClick={() => {
            OnSubmit();
          }}
          disabled={file == undefined}
        >
          Import
      </button>
      </div>
    </PageDiv>
  );
};

export default connector(SalesImportPage);
