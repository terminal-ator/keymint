import axios from "axios";
import { Receipt } from "../pages/receipt";

const SERVER_URL = `http://localhost:8080`;

export const getCompanies = async () => {
  const req = await axios.get(`${SERVER_URL}/companies`);
  return req.data.companies;
};

export const getMasters = async (companyID: number) => {
  const req = await axios.get(`${SERVER_URL}/masters/${companyID}`);
  return req.data.masters;
};

export const getStatements = async (companyID: number) => {
  const req = await axios.get(`${SERVER_URL}/cstatements/${companyID}`);
  return req.data.statements;
};

export const getBanks = async (companyID: number) => {
  return axios.get(`${SERVER_URL}/banks/${companyID}`);
};

export const getBankWiseStatements = async (bankID: number) => {
  return axios.get(`${SERVER_URL}/statements/${bankID}`);
};

interface StatementMaster {
  statement_id: number;
  cust_id: number;
  company_id: number;
}

export const postStatementMaster = async (arg: StatementMaster) => {
  return axios.post(SERVER_URL + "/statements", arg);
};

export const getUploadCompanies = async (companyID: number) => {
  return axios.get(`${SERVER_URL}/uplcompany/${companyID}`);
};

export const postFileUpload = async (
  companyID: number,
  companyName: string,
  formdata: FormData
) => {
  return axios.post(
    `${SERVER_URL}/upload?company=${companyName}&id=${companyID}`,
    formdata
  );
};

export const postLedger = async (date: string, recArray : Array<Receipt>, companyID: number)=>{
  return axios.post(`${SERVER_URL}/ledger/${companyID}`, { date, ledger_entry: recArray })
}

export const fetchLedger = async(custID: number, companyID:number)=>{
  return axios.get(`${SERVER_URL}/ledger?cust_id=${custID}&company=${companyID}`)
}