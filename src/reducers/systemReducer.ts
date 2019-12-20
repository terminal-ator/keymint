import {
  SystemActionType,
  SELECT_COMPANY,
  SAVE_COMPANIES
} from "../actions/systemActions";
import { NormalizedCache } from "../types/generic";
import { Company } from "../types/company";

export interface SystemState {
  SelectedCompany: number;
  Companies: NormalizedCache<Company> | undefined;
}

const initialState: SystemState = {
  SelectedCompany: 1,
  Companies: undefined
};

export const SystemReducer = (
  state = initialState,
  action: SystemActionType
): SystemState => {
  switch (action.type) {
    case SELECT_COMPANY:
      return { ...state, SelectedCompany: action.payload };
    case SAVE_COMPANIES:
      return { ...state, Companies: action.payload };
    default:
      return state;
  }
};
