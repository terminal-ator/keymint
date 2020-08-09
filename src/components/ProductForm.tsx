import React, {useEffect} from "react";
import {stateSelector} from "../reducers";
import {useState} from "react";
import {Input, message} from "antd";
import {Button, TextField , Select, MenuItem } from "@material-ui/core";
import dotPropImmutable from "dot-prop-immutable";
import {gql} from "apollo-boost";
import {useMutation, useQuery} from "@apollo/react-hooks";


export interface Product {
  _id?: string;
  name: string;
  hsn:string;
  assoc_company: number;
  cgstRate?: number | undefined;
  sgstRate?: number | undefined;
  igstRate?: number | undefined;
  cessRate?: number | undefined;
  unit: string;
  company: string;
  skus: Sku[];
}

interface productCompany {
  _id: string;
  name: string;
}

export interface Sku {
  code: string;
  name: string;
  caseUnits?: number;
  outerUnits?: number;
  purRate?:number;
  mrp?: number;
  saleRates: number[];
}

interface skuProps {
  sku: Sku;
  idx: number;
  cgstRate?: number;
  sgstRate?: number;
  handleUpdate(arg0:number, arg1:string, arg3: string|number):void;
  addSales(idx:number):void;
  handleRates(idx:number, arrayIndex:number, value:number):void;
}


const POST_PRODUCT = gql`
   mutation create($input: CProductI){
    createProduct(input: $input){
      code
      message
    }
   }
`;

const FETCH_PRO_COMPANY = gql`
  query($input: Int!){
    getProductCompanies(companyID : $input){
      _id
      name
    }
  }
`;

const POST_COMPANY = gql`
  mutation create($input:PCInput!){
     createProductCompany(input: $input){
      code
      message
     }
  }
`;

interface pcQuery {
  getProductCompanies : productCompany[]
};
const FETCH_PRODUCT = gql`
  query Product($productID: String!){
    getProduct(productID: $productID){
      _id
      name
      hsn
      cgstRate
      sgstRate
      igstRate
      cessRate
      unit
      company
      skus{
        code
        name
        caseUnits
        outerUnits
        mrp
        saleRates
        purRate
      }
    }
  }
`;

interface query {
  getProduct: Product
}

interface compMutation {
  createProductCompany: {
    code : number;
    message: string;
  }
}

const SkuForm = (props:skuProps)=>{

  const { sku, idx, handleUpdate, addSales, handleRates, cgstRate, sgstRate } = props;

  return <div
      style={{marginTop: 12, borderBottom:"1px solid black", padding: 15, paddingLeft:10, paddingRight: 10}}
  > <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
      <TextField label={"Code"} value={sku.code} onChange={(e)=>
      {handleUpdate(idx, "code", e.target.value)}}
      />
      <TextField
        label={"Sku Name"}
        value={sku.name}
        onChange={(e)=>{ handleUpdate(idx, "name",e.target.value)}}
      />
      <TextField label={"MRP"} value={sku.mrp} type={"number"}
                 onChange={(e)=>{handleUpdate(idx,"mrp",parseFloat(e.target.value))}} />
      <TextField label={"Purchase Rate"} value={sku.purRate}
                 type={"number"}
                 onChange={(e)=>{ handleUpdate(idx,"purRate",parseFloat(e.target.value)) }}
      />
      <TextField label={"Case Units"} value={sku.caseUnits} type={"number"}  onChange={(e)=>{

            handleUpdate(idx,"caseUnits", parseFloat(e.target.value));
          }
      }/>
      <TextField label={"Outer Units"} value={sku.outerUnits}
                 type={"number"}
                 onChange={(e)=>{handleUpdate(idx,"outerUnits",parseFloat(e.target.value))}}
      />

  </div>
      <div>
        <div style={{ display: "flex", flexDirection:"row", marginTop: 10}}>
          {
            sku.saleRates.map((rate, id)=><TextField
              type={"number"} key={id} defaultValue={rate}
              label={`Sale Rate ${id+1}`}
              onBlur={(e)=>{
               handleRates(idx, id, parseFloat(e.target.value));
              }}
            />)
          }
          <Button onClick={()=>{addSales(idx);}}>+</Button>
          <Button>-</Button>
        </div>
      </div>
    <div>
      Rates After Tax
      <p> Purchase: { sku.purRate && cgstRate && sgstRate && sku.purRate+ sku.purRate*((cgstRate+sgstRate)/100) } </p>
      <p>
        Sale:
          <ul style={{ display: "inline", listStyle:"none"}}>
            { sku.saleRates.map((sale, index)=><li> {index+1}. { cgstRate && sgstRate && sale + sale*((cgstRate+sgstRate)/100) }</li>)}
          </ul>
      </p>
    </div>
  </div>
};

interface CompanyProps {
  createProduct(name:string): void;
}

const CreateCompany = (props:CompanyProps)=>{
  const { createProduct } = props;
  const [ show, setShow ] = useState(false);
  const [ name, setName ] = useState("");
  if(!show) return <div style={{ marginLeft: 10}}><Button onClick={()=>{ setShow(true)}}>+Company</Button></div>;
  return <div style={{ marginLeft: 10 , display: "flex", flexDirection:"row", alignContent:"center"} }>
    <TextField label={"Company name"} value={name} onChange={e=>{ setName(e.target.value) }} />
    <Button onClick={()=> { setShow(false);  setName(""); createProduct(name);  }}>OK</Button>
  </div>;
};

