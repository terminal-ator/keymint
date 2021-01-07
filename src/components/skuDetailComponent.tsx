import React from 'react';
import {gql} from "apollo-boost";
import {Product} from "./ProductForm";
import {useQuery} from "@apollo/react-hooks";
import {Button} from "@material-ui/core";
import {useDispatch} from "react-redux";
import {ToggleProduct} from "../actions/uiActions";

interface Props {
  product_id: string;
}

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
      skus{
        code
        name
        caseUnits
        outerUnits
        mrp
        saleRates
      }
    }
  }
`;

interface query {
  getProduct: Product
}

const SkuDetailComponent = (props:Props)=>{
  const dispatch = useDispatch();
   const { product_id } = props;
   const { data, loading } = useQuery<query>(FETCH_PRODUCT, { variables: { productID: product_id }});
   if(loading){
     return <div>
        Loading....
     </div>
   }
   if(data){
    return <div>
        <h2 >{data?.getProduct.name}</h2>
        <Button onClick={()=>{ dispatch(ToggleProduct(true,product_id))}} variant={"contained"}>Edit</Button>
        <ul>
          {
            data?.getProduct.skus.map((sku)=><li key={sku.code}>{sku.name}</li>)
          }
        </ul>
        </div>;

   }
   return <div>Select a valid product</div>
};

export default SkuDetailComponent;