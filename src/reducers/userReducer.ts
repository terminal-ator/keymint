import {UserActions} from "../actions/userActions";

interface UserState {
    token: string
    isLoggedIn: boolean
}

const initialState: UserState = {
    token: "",
    isLoggedIn: false
}

export const UserReducer = (
    state = initialState,
    action: UserActions
) => {
    switch (action.type) {
        case "LOGIN_USER":
            return {...state, token:action.payload, isLoggedIn: true}
        case "LOGOUT_USER":
            return { ...state, token: "", isLoggedIn: false}
        default:
            return state;
    }
};