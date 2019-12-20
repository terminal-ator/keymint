import { NormalizedCache } from "../types/generic";
import { Statement } from "../types/statements";
import { StatementActions, FETCH_STATS } from "../actions/stmtActions";

export interface StatementState {
  statements: NormalizedCache<Statement> | undefined;
}

const initialState: StatementState = {
  statements: undefined
};

export const StmtReducer = (
  state = initialState,
  action: StatementActions
): StatementState => {
  switch (action.type) {
    case FETCH_STATS:
      return { ...state, statements: action.payload };
    default:
      return state;
  }
};
