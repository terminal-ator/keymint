import React, {FC, useState} from 'react';
import useSWR from "swr";
import {GeneralResponse} from "../types/response";
import {Sku, SkuFromServer} from "./ProductFormV2";
import Loading from "./loading";
import {Button} from "antd";
import KeyList from "./keylist";
import ImKeyList from "./ImprovedKeyList";
import {RenderItemProps} from "../types/generic";
import {ApiGet} from "../api/auth";
import { useHistory } from 'react-router-dom';
import ObjectImKeyList from "./ObjectKeyList";

interface SkuListProps {
    initFilter?: string
    handleEnter?(sku: SkuFromServer): void;
    handleEscape?(_:number, __: string): void;

}

const SkuList: FC<SkuListProps> = ({ initFilter, handleEnter })=>{
    type G = GeneralResponse<Array<SkuFromServer>>
    const history = useHistory();
    const { data: skus, error, revalidate } = useSWR<G>("/product/sku", ApiGet);
    const [ filter, setFilter ] = useState(initFilter || "");
    const renderSkus = (arg: RenderItemProps<Sku>) =>{
        return <div style={{ padding: 5 }}>
            {arg.item.name}
        </div>
    }

    const handleKey = async (_: number, key: string)=>{
        const newFilter = filter + key;
        setFilter(newFilter);
    }
    const handleBackSpace = async (_: number, key: string) => {
        const newFilter = filter.slice(0, -1);
        // await filterBasedOnName(newFilter);
        setFilter(newFilter);
    };
    const clearFilter = () => {
        setFilter("");
        return;
    };
    const handleEscape = (cursor: number, str: string) => {
        if (filter === "" ) {
            // props.handleEscape(cursor, str);
            return;
        } else if (filter === "") {
            history.goBack();
            return;
        }
        clearFilter();
    };
    const handleMisc = [
        {
            key: 8,
            handler: handleBackSpace
        },
        {
            key: 27,
            handler: handleEscape
        }
    ];
    const filterFunc = (data: SkuFromServer): boolean =>{
        return(
            data.name.toLowerCase().startsWith(filter.toLowerCase())
        )
    }

    if(!skus){
        return <div>
            <Loading />
        </div>
    }
    if(error){
        return <div>Failed to fetch sku, <Button onClick={async ()=>{await revalidate();}}>Retry</Button>  </div>
    }
    return <div>
        {
            skus && <ObjectImKeyList
                handleCharacter={handleKey}
                handleEnter={handleEnter}
                filter={filterFunc}
                handleMisc={handleMisc}
                autoFocus={true}
                scrollMode
                            cursor={0} data={skus.data} renderItem={renderSkus}
                            columns={["Name", "Rate","Tax"]} rowHeight={40} numberOfRows={10} maxHeight={0} />
        }
    </div>
}


export default SkuList;