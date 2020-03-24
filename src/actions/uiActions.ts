import { Journal } from "../types/ledger";
import { ThunkAction } from "redux-thunk";
import { getJournal } from "../api";
import { AppState } from "../reducers";
import { Action } from "redux";

export const TOGGLE_MASTER = `TOGGLE_MASTER`;
export const UPDATE_MASTER = `UPDATE_MASTER`;

export const TOGGLE_JOURNAL = `TOGGLE_JOURNAL`;
export const FETCH_JOURNAL = `FETCH_JOURNAL`;
export const UPDATE_JOURNAL = `UPDATE_JOURNAL`;

interface journalPayload {
    show: boolean
    valid: boolean
    id: number;
}

interface ShowCreateMaster {
    type: typeof TOGGLE_MASTER;
    payload: boolean;
}

interface UpdateMaster {
    type: typeof UPDATE_MASTER;
    payload: number;
}

interface ShowJournal {
    type: typeof TOGGLE_JOURNAL;
    payload: journalPayload;
}

interface FetchJouralAction {
    type: typeof FETCH_JOURNAL;
    payload: Journal
}

export type UiActions = ShowCreateMaster | UpdateMaster | ShowJournal | FetchJouralAction;

export const ToggleMaster = (show: boolean) => {
    return ({
        type: TOGGLE_MASTER,
        payload: show
    })
}

export const UpdateMaster = (cust_id: number) => {
    return (
        {
            type: UPDATE_MASTER,
            payload: cust_id
        }
    )
}

export const ToggleJournal = (show: boolean, valid: boolean, id: number): ShowJournal => {
    return ({
        type: TOGGLE_JOURNAL,
        payload: {
            show: show,
            valid: valid,
            id: id
        }
    })
}



export const FetchJournal = (
    journalID: number
): ThunkAction<void, AppState, null, Action<String>> => async dispatch => {
    const journal = await getJournal(journalID);
    console.log(journal);
    dispatch({
        type: FETCH_JOURNAL,
        payload: journal.data
    })
    dispatch(ToggleJournal(true, true, journalID));
}