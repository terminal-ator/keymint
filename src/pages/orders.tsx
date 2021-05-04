import React from 'react';
import {PageDiv} from "../components/styledComp";
import Nav from "../components/nav";
import OrderList from "../components/orderList";
import OrderView from "../components/orderView";

const OrderPage = ()=>{
  return <PageDiv>
    <Nav />
    <OrderView />
  </PageDiv>
};

export default OrderPage;