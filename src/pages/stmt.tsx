import React, { useState, useEffect, ChangeEvent } from "react";
import { AppState } from "../reducers";
import { connect, ConnectedProps } from "react-redux";
import { RouteComponentProps, useParams, useHistory } from "react-router";
import MasterList from "../components/mstrlist";
import KeyList from "../components/keylist";
import './stmt.css';
import {
  NormalizedCache,
  normalize,
  RenderItemProps,
  DeNormalize,
  StatementMutation
} from "../types/generic";
import { Statement } from "../types/statements";
import {
  getBankWiseStatements,
  postStatementMaster,
  newSetStatement, getRecommended
} from "../api";
import StatementTR from "../components/sttmntTR";
import withPop from "../components/popup";
import styled from "styled-components";
import Loading from "../components/loading";
import Nav from "../components/nav";
import {Button, Card, DatePicker} from "antd";
import moment from "moment";
import {PageDiv} from "../components/styledComp";

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
  width: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  flex-direction: row;
`;

export const DialogContent = styled.div`
  height: 100%;
  overflow: hidden;
  opacity: 1;
  width: 100%;
  float: right;
  padding: 10px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23);
  flex: 1;
`;

export interface Recommended {
  id: number
  name: string
  date: string
  amount: number
  master_id: number
  master_name:string
  [key :string]: any
}

const connector = connect(mapState, {});

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & RouteComponentProps;

const { RangePicker } = DatePicker;

const STMT = (props: Props) => {
  const [cursor, setCursor] = useState(0);
  const [statements, setStatements] = useState<NormalizedCache<Statement>>();
  const [filtered, setFiltered] = useState<NormalizedCache<Statement>>();
  const [selected, setSelected] = useState<number>();
  const [ hide, setHide ] = useState(false);
  const [ recoms, setRecoms ] = useState<Array<Recommended>>();

  let { id } = useParams();
  let history = useHistory();
  let [showDialog, setDialog] = useState(false);
  let [ mouseMode, setMouseMode ] = useState(false);
  const [ sd, setSd ] = useState("");
  const [ ed, setEd ] = useState("");

  const fetchStatements = async () => {
    if (id) {
      const req = await getBankWiseStatements(parseInt(id),sd, ed);
      setStatements(normalize<Statement>(req.data.statements));
      setFiltered(normalize<Statement>(req.data.statements));
    }
  };
  useEffect(() => {
    if(id){
      getBankWiseStatements(parseInt(id),sd,ed).then((res)=>{
        setStatements(normalize<Statement>(res.data.statements));
        setFiltered(normalize<Statement>(res.data.statements));
        setCursor(0);
      })
    }
  }, [id,sd,ed]);

  useEffect(()=>{
      if(selected && filtered?.normalized[selected]){
        const amount = filtered?.normalized[selected].deposit.Valid? filtered?.normalized[selected].deposit.Float64:
          filtered?.normalized[selected].withdrawl.Float64
          getRecommended(amount).then((res)=>{
            setRecoms(res.data)
          })
      }
  },[selected])

  const goBack = () => {
    history.goBack();
  };
  const handleFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHide(e.target.checked);
  };

  const handleStmtSelect = (cursor: number | string) => {
    if (filtered) {
      console.log(cursor);
      const stat = filtered.normalized[cursor];
      console.log(stat);
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
        let packet: StatementMutation = {
          bank_id: parseInt(id),
          company_id: props.cmpyID,
          stat_id: toStatement.id,
          cust_id: masterID
        };
        console.log("Showing sending packet: ", {
          packet
        });
        await newSetStatement(packet);
        setStatements(newStatements);
        setFiltered(filteredStatement);

        setDialog(false);
      }
    }
  };

  const filterOutstanding = (item: Statement)=>{
      return !item.cust_id.Valid || !hide;
  }

  const renderItem = (arg: RenderItemProps<Statement>) => {
    if (statements && statements.normalized[arg.item.id]) {
      return (
        <StatementTR
          key={arg.item.id.toString()}
          statement={statements.normalized[arg.item.id]}
        />
      );
    }
  };
  return (
    <PageDiv>
      <Nav />
      <div
        style={{ display: "flex", flexDirection: "row", alignItems: "center" }}
      >
        <p><input type="checkbox" onChange={(e)=>{setMouseMode(e.target.checked)}}/>Mouse Mode</p>
        <h2 style={{ color: "#0074D9"}} >{ id && props.masters.normalized[parseInt(id)].name}</h2>
        <label style={{ marginLeft: "10px" }}>
          <input
            onChange={handleFilter}
            type="checkbox"
            placeholder="Show outstandings"
          />
          Show Outstandings
        </label>
      </div>
      <RangePicker onChange={(date,dateString)=>{
        setSd(dateString[0]);setEd(dateString[1]);
      }}  />
      <div>
        {mouseMode?<div>
          { filtered?.all.map((row)=>
          {
            const statement = filtered?.normalized[row]
            return <div
                onClick={()=>{handleStmtSelect(row)}}
                className="sttRow" style={{ display: "grid",gridTemplateColumns:"0.5fr 2fr 2fr 0.5fr 0.5fr", margin: 5}}>
              <div>{ moment(statement?.date).format("LL")}</div>
              <div>{statement?.narration}</div>
              <div>{statement?.master.name || "No master"}</div>
              <div>{statement?.deposit.Valid? <span style={{ borderRadius:2, padding: 4, backgroundColor:"green", color:"white"}} >{statement.deposit.Float64}</span>:""}</div>
              <div>{statement?.withdrawl.Valid? <span style={{borderRadius:2, padding: 4, backgroundColor:"red", color:"white"}} >{statement.withdrawl.Float64}</span>:""}</div>
            </div>})}
        </div>:filtered ? (
            <KeyList
                key={"stats"}
                columns={[
                  "Date",
                  "Narration",
                  "Master",
                  "Reference",
                  "Deposit",
                  "Withdrawl"
                ]}
                cursor={cursor}
                maxHeight={700}
                rowHeight={10}
                numberOfRows={10}
                data={filtered}
                renderItem={renderItem}
                handleEscape={goBack}
                handleEnter={handleStmtSelect}
                filter={filterOutstanding}

                maxWidth={"100%"}
            />
        ) : (
            <Loading />
        )}
      {props.masters
        ? withPop(
            <DialogWrapper>
              <div style={{ flex: 1 }}>
                <Card
                  style={{  margin: "0px auto", width: "80%", marginTop: 40, backgroundColor:"white" }}
                >
                  <Button type={"danger"} onClick={()=>{setDialog(false)}}>Close</Button>
                  <h4>Statement Detail</h4>
                  {selected && filtered && (
                    <div>
                      <p>
                        {moment(filtered.normalized[selected].date).format(
                          "LL"
                        )}
                      </p>
                      <div>
                        {filtered.normalized[selected] &&
                          filtered.normalized[selected].narration}
                      </div>
                      <div style={{ display: "flex", flexDirection:"row", width:"100%"}}>
                      <div style={{ padding:"5px", flex:1, backgroundColor: "#36e392", color:"white"}} >
                      ₹
                        { filtered?.normalized[selected] &&
                          filtered?.normalized[selected].deposit .Float64
                        }
                      </div>
                      <div style={{padding:"5px", flex:1, backgroundColor: "red", color:"white"}}  >
                      ₹
                        {
                          filtered?.normalized[selected] &&
                            filtered?.normalized[selected].withdrawl.Float64
                        }
                      </div>
                      </div>
                      <div style={{ width: "100%"}}>
                        <p>Recommended</p>
                        <ul>{
                          recoms && recoms.map((re) => <li key={re.name + re.date}
                                                           style={{display: "flex", justifyContent: "space-between"}}>
                            <span>{moment(re.date).format("MMM Do")}</span>
                            <span>{re.name}</span>
                            <span>Rs.{re.amount}</span>
                            <span><Button onClick={()=>{ handleMasterChange(re.master_id)}} type={"dashed"} >Select</Button></span>
                          </li>)
                        }</ul>
                      </div>
                    </div>
                  )}
                </Card>
              </div>
              <DialogContent style={{ backgroundColor:"white"}}>
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

    </PageDiv>
  );
};

export default connector(STMT);
