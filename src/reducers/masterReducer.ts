import { NormalizedCache } from "../types/generic";
import { Master } from "../types/master";
import { MasterActions, FETCH_MASTERS } from "../actions/masterActions";

export interface MasterState {
  masters: NormalizedCache<Master>
}

const initialState: MasterState = {
  masters: { normalized: {}, all: [] }
};

export const MasterReducer = (
  state = initialState,
  action: MasterActions
): MasterState => {
  switch (action.type) {
    case FETCH_MASTERS:
      return { ...state, masters: action.payload };
    default:
      return state;
  }
};
