import React, {FC, useRef, useState} from 'react';
import {Button, Input, Modal, Select} from "antd";
import useSWR from "swr";
import {GeneralResponse} from "../types/response";
import {fetcher} from "../api/base";
import dotPropImmutable from "dot-prop-immutable";
import {TextField} from "@material-ui/core";
import {CreateProduct, CreateProductCompany, CreateSku} from "../api/product";
import {dark} from "@material-ui/core/styles/createPalette";
import QuickCreate from "./QuickCreate";

export interface Sku {
    id?: number;
    name: string;
    unit?: string;
    pur_rate?: number;
    rate?: number;
    igst?: number;
    cess?: number;
    product_id?: number;
}

export interface Product {
    id?: number;
    name: string;
    product_company_id?: number;
    company_id?: number;
}

export interface ProductCompany {
    id: number;
    name: string;
    company_id: number
}

const ProductFormV2 = () => {
    const [productState, setProductState] = useState("");
    type M = GeneralResponse<Array<Product>>
    const nameRef = useRef<HTMLInputElement>(null);
    const defaultSKU: Sku = {
        name: "",
        unit: "",
        rate: 0,
        igst: 0,
        cess: 0,
        pur_rate: 0,

    }
    const [sku, setSku] = useState(defaultSKU);
    const [loading, setLoading] = useState(false);
    const [createProduct, setCreateProduct] = useState(false);
    const {data: products, error, revalidate} = useSWR<M>("/product/product", fetcher)

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        setLoading(true);
        e.preventDefault()
        // set sku product id to sku.
        if (productState === "") {
            setLoading(false)
            return
        }
        const n: Sku = dotPropImmutable.set(sku, "product_id", parseInt(productState))
        console.log(n)

        // TODO submit the form to server
        try {
            await CreateSku(n)
            const newSku: Sku = {
                name: "",
                unit: sku.unit,
                rate: 0,
                pur_rate: 0,
                igst: sku.igst,
                cess: sku.cess,
            }
            setSku(newSku)

            // focus the name field
            if (nameRef && nameRef.current) {
                nameRef.current.focus()
            }
        } catch (e) {
            console.log("Failed to create sku, please retry")
        }
        // set loading as false
        setLoading(false);
    }

    const callBack = async ()=>{
        setCreateProduct(false);
        await revalidate()
    }

    return (
        <div style={{ maxWidth: "500px", margin:"0px auto"}}>
            <Modal visible={createProduct}
                   footer={null}
                   onCancel={() => {
                       setCreateProduct(false)
                   }}
            >
                <CompanyAndProduct callback={callBack}/>
            </Modal>
            <div>

                <form
                    style={{
                        display: "grid", gap: "12px",
                        maxWidth: "100%", gridTemplateColumns: "1fr 1fr"
                    }}
                    onSubmit={onSubmit}
                >
                    <Select showSearch
                            style={{gridColumn: "1/2"}}
                            filterOption={(input, option) =>
                                option?.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                            value={productState}
                            onChange={(e) => {
                                setProductState(e)
                            }} loading={!products}>
                        <Select.Option value={""} key={"x"}>
                            Product Name
                        </Select.Option>
                        {
                            products && products.data &&
                            products.data.map((prod) =>
                                <Select.Option value={prod.id?.toString()||"xxx"} key={prod.id?.toString()}>
                                    {prod.name}
                                </Select.Option>)
                        }
                    </Select>
                    <div>
                        <Button style={{ alignSelf: "center"}} type={"ghost"} size={"small"} onClick={() => {
                            setCreateProduct(true)
                        }}>Add a product</Button>
                    </div>
                    <TextField value={sku.name}
                               inputRef={nameRef}
                               style={{gridColumn: "1/3"}}
                               onChange={(e) => {
                                   const n = dotPropImmutable.set(sku, "name", e.target.value)
                                   setSku(n);
                               }}
                               variant={"filled"}
                               required
                               label={"Name of the Sku"}/>
                    <TextField label={"Unit"}
                               required
                               onChange={(e) => {
                                   const n = dotPropImmutable.set(sku, "unit", e.target.value)
                                   setSku(n);
                               }}
                               value={sku.unit}/>
                    <TextField required label={"Purchase Rate"} value={sku.pur_rate}
                               type={"number"}
                               onChange={(e) => {
                                   const val = parseFloat(e.target.value)
                                   const n = dotPropImmutable.set(sku, "pur_rate", val)
                                   setSku(n);
                               }}
                    />
                    <TextField type={"number"}
                               required
                               label={"Sale Rate"}
                               value={sku.rate}
                               onChange={(e) => {
                                   let val = parseFloat(e.target.value)
                                   let n = dotPropImmutable.set(sku, "rate", val)
                                   setSku(n);
                               }}
                    />
                    <TextField required
                               label={"IGST %"}
                               type={"number"}
                               value={sku.igst}
                               onChange={(e) => {
                                   let val = parseFloat(e.target.value)
                                   let n = dotPropImmutable.set(sku, "igst", val)
                                   setSku(n)
                               }}

                    />
                    <TextField type={"number"}
                               label={"Cess %"} value={sku.cess}
                               onChange={(e) => {
                                   let val = parseFloat(e.target.value)
                                   let n = dotPropImmutable.set(sku, "cess", val)
                                   setSku(n)
                               }}
                    />
                    <Button loading={loading} style={{gridColumn: "1/2"}} type={"primary"}
                            size={"large"}
                            htmlType={"submit"}>Save</Button></form>
            </div>
        </div>)
}

interface CompanyAndProductProps {
    callback(): void
}
const CompanyAndProduct:FC<CompanyAndProductProps> = ({ callback }) => {

    type M = GeneralResponse<Array<ProductCompany>>
    const {data: Companies, revalidate} = useSWR<M>("/product/companies", fetcher);
    const [ company, setCompany ] = useState(0);
    const [productName, setProductName] = useState("");

    const quickCreateCompany = async (name: string)=>{
        try{
            await CreateProductCompany(name)
            await revalidate()
        }catch (e) {
            console.log(e)
        }
    }

    const createProduct = async (e: React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault()
        if(company==0) return
        const product: Product = {
            name: productName,
            product_company_id: company
        }
        try{
            await CreateProduct(product)
            setProductName("");
            await callback()
        }catch (e) {
            console.log(e)
        }
    }

    return (
        <div style={{marginTop: 20}}>
            <h4>Create a product</h4>
            <form onSubmit={createProduct} style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px"}}>
                <div style={{display:"flex",gridColumn:"1/3"}}>
                    <Select value={company} onChange={(e)=>{setCompany(e)}} showSearch loading={!Companies} placeholder={"Select a Company Name"}>
                        <Select.Option value={0}>Select a company</Select.Option>
                        {
                            Companies && Companies.data?.map((com) =>
                                <Select.Option key={com.id} value={com.id}>{com.name}</Select.Option>)
                        }
                    </Select>
                    <div style={{ width: "100%"}}>
                    <QuickCreate onCreate={quickCreateCompany} placeholder={"Company name"}/>
                    </div>
                </div>
                <TextField value={productName} onChange={(e)=>{setProductName(e.target.value)}} style={{gridColumn: "1/3"}} variant={"outlined"} label={"Product Name"}/>
                <Button htmlType={"submit"}>Save</Button>
            </form>
        </div>
    )
}

export default ProductFormV2;