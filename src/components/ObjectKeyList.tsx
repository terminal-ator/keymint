import React, {FC, useEffect, useRef, useState} from "react";
import styled from "styled-components";
import {HasId, NormalizedCache} from "../types/generic";
import {usePrevious} from "../Hooks/misc";
import { Checkbox } from 'antd';


interface ViewHolderProps{
    selected: boolean;
    bgColorOn?: string;
    bgColorOff?: string;
    colorOn?:string;
    colorOff?:string;
    height:string;
}

export const ViewHolder = styled.div`
    background: ${(props: ViewHolderProps) =>
    props.selected
        ? props.bgColorOn
        ? props.bgColorOn
        : "#005cbf"
        : props.bgColorOff
        ? props.bgColorOff
        : ""};
  color: ${(props: ViewHolderProps) =>
    props.selected
        ? props.colorOn
        ? props.colorOn
        : "white"
        : props.colorOff
        ? props.colorOff
        : "black"};
  height: ${(props: ViewHolderProps) => {
    if (props.height) return props.height;
    return "40px";
}};
  :hover {
    cursor: pointer;
    background-color: #f8d7da;
  }
`
interface KeyProps<T> {
    cursor: number;
    data: Array<T>;
    renderItem(arg: any): any;
    columns: Array<string>;
    rowHeight: number;
    numberOfRows: number;
    maxHeight: number;
    maxWidth?:string;
    handleCharacter?(cursor: number, val: string): void;
    handleEnter?(item:T):void;
    handleEscape?(): void;
    handleMisc?: {
        key: number;
        handler: (cursor: number, e: string) => void | undefined;
    }[];
    width?: string;
    filter?(data: T): boolean;
    renderColumn?(): any;
    autoFocus?: boolean;
    headers?: FC[];
    footers?: FC[];
    scrollMode?: boolean;
}

