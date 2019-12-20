import { combineReducers } from "redux";
import { SystemReducer } from "./systemReducer";
import { MasterReducer } from "./masterReducer";
import { StmtReducer } from "./stmtReducer";

const rootReducer = combineReducers({
  sys: SystemReducer,
  master: MasterReducer,
  stmt: StmtReducer
});

export type AppState = ReturnType<typeof rootReducer>;

export default rootReducer;
