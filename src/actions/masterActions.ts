import { ThunkAction } from "redux-thunk";
import { AppState } from "../reducers";
import { Action } from "redux";
import { NormalizedCache, normalize } from "../types/generic";
import { Master } from "../types/master";
import { getMasters } from "../api";

export const FETCH_MASTERS = `FETCH_MASTERS`;

interface fetchMasterAction {
  type: typeof FETCH_MASTERS;
  payload: NormalizedCache<Master>;
}

export type MasterActions = fetchMasterAction;

export const FetchMasters = (
  companyID: number
): ThunkAction<void, AppState, null, Action<String>> => async dispatch => {
  const masters = await getMasters(companyID);
  dispatch({
    type: FETCH_MASTERS,
    payload: normalize<Master>(masters, true)
  });
};
