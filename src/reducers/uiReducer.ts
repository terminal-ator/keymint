import {
    FETCH_JOURNAL,
    SET_END_DATE,
    SET_START_DATE,
    TOGGLE_JOURNAL,
    TOGGLE_MASTER,
    TOGGLE_PRODUCT,
    UiActions,
    UPDATE_MASTER
} from '../actions/uiActions';
import {Journal} from '../types/ledger';
import {Master} from "../types/master";
import {SkuFromServer} from "../components/ProductFormV2";

interface UIState {
    masterToggle: boolean
    masterToUpdate: boolean
    masterCustID: number | undefined
    journalToggle: boolean
    journalID: {
        valid: boolean;
        id: number;
    }
    journal: Journal | undefined,
    masterFormToggle: boolean,
    master: Master | undefined,
    productToggle: boolean
    product_id?: string | null,
    loading: boolean
    start_date: string
    end_date: string
    sku: SkuFromServer | null

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
    journal: undefined,
    masterFormToggle: false,
    master: undefined,
    productToggle: false,
    loading:false,
    start_date: "",
    end_date:"",
    sku: null

};

export const UIReducer = (state = initialState, action: UiActions): UIState => {
    switch (action.type) {
        case TOGGLE_MASTER:
            return { ...state, masterToggle: action.payload, masterToUpdate: false }
        case UPDATE_MASTER:
            return { ...state, masterToggle: true, masterToUpdate: true, masterCustID: action.payload }
        case TOGGLE_JOURNAL:
            return { ...state, journalToggle: action.payload.show, journalID: { valid: action.payload.valid, id: action.payload.id } }
        case FETCH_JOURNAL:
            return { ...state, journal: action.payload };
        case TOGGLE_PRODUCT:
            return { ...state, productToggle: action.payload,sku: action.sku};
        case "SHOW_MASTER_FORM":
            return { ...state, masterFormToggle: action.show, master: action.master }
        case "LOADING_START":
            return { ...state, loading:true}
        case "LOADING_END":
            return {...state, loading:false}
        case SET_START_DATE:
            return { ...state, start_date: action.payload }
        case SET_END_DATE:
            return { ... state, end_date: action.payload }
        default:
            return state
    }
};