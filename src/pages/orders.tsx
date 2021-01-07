import React from 'react';
import {PageDiv} from "../components/styledComp";
import Nav from "../components/nav";
import OrderList from "../components/orderList";

const OrderPage = ()=>{
  return <PageDiv>
    <Nav />
    <h1>Orders</h1>
    <OrderList />
  </PageDiv>
};

export default OrderPage;