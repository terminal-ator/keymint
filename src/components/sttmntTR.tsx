import React, { FC } from "react";
import moment from "moment";
import { StatementLiProps } from "../types/statements";
import { SELTR } from "../pages";
import styled from "styled-components";

export const SimTd = styled.td`
  min-width: 50px;
  max-width: 150px;
  text-align: center;
  vertical-align: middle;
  border: 1px solid black;
  border-collapse: collapse;
  overflow: hidden;
`;

export const DetailTd = styled.td`
    min-width: 50px;
    max-width: 150px;
    text-align: left
    padding-left: 10px;
    border-bottom: 1px solid #e0e0e0;
    border-collapse: collapse;
    padding: 10px;
    overflow: hidden
`

export const LongTd = styled(SimTd)`
  overflow: hidden;
  max-width: 500px;
  min-width: 500px;
  padding-left: 10px;
  padding-right: 10px;
  padding: 10px;
`;
const StatementTR: FC<StatementLiProps> = ({ statement }) => {
  // console.log(`Displaying masters ${masters}`);
  return (
    <SELTR>
      <SimTd>{moment(statement.date).format("LL")}</SimTd>
      <LongTd className="narration-SimTd">{statement.narration.substr(0,30)}</LongTd>
      <LongTd className="narration-SimTd">
        {(statement.master && statement.master.name) || "No ledger selected"}
      </LongTd>
      <SimTd>{statement.ref_no}</SimTd>
      <SimTd>
        {(statement.deposit.Valid && statement.deposit.Float64) || 0}
      </SimTd>
      <SimTd>
        {(statement.withdrawl.Valid && statement.withdrawl.Float64) || 0}
      </SimTd>
    </SELTR>
  );
};

export default StatementTR;