function ObjectImKeyList<T extends HasId>(props: KeyProps<T>){
    let {   numberOfRows, autoFocus,  filter, data } = props;
    const [ cursor, setCursor ] = useState(props.cursor)
    const prevCursor = usePrevious(cursor)
    const [lowerCursorBound, setLowerCursorBound] = useState(props.cursor);
    const divRef = useRef<HTMLDivElement>(null);
    const [upperCursorBound, setUpperCursorBound] = useState(
        props.cursor + numberOfRows
    );
    const [scrollIndex, setScrollIndex] = useState(0);
    const [ scrollMode, setScrollMode ] = useState(false);
    const autofocus = autoFocus==false? autoFocus : true;
    const prevScrollIndex = usePrevious(scrollIndex);
    // const [ data, setData ] = useState(props.data);
    const Focus = useRef<HTMLDivElement>(null);

    // Effects
    // useEffect(()=>{
    //     setData(props.data)
    // },[props.data]) // handle data

    useEffect(()=>{
        setCursor(props.cursor);
    },[props.cursor]); // handle cursor

    useEffect(()=>{
        if(data && cursor > data.length){
            setCursor(data.length-1);
        }
        // deal with page up and down
        const jumpFactor = cursor - prevCursor > 1 ? numberOfRows/2 -3 : 0;
        if(cursor > upperCursorBound){
            setUpperCursorBound(cursor+jumpFactor);
            setLowerCursorBound(cursor - numberOfRows + jumpFactor );
            return;
        }

        if(cursor<lowerCursorBound){
            setLowerCursorBound(cursor - jumpFactor);
            setUpperCursorBound( cursor + numberOfRows - jumpFactor);
            return;
        }

    },[cursor]) // handle visibility

    useEffect(()=>{
        if(divRef && divRef.current && autoFocus){
            divRef.current.focus();
        }
    }) // focus on mounting

    if(!data){
        return <div>No rows to show</div>
    }

    if(filter && data){
        data = data.filter((item)=>filter?.(item));
    }


    // calculated styles
    const styles = {
        wrapper: {
            display: "flex",
            flexDirection: "column" as "column",
            height: numberOfRows * props.rowHeight,
            minHeight: Math.max(props.maxHeight, numberOfRows * props.rowHeight ),
            width: props.maxWidth,
            outlineColor: "#ff1744",
            outline: "none",
            overflowY: "scroll" as "scroll"
        },
    } // close styles
    const checkIfVisible = (index: number): boolean => {
        if (lowerCursorBound <= index && index <= upperCursorBound) return true;
        return false;
    }; // check if visible

    // handle key board events
    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        e.preventDefault();

        if(!scrollMode){
            if (e.keyCode == 38 && cursor > 0) {
                setCursor(cursor - 1);
            }
            if (e.keyCode == 40 && cursor < data.length - 1) {
                setCursor(cursor + 1);
            }

            // handle page up
            if (e.keyCode == 33 && cursor > 0) {
                if (cursor - props.numberOfRows < 0) {
                    setCursor(0);
                } else {
                    setCursor(cursor - props.numberOfRows);
                }
            }

            // handle Page down
            if (e.keyCode == 34 && cursor < data.length - 1) {
                if (cursor + props.numberOfRows > data.length) {
                    setCursor(data.length - 1);
                } else {
                    setCursor(cursor + props.numberOfRows);
                }
            }

            if (e.keyCode == 36) {
                setCursor(0);
            }

            if (e.keyCode == 35) {
                setCursor(props.data.length - 1);
            }
        }

        // character code logic
        if (
            props.handleCharacter &&
            ((e.keyCode > 47 && e.keyCode < 91) ||
                e.keyCode === 32 ||
                e.keyCode == 190 ||
                e.keyCode == 188)
        ) {
            const val = e.key.toString();
            setCursor(0);
            props.handleCharacter(cursor, val);
        }

        // handle Enter
        if (e.keyCode === 13) {
            if (props.handleEnter) {
                const selectedElement = data[cursor];
                props.handleEnter(selectedElement);
            }
        }

        if (e.keyCode === 27) {
            if (props.handleEscape) {
                props.handleEscape();
            }
        }

        // handle misc
        if (props.handleMisc) {
            props.handleMisc.map(async pair => {
                if (e.keyCode === pair.key) {
                    pair.handler(cursor, e.key);
                }
            });
        }
    }; // handle keyboard events

    const handleClick = async (newCursor: number) => {
        if (props.handleEnter) {
            //props.handleEnter();
            await setCursor(newCursor);
            const selectedElement = data[newCursor];
            props.handleEnter(selectedElement);
        }
    }; // handle Click

    return (
        <div>
            <div style={{ display: "flex", width:"100%", padding: 5 }} className="keylist-settings" >
                <div style={{ border: "2px solid rgb(244, 245, 247)", padding: 5, borderRadius: 5}} >
                    <Checkbox checked={scrollMode} onChange={(e)=>{setScrollMode(e.target.checked)}} />
                    <span style={{ marginLeft: 5}}>Scroll Mode</span>
                </div>
            </div>
            <div>
                {
                    props.headers && props.headers.map((Headed)=><Headed />)
                }
            </div>
            <div
                style={styles.wrapper}
                ref={divRef}
                onKeyDown={handleKeyDown}
                tabIndex={1}
            >
                {
                   data && data.map((item, i)=>{
                        return checkIfVisible(i) || scrollMode ? <ViewHolder
                            onClick = { async e => {
                                if(e.nativeEvent.type==="click") await handleClick(i);
                            }}
                            key={item.id + (item.cust_id ? item.cust_id?.Int64.toString():"0") }
                            height={`${props.rowHeight}px`}
                            selected={cursor===i}
                        >
                            {
                                props.renderItem({
                                    item: item,
                                })
                            }
                        </ViewHolder>:null;
                    })// map
                }
            </div>
            <div>
                {
                    props.footers && props.footers.map((Headed)=><Headed />)
                }
            </div>
            <p
                style={{
                    float: "right",
                    paddingTop: 10,
                    paddingLeft: 5,
                    paddingRight: 5,
                    paddingBottom: 10,
                    color:'black',
                }}
            >
                {data.length - cursor - 1} More
            </p>
        </div>
    )

}

export default ObjectImKeyList