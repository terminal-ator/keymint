import { ThunkAction } from "redux-thunk";
import { AppState } from "../reducers";
import { Action } from "redux";
import { NormalizedCache, normalize } from "../types/generic";
import { Master } from "../types/master";
import { getMasters } from "../api";
import {LOADING_END, LOADING_START} from "./uiActions";
import {message} from "antd";

export const FETCH_MASTERS = `FETCH_MASTERS`;

interface fetchMasterAction {
  type: typeof FETCH_MASTERS;
  payload: NormalizedCache<Master>;
}

export type MasterActions = fetchMasterAction;

export const FetchMasters = (
): ThunkAction<void, AppState, null, Action<String>> => async (dispatch, getState) => {
  const companyID = getState().sys.SelectedCompany;
  dispatch({ type: LOADING_START });
  try{
    const masters = await getMasters();
    console.log(masters);
    dispatch({
      type: FETCH_MASTERS,
      payload: normalize<Master>(masters, true)
    });
  }catch (e) {
    message.error("There was some issue, please try again!")
  }finally {
    dispatch({type: LOADING_END});
  }

};
