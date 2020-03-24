import React, { useState, useEffect, ChangeEvent } from "react";
import { AppState } from "../reducers";
import { connect, ConnectedProps } from "react-redux";
import { RouteComponentProps, useParams, useHistory } from "react-router";
import MasterList from "../components/mstrlist";
import KeyList from "../components/keylist";
import {
  NormalizedCache,
  normalize,
  RenderItemProps,
  DeNormalize,
  StatementMutation
} from "../types/generic";
import { Statement } from "../types/statements";
import { getBankWiseStatements, postStatementMaster, newSetStatement } from "../api";
import StatementTR from "../components/sttmntTR";
import withPop from "../components/popup";
import styled from "styled-components";
import Loading from "../components/loading";
import Nav from "../components/nav";

const mapState = (state: AppState) => ({
  masters: state.master.masters,
  companies: state.sys.Companies,
  cmpyID: state.sys.SelectedCompany
});

export const DialogWrapper = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  z-index: 1000;
  height: 100%;
  width:100%;
  background: rgba(0,0,0,0.6);
`;

export const DialogContent = styled.div`
  background-color: #fff;
  height: 100%;
  overflow: hidden;
  opacity: 1;
  width: 700px;
  float: right;
  padding: 10px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23);
`;

const connector = connect(mapState, {});

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & RouteComponentProps;

const STMT = (props: Props) => {
  const [cursor, _] = useState(0);
  const [statements, setStatements] = useState<NormalizedCache<Statement>>();
  const [filtered, setFiltered] = useState<NormalizedCache<Statement>>();
  const [selected, setSelected] = useState<number>();

  let { id } = useParams();
  let history = useHistory();
  let [showDialog, setDialog] = useState(false);

  const fetchStatements = async () => {
    if (id) {
      const req = await getBankWiseStatements(parseInt(id));
      setStatements(normalize<Statement>(req.data.statements));
      setFiltered(normalize<Statement>(req.data.statements));
    }
  };
  useEffect(() => {
    fetchStatements();
  }, [id]);

  const goBack = () => {
    history.goBack();
  };
  const handleFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.checked) {
      fetchStatements();
    } else {
      if (statements) {
        const denormed = DeNormalize<Statement>(statements);
        const filtered = denormed.filter(stat => !stat.cust_id.Valid);
        setFiltered(normalize<Statement>(filtered));
      }
    }
  };

  const handleStmtSelect = (cursor: number) => {
    if (filtered) {
      const stat = filtered.normalized[filtered.all[cursor]];
      setSelected(stat.id);
      setDialog(true);
    }
  };
  const handleMasterChange = async (masterID: number) => {
    // console.log("Changing master to:", masterID);
    // console.log()
    if (filtered && statements && selected && props.masters) {
      let toStatement = filtered.normalized[selected];
      console.log({ toStatement });
      toStatement.cust_id = { Valid: true, Int64: masterID };
      toStatement.master = props.masters.normalized[masterID];

      let newStatements: NormalizedCache<Statement> = {
        all: statements.all,
        normalized: { ...statements.normalized, [toStatement.id]: toStatement }
      };

      let filteredStatement: NormalizedCache<Statement> = {
        all: filtered.all,
        normalized: { ...filtered.normalized, [toStatement.id]: toStatement }
      };
      if (id) {
        let packet: StatementMutation = { bank_id: parseInt(id), company_id: props.cmpyID, stat_id: toStatement.id, cust_id: masterID }
        console.log("Showing sending packet: ", {
          packet
        });
        // await postStatementMaster({
        //   cust_id: masterID,
        //   statement_id: selected,
        //   company_id: props.cmpyID
        // });
        await newSetStatement(packet);
        setStatements(newStatements);
        setFiltered(filteredStatement);

        setDialog(false);
      }
    }
  };

  const renderItem = (arg: RenderItemProps<Statement>) => {
    if (statements) {
      return (
        <StatementTR
          key={arg.item.id.toString()}
          statement={statements.normalized[arg.item.id]}
        />
      );
    }
  };
  return (
    <div>
      <Nav />
      <div
        style={{ display: "flex", flexDirection: "row", alignItems: "center" }}
      >
        <h1>Statements</h1>
        <label>
          <input
            onChange={handleFilter}
            type="checkbox"
            placeholder="Show outstandings"
          />
          Show Outstandings
        </label>
      </div>
      {filtered ? (
        <KeyList
          key={"stats"}
          columns={[
            "Date",
            "Narration",
            "Master",
            "Reference",
            "Deposit",
            "Withdrawl",
          ]}
          cursor={cursor}
          maxHeight={700}
          rowHeight={30}
          numberOfRows={10}
          data={filtered}
          renderItem={renderItem}
          handleEscape={goBack}
          handleEnter={handleStmtSelect}
        />
      ) : (
          <Loading />
        )}
      {props.masters
        ? withPop(
          <DialogWrapper>
            <DialogContent>
              <MasterList
                masters={props.masters}
                companies={props.companies}
                handleEscape={(_: number, __: string) => {
                  setDialog(false);
                }}
                handleEnter={handleMasterChange}
              />
            </DialogContent>
          </DialogWrapper>,
          showDialog
        )
        : null}

      {/* {props.masters && (
        <MasterList masters={props.masters} companies={props.companies} />
      )} */}
    </div>
  );
};

export default connector(STMT);
