import React, { FC } from "react";
import moment from "moment";
import { StatementLiProps } from "../types/statements";
import { SELTR } from "../pages";
import styled from "styled-components";

const SimTd = styled.td`
  min-width: 150px;
  max-width: 150px;
  text-align: center;
  vertical-align: middle;
  border: 1px solid black;
  border-collapse: collapse;
  overflow: hidden;
`;

const LongTd = styled(SimTd)`
  overflow: hidden;
  max-width: 400px;
  min-width: 400px;
  padding-left: 10px;
  padding-right: 10px;

  :hover {
    max-width: 400px;
    overflow-x: scroll;
  }
`;
const StatementTR: FC<StatementLiProps> = ({ statement }) => {
  // console.log(`Displaying masters ${masters}`);
  return (
    <SELTR>
      <SimTd>{moment(statement.date).format("LL")}</SimTd>
      <LongTd className="narration-SimSimTd">{statement.narration}</LongTd>
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
      <SimTd>{statement.bank.name}</SimTd>
      <SimTd>{statement.company.name}</SimTd>
    </SELTR>
  );
};

export default StatementTR;
