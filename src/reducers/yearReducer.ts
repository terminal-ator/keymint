import {NormalizedCache, Year} from "../types/generic";
import {CHOOSE_YEAR, SAVE_YEARS, YearsActions} from "../actions/yearsActions";
import {act} from "react-dom/test-utils";

interface YearState {
  years: NormalizedCache<Year>,
  year?: number
}

const initialState: YearState = {
  years: { normalized: {}, all: []},
};

export const YearReducer = (
  state = initialState,
  action:YearsActions
): YearState=>{
  switch (action.type) {
    case SAVE_YEARS:
      return { ...state, years: action.payload};
    case CHOOSE_YEAR:
      return {...state, year: action.payload};
    default:
      return state;
  }
}