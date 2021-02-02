import {normalize, NormalizedCache} from '../types/generic';
import {Posting} from '../types/ledger';
import {FETCH_POSTINGS, PostingActions, SET_CHEQUES, SET_POSTING_PARENT_ID} from '../actions/postingActions';
import {Cheque, NewCheque} from "../pages/cheque";

export interface PostingResponse {
  journals: Posting[]
  master_id: number;
  opening_balance: number;
  start_date: string;
  end_date: string;
  closing_balance: number;
  current_total: number;
}

interface PostingState{
  postings: NormalizedCache<Posting> | undefined;
  postId: number;
  cheques: Cheque[] | null;
  opening_balance: number;
  closing_balance: number;
  start_date: string;
  end_date: string;
  current_total: number;
  debit_total: number;
  credit_total: number;
}

const initialState: PostingState = {
  postings: undefined,
  postId: 0,
  cheques: [],
  opening_balance: 0,
  closing_balance: 0,
  start_date: "",
  end_date: "",
  current_total: 0,
  debit_total: 0,
  credit_total: 0
};

export const PostingReducer = (state = initialState, action: PostingActions)=>{
  switch (action.type) {
    case FETCH_POSTINGS:
      console.log("These are the journals received:", action.payload);
      const res = normalize(action.payload.journals);
      console.log({ res })
      return { ...state, postings: res,  ...action.payload };
    case SET_POSTING_PARENT_ID:
      return { ...state, postId: action.payload };
    case SET_CHEQUES:
      return { ...state, cheques: action.payload };
    default: return state;
  }
};


