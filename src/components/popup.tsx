import React, { FC } from "react";

const withPop = (comp: JSX.Element, show: boolean) => {
  if (show) return comp;
  else return null;
};

export default withPop;
