import axios from "axios";

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
