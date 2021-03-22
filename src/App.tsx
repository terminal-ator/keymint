import React from "react";
import logo from "./logo.svg";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import { Provider } from "react-redux";
import CReducer, { stateSelector } from "./reducers";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import Index from "./pages";
import { composeWithDevTools } from "redux-devtools-extension";
import STMT from "./pages/stmt";
import menu from "./pages/menu";
import Bank from "./pages/bank";
import SalesImportPage from "./pages/sales";
import receipt from "./pages/receipt";
import LedgerPage from "./pages/ledger";
import { PersistGate } from "redux-persist/integration/react";
import MasterForm from "./components/master";
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "@apollo/react-hooks";
import Errors from "./pages/errors";
import './App.css';
import Master from './components/master';

import 'antd/dist/antd.css';
import { Modal } from "antd";
import Glob from "./Glob";
import JournalPage from "./pages/journal";
import ImportStatementPage from "./pages/importStatement";
import YearPage from "./pages/year";
import ChequePage from "./pages/cheque";
import DayBook from "./pages/daybook";
import PendingPage from "./pages/pending";
import ProductPage from "./pages/products";
import OrderPage from "./pages/orders";
import LoginPage from "./pages/login";
import AuthRoute from "./components/AuthRoute";
import SignUpPage from "./pages/signup";
import ApprovalPage from "./pages/approval";

const persistConfig = {
  key: "root",
  storage
};

const perReducer = persistReducer(persistConfig, CReducer);
/* eslint-disable no-underscore-dangle */
const store = createStore(
  perReducer,
  composeWithDevTools(applyMiddleware(thunk))
);
let persistor = persistStore(store);

const client = new ApolloClient({
  uri: "http://localhost:4000",
});

/* eslint-enable */
const App: React.FC = () => {

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ApolloProvider client={client}>
          <Router>
            <AuthRoute exact path="/" component={Index} />
            <AuthRoute path="/menu" component={menu} />
            <AuthRoute path="/stmt/:id" component={STMT} />
            <AuthRoute path="/banks" component={Bank} />
            <AuthRoute path="/sales" component={SalesImportPage} />
            <AuthRoute path="/ledgers" component={LedgerPage} />
            <AuthRoute path="/master" component={MasterForm} />
            <AuthRoute path="/errors" component={Errors} />
            <AuthRoute path="/journal" component={JournalPage} />
            <AuthRoute path="/years" component={YearPage} />
            <AuthRoute path={'/imrstat'} component={ImportStatementPage} />
            <AuthRoute path={"/receipt"} component={ChequePage} />
            <AuthRoute path={"/daybook"} component={DayBook} />
            <AuthRoute path={"/pending"} component={PendingPage} />
            <AuthRoute path={"/products"} component={ProductPage} />
            <AuthRoute path={"/orders"} component={OrderPage} />
            <Route path={"/login"} component={LoginPage} />
            <Route path={"/signup"} component={SignUpPage} />
            <Route path={"/approvals"} component={ApprovalPage} />
          <Glob />
          </Router>
        </ApolloProvider>
      </PersistGate>
    </Provider>
  );
};

export default App;
