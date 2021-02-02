import React from "react";
import { Route, Redirect } from "react-router-dom";
import {IsLoggedIn} from "../api/auth";
import {stateSelector} from "../reducers";


// @ts-ignore
const AuthRoute = ({ component: Component , ...rest}) =>{

    // const isloggedIn = stateSelector(stt => stt.user.isLoggedIn);

    return <Route {...rest} render={(props)=>
        IsLoggedIn() ?<Component {...props} />:
            <Redirect to={{ pathname:"/login"}} />
    } />
}

export default AuthRoute;