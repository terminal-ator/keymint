import {Company} from "../types/company";
import useSwr from 'swr';
import {fetcher} from "../api/base";
interface AllCompanies {
    companies: Company[];
}


export const useCompanies = (): [ AllCompanies | undefined, any, any ]=>{
    const { data, error } = useSwr<AllCompanies>("/company/all", fetcher);
    return [ data, !data, error ]
}