import { UiActions, TOGGLE_MASTER, UPDATE_MASTER } from '../actions/uiActions';
interface UIState {
    masterToggle: boolean
    masterToUpdate: boolean
    masterCustID: number | undefined
}

const initialState: UIState = {
    masterToggle: false,
    masterToUpdate: false,
    masterCustID: undefined
}

export const UIReducer = (state = initialState, action: UiActions): UIState => {
    switch (action.type) {
        case TOGGLE_MASTER:
            return { ...state, masterToggle: action.payload, masterToUpdate: false }
        case UPDATE_MASTER:
            return { ...state, masterToggle: true, masterToUpdate: true, masterCustID: action.payload }
        default:
            return state
    }
};