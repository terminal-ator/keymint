import React, {FC, useState} from "react";
import {Button, TextField} from "@material-ui/core";

interface QuickCreateProps {
    onCreate(name: string): void;
    placeholder: string;
}

const QuickCreate:FC<QuickCreateProps> = (props)=> {
    const { onCreate, placeholder } = props;
    const [ show, setShow ] = useState(false);
    const [ name, setName ] = useState("");
    if(!show) return <div style={{ marginLeft: 10}}><Button onClick={()=>{ setShow(true)}}>+</Button></div>;
    return <div style={{ marginLeft: 10 , display: "flex", flexDirection:"row", alignContent:"center"} }>
        <TextField label={placeholder} value={name} onChange={e=>{ setName(e.target.value) }} />
        <Button onClick={()=> { setShow(false);  setName(""); onCreate(name);  }}>OK</Button>
    </div>;

}

export default  QuickCreate;