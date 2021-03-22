import {ThunkAction} from "redux-thunk";
import {AppState} from "../reducers";
import {Action} from "redux";
import {SignInUserApi} from "../api/auth";
import {AxiosResponse} from "axios";
import {message} from "antd";
import {LOADING_END, LOADING_START} from "./uiActions";
import { SignUpUserApi } from '../api/auth';

export const INVALID_PASSWORD = 'INVALID_REQ';
export const USER_EXIST = 'USER_EXIST';
export const LOGIN_USER = 'LOGIN_USER';
export const LOGOUT_USER = 'LOGOUT_USER';


interface SignInUpInterface {
    message: string;
    code: string;
    token?: string;
}

interface LOGIN_USER{
    type: typeof LOGIN_USER;
    payload: string;
}

interface LogoutUser {
    type: typeof LOGOUT_USER;
}

export type UserActions = LOGIN_USER | LogoutUser;

export const SignInUser = (username:string, password:string): ThunkAction<void, AppState, any, Action<String>> => async dispatch=>{
    await dispatch({type: LOADING_START})
    try{
        const res: AxiosResponse<SignInUpInterface> = await SignInUserApi(username, password)
        await dispatch({ type: LOADING_END })
        if(res.status===200 && res.data.token){

            message.success("Login successful, redirecting")
            await dispatch({ type: LOGIN_USER, payload: res.data.token })
            localStorage.setItem("token",res.data.token);
        }else{
            message.error("No login data found, retry")
            return
        }
    }catch (e) {
        message.error("No user found.");
        await dispatch({ type: LOADING_END });
    }finally {
        dispatch({ type: LOADING_END })
    }
    await dispatch({ type: LOADING_END });
}

export const SignUpUser = (username:string, password:string): ThunkAction<void, AppState, any, Action<String>> => async dispatch =>{
    await dispatch({ type: LOADING_START })
    try{
        const res: AxiosResponse<SignInUpInterface> = await SignUpUserApi(username, password);
        if(res.status===200 && res.data.token){
            message.success("Login successful, redirecting")
            await dispatch({ type: LOGIN_USER, payload: res.data.token })
            localStorage.setItem("token",res.data.token);
        }else{
            message.error("No login data found, retry")
            return
        }
    }catch(e){
        message.error("Unable to signup, a helpful message will be displayed in the future")
    }
    finally{
        await dispatch({ type: LOADING_END });
    }
}

export const LogOut = ()=>{
    localStorage.setItem("token", "")
    return {
        type: LOGIN_USER
    }
}



