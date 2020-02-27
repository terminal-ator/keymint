import React, { useState, useEffect } from "react";
import KeyList from "../components/keylist";
import { normalize, RenderItemProps, NormalizedCache, DeNormalize } from "../types/generic";
import { SELTR } from ".";
import { useHistory } from "react-router";
import { Bank } from "../types/bank";
import { AppState } from "../reducers";
import Axios from "axios";
import { getBanks } from "../api";
import { connect, ConnectedProps } from "react-redux";
import { PageDiv } from "../components/styledComp";
import Nav from '../components/nav';
import { Master } from "../types/master";

interface MenuItem {
  id: number;
  name: string;
  route: string;
}

const MenuRoutes = [
  {
    id: 1,
    name: "Statements",
    route: "stmt"
  }
];

const mapState = (state: AppState) => ({
  companyId: state.sys.SelectedCompany,
  masters: state.master.masters
});

const connector = connect(mapState, {});

type Props = ConnectedProps<typeof connector>;

const BankPage = (props: Props) => {
  let history = useHistory();
  let [banks, setBanks] = useState<NormalizedCache<Master>>();

  // useEffect(() => {
  //   if(props.masters){
  //     const mstrs = DeNormalize<Master>(props.masters)
  //     const bnks = mstrs.filter( (mstr) => {
  //       if(mstr.group_id==5)return mstr}
  //      )
  //     setBanks(normalize<Master>(bnks))
  //   }
  // }, []);

  useEffect(() => {
    if (props.masters) {

      const mstrs = DeNormalize<Master>(props.masters);
      console.log(mstrs);
      const bnks = mstrs.filter((mstr) => mstr.group_id === 5);
      console.log(bnks);
      const bnksf = normalize<Master>(bnks, true);
      // console.log()
      setBanks(bnksf);
    }
  }, []);

  const menuItems = normalize<MenuItem>(MenuRoutes);
  const renderItem = (arg: RenderItemProps<Master>) => {
    return (
      <SELTR>
        <td>{arg.item.name}</td>
      </SELTR>
    );
  };

  const goBack = (_: number, __: string) => {
    history.goBack();
  };

  const handleEnter = (cursor: number) => {
    if (banks) {
      const selected = banks.normalized[banks.all[cursor]];
      history.push(`stmt/${selected.cust_id.Int64}`);
    }
  };

  const keyMap = [
    {
      key: 27,
      handler: goBack
    }
  ];

  const cursor = 0;
  return (
    <PageDiv>
      <Nav />
      <br />
      <div style={{ padding: 10 }}>
        {banks && (
          <KeyList
            columns={["Banks"]}
            cursor={cursor}
            data={banks}
            maxHeight={400}
            numberOfRows={8}
            width={"400px"}
            rowHeight={50}
            renderItem={renderItem}
            handleEnter={handleEnter}
            handleMisc={keyMap}
          />
        )}
      </div>

    </PageDiv>
  );
};

export default connector(BankPage);
