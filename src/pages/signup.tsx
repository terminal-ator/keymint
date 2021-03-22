import React from 'react';
import {useEffect, useState} from "react";
import {PageDiv} from "../components/styledComp";
import {useDispatch} from "react-redux";
import {stateSelector} from "../reducers";
import { useHistory } from 'react-router-dom';
import {SignUpUser} from "../actions/userActions";
import {Button, Input} from "antd";
import {IsLoggedIn} from "../api/auth";


const SignUpPage = ()=>{
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
        await dispatch(SignUpUser(usr, pwd))
        history.push("/")
    }

    return(
        <PageDiv>
            <div style={{ width: 400, height:500, position: "relative", top: 100, margin: "0px auto",borderRadius:10,  border:"1px solid #3e3e3e", padding: 50}}>
                <h2>SignUp</h2>
                <form onSubmit={signIn}>
                    <Input style={{ marginTop: 10 }} placeholder={"Email"} value={usr} type={"email"} onChange={(e)=>{setUsr(e.target.value)}} />
                    <Input style={{ marginTop: 10 }}  placeholder={"Password"} value={pwd} type={"password"} onChange={(e)=>{setPwd(e.target.value)}} />
                    <Button style={{ marginTop: 10 }} htmlType="submit" type={"ghost"}>Login</Button>
                </form>
            </div>
        </PageDiv>
    )
}

export default SignUpPage;