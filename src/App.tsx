import React from "react";
import logo from "./logo.svg";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import { Provider } from "react-redux";
import CReducer from "./reducers";
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
  uri: "http://192.168.0.116:4000"
});

/* eslint-enable */
const App: React.FC = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ApolloProvider client={client}>
          <Router>
            <Route exact path="/" component={Index} />
            <Route path="/menu" component={menu} />
            <Route path="/stmt/:id" component={STMT} />
            <Route path="/banks" component={Bank} />
            <Route path="/sales" component={SalesImportPage} />
            <Route path="/receipt" component={receipt} />
            <Route path="/ledgers" component={LedgerPage} />
            <Route path="/master" component={MasterForm} />
            <Route path="/errors" component={Errors} />
          </Router>
        </ApolloProvider>
      </PersistGate>
    </Provider>
  );
};

export default App;
