import {NormalizedCache, Year} from "../types/generic";
import {SAVE_YEARS, YearsActions} from "../actions/yearsActions";

interface YearState {
  years: NormalizedCache<Year>
}

const initialState: YearState = {
  years: { normalized: {}, all: []}
};

export const YearReducer = (
  state = initialState,
  action:YearsActions
): YearState=>{
  switch (action.type) {
    case SAVE_YEARS:
      return { ...state, years: action.payload};
    default:
      return state;
  }
}