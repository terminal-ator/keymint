import React, {useState} from 'react';
import Nav from "../components/nav";
import {PageDiv} from "../components/styledComp";
import ProductComponent from "../components/productComponent";
import SkuDetailComponent from "../components/skuDetailComponent";
import styled from "styled-components";
import SkuList from "../components/SkuList";
import {useDispatch} from "react-redux";
import {ToggleProduct} from "../actions/uiActions";
import {SkuFromServer} from "../components/ProductFormV2";

const Container = styled.div`
  display: grid;
  grid-template-columns: 400px auto;
`;


const ProductPage = ()=>{
  const [ productID, setProductID ]  = useState("");
  const dispatch = useDispatch();
  const selectProduct = ( productID: string) =>{
    setProductID(productID);
  };

  const handleProduct = (sku: SkuFromServer)=>{
    console.log({ sku })
    dispatch(ToggleProduct(true,sku))
  }

  
  return(<PageDiv>
    <Nav/>
    <h1>Products</h1>
    <Container>
    {/*<ProductComponent handleProductSelect={selectProduct} />*/}
    {/*<SkuDetailComponent product_id={productID}/>*/}
    <SkuList handleEnter={handleProduct}/>
    </Container>
  </PageDiv>)
};

export default ProductPage;

