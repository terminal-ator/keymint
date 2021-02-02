import {DeNormalize, HasId, NormalizedCache, RenderItemProps} from "../types/generic";
import React, {FC} from "react";
import {KeyBody, KeyTable} from "./keylist";

interface TouchListProps<T> {
    data: NormalizedCache<T>,
    renderItem(any: RenderItemProps<T>): any;
    columns: Array<string>;
    maxHeight: string;
    maxWidth?: string;
    handleEnter?(cursor: number): void;
    headers?: FC[];
    footers?: FC[];
}

function TouchList<T extends HasId>(props:TouchListProps<T>){
    const { columns, data, renderItem, maxHeight, handleEnter } = props;
    const dataArray = DeNormalize(data);

    return(
        <div>
            <KeyTable>
                <thead>
                    <tr>
                        {
                            columns.map((col)=>(
                                <th key={col}>
                                    {col}
                                </th>
                            ))
                        }
                    </tr>
                </thead>
                {
                    props.headers && props.headers.map((Headed)=><Headed />)
                }
                <tbody style={{ display:"block", maxHeight, overflowY:"scroll"}} >
                    {
                        dataArray.map((item,i)=>
                            {
                                return renderItem({ item })
                            }
                         )
                    }
                </tbody>
                <tfoot>
                {
                    props.footers && props.footers.map((Footers)=><Footers />)
                }
                </tfoot>
            </KeyTable>
        </div>
    )
}

export default TouchList;