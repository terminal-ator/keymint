import axios from "axios";
import { Receipt } from "../pages/receipt";
import { QuickForm } from "../components/ledgerDetail";
import {NullInt, StatementMutation} from "../types/generic";
import { Journal } from "../types/ledger";
import {Cheque, NewCheque} from "../pages/cheque";
import {ax} from "./base";
import {createCompany, GetCompanies} from "./companies";
import {AuthHeader} from "./auth";
import {GetMasters, GetUploadCompanies} from "./masters";
import {GetBankWiseStatements, PostStatementMaster} from "./statements";
import {PostFileUpload} from "./uploads";

export let getCompanies = GetCompanies;
export const getMasters = GetMasters;
export const getBankWiseStatements = GetBankWiseStatements;
export const postStatementMaster = PostStatementMaster;
export const getUploadCompanies = GetUploadCompanies;
export const postFileUpload = PostFileUpload;
export  const postStatementUpload = async (
  companyID: number,
  bankID: number,
  formData: FormData
) =>{
  return ax.post(`/statements/import/${bankID}`, formData, { headers: AuthHeader() })
}

export const postLedger = async (
  date: string,
  recArray: Array<Receipt>,
  companyID: number
) => {
  console.log({ recArray });
  return ax.post(`/ledger/${companyID}`, {
    date,
    ledger_entry: recArray
  });
};

export const postReceipt = async (
  data: { id?:number, amount:number, master_id:number, date:string }[],
) =>{
  const company = await localStorage.getItem('company')
  return ax.post(`/ledger/${company}`, data, {
    headers: {
      "authorization": company
    }
  });
}

export interface ReceiptRequest {
  date: string;
  receipt_id: number;
  receipt_entry: { id?:number, amount:number, master_id:number, date:string }[]
}

export const newPostReceipt = async (
    data: ReceiptRequest
)=>{
  const company = await localStorage.getItem('company')
  return ax.post(`/ledger/${company}`, data, {
    headers: {
      "authorization": company
    }
  });
}

export const putLedger = async (qck: QuickForm, companyID: number) => {
  return ax.put(`/postings/${companyID}`, qck);
};

export const getPostings = async (accountID: number) => {
  return ax.get(`/postings/${accountID}`,
    {
      headers: AuthHeader()
    });
};

export const getPostingsWithDate = async (accountID:number, startDate: string, endDate: string)=>{
  return ax.get(`/postings/${accountID}?start=${startDate}&end=${endDate}`, {
    headers: AuthHeader()
  })
}

export const newSetStatement = async (packet: StatementMutation) => {
  return ax.post(`/statements/`, packet, { headers: AuthHeader()});
};

export const postErrors = async (cust_id: number, error_id: number) => {
  return ax.post(`/errors`, { cust_id, error_id })
}


export const postCreateMaster = async (value: any, companyID: number) => {
  return ax.post(`/master/${companyID}`, value);
}

export const fetchBeats = async (companyID: number) => {
  return ax.get(`/beat/${companyID}`, { headers: AuthHeader()})
}

export const putUpdateMaster = async (master: { name: string, beat_id: number, group_id: number, cust_id: NullInt, opening_balance: number }, companyID:number) => {
  return ax.put(`/master/`, master, { headers: AuthHeader() })
}

export const postNewJournal = async (journal: Journal) => {
  return ax.post('/postings', journal, {
    headers: AuthHeader()
  })
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


export const addCheques = async ( cheques: NewCheque[])=>{
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

export const CreateCompany = createCompany;

export const GetGroupsAndBeats = async (companyID: number)=>{
  return ax.get(`/beats/${companyID}`, { headers: AuthHeader()})
}

export const PostCreateBeats = async (beatName: string) => {
  const token = await localStorage.getItem("company");
  return ax.post(`/beats/make/${beatName}`,{} , { headers: { "authorization": token}})
}

export const DeleteVoucherById = async (journalID: number) => {
  return ax.delete(`/postings/${journalID}`, { headers: AuthHeader() });
}