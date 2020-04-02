import React, { FC, useState, useEffect, useRef } from "react";
import {
  RenderItemProps,
  NormalizedCache,
  DeNormalize,
  HasId
} from "../types/generic";
import styled from "styled-components";

const KeyTable = styled.table`
  table-layout: fixed;
  white-space: nowrap;
  border-collapse: collapse;
  width: 100%;
`;

export interface SELTRPROPS {
  selected: boolean;
  bgColorOn?: string;
  bgColorOff?: string;
  colorOn?: string;
  colorOff?: string;
  height?: string;
}

const KeyBody = styled.tbody`
  background: ${(props: SELTRPROPS) =>
    props.selected
      ? props.bgColorOn
        ? props.bgColorOn
        : "#EEEEEE"
      : props.bgColorOff
      ? props.bgColorOff
      : "white"};
  color: ${(props: SELTRPROPS) =>
    props.selected
      ? props.colorOn
        ? props.colorOn
        : "black"
      : props.colorOff
      ? props.colorOff
      : "black"};
  height: ${(props: SELTRPROPS) => {
    if (props.height) return props.height;
    return "40px";
  }};
  :hover {
    cursor: pointer;
  }
  td {
    padding: 10px;
  }
`;

interface KeyProps<T> {
  cursor: number;
  data: NormalizedCache<T>;
  renderItem(arg: any): any;
  columns: Array<string>;
  rowHeight: number;
  numberOfRows: number;
  maxHeight: number;
  handleCharacter?(cursor: number, val: string): void;
  handleEnter?(cursor: number): void;
  handleEscape?(): void;
  handleMisc?: {
    key: number;
    handler: (cursor: number, e: string) => void | undefined;
  }[];
  width?: string;
  filter?(data: T): boolean;
}

function GetDimensions() {
  const { innerHeight: height, innerWidth: width } = window;
  return { width, height };
}

function useGetDimenstion() {
  const [dim, setDim] = useState(GetDimensions());
}

