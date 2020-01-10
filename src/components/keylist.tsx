import React, { FC, useState, useEffect, useRef } from "react";
import { RenderItemProps, NormalizedCache } from "../types/generic";
import styled from "styled-components";

const KeyTable = styled.table`
  table-layout: fixed;
  white-space: nowrap;
  border-collapse: collapse;
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
        : "#1f85de"
      : props.bgColorOff
      ? props.bgColorOff
      : "white"};
  color: ${(props: SELTRPROPS) =>
    props.selected
      ? props.colorOn
        ? props.colorOn
        : "white"
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
}

function KeyList<T>(props: KeyProps<T>) {
  const [cursor, setCursor] = useState(props.cursor);
  const prevCursor = usePrevious(cursor);
  const [lowerCursorBound, setLoweCursorBound] = useState(props.cursor);
  const [upperCursorBound, setUpperCursorBound] = useState(
    props.cursor + props.numberOfRows
  );
  const prevUpper = usePrevious(upperCursorBound);
  const prevLower = usePrevious(lowerCursorBound);
  // console.log("Current cursors bound:", lowerCursorBound, upperCursorBound);

  useEffect(() => {
    setCursor(props.cursor);
  }, [props.cursor]);
  // console.log("Getting cursor in keylist", cursor, props.cursor);

  useEffect(() => {
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

  const totalheight =
    props.rowHeight * props.numberOfRows + props.rowHeight + 41 || 800;

  const styles = {
    wrapper: {
      backgroundColor: "#fff",
      zIndex: 999,
      position: "relative" as "relative",
      top: 0,
      bottom: 0,
      overflowY: "scroll" as "scroll",
      height: props.maxHeight,
      width: props.width || "100%"
    },
    listWrapper: {
      top: 0,
      left: 0,

      position: "absolute" as "absolute",
      backgroundColor: "#fff",
      padding: 10
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
    if (e.keyCode == 40 && cursor < props.data.all.length - 1) {
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
    if (e.keyCode == 34 && cursor < props.data.all.length - 1) {
      if (cursor + props.numberOfRows > props.data.all.length) {
        setCursor(props.data.all.length - 1);
      } else {
        setCursor(cursor + props.numberOfRows);
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
      props.handleCharacter(cursor, val);
    }

    // handle Enter
    if (e.keyCode === 13) {
      if (props.handleEnter) {
        props.handleEnter(cursor);
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
      props.handleEnter(newCursor);
    }
  };

  // console.log(props.data);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  return (
    <div style={styles.wrapper}>
      <div
        onKeyDown={handleKeyDown}
        ref={Focus}
        tabIndex={0}
        style={styles.listWrapper}
        onScroll={handleScroll}
      >
        <KeyTable>
          <thead>
            <tr style={{ height: props.rowHeight }}>
              {props.columns.map(column_name => (
                <th key={column_name}>{column_name}</th>
              ))}
            </tr>
          </thead>
          {props.data.all.map((itemid, i) => {
            return checkIfVisible(i) || false ? (
              <KeyBody
                onMouseMove={() => {
                  handleHover(i);
                }}
                onMouseDown={() => {
                  handleClick(i);
                }}
                selected={cursor === i}
                height={`${props.rowHeight}px`}
                key={itemid}
              >
                {props.renderItem({
                  item: props.data.normalized[itemid],
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