import axios from "axios";
import {AuthHeader} from "./auth";

export const ax = axios.create({
    baseURL: "/api",
});

export const fetcher = <T>(url:string) => ax.get<T>(url, { headers: AuthHeader()}).then(res=>res.data);

