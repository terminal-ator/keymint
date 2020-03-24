import { UiActions, TOGGLE_MASTER, UPDATE_MASTER, TOGGLE_JOURNAL, FETCH_JOURNAL } from '../actions/uiActions';
import { Journal } from '../types/ledger';
interface UIState {
    masterToggle: boolean
    masterToUpdate: boolean
    masterCustID: number | undefined
    journalToggle: boolean
    journalID: {
        valid: boolean;
        id: number;
    }
    journal: Journal | undefined
}

const initialState: UIState = {
    masterToggle: false,
    masterToUpdate: false,
    masterCustID: undefined,
    journalToggle: false,
    journalID: {
        valid: false,
        id: 0
    },
    journal: undefined
}

export const UIReducer = (state = initialState, action: UiActions): UIState => {
    switch (action.type) {
        case TOGGLE_MASTER:
            return { ...state, masterToggle: action.payload, masterToUpdate: false }
        case UPDATE_MASTER:
            return { ...state, masterToggle: true, masterToUpdate: true, masterCustID: action.payload }
        case TOGGLE_JOURNAL:
            return { ...state, journalToggle: action.payload.show, journalID: { valid: action.payload.valid, id: action.payload.id } }
        case FETCH_JOURNAL:
            return { ...state, journal: action.payload }
        default:
            return state
    }
};