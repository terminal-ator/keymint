import {NormalizedCache} from '../types/generic';
import {Posting} from '../types/ledger';
import {FETCH_POSTINGS, PostingActions, SET_CHEQUES, SET_POSTING_PARENT_ID} from '../actions/postingActions';
import {Cheque} from "../pages/cheque";

interface PostingState{
  postings: NormalizedCache<Posting> | undefined;
  postId: number;
  cheques: Cheque[] | null;
}

const initialState: PostingState = {
  postings: undefined,
  postId: 0,
  cheques: null
};

export const PostingReducer = (state = initialState, action: PostingActions)=>{
  switch (action.type) {
    case FETCH_POSTINGS:
      return { ...state, postings: action.payload };
    case SET_POSTING_PARENT_ID:
      return { ...state, postId: action.payload };
    case SET_CHEQUES:
      return { ...state, cheques: action.payload };
    default: return state;
  }
};


