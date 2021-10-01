export interface Company {
  id: number;
  name: string;
  year: string;
}


export interface FullCompany {
  id: number;
  name: string;
  gstin: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  mobile: string;
}

export interface UplCompany {
  id: number;
  name: string;
  company_id: number;
}


export interface CreateCompanyType{
  name: string;
  startdate: string;
  enddate: string;
  year:string

}