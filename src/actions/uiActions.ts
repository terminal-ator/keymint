import { Journal } from "../types/ledger";
import { ThunkAction } from "redux-thunk";
import { getJournal } from "../api";
import { AppState } from "../reducers";
import { Action } from "redux";
import {Master} from "../types/master";
import {message} from "antd";

export const TOGGLE_MASTER = `TOGGLE_MASTER`;
export const UPDATE_MASTER = `UPDATE_MASTER`;
export const SHOW_MASTER_FORM = `SHOW_MASTER_FORM`;

export const TOGGLE_JOURNAL = `TOGGLE_JOURNAL`;
export const FETCH_JOURNAL = `FETCH_JOURNAL`;
export const TOGGLE_PRODUCT = `TOGGLE_PRODUCT`;
export const UPDATE_JOURNAL = `UPDATE_JOURNAL`;
export const LOADING_START = `LOADING_START`;
export const LOADING_END = `LOADING_END`;

interface journalPayload {
    show: boolean
    valid: boolean
    id: number;
    onComplete?: ()=>void;
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

interface ShowMasterForm {
    type: typeof SHOW_MASTER_FORM;
    show: boolean;
    master: Master | undefined;
}

interface ShowProduct {
    type: typeof TOGGLE_PRODUCT;
    payload: boolean;
    product_id?: string | null
}

interface LoadingStart{
    type: typeof LOADING_START;
}

interface LoadingEnd {
    type: typeof LOADING_END;
}

export type UiActions =  ShowProduct|ShowCreateMaster | UpdateMaster
    | ShowJournal | FetchJouralAction  | ShowMasterForm | LoadingStart | LoadingEnd ;

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

export const ToggleMasterForm = (show: boolean, master: Master | undefined):ShowMasterForm => {
    return({
        type: SHOW_MASTER_FORM,
        show,
        master
    });
}

export const ToggleJournal = (show: boolean, valid: boolean, id: number, onComplete: (() => void) | undefined): ShowJournal => {
    return ({
        type: TOGGLE_JOURNAL,
        payload: {
            show: show,
            valid: valid,
            id: id,
            onComplete: onComplete
        }
    })
}

export const ToggleProduct = (show: boolean, product_id?: string | null): ShowProduct =>{
    return ({
        type: TOGGLE_PRODUCT,
        payload: show,
        product_id
    })
};



export const FetchJournal = (
    journalID: number,
    onComplete?: ()=>void
): ThunkAction<void, AppState, null, Action<String>> => async dispatch => {

    dispatch({
        type: LOADING_START
    });
    try{
        const journal = await getJournal(journalID);
        console.log(journal);
        dispatch({
            type: FETCH_JOURNAL,
            payload: journal.data
        });
    }catch (e) {
        message.error("Failed to connect, please retry")
    }finally {
        dispatch({
            type: LOADING_END
        })
        dispatch(ToggleJournal(true, true, journalID, onComplete));
    }
}