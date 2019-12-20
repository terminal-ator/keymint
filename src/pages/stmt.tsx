import React, { useState, useEffect } from "react";
import { AppState } from "../reducers";
import { connect, ConnectedProps } from "react-redux";
import { RouteComponentProps, useParams, useHistory } from "react-router";
import MasterList from "../components/mstrlist";
import KeyList from "../components/keylist";
import { NormalizedCache, normalize, RenderItemProps } from "../types/generic";
import { Statement } from "../types/statements";
import { getBankWiseStatements, postStatementMaster } from "../api";
import StatementTR from "../components/sttmntTR";
import withPop from "../components/popup";
import styled from "styled-components";
import Loading from "../components/loading";

const mapState = (state: AppState) => ({
  masters: state.master.masters,
  companies: state.sys.Companies,
  cmpyID: state.sys.SelectedCompany
});

const DialogWrapper = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  z-index: 1000;
  height: 100%;
`;

const DialogContent = styled.div`
  background-color: #fff;
  width: 400px;
  height: 100%;
  overflow: hidden;
  opacity: 1;
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
  const [selected, setSelected] = useState<number>();

  let { id } = useParams();
  let history = useHistory();
  let [showDialog, setDialog] = useState(false);

  const fetchStatements = async () => {
    if (id) {
      const req = await getBankWiseStatements(parseInt(id));
      setStatements(normalize<Statement>(req.data.statements));
    }
  };
  useEffect(() => {
    fetchStatements();
  }, [id]);

  const goBack = () => {
    history.goBack();
  };

  const handleStmtSelect = (cursor: number) => {
    if (statements) {
      const stat = statements.normalized[statements.all[cursor]];
      setSelected(stat.id);
      setDialog(true);
    }
  };
  const handleMasterChange = async (masterID: number) => {
    // console.log("Changing master to:", masterID);
    // console.log()
    if (statements && selected && props.masters) {
      let toStatement = statements.normalized[selected];
      toStatement.cust_id = { Valid: true, Int64: masterID };
      toStatement.master = props.masters.normalized[masterID];

      let newStatements: NormalizedCache<Statement> = {
        all: statements.all,
        normalized: { ...statements.normalized, [toStatement.id]: toStatement }
      };
      await postStatementMaster({
        cust_id: masterID,
        statement_id: selected,
        company_id: props.cmpyID
      });

      setStatements(newStatements);

      setDialog(false);
    }
  };

  const renderItem = (arg: RenderItemProps<Statement>) => {
    if (statements) {
      return (
        <StatementTR
          key={arg.item.id.toString()}
          statement={statements.normalized[arg.item.id]}
          isHighlighted={arg.isHighlighted}
          rowHeight={arg.rowHeight}
        />
      );
    }
  };
  return (
    <div>
      <h1>Statements</h1>
      {statements ? (
        <KeyList
          key={"stats"}
          columns={[
            "Date",
            "Narration",
            "Master",
            "Reference",
            "Deposit",
            "Withdrawl",
            "Bank",
            "Company"
          ]}
          cursor={cursor}
          maxHeight={700}
          rowHeight={40}
          numberOfRows={14}
          data={statements}
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
