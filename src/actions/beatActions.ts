import { NormalizedCache, normalize } from "../types/generic";
import { ThunkAction } from "redux-thunk";
import { AppState } from "../reducers";
import { Action } from "redux";
import { fetchBeats } from "../api";
import {LOADING_END, LOADING_START} from "./uiActions";
import {message} from "antd";


export interface Beat{
    id: number;
    name: string;
    addn1: string;
    addn2: string;
    companyid: number;
    short_name: string;
}


export const FETCH_BEAT = 'FETCH_BEAT';

interface fetchBeatAction {
    type: typeof FETCH_BEAT;
    payload: NormalizedCache<Beat>
}

export type BeatActions = fetchBeatAction;

export const FetchBeat = (
    companyID:number
): ThunkAction<void, AppState, null, Action<String>> => async dispatch =>{
    dispatch({ type: LOADING_START });
    try{
        const beats = await fetchBeats(companyID);
        console.log(beats)
        dispatch({
            type: FETCH_BEAT,
            payload: normalize<Beat>(beats.data)
        })
    }catch (e) {
        message.error("There was some error please try again.")
    }finally {
        dispatch({ type: LOADING_END });
    }

}