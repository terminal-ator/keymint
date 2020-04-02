import { SystemState } from "../reducers/systemReducer";
import { NormalizedCache, normalize } from "../types/generic";
import { Company } from "../types/company";
import { ThunkAction } from "redux-thunk";
import { AppState } from "../reducers";
import { Action } from "redux";
import { getCompanies } from "../api";

export const SELECT_COMPANY = `SELECT_COMPANY`;
export const SAVE_COMPANIES = `SAVE_COMPANIES`;

interface SelectCompanyAction {
  type: typeof SELECT_COMPANY;
  payload: number;
}

interface SaveCompaniesAction {
  type: typeof SAVE_COMPANIES;
  payload: NormalizedCache<Company>;
}

export type SystemActionType = SelectCompanyAction | SaveCompaniesAction;

export const GetCompanies = (): ThunkAction<
  void,
  AppState,
  null,
  Action<String>
> => async dispatch => {
  const companiesData = await getCompanies();
  dispatch({
    type: SAVE_COMPANIES,
    payload: normalize<Company>(companiesData)
  });
};

export const SelectCompany  = (id: number): ThunkAction<void, AppState, null, Action<String>> => async dispatch => {
  await localStorage.setItem('company', id.toString());
  dispatch({
    type: SELECT_COMPANY,
    payload: id
  })
}


export const oldSelectCompany = (id: number) => ({
  type: SELECT_COMPANY,
  payload: id
});
