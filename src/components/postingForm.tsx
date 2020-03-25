import React, { useState, useRef, useEffect } from 'react';
import { TPosting } from '../types/ledger';
import { Select } from './styledComp';
import { Master } from '../types/master';
import { NormalizedCache } from '../types/generic';
import { Select as RelSelect } from 'antd';


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
        <div>
            <Select
                value={toBy}
                onChange={(e) => { setToBy(e.target.value) }}
                ref={selectRef}
            >
                <option value={"0"}>By</option>
                <option value={"1"}>To</option>
            </Select>
            <RelSelect
                showSearch
                value={posting.master_id}
                onChange={(e) => {
                    const id = e;
                    handleMasterChange(props.pKey, id);
                }
                }
                style={{ width: 300 }}
                filterOption={(input, option) =>
                    option ? option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0 : false
                }
            >
                <RelSelect.Option value={1} key={posting.id + 1} disabled>Choose a name</RelSelect.Option>
                {
                    masters.map((mstr, id) =>
                        <RelSelect.Option key={`${posting.id}${id}`} value={mstr.cust_id.Int64}>
                            {mstr.name}

                        </RelSelect.Option>)
                }
            </RelSelect>
            <input
                disabled={toBy == "1"}
                value={toBy == "0" ? -posting.amount : ""}
                type="number"
                onChange={(e) => {
                    const amnt = parseInt(e.target.value);
                    handleAmount(props.pKey, -amnt)
                }
                }
            />
            <input
                disabled={toBy == "0"}
                value={toBy == "1" ? posting.amount : ""}
                type="number"
                onChange={(e) => {
                    const amnt = parseInt(e.target.value);
                    handleAmount(props.pKey, amnt)
                }
                }
            />
        </div>
    )


}

export default PostingForm;