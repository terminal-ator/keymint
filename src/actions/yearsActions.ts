import { normalize, NormalizedCache, Year } from "../types/generic";
import { ThunkAction } from "redux-thunk";
import { AppState } from "../reducers";
import { Action } from "redux";
import { fetchYears } from "../api";

export const FETCH_YEARS = `FETCH_YEARS`;
export const SAVE_YEARS = `SAVE_YEARS`;
export const CHOOSE_YEAR = `CHOOSE_YEAR`;

export interface SaveYear {
  type: string;
  payload: NormalizedCache<Year>;
}

export interface ChooseYear {
  type: string;
  payload: number;
}

export const SaveYears = (payload: NormalizedCache<Year>): SaveYear => {
  return {
    type: SAVE_YEARS,
    payload
  };
};

export const SetYear = (yearID: number): ChooseYear => {
  return {
    type: CHOOSE_YEAR,
    payload: yearID
  };
};

export type YearsActions = SaveYear & ChooseYear;

export const FetchYears = (): ThunkAction<
  void,
  AppState,
  null,
  Action<String>
> => async (dispatch, getState) => {
  const companyID = getState().sys.SelectedCompany;
  const years = await fetchYears(companyID);
  dispatch(SaveYears(normalize<Year>(years.data, false)));
};

export const SaveSelectedYear = (
  yearID: number
): ThunkAction<void, AppState, null, Action<String>> => async dispatch => {
  await localStorage.setItem('yearID', yearID.toString());
  dispatch(SetYear(yearID));
};
