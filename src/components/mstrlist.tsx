import React, { useState, FC, useRef, useEffect } from "react";
import { Master } from "../types/master";
import {
  RenderItemProps,
  NormalizedCache,
  GenerateCacheFromAll,
  DeNormalize,
  normalize
} from "../types/generic";
import { Company } from "../types/company";
import KeyList from "./keylist";
import { SELTR } from "../pages";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { useSelector } from "react-redux";
import { stateSelector } from "../reducers";
import { Beat } from "../actions/beatActions";
import { Select } from "./styledComp";
import { compareTwoStrings } from 'string-similarity';

interface MasterListProps {
  masters: NormalizedCache<Master>;
  handleEnter?(masterID: number): void;
  handleEscape?(_: number, __: string): void;
  companies?: NormalizedCache<Company>;
}

type MProps = MasterListProps & RouteComponentProps;

const MasterList: FC<MProps> = (props: MProps) => {
  const [filter, setFilter] = useState("");
  const [cursor, setCursor] = useState(0);
  const [masters, setMasters] = useState(props.masters);
  const [balanceFilter, setBalance] = useState(false);
  const [beatFilter, setBeatFilter] = useState(0);
  const bts = stateSelector(state => state.beats.beats);
  useEffect(() => {
    setMasters(props.masters);
  }, [props.masters]);
  const columns = ["Name", "Beat", "Balance"];
  const selectName = (cursor: number) => {
    if (props.handleEnter) props.handleEnter(cursor);
  };
  const filterBasedOnBalance = (selected: boolean) => {
    setBalance(selected);
  };
  const filterBasedOnName = async (filteredString: string) => {
    if (filteredString === "") {
      setCursor(0);
      return 0;
    }
    const master = masters;
    for (let i = 0; i < master.all.length; i++) {
      if (
        master.normalized[master.all[i]].name
          .toLowerCase()
          .startsWith(filteredString.toLowerCase())
      ) {
        setCursor(i);
        return 0;
      }
    }
    return 1;
  };
  const filterByBeat = (val: number) => {
    setBeatFilter(val);
  };
  const handleKey = async (_: number, key: string) => {
    const newFilter = filter + key;
    // console.log("New filter:", newFilter);
    // const val = await filterBasedOnName(newFilter);
    // if (val == 0) setFilter(newFilter);
    setFilter(newFilter);
  };
  const handleBackSpace = async (_: number, key: string) => {
    const newFilter = filter.slice(0, -1);
    // await filterBasedOnName(newFilter);
    setFilter(newFilter);
  };
  function renderItem(arg: RenderItemProps<Master>) {
    // console.log(arg);
    return (
      <SELTR key={arg.item.id.toString()}>
        <td style={{ padding: 5, overflow: "hidden" }}>
          <span>
            {arg.item.chq_flg ? (
              <span style={{ backgroundColor: "#53c97c", width: 5 }}>
                &nbsp;{" "}
              </span>
            ) : null}
            &nbsp;
            <span>{arg.item.name}</span>
          </span>
        </td>
        <td>{bts?.normalized[arg.item.beat_id].short_name}</td>
        <td>
          {Math.abs(arg.item.balance).toString()}&nbsp;
          {arg.item.balance < 0 ? "DR" : "CR"}
        </td>
      </SELTR>
    );
  }

  const clearFilter = () => {
    setFilter("");
    return;
  };

  const handleEscape = (cursor: number, str: string) => {
    if (filter === "" && props.handleEscape) {
      props.handleEscape(cursor, str);
      return;
    } else if (filter === "") {
      props.history.goBack();
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
  const filterFunc = (data: Master): boolean => {
    return (
      (!balanceFilter || data.balance !== 0)
      && data.name.toLowerCase().startsWith(filter.toLowerCase())
      && (beatFilter===0 || data.beat_id == beatFilter)
    );
  };

  return (
    <div style={{ height: "100%" }}>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          width: "100%",
          justifyContent: "space-between"
        }}
      >
        <Select
          onChange={e => {
            filterByBeat(parseInt(e.target.value));
          }}
        >
          <option value={0}>All</option>
          {bts?.all.map(id => (
            <option key={bts.normalized[id].id} value={bts.normalized[id].id}>
              {bts.normalized[id].name}
            </option>
          ))}
        </Select>
        <p className="filter-text" style={{ marginTop: 2, marginLeft: 2 }}>
          {filter || "Search will appear here"}
        </p>
        <span style={{ float: "right", alignSelf: "center" }}>
          <input
            type="checkbox"
            name="handle"
            onChange={e => {
              filterBasedOnBalance(e.target.checked);
            }}
          />
          <label htmlFor="handle">&nbsp; Hide Balanced</label>
        </span>
      </div>
      <KeyList
        key={"master-list"}
        columns={columns}
        cursor={cursor}
        rowHeight={20}
        numberOfRows={12}
        maxHeight={700}
        handleCharacter={handleKey}
        data={masters}
        renderItem={renderItem}
        handleMisc={handleMisc}
        handleEnter={selectName}
        width={"100%"}
        filter={filterFunc}
      />
    </div>
  );
};

export default withRouter(MasterList);
