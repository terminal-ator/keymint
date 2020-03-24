import {NormalizedCache} from '../types/generic';
import {Posting} from '../types/ledger';
import {FETCH_POSTINGS, PostingActions, SET_POSTING_PARENT_ID} from '../actions/postingActions';

interface PostingState{
  postings: NormalizedCache<Posting> | undefined;
  postId: number;
}

const initialState: PostingState = {
  postings: undefined,
  postId: 0,
};

export const PostingReducer = (state = initialState, action: PostingActions)=>{
  switch (action.type) {
    case FETCH_POSTINGS:
      return { ...state, postings: action.payload };
    case SET_POSTING_PARENT_ID:
      return { ...state, postId: action.payload };
    default: return state;
  }
};


