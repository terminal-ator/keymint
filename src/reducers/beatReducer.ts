import { Beat, BeatActions, FETCH_BEAT } from "../actions/beatActions";
import { NormalizedCache } from "../types/generic";

export interface BeatState  {
    beats: NormalizedCache<Beat> | undefined
}

const initialState : BeatState = {
    beats : undefined
}

export const BeatReducer = (
    state = initialState,
    action: BeatActions
): BeatState =>{
    switch(action.type){
        case FETCH_BEAT:
            return {...state, beats: action.payload}
        default:
            return state;
    }
}