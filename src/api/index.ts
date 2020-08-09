import axios from "axios";
import { Receipt } from "../pages/receipt";
import { QuickForm } from "../components/ledgerDetail";
import {NullInt, StatementMutation} from "../types/generic";
import { FormValues } from "../components/master";
import { Master } from "../types/master";
import { Journal } from "../types/ledger";
import {Cheque} from "../pages/cheque";

export const ax = axios.create({
  baseURL: 'http://unraidone.duckdns.org:8080',
});

const SERVER_URL = `http://unraidone.duckdns.org:8080`;

export const getCompanies = async () => {
  const req = await axios.get(`${SERVER_URL}/companies`);
  return req.data.companies;
};

export const getMasters = async (companyID: number) => {
  const yearID = await localStorage.getItem('yearID');
  const req = await ax.get(`/accounts`, {
    headers:{
      "Authorization": companyID,
      "yearID": yearID
    }
  });
  return req.data;
};

export const getStatements = async (companyID: number) => {
  const req = await axios.get(`${SERVER_URL}/cstatements/${companyID}`);
  return req.data.statements;
};

export const getBanks = async (companyID: number) => {
  return axios.get(`${SERVER_URL}/banks/${companyID}`);
};

export const getBankWiseStatements = async (bankID: number, startDate:string, endDate:string) => {
  const yearID = await localStorage.getItem('yearID');
  return axios.get(`${SERVER_URL}/statements/${bankID}?sd=${startDate}&ed=${endDate}`,{
    headers:{
      "yearID": yearID
    }
  });
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
  saleId: number,
  formdata: FormData
) => {
  return axios.post(
    `${SERVER_URL}/upload?company=${companyName}&id=${companyID}&sales=${saleId}`,
    formdata
  );
};

export  const postStatementUpload = async (
  companyID: number,
  bankID: number,
  formData: FormData
) =>{
  return ax.post(`/statement/import?bank=${bankID}&company=${companyID}`, formData)
}

export const postLedger = async (
  date: string,
  recArray: Array<Receipt>,
  companyID: number
) => {
  console.log({ recArray });
  return axios.post(`${SERVER_URL}/ledger/${companyID}`, {
    date,
    ledger_entry: recArray
  });
};

export const postReceipt = async (
  data: { id?:number, amount:number, master_id:number, date:string }[]
) =>{
  const company = await localStorage.getItem('company')
  return ax.post(`/ledger/${company}`, data, {
    headers: {
      "authorization": company
    }
  });
}

export const fetchLedger = async (custID: number, companyID: number) => {
  return axios.get(
    `${SERVER_URL}/ledger?cust_id=${custID}&company=${companyID}`
  );
};

export const putLedger = async (qck: QuickForm, companyID: number) => {
  return axios.put(`${SERVER_URL}/ledger/${companyID}`, qck);
};

export const getPostings = async (accountID: number) => {
  const yearID = await localStorage.getItem("yearID");
  return axios.get(`${SERVER_URL}/postings/${accountID}`,
    {
      headers:{
        "yearID" : yearID
      }
    });
};

export const newSetStatement = async (packet: StatementMutation) => {
  return axios.post(`${SERVER_URL}/statement/`, packet);
};

export const postErrors = async (cust_id: number, error_id: number) => {
  return axios.post(`${SERVER_URL}/errors`, { cust_id, error_id })
}


export const postCreateMaster = async (value: any, companyID: number) => {
  return axios.post(`${SERVER_URL}/master/${companyID}`, value);
}

export const fetchBeats = async (companyID: number) => {
  return ax.get(`/beat/${companyID}`)
}

export const putUpdateMaster = async (master: { name: string, beat_id: number, group_id: number, cust_id: NullInt }, companyID:number) => {
  return ax.put(`/master/${companyID}`, master)
}

export const postNewJournal = async (journal: Journal) => {
  return ax.post('/journal', journal)
}

export const getJournal = async (journalID: number) => {
  return ax.get(`/journal/${journalID}`)
}

export const fetchYears = async ( company: number )=>{
  const companyID = await localStorage.getItem('company');
  return  ax.get('/years',{
    headers:{
      "Authorization": companyID
    }
  })
}


export const addCheques = async ( cheques: Cheque[])=>{
  return ax.post('/cheque/list', cheques);
}

export const getCheques = async (masterid: number)=>{
  return ax.get(`/cheque/cheques/${masterid}`)
}

export const postToggleCheque = async (cid: number)=>{
  return ax.post(`/cheque/toggle/${cid}`)
}

export const getRecommended = async ( amount: number )=>{
  const token = await localStorage.getItem('company');
  return ax.get(`/cheque/recommended/${amount}`, { headers: { "authorization" : token}});
}


export const getPendingCheques = async ()=>{
  const token = await localStorage.getItem('company')
  return ax.get(`/cheque/pending`, { headers: { "authorization": token }})
}