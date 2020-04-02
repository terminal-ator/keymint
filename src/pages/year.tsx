import React, { useEffect, useState } from "react";
import Nav from "../components/nav";
import KeyList from "../components/keylist";
import { stateSelector } from "../reducers";
import { NormalizedCache, RenderItemProps, Year } from "../types/generic";
import { useDispatch } from "react-redux";
import { SaveSelectedYear } from "../actions/yearsActions";
import { useHistory } from "react-router-dom";
import {FetchMasters} from "../actions/masterActions";

const YearPage = () => {
  const years = stateSelector(state => state.years.years);
  const dispatch = useDispatch();
  const history = useHistory();

  const render = (item: RenderItemProps<Year>) => {
    return (
      <tr>
        <td>{item.item.year_string}</td>
      </tr>
    );
  };

  const handleSelect = async (cursor: number) => {
    await dispatch(SaveSelectedYear(cursor));
    await dispatch(FetchMasters());
    await history.push("/menu");
  };

  return (
    <div>
      <Nav />
      <KeyList
        handleEnter={handleSelect}
        cursor={0}
        data={years}
        renderItem={render}
        columns={["Year"]}
        rowHeight={20}
        numberOfRows={years.all.length}
        maxHeight={600}
        handleEscape={()=>{history.goBack();}}
      />
    </div>
  );
};

export default YearPage;
