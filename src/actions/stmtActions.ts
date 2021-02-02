import { NormalizedCache, normalize } from "../types/generic";
import { Statement } from "../types/statements";
export const FETCH_STATS = `FETCH_STATS`;
interface fetchStatAction {
  type: typeof FETCH_STATS;
  payload: NormalizedCache<Statement>;
}
export type StatementActions = fetchStatAction;
