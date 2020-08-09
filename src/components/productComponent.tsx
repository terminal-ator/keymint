import React from "react";
import { gql } from "apollo-boost";
import { stateSelector } from "../reducers";
import { useQuery } from "@apollo/react-hooks";
import {normalize, normalize_id, RenderItemProps} from "../types/generic";
import KeyList from "./keylist";
import KeyList2 from "./KeyList2";

const FETCH_PRODUCTS = gql`
  query products($companyID: Int) {
    getProducts(companyID: $companyID){
      _id
      name
    }
  }
`;

interface Product {
  _id: string;
  name: string;
}

interface query {
    getProducts: Product[]
}

interface Props{
  handleProductSelect(id: string): void
}

const ProductComponent = (props: Props) => {
  const companyID = stateSelector(stt => stt.sys.SelectedCompany);
  const { handleProductSelect } = props;
  const { data, loading, error } = useQuery<query>(FETCH_PRODUCTS, {
    variables: { companyID: companyID }
  });

  if (loading) return <div>Loading</div>;
  if (error) return <div>Error while fetching, please refresh</div>;
  if(data){
    console.log(data);
   const products = normalize_id(data.getProducts);
    return (<div>
      <KeyList2 cursor={0} data={products} renderItem={(arg:RenderItemProps<Product>)=><div>{arg.item.name}</div>}
                columns={["Names"]} rowHeight={10} numberOfRows={20} maxHeight={100}
                handleEnter={handleProductSelect}
      />
    </div>)
  }
  return <div>Please refresh</div>
};

export default ProductComponent;