const ProductForm = ()=>{

  const companyID = stateSelector( stt => stt.sys.SelectedCompany);
  const product_id  = stateSelector(stt=>stt.ui.product_id);
  const [ postProduct, { data, error }  ]  = useMutation(POST_PRODUCT);
  const [ createProductCompany, {}]  = useMutation(POST_COMPANY);
  const { data : queryData, loading, refetch} = useQuery<pcQuery>(FETCH_PRO_COMPANY, { variables : { input: companyID }});
  const { data: productData} = useQuery<query>(FETCH_PRODUCT, { variables: { productID: product_id }});

  useEffect(()=>{
    if(data && data.createProduct?.code == 200){
      message.success("Successfully created a product");
    }
  }, [data]);

  const createCompany = async (name: string)=>{
    const input = { name, assoc_company: companyID };
    await createProductCompany({ variables: { input }});
    await refetch();
  };
  const newSku: Sku = {
    code: "",
    name:"",
    saleRates:[
      0.0
    ]
  };

  const defaultProduct:Product = {
    name: "",
    hsn: "",
    assoc_company: companyID,
    company: "",
    unit: "",
    skus: [
    newSku
    ]
  };

  const [ product, setProduct ] = useState(defaultProduct);

  useEffect(()=>{
    if(productData){
      setProduct(productData?.getProduct);
      console.log(productData?.getProduct);
    }
  }, [ productData ]);


  if(error)return (<div>{ error?.message }</div>);

  const updateProduct = (fieldName: string, value: string | number)=>{
    const newProduct = dotPropImmutable.set(product, `${fieldName}`, value);
    setProduct(newProduct);
  }
  
  const updateSku = (index: number,fieldName: string, value: string|number)=>{
      const newProduct = dotPropImmutable.set(product,`skus.${index}.${fieldName}`,value);
      //console.log({ newProduct });
      setProduct(newProduct);
  };

  const addSaleRates = (index: number)=>{
    const newProduct = dotPropImmutable.set(product, `skus.${index}.saleRates`, (list: Array<number>)=>[...list,0]);
    setProduct(newProduct);
  }

  const handleSales = (index:number, listIndex:number, value:number)=>{
    const newProduct = dotPropImmutable.set(product, `skus.${index}.saleRates.${listIndex}`, value);
    setProduct(newProduct);
  }

  const addSku = ()=>{
    const newProduct = dotPropImmutable.set( product, `skus`, (list: Array<Sku>)=>[...list, newSku ]);
    setProduct(newProduct);
  };

  return <div>
    <TextField variant={"outlined"}
               style={{ width: "60%"}}
               label={"Name of Product"}
               value={product.name}
               onChange={(e)=>{updateProduct('name', e.target.value)}}
    />
    <div style={{ marginTop: 10, display: "flex", flexDirection: "row" }}>
      <Select style={{ minWidth: 120 }}
              label={"Company"}
              value={product.company}
              onChange={(e)=>{const n = dotPropImmutable.set(product,`company`, e.target.value); setProduct(n);}}
      >
        <MenuItem value={""} disabled>Company</MenuItem>
      {
        queryData && queryData.getProductCompanies?.map((company:productCompany)=>
          <MenuItem key={company._id} value={company._id}>{company.name}</MenuItem>
        )
      }
    </Select>
      <CreateCompany createProduct={createCompany} />
    </div>
    <div
      style={{ marginTop:10, display : "flex", flexDirection: "row", justifyContent:"flex-start"}}>

    <TextField
      onChange={(e)=>{updateProduct('hsn', e.target.value)}}
      size={"small"} variant={"outlined"} value={product.hsn} label={"HSN Code"} />
    <TextField
      onChange={(e)=>{updateProduct('unit', e.target.value)}}
      size={"small"} variant={"outlined"} value={product.unit} label={"Unit"} />
    </div>
    <div style={{ marginTop: 8, display : "flex", flexDirection: "row", justifyContent:"flex-start"}}>
     <TextField
       onChange={(e)=>{updateProduct('sgstRate', parseFloat(e.target.value))}}
       type={"number"} size={"small"} variant={"outlined"} value={product.sgstRate} label={"SGST Rate"} />
      <TextField
        onChange={(e)=>{updateProduct('cgstRate', parseFloat(e.target.value))}}
        type={"number"} size={"small"} variant={"outlined"} value={product.cgstRate} label={"CGST Rate"} />
      <TextField
        onChange={(e)=>{updateProduct('igstRate', parseFloat(e.target.value))}}
        type={"number"} size={"small"} variant={"outlined"} value={product.igstRate} label={"IGST Rate"} />
    </div>
    <div style={{ marginTop: 10 }}>
      <h4>Skus</h4>
      {
        product.skus.map((sku, index)=>
          <SkuForm sku={sku} key={sku.code}
                   idx={index} handleUpdate={updateSku}
                   cgstRate={product.cgstRate}
                   sgstRate={product.sgstRate}
                   addSales={addSaleRates}
                   handleRates={handleSales}
          />)
      }
      <br />
      <div>
        <Button variant={"contained"} color={"secondary"} onClick={()=>{ addSku() }}>Add</Button>
        <Button variant={"outlined"} color={"default"} onClick={async ()=>{
          // console.log( JSON.stringify(product));
          localStorage.setItem("product", JSON.stringify(product));
          try{
            const res = await postProduct({ variables: { input : product  }});
            message.success("Successful");
            setProduct(defaultProduct);
          }catch (e) {
            message.error("Failed, please try again")
          }finally {
          }
          // alert(JSON.stringify(product));
        }}>Save</Button>
      </div>
    </div>
  </div>

};


export default ProductForm;