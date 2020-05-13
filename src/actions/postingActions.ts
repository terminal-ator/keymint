import { Posting } from "../types/ledger";
import { normalize, NormalizedCache } from "../types/generic";
import { ThunkAction } from "redux-thunk";
import { AppState } from "../reducers";
import { Action } from "redux";
import {getCheques, getPostings} from "../api";
import {Cheque} from "../pages/cheque";

export const FETCH_POSTINGS = `FETCH_POSTING`;
export const SET_POSTING_PARENT_ID = `SET_POSTING_PARENT_ID`;
export const SET_CHEQUES = `SET_CHEQUES`;

interface FetchPosting {
  type: typeof FETCH_POSTINGS;
  payload: NormalizedCache<Posting>;
}

interface FetchCheques {
  type: typeof SET_CHEQUES;
  payload: Cheque[]

}

interface SetPostingId{
  type: typeof SET_POSTING_PARENT_ID ;
  payload: number;
}

export type PostingActions = FetchPosting | SetPostingId | FetchCheques;

export const fetchPosting = (
  id: number,
): ThunkAction<void, AppState, null, Action<String>> => async (dispatch) => {
  dispatch({
    type: SET_POSTING_PARENT_ID,
    payload: id,
  });
  const postings = await getPostings(id);
  const postingsState = normalize<Posting>(postings.data);
  dispatch({
    type: FETCH_POSTINGS,
    payload: postingsState,
  });
  //dispatch(fetchCheques);
};

export const fetchCheques = (): ThunkAction<void, AppState, null, Action<String>> => async (dispatch, getState) => {
  const postingID = getState().posts.postId;
  const req = await getCheques(postingID);
  const cheques = req.data;
  dispatch({
    type: SET_CHEQUES,
    payload: cheques
  })
}