function  KeyList<T extends HasId>(props: KeyProps<T>) {
  const [cursor, setCursor] = useState(props.cursor);
  const prevCursor = usePrevious(cursor);
  const [lowerCursorBound, setLoweCursorBound] = useState(props.cursor);
  const divRef = useRef<HTMLDivElement>(null);
  const [upperCursorBound, setUpperCursorBound] = useState(
    props.cursor + props.numberOfRows
  );
  const [ scrollIndex, setScrollIndex] = useState(0);
  const prevScrollIndex = usePrevious(scrollIndex);
  const { data } = props;
  let dataArray = DeNormalize(data);
  if (props.filter) {
    dataArray = dataArray.filter(item => props.filter?.(item));
  }
  const prevUpper = usePrevious(upperCursorBound);
  const prevLower = usePrevious(lowerCursorBound);
  useEffect(() => {
    setCursor(props.cursor);
  }, [props.cursor]);
  useEffect(() => {
    if(cursor> dataArray.length){
      setCursor(1);
    }
    const jumpFactor = cursor - prevCursor > 1 ? props.numberOfRows / 2 - 3 : 0;
    if (cursor > upperCursorBound) {
      setUpperCursorBound(cursor + jumpFactor);
      setLoweCursorBound(cursor - props.numberOfRows + jumpFactor);
      return;
    }
    if (cursor < lowerCursorBound) {
      setLoweCursorBound(cursor - jumpFactor);
      setUpperCursorBound(cursor + props.numberOfRows - jumpFactor);
      return;
    }
  }, [cursor]);
  useEffect(()=>{
    if(dataArray.length<cursor){
      setCursor(0);
    }
  },[dataArray.length])
  function usePrevious(value: number): number {
    const ref = useRef<number>(0);

    useEffect(() => {
      ref.current = value;
    }, [value]);

    return ref.current;
  }
  const Focus = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (Focus && Focus.current) {
      Focus.current.focus();
    }
  });
  const styles = {
    wrapper: {
      backgroundColor: "#fff",
      zIndex: 999,
      position: "relative" as "relative",
      top: 0,
      bottom: 0,
      overflowY: "scroll" as "scroll",
      height: 2 * props.numberOfRows * props.rowHeight + 200,
      width: props.width || "100%"
    },
    listWrapper: {
      top: 0,
      left: 0,
      outline: "hidden",
      position: "absolute" as "absolute",
      backgroundColor: "#fff",
      height: props.rowHeight * props.data.all.length,
      minWidth: 200
    },
    list: (height: number) => ({
      height,
      position: "relative" as "relative",
      overflow: "hidden" as "hidden"
    }),
    item: (index: any, height: any) => ({
      height,
      left: 0,
      right: 0,
      top: 0,
      position: "relative" as "relative"
    })
  };
  const checkIfVisible = (index: number): boolean => {
    if (lowerCursorBound <= index && index <= upperCursorBound) return true;
    return false;
  };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    e.preventDefault();

    if (e.keyCode == 38 && cursor > 0) {
      setCursor(cursor - 1);
    }
    if (e.keyCode == 40 && cursor < dataArray.length - 1) {
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
    if (e.keyCode == 34 && cursor < dataArray.length - 1) {
      if (cursor + props.numberOfRows > dataArray.length) {
        setCursor(dataArray.length - 1);
      } else {
        setCursor(cursor + props.numberOfRows);
      }
    }

    if (e.keyCode == 36) {
      setCursor(0);
    }

    if (e.keyCode == 35) {
      setCursor(props.data.all.length - 1);
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
      props.handleCharacter(cursor, val);
    }

    // handle Enter
    if (e.keyCode === 13) {
      if (props.handleEnter) {
        let id: number = 0;
        const selectedElement = dataArray[cursor];
        console.log(`Selected element`, { selectedElement });
        if (selectedElement.id != 0) {
          id = selectedElement.id;
          console.log("Handling with ID: ", selectedElement.id);
        } else if (selectedElement.cust_id?.Valid) {
          id = selectedElement.cust_id.Int64;
          console.log("Handling with cust_id:", selectedElement.cust_id.Int64);
        } else {
          id = selectedElement.id;
        }
        props.handleEnter(id);
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
  };
  const handleHover = (newCursor: number) => {
    setCursor(newCursor);
  };
  const handleClick = (newCursor: number) => {
    if (props.handleEnter) {
      //props.handleEnter();
      let id: number = 0;
      const selectedElement = dataArray[cursor];
      console.log(`Selected element`, { selectedElement });
      if (selectedElement.id != 0) {
        id = selectedElement.id;
        console.log("Handling with ID: ", selectedElement.id);
      } else if (selectedElement.cust_id?.Valid) {
        id = selectedElement.cust_id.Int64;
        console.log("Handling with cust_id:", selectedElement.cust_id.Int64);
      } else {
        id = selectedElement.id;
      }
      props.handleEnter(id);
    }
  };
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if(divRef.current){
      //console.log(`Logging scroll events with scrolltop: ${divRef.current.scrollTop}`);
      const scTop = divRef.current.scrollTop;
      const updateIndex =  Math.round(scTop / props.rowHeight);
      //console.log(updateIndex)
      const scroll = prevScrollIndex < updateIndex ? updateIndex : -updateIndex;
      setCursor(cursor+scroll);
      setScrollIndex(updateIndex);
      //setLoweCursorBound(prevLower-1);
      //setUpperCursorBound(prevUpper + props.numberOfRows -1);
    }
    console.log("Handling scroll");
  };



  return (
    <div style={styles.wrapper} ref={divRef} onScroll={handleScroll} >
      <div
        onKeyDown={handleKeyDown}
        ref={Focus}
        tabIndex={1}
        style={styles.listWrapper}
      >
        <KeyTable  className="">
          <thead>
            <tr style={{ height: props.rowHeight }}>
              {props.columns.map(column_name => (
                <th style={{ paddingLeft: 5 }} key={column_name}>
                  {column_name}
                </th>
              ))}
            </tr>
          </thead>
          {dataArray.map((item, i) => {
            return checkIfVisible(i) ||
              (false) ? (
              <KeyBody
                onMouseMove={() => {
                  handleHover(i);
                }}
                onMouseDown={() => {
                  handleClick(i);
                }}
                selected={cursor === i}
                height={`${props.rowHeight}px`}
                key={i}

              >
                {props.renderItem({
                  item: item,
                  isHighlighted: cursor === i,
                  style: styles.item(i, props.rowHeight),
                  className: cursor === i ? "selected" : "",
                  setFocus: handleHover,
                  index: i,
                  rowHeight: props.rowHeight
                })}
              </KeyBody>
            ) : null;
          })}
        </KeyTable>
      </div>
    </div>
  );
}

export default KeyList;
