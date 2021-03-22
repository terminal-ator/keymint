import { Posting } from "../types/ledger";
import { normalize, NormalizedCache } from "../types/generic";
import { ThunkAction } from "redux-thunk";
import { AppState } from "../reducers";
import { Action } from "redux";
import {getCheques, getPostings, getPostingsWithDate} from "../api";
import {Cheque} from "../pages/cheque";
import {PostingResponse} from "../reducers/postingReducer";
import {AxiosResponse} from "axios";
import {LOADING_END, LOADING_START} from "./uiActions";
import {message} from "antd";

export const FETCH_POSTINGS = `FETCH_POSTING`;
export const SET_POSTING_PARENT_ID = `SET_POSTING_PARENT_ID`;
export const SET_CHEQUES = `SET_CHEQUES`;

interface FetchPosting {
  type: typeof FETCH_POSTINGS;
  payload: PostingResponse;

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
  const postings:AxiosResponse<PostingResponse> = await getPostings(id);
  dispatch({
    type: FETCH_POSTINGS,
    payload: postings.data,
  });
  //dispatch(fetchCheques);
};


export const fetchPostingWithDate = (
    id: number,
    startDate: string,
    endDate: string
): ThunkAction<void,AppState, null, Action<String>> => async (dispatch)=>{
  dispatch({type:LOADING_START});
  try{
    const postings: AxiosResponse<PostingResponse> = await getPostingsWithDate(id, startDate, endDate);
    dispatch({
      type: FETCH_POSTINGS,
      payload: postings.data,
    });
  }catch (e) {
    message.error("Failed to connect to server, please retry")
  }finally {
    dispatch({ type: LOADING_END });
  }

}


export const fetchCheques = (): ThunkAction<void, AppState, null, Action<String>> => async (dispatch, getState) => {
  const postingID = getState().posts.postId;
  const req = await getCheques(postingID);
  const cheques = req.data;
  dispatch({
    type: SET_CHEQUES,
    payload: cheques
  })
}
