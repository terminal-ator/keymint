import { Posting } from "../types/ledger";
import { normalize, NormalizedCache } from "../types/generic";
import { ThunkAction } from "redux-thunk";
import { AppState } from "../reducers";
import { Action } from "redux";
import { getPostings } from "../api";

export const FETCH_POSTINGS = `FETCH_POSTING`;
export const SET_POSTING_PARENT_ID = `SET_POSTING_PARENT_ID`;

interface FetchPosting {
  type: typeof FETCH_POSTINGS;
  payload: NormalizedCache<Posting>;
}

interface SetPostingId{
  type: typeof SET_POSTING_PARENT_ID ;
  payload: number;
}

export type PostingActions = FetchPosting | SetPostingId;

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
};
