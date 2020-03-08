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
  const bts = stateSelector(state => state.beats.beats)

  useEffect(() => {
    setMasters(props.masters);
  }, [props.masters]);

  const columns = ["Name", "Beat", "Balance"];

  const selectName = (cursor: number) => {
    if (props.handleEnter) props.handleEnter(masters.all[cursor]);
  };

  const filterBasedOnBalance = (selected: boolean) => {
    if (selected) {
      const mstr = DeNormalize<Master>(props.masters)
      const newMstr = mstr.filter((m) => m.balance !== 0);
      const norml = normalize<Master>(newMstr, true);
      setMasters(norml);
    } else {
      setMasters(props.masters)
    }
  }

  const filterBasedOnName = async (filteredString: string) => {
    // console.log("Got filterd string:", filteredString);
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
        // console.log("Setting cursor:", i);
        setCursor(i);
        return 0;
      }
    }
    return 1;
  };

  const filterByBeat = (val: number) => {
    if (val == 0) {
      setMasters(props.masters)
      return;
    }
    const denorm = DeNormalize(props.masters);
    const filtered = denorm.filter((mstr) => mstr.beat_id == val)
    const normed = normalize(filtered, true);
    setMasters(normed);
  }

  // const filterOut = async (filteredString: string) => {
  //   if (filteredString === "") setMasters(props.masters);
  //   const customFilterAll =
  // };

  const handleKey = async (_: number, key: string) => {
    const newFilter = filter + key;
    // console.log("New filter:", newFilter);
    const val = await filterBasedOnName(newFilter);
    if (val == 0) setFilter(newFilter);
    else setFilter(filter);
  };
  const handleBackSpace = async (_: number, key: string) => {
    const newFilter = filter.slice(0, -1);
    await filterBasedOnName(newFilter);
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
        <td>
          {bts?.normalized[arg.item.beat_id].short_name}
        </td>
        <td>{
          Math.abs(arg.item.balance).toString()
        }&nbsp;{arg.item.balance < 0 ? "DR" : "CR"}</td>
      </SELTR>
    );
  }

  const clearFilter = () => {
    setFilter("");
    return
  }

  const handleEscape = (cursor: number, str: string) => {
    if (filter === "" && props.handleEscape) { props.handleEscape(cursor, str); return; }
    else if (filter === "") { props.history.goBack(); return }
    clearFilter();
  }

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

  return (
    <div style={{ height: "100%" }}>
      <Select onChange={(e) => { filterByBeat(parseInt(e.target.value)) }} >
        <option value={0}>All</option>
        {
          bts?.all.map((id) => <option key={bts.normalized[id].id} value={bts.normalized[id].id}>{bts.normalized[id].name}</option>)
        }
      </Select>
      <p className="filter-text">{filter || "filter"}</p>
      <span>
        <input type="checkbox" name="handle" onChange={e => { filterBasedOnBalance(e.target.checked) }} /><label htmlFor="handle">Hide Balanced</label>
      </span>
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
      />
    </div>
  );
};

export default withRouter(MasterList);
