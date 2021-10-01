import {ax} from "./base";
import {Product, Sku, SkuFromServer} from "../components/ProductFormV2";
import {AuthHeader} from "./auth";
import {GeneralResponse} from "../types/response";

export const CreateSku = (sku: Sku)=>{
    return ax.post("/product/sku", sku, { headers: AuthHeader() } )
}

export const CreateProduct = (product: Product) =>{
    return ax.post("/product/product", product, { headers: AuthHeader() })
}

export const CreateProductCompany = (company: string) => {
    return ax.post(`/product/company/${company}`,{}, { headers: AuthHeader()})
}

export const FetchAllSku = ()=>{
    return ax.get(`/product/sku`)
}

export const FetchSkuByID = (skuID: number)=>{
    return ax.get<GeneralResponse<SkuFromServer>>(`/product/sku/${skuID}`)
}