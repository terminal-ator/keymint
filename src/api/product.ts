import {ax} from "./base";
import {Product, Sku} from "../components/ProductFormV2";
import {AuthHeader} from "./auth";

export const CreateSku = (sku: Sku)=>{
    return ax.post("/product/sku", sku, { headers: AuthHeader() } )
}

export const CreateProduct = (product: Product) =>{
    return ax.post("/product/product", product, { headers: AuthHeader() })
}

export const CreateProductCompany = (company: string) => {
    return ax.post(`/product/company/${company}`,{}, { headers: AuthHeader()})
}