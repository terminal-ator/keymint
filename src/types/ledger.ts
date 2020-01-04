import { NullString, NullInt } from "./generic";

export interface Ledger{
  id: number;
  cust_id:number;
  ledger_type: string;
  ledger_date: string;
  ledger_no: NullString;
  assoc_id: NullString;
  to_cust: NullInt;
  from_cust: NullInt;
  company_id: number;
}