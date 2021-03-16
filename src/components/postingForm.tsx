import React, { useState, useRef, useEffect } from 'react';
import { TPosting } from '../types/ledger';
import { Select } from './styledComp';
import { Master } from '../types/master';
import { NormalizedCache } from '../types/generic';
import { Select as RelSelect } from 'antd';
import NameSelect from "./nameSelect";


interface Props {
    posting: TPosting
    handleMasterChange(postID: number, id: number): void
    handleDebit?(amount: number): void
    handleCredit?(amount: number): void
    handleAmount(postID: number, amount: number): void
    masters: Master[]
    pKey: number
}


const PostingForm = (props: Props) => {

    // 0 is for to, 1 for by
    const [toBy, setToBy] = useState("0")
    const { posting, handleAmount, handleMasterChange, masters } = props;
    const selectRef = useRef<HTMLSelectElement>(null);


    useEffect(() => { if (selectRef && selectRef.current) selectRef.current.focus() }, [selectRef])

    useEffect(() => {
        if (posting.amount >= 0) {
            setToBy("1")
        }
    }, [props.posting.amount])

    return (
        <div style={{ display:"flex", marginTop: 5 }}>
            <Select
                value={toBy}
                onChange={(e) => { setToBy(e.target.value) }}
                ref={selectRef}
                style={{ marginRight: 5}}
            >
                <option value={"0"}>By</option>
                <option value={"1"}>To</option>
            </Select>
          <div style={{ minWidth:"40%"}}><NameSelect onSelect={ (e)=>{handleMasterChange(props.pKey,e)} } cursor={posting.master_id} /></div>
            <input
                disabled={toBy == "1"}
                value={toBy == "0" ? -posting.amount : ""}
                type="number"
                onChange={(e) => {
                    const amnt = parseFloat(e.target.value);
                    handleAmount(props.pKey, -amnt)
                }
                }
                style={{ marginLeft: 5}}
            />
            <input
                disabled={toBy == "0"}
                value={toBy == "1" ? posting.amount : ""}
                type="number"
                onChange={(e) => {
                    const amnt = parseFloat(e.target.value);
                    handleAmount(props.pKey, amnt)
                }
                }
            />
        </div>
    )


}

export default PostingForm;