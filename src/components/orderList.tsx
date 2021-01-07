import React, {useState} from 'react';
import {gql} from "apollo-boost";
import {Product} from "./ProductForm";
import {useQuery} from "@apollo/react-hooks";
import {stateSelector} from "../reducers";

interface Cart{
  _id : string;
  user_id: string;
  user: {
    _id: string,
    name: string
  },
  products: Product[]
}

interface Orders {
  getCarts: Cart[]
}

interface Order {
  getCartFromConsole: Cart
}

const FETCH_ORDERS = gql`
  query fetchCarts($input:Int!){
    getCarts(assoc_company: $input){
      _id
      user{
        _id
        name
      }
    }
  }
`;

const FETCH_ORDER = gql`
  query fetchOrder($input: String!){
    getCartFromConsole(cartID: $input){
      _id
      user{
        _id
        name
      }
      products{
        _id
        name
        skus{
          code
          name
          quantity
        }
      }
    }
  }
`;

interface OrderDetailProps {
  cart_id: string;
  handleSave?(): void
}

const OrderDetail = ( props: OrderDetailProps)=>{
  const { cart_id, handleSave } = props;
  const { data, loading, error }= useQuery<Order>(FETCH_ORDER, { variables: { input: cart_id }});

  if(loading){
    return <div>Loading</div>
  }

  if(error){
    return <div>Refresh the page { error.message } </div>
  }
    return <div >
      <p>{
         data?.getCartFromConsole.user.name
      }</p>
      <ul style={{ maxHeight: 600, overflowY:"scroll"}}>
        {
          data?.getCartFromConsole.products.map((product)=><li key={product._id}>
            {product.name}
            <ul>
            {

              product.skus.map((sku)=><li key={product._id+ sku.code}>
                <span>
                  { sku.name}
                </span>
                <span style={{ backgroundColor: "#3e21f2", padding: 2, borderRadius: 4, marginLeft: 5, minWidth: 10, width: 10, color: "white" }}>
                  {sku.quantity}
                </span>
              </li>)
            }
            </ul>
          </li>)
        }
      </ul>
    </div>
};

const OrderList = ()=>{
  const companyID = stateSelector(stt => stt.sys.SelectedCompany);
  const [ selectedOrder, setSelectedOrder ] = useState("");
  const { data, loading, error, refetch } = useQuery<Orders>(FETCH_ORDERS, { variables: { input : companyID }});

  if(loading){
    return <div>Loading</div>
  }

  if (error){
    return <div>Please refresh { error?.message }</div>
  }

  return(
    <div style={{ display: 'grid', gridTemplateColumns: "300px auto"}}>
      <div>
        <ul>
          {
            data?.getCarts.map((cart)=><li key={cart._id}>
              <a onClick={()=>{setSelectedOrder(cart._id)}} >{cart?.user?.name}</a>
            </li>)
          }
        </ul>
      </div>
      <div>
        {
          selectedOrder == "" ? <div> <h3 style={{ color: "white"}}>Selected an order to view</h3> </div>: <OrderDetail cart_id={selectedOrder} />
        }
      </div>
    </div>
  )
};

export default OrderList;