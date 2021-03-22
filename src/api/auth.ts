import { AxiosResponse } from "axios";
import {ax} from "./base";

export const AuthHeader = ()=>{
    const token = localStorage.getItem("token")
    return {
        "Authorization": `Bearer ${token}`
    }
}

export const IsLoggedIn = ():boolean=>{
    const token = localStorage.getItem("token")
    return token!=="" && token != null
}

export const SignInUserApi = async (username: string, password: string)=>{
    return ax.post("/user/signin", { email: username, password })
}

export const SignUpUserApi = async (username: string, password: string)=>{
    return ax.post("/user/signup",{ email: username, password });
}

export const AuthenticatedGet = <T>(url:string)=> ax.get<T>(url, { headers: AuthHeader()}).then((res)=>res.data);