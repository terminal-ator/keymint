import { NullString, NullInt } from "./generic";

export interface Ledger {
  id: number;
  cust_id: number;
  ledger_type: string;
  ledger_date: string;
  ledger_no: NullString;
  assoc_id: NullString;
  to_cust: NullInt;
  from_cust: NullInt;
  company_id: number;
}

export interface Posting {
  id: number;
  date: string;
  journal_id: number;
  narration: string;
  ref_no: string;
  stat_id: number;
  amount: number;
}

export interface TPosting {
  id: number;
  master_id: number
  amount: number
}


export interface Journal {
  id: number;
  date: string;
  narration: string;
  ref_no: string;
  company_id: number;
  type: string;
  sttmt_id: number | undefined;
  postings?: TPosting[]
}