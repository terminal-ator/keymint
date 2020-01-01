import React, { useState, useEffect } from "react";
import FileUpload from "../components/fileupload";
import { Select } from "../components/styledComp";
import { UplCompany } from "../types/company";
import { AppState } from "../reducers";
import { connect, ConnectedProps } from "react-redux";
import { getUploadCompanies, postFileUpload } from "../api";

const mapState = (state: AppState) => {
  return {
    companyID: state.sys.SelectedCompany
  };
};

const connector = connect(mapState, {});

type TypeFromRedux = ConnectedProps<typeof connector>;

const SalesImportPage = (props: TypeFromRedux) => {
  const [companies, setCompanies] = useState<Array<UplCompany>>();
  const [company, setCompany] = useState("");
  const [file, setFile] = useState<File>();

  const fetchCompanies = async () => {
    const req = await getUploadCompanies(props.companyID);
    setCompanies(req.data.data);
  };

  const sendFile = async (formdata: FormData) => {
    await postFileUpload(props.companyID, company, formdata);
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
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", width: 300 }}>
      Import
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
      >
        Import
      </button>
    </div>
  );
};

export default connector(SalesImportPage);
