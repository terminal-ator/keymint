import React, {useState} from 'react';
import Nav from "../components/nav";
import {PageDiv} from "../components/styledComp";
import ProductComponent from "../components/productComponent";
import SkuDetailComponent from "../components/skuDetailComponent";
import styled from "styled-components";

const Container = styled.div`
  display: grid;
  grid-template-columns: 400px auto;
`;


const ProductPage = ()=>{
  
  const [ productID, setProductID ]  = useState("");

  const selectProduct = ( productID: string) =>{
    setProductID(productID);
  };

  
  return(<PageDiv>
    <Nav/>
    <h1>Products</h1>
    <Container>
    <ProductComponent handleProductSelect={selectProduct} />
    <SkuDetailComponent product_id={productID}/>
    </Container>
  </PageDiv>)
};

export default ProductPage;

