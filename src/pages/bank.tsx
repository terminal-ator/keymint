import React, { useState, useEffect } from "react";
import KeyList from "../components/keylist";
import { normalize, RenderItemProps, NormalizedCache } from "../types/generic";
import { SELTR } from ".";
import { useHistory } from "react-router";
import { Bank } from "../types/bank";
import { AppState } from "../reducers";
import Axios from "axios";
import { getBanks } from "../api";
import { connect, ConnectedProps } from "react-redux";

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
  companyId: state.sys.SelectedCompany
});

const connector = connect(mapState, {});

type Props = ConnectedProps<typeof connector>;

const BankPage = (props: Props) => {
  let history = useHistory();
  let [banks, setBanks] = useState<NormalizedCache<Bank>>();

  useEffect(() => {
    fetchBanks();
  }, []);

  const fetchBanks = async () => {
    const req = await getBanks(props.companyId);
    setBanks(normalize<Bank>(req.data.banks));
  };

  const menuItems = normalize<MenuItem>(MenuRoutes);
  const renderItem = (arg: RenderItemProps<Bank>) => {
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
      history.push(`stmt/${selected.id}`);
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
    <div>
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
  );
};

export default connector(BankPage);
