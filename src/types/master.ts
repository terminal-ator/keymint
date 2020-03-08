import { NullString, NullInt } from "./generic";

export interface Master {
  id: number;
  cust_id: NullInt;
  is_master: boolean;
  name: string;
  address: NullString;
  Area: NullString;
  CreatedAt: NullString;
  company_id: number;
  chq_flg: number;
  group_id: number;
  balance: number;
  beat_id: number;
}
