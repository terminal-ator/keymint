import React from "react";
import KeyList from "../components/keylist";
import { normalize, RenderItemProps } from "../types/generic";
import { SELTR } from ".";
import { useHistory } from "react-router";
import { PageDiv } from "../components/styledComp";
import Nav from "../components/nav";

interface MenuItem {
  id: number;
  name: string;
  route: string;
}

const MenuRoutes = [
  {
    id: 1,
    name: "Statements",
    route: "banks"
  },
  {
    id: 2,
    name: "Import Sales",
    route: "sales"
  },
  {
    id: 6,
    name: 'Import Statement',
    route: 'imrstat',
  },
  {
    id: 3,
    name: "Receipts",
    route: "receipt"
  },
  {
    id: 4,
    name: "Ledgers",
    route: "ledgers"
  },
  {
    id: 5,
    name: "Errors",
    route: "errors"
  }
];

export default () => {
  let history = useHistory();
  const menuItems = normalize<MenuItem>(MenuRoutes);
  const renderItem = (arg: RenderItemProps<MenuItem>) => {
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
    const selected = menuItems.normalized[cursor];
    history.push(selected.route);
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
      <div>
        <KeyList
          columns={["Menu"]}
          cursor={cursor}
          data={menuItems}
          maxHeight={400}
          numberOfRows={8}
          width={"250px"}
          rowHeight={20}
          renderItem={renderItem}
          handleEnter={handleEnter}
          handleMisc={keyMap}
        />
      </div>
    </PageDiv>
  );
};
