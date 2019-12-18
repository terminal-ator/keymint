import React from "react";
import logo from "./logo.svg";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import { Provider } from "react-redux";
import CReducer from "./reducers";
import "./App.css";
import Index from "./pages";
import { composeWithDevTools } from "redux-devtools-extension";
import STMT from "./pages/stmt";
import menu from "./pages/menu";
import Bank from "./pages/bank";

/* eslint-disable no-underscore-dangle */
const store = createStore(
  CReducer,
  composeWithDevTools(applyMiddleware(thunk))
);
/* eslint-enable */
const App: React.FC = () => {
  return (
    <Provider store={store}>
      <Router>
        <Route exact path="/" component={Index} />
        <Route path="/menu" component={menu} />
        <Route path="/stmt/:id" component={STMT} />
        <Route path="/banks" component={Bank} />
      </Router>
    </Provider>
  );
};

export default App;
