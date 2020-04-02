import { combineReducers } from "redux";
import { SystemReducer } from "./systemReducer";
import { MasterReducer } from "./masterReducer";
import { StmtReducer } from "./stmtReducer";
import { BeatReducer } from "./beatReducer";
import { TypedUseSelectorHook, useSelector } from "react-redux";
import { UIReducer } from "./uiReducer";
import { PostingReducer } from "./postingReducer";
import {YearReducer} from "./yearReducer";

const rootReducer = combineReducers({
  sys: SystemReducer,
  master: MasterReducer,
  stmt: StmtReducer,
  beats: BeatReducer,
  ui: UIReducer,
  posts: PostingReducer,
  years: YearReducer
});

export type AppState = ReturnType<typeof rootReducer>;

export const stateSelector: TypedUseSelectorHook<AppState> = useSelector;

export default rootReducer;
