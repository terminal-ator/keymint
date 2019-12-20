import { NormalizedCache, normalize } from "../types/generic";
import { Statement } from "../types/statements";
import { ThunkAction } from "redux-thunk";
import { AppState } from "../reducers";
import { Action } from "redux";
import { getStatements, getBankWiseStatements } from "../api";

export const FETCH_STATS = `FETCH_STATS`;

interface fetchStatAction {
  type: typeof FETCH_STATS;
  payload: NormalizedCache<Statement>;
}

export type StatementActions = fetchStatAction;

export const FetchStats = (
  companyId: number
): ThunkAction<void, AppState, null, Action<String>> => async dispatch => {
  const statements = await getStatements(companyId);
  dispatch({
    type: FETCH_STATS,
    payload: normalize<Statement>(statements)
  });
};

// export const FetchBankWiseStatements = (
//   bankId: number
// ): ThunkAction<void, AppState, null, Action<String>> => async dispatch=>{
//   const req = await getBankWiseStatements(bankId);
//   const normalizedReq = normalize<Statement>(req.data.statements);
//   dispatch({
//     type: FET
//   })
// }
