import {SystemState} from "../reducers/systemReducer";
import {NormalizedCache, normalize} from "../types/generic";
import {Company} from "../types/company";
import {ThunkAction} from "redux-thunk";
import {AppState} from "../reducers";
import {Action} from "redux";
import {getCompanies} from "../api";
import {LOADING_END, LOADING_START} from "./uiActions";
import {GeneralResponse} from "../types/response";
import {AxiosResponse} from "axios";
import {message} from "antd";
import {SelectCompanyApi} from "../api/companies";

export const SELECT_COMPANY = `SELECT_COMPANY`;
export const SAVE_COMPANIES = `SAVE_COMPANIES`;

interface SelectCompanyAction {
    type: typeof SELECT_COMPANY;
    payload: number;
}

interface SaveCompaniesAction {
    type: typeof SAVE_COMPANIES;
    payload: NormalizedCache<Company>;
}

export type SystemActionType = SelectCompanyAction | SaveCompaniesAction;

export const GetCompanies = (): ThunkAction<void,
    AppState,
    null,
    Action<String>> => async dispatch => {
    const companiesData = await getCompanies();
    dispatch({
        type: SAVE_COMPANIES,
        payload: normalize<Company>(companiesData)
    });
};

export const SelectCompany = (id: number): ThunkAction<void, AppState, null, Action<String>> => async dispatch => {
    await localStorage.setItem('company', id.toString());

    try {
        dispatch({type: LOADING_START});
        const response: AxiosResponse<GeneralResponse<string>> = await SelectCompanyApi(id);
        if (response.status === 200 && response.data.data) {
            await localStorage.setItem("token", response.data.data)
        }else{
            console.log("Failed to fetch company detail.");
        }
    } catch (e) {
        message.error("Failed to connect to server, please try")
    } finally {
        dispatch({type: LOADING_END});
    }
        dispatch({
        type: SELECT_COMPANY,
        payload: id
    })
};


export const oldSelectCompany = (id: number) => ({
    type: SELECT_COMPANY,
    payload: id
});
