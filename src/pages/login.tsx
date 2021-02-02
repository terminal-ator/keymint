import React from 'react';
import {useEffect, useState} from "react";
import {PageDiv} from "../components/styledComp";
import {useDispatch} from "react-redux";
import {stateSelector} from "../reducers";
import { useHistory } from 'react-router-dom';
import {SignInUser} from "../actions/userActions";
import {Button, Input} from "antd";
import {IsLoggedIn} from "../api/auth";


const LoginPage = ()=>{
    const [ usr, setUsr ] = useState("");
    const [ pwd, setPwd ] = useState("");
    const dispatch = useDispatch();
    const isLoggedIn = stateSelector( stt => stt.user.isLoggedIn);
    const history = useHistory();

    useEffect(()=>{
        if(IsLoggedIn())
        history.push("/")
    }, [])

    const signIn = async (e: React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        await dispatch(SignInUser(usr, pwd))
        history.push("/")
    }

    return(
        <PageDiv>
            <div style={{ width: 600, position: "relative", top: 200, margin: "0px auto", boxShadow:"0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)", padding: 50}}>
                <h2>Login</h2>
                <form onSubmit={signIn}>
                    <Input style={{ marginTop: 10 }} placeholder={"Email"} value={usr} type={"email"} onChange={(e)=>{setUsr(e.target.value)}} />
                    <Input style={{ marginTop: 10 }}  placeholder={"Password"} value={pwd} type={"password"} onChange={(e)=>{setPwd(e.target.value)}} />
                    <button style={{ marginTop: 10 }}  type={"submit"}>Login</button>
                </form>
            </div>
        </PageDiv>
    )
}

export default LoginPage;